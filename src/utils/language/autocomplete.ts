import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { autocompletion } from "@codemirror/autocomplete";
import type { Type } from "arktype";
import { getAllHandlers, getHandlerMetadata } from "~/handlers/registry";
import type KindModelPlugin from "~/main";
import {
	getHandlerFromContext,
	getOptionStart,
	isExpectingValue,
	isInsideOptionsHash,
	parseKmContext,
	shouldShowHandlerCompletions,
} from "./km-parser";

/**
 * Check if a position is inside a ```km codeblock.
 * Returns the codeblock boundaries if inside, null otherwise.
 * Handles both closed blocks (with closing ```) and unclosed blocks (still being typed).
 */
function findKmCodeblockAtPosition(
  doc: string,
  pos: number,
): { contentStart: number; contentEnd: number; content: string } | null {
  // Match ```km followed by optional whitespace and newline, then content
  // Content ends either at closing ``` or end of document
  const regex = /```km[ \t]*\r?\n([\s\S]*?)(?:```|$)/g;
  let match;

  while ((match = regex.exec(doc)) !== null) {
    const fullMatch = match[0];
    const content = match[1];
    // Content starts after ```km\n
    const contentStart = match.index + fullMatch?.indexOf(content);
    const contentEnd = contentStart + content.length;

    // Check if position is within this codeblock's content
    if (pos >= contentStart && pos <= contentEnd) {
      return { contentStart, contentEnd, content };
    }
  }

  return null;
}

/**
 * Extract option keys from an ArkType schema.
 */
function getSchemaOptionKeys(schema: Type<unknown>): Array<{
  key: string;
  type: string;
  optional: boolean;
}> {
  const options: Array<{ key: string; type: string; optional: boolean }> = [];

  // Access the internal structure of the ArkType schema
  // ArkType schemas have a structure we can inspect
  try {
    const def = (schema as any).internal?.structure;
    if (!def) {
      return options;
    }

    // Iterate through the schema's properties
    for (const [key, propSchema] of Object.entries(def)) {
      if (key === "+") {
        continue; // Skip the reject marker
      }

      // Clean the key (remove ? suffix if present)
      const cleanKey = key.replace(/\?$/, "");
      const isOptional = key.endsWith("?");

      // Get the type description
      let typeDesc = "unknown";
      if (propSchema && typeof propSchema === "object") {
        const ps = propSchema as any;
        if (ps.expression) {
          typeDesc = ps.expression;
        }
        else if (ps.domain) {
          typeDesc = ps.domain;
        }
      }

      options.push({
        key: cleanKey,
        type: typeDesc,
        optional: isOptional,
      });
    }
  }
  catch {
    // If we can't parse the schema, return empty
  }

  return options;
}

/**
 * Create a tooltip/info panel for a handler.
 */
function createHandlerInfo(handler: {
  name: string;
  description: string;
  examples: string[];
}): Node {
  const div = document.createElement("div");
  div.className = "km-handler-info";
  div.style.padding = "4px";

  const desc = document.createElement("p");
  desc.textContent = handler.description;
  desc.style.margin = "0 0 8px 0";
  div.appendChild(desc);

  if (handler.examples.length > 0) {
    const examplesHeader = document.createElement("strong");
    examplesHeader.textContent = "Examples:";
    div.appendChild(examplesHeader);

    const examplesList = document.createElement("ul");
    examplesList.style.margin = "4px 0";
    examplesList.style.paddingLeft = "16px";

    for (const example of handler.examples) {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = example;
      li.appendChild(code);
      examplesList.appendChild(li);
    }
    div.appendChild(examplesList);
  }

  return div;
}

/**
 * Get completions for handler names.
 */
function getHandlerCompletions(from: number): Completion[] {
  const handlers = getAllHandlers();
  return handlers.map(h => ({
    label: h.name,
    type: "function",
    detail: h.description,
    apply: `${h.name}()`,
    boost: 1,
    info: () => createHandlerInfo(h),
  }));
}

/**
 * Get completions for option keys within a handler's options hash.
 */
function getOptionKeyCompletions(handlerName: string): Completion[] {
  const meta = getHandlerMetadata(handlerName);
  if (!meta?.optionsSchema) {
    return [];
  }

  const options = getSchemaOptionKeys(meta.optionsSchema);
  return options.map(opt => ({
    label: opt.key,
    type: "property",
    detail: `${opt.type}${opt.optional ? " (optional)" : ""}`,
    apply: `${opt.key}: `,
    boost: opt.optional ? 0 : 1,
  }));
}

/**
 * Get completions for boolean values.
 */
function getBooleanCompletions(): Completion[] {
  return [
    { label: "true", type: "keyword", boost: 1 },
    { label: "false", type: "keyword", boost: 0 },
  ];
}

/**
 * Get completions for Kind handler's kind parameter.
 * Suggests known kinds from the vault (top-level only).
 */
function getKindValueCompletions(plugin: KindModelPlugin): Completion[] {
  console.log("[KM Autocomplete] kindTags:", plugin.kindTags);

  if (!plugin.kindTags || plugin.kindTags.length === 0) {
    console.warn("[KM Autocomplete] No kind tags available");
    return [];
  }

  // Extract unique top-level kinds (before first /)
  const topLevelKinds = new Set<string>();
  for (const tag of plugin.kindTags) {
    const parts = tag.split("/");
    if (parts.length > 0) {
      topLevelKinds.add(parts[0]);
    }
  }

  const completions = Array.from(topLevelKinds).map(kindName => ({
    label: `"${kindName}"`,
    type: "constant",
    detail: "kind",
    apply: `"${kindName}"`,
    boost: 1,
  }));

  console.log("[KM Autocomplete] Generated kind completions:", completions);
  return completions;
}

/**
 * Get category completions for a given kind.
 * Returns unique categories that exist under the specified kind.
 * Excludes category definition pages (e.g., #software/category/productivity).
 */
function getCategoryCompletions(plugin: KindModelPlugin, kind: string): Completion[] {
  if (!plugin.kindTags || plugin.kindTags.length === 0) {
    return [];
  }

  const categories = new Set<string>();

  // Find all tags like: software/productivity (entity tags)
  // Exclude tags like: software/category/productivity (category definition pages)
  for (const tag of plugin.kindTags) {
    if (tag.startsWith(`${kind}/`) && !tag.includes("/category/")) {
      const parts = tag.split("/");
      // Second part is the category (e.g., "productivity" from "software/productivity")
      if (parts.length >= 2 && parts[1] && parts[1] !== "category") {
        categories.add(parts[1]);
      }
    }
  }

  const completions = Array.from(categories).map(category => ({
    label: `"${category}"`,
    type: "constant",
    detail: `category under ${kind}`,
    apply: `"${category}"`,
    boost: 1,
  }));

  console.log(`[KM Autocomplete] Categories for ${kind}:`, completions);
  return completions;
}

/**
 * Get subcategory completions for a given kind/category.
 * Excludes subcategory definition pages (e.g., #software/productivity/subcategory/ide).
 */
function getSubcategoryCompletions(plugin: KindModelPlugin, kind: string, category: string): Completion[] {
  if (!plugin.kindTags || plugin.kindTags.length === 0) {
    return [];
  }

  const subcategories = new Set<string>();

  // Find all tags like: software/productivity/ide (entity tags)
  // Exclude tags like: software/productivity/subcategory/ide (subcategory definition pages)
  for (const tag of plugin.kindTags) {
    if (tag.startsWith(`${kind}/${category}/`) && !tag.includes("/subcategory/")) {
      const parts = tag.split("/");
      // Third part is the subcategory (e.g., "ide" from "software/productivity/ide")
      if (parts.length >= 3 && parts[2] && parts[2] !== "subcategory") {
        subcategories.add(parts[2]);
      }
    }
  }

  const completions = Array.from(subcategories).map(subcategory => ({
    label: `"${subcategory}"`,
    type: "constant",
    detail: `subcategory under ${kind}/${category}`,
    apply: `"${subcategory}"`,
    boost: 1,
  }));

  console.log(`[KM Autocomplete] Subcategories for ${kind}/${category}:`, completions);
  return completions;
}

/**
 * Main completion function for KM codeblocks.
 * Only provides completions when cursor is inside a ```km codeblock.
 */
function kmCompletions(plugin: KindModelPlugin) {
  return (context: CompletionContext): CompletionResult | null => {
    const doc = context.state.doc.toString();

    // Check if we're inside a ```km codeblock
    const codeblock = findKmCodeblockAtPosition(doc, context.pos);
    if (!codeblock) {
      // Not inside a km codeblock, don't provide completions
      return null;
    }

    console.log("[KM Autocomplete] Inside km block, checking context...")

    const line = context.state.doc.lineAt(context.pos);
    const textBeforeCursor = line.text.slice(0, context.pos - line.from);

    // Don't complete inside comments
    if (textBeforeCursor.trim().startsWith("//")) {
      return null;
    }

    const ctx = parseKmContext(textBeforeCursor, context.pos - line.from);

    // Handler name completion (at start of line or partial handler name)
    if (shouldShowHandlerCompletions(textBeforeCursor)) {
      console.log("[KM Autocomplete] Showing handler completions");
      const word = context.matchBefore(/[A-Z][a-zA-Z]*/);
      return {
        from: word?.from ?? context.pos,
        options: getHandlerCompletions(word?.from ?? context.pos),
      };
    }

    console.log("[KM Autocomplete] Context:", {
      handlerName: ctx.handlerName,
      isInsideParens: ctx.isInsideParens,
      isInsideOptionsHash: ctx.isInsideOptionsHash,
      scalarArgs: ctx.scalarArgs,
      textBeforeCursor,
    });

    // Scalar parameter value completion for Kind handler
    if (ctx.handlerName === "Kind" && ctx.isInsideParens && !ctx.isInsideOptionsHash) {
      console.log("[KM Autocomplete] Detected Kind handler, scalarArgs:", ctx.scalarArgs);

      // Count parameters by counting commas before cursor
      const commaCount = (textBeforeCursor.match(/,/g) || []).length;

      let options: Completion[] = [];

      if (commaCount === 0) {
        // First parameter: kind
        console.log("[KM Autocomplete] Position: kind (param 1)");
        options = getKindValueCompletions(plugin);
      }
      else if (commaCount === 1) {
        // Second parameter: category
        // Extract kind from first parameter
        const kindMatch = ctx.scalarArgs[0]?.match(/"([^"]*)"|'([^']*)'/);
        const kind = kindMatch ? (kindMatch[1] || kindMatch[2]) : null;

        if (kind) {
          console.log(`[KM Autocomplete] Position: category (param 2) for kind="${kind}"`);
          options = getCategoryCompletions(plugin, kind);
        } else {
          console.log("[KM Autocomplete] Could not extract kind from first param");
        }
      }
      else if (commaCount === 2) {
        // Third parameter: subcategory
        // Extract kind and category from first two parameters
        const kindMatch = ctx.scalarArgs[0]?.match(/"([^"]*)"|'([^']*)'/);
        const categoryMatch = ctx.scalarArgs[1]?.match(/"([^"]*)"|'([^']*)'/);
        const kind = kindMatch ? (kindMatch[1] || kindMatch[2]) : null;
        const category = categoryMatch ? (categoryMatch[1] || categoryMatch[2]) : null;

        if (kind && category) {
          console.log(`[KM Autocomplete] Position: subcategory (param 3) for kind="${kind}", category="${category}"`);
          options = getSubcategoryCompletions(plugin, kind, category);
        } else {
          console.log("[KM Autocomplete] Could not extract kind/category from previous params");
        }
      }

      if (options.length > 0) {
        console.log(`[KM Autocomplete] Offering ${options.length} suggestions`);

        // Match various patterns:
        // - Empty after comma: Kind("software", |)
        // - Opening quote: Kind("software", "|)
        // - Partial string: Kind("software", "de|)
        const word = context.matchBefore(/"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*/);

        return {
          from: word?.from ?? context.pos,
          options,
          // Force autocomplete to show even if no text typed yet
          validFor: /^[a-zA-Z0-9_"]*$/,
        };
      }
    }

    // Inside options hash
    if (isInsideOptionsHash(textBeforeCursor)) {
      const handlerName = getHandlerFromContext(textBeforeCursor);
      if (!handlerName) {
        return null;
      }

      // Check if we're expecting a value (after colon)
      if (isExpectingValue(textBeforeCursor)) {
        // For now, just offer boolean completions
        // In future, could inspect the schema type for the key
        const word = context.matchBefore(/[a-zA-Z]*/);
        return {
          from: word?.from ?? context.pos,
          options: getBooleanCompletions(),
        };
      }

      // Don't complete option keys when inside a string
      if (ctx.isInsideString) {
        return null;
      }

      // Option key completion
      const word = context.matchBefore(/[a-zA-Z_][a-zA-Z0-9_]*/);
      const from = word?.from ?? getOptionStart(context.pos, textBeforeCursor);
      return {
        from,
        options: getOptionKeyCompletions(handlerName),
      };
    }

    return null;
  };
}

/**
 * Create the KM autocomplete extension.
 * Provides context-aware autocomplete for KM codeblocks.
 */
export function km_autocomplete(plugin: KindModelPlugin) {
  return autocompletion({
    override: [kmCompletions(plugin)],
    activateOnTyping: true,
    // Explicitly trigger on quotes, letters, and after commas
    activateOnCompletion: () => true,
    // Show completions more aggressively
    defaultKeymap: true,
  });
}
