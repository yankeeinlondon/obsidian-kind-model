/**
 * CodeMirror 6 linter extension for KM codeblocks.
 * Provides real-time inline validation with red underlines and hover tooltips.
 *
 * IMPORTANT: This linter only operates within ```km codeblocks.
 * It detects codeblock boundaries and skips all other content.
 */
import type { Diagnostic } from "@codemirror/lint";
import { linter } from "@codemirror/lint";
import type { EditorView } from "@codemirror/view";
import { getAllHandlers, getHandlerMetadata } from "~/handlers/registry";
import { getHandlerFromContext } from "./km-parser";

/**
 * Represents a km codeblock found in the document.
 */
interface KmCodeblock {
  /** Start position of the codeblock content (after ```km\n) */
  contentStart: number;
  /** End position of the codeblock content (before ```) */
  contentEnd: number;
  /** The content inside the codeblock */
  content: string;
}

/**
 * Find all ```km codeblocks in the document.
 * Handles both closed blocks (with closing ```) and unclosed blocks (still being typed).
 */
function findKmCodeblocks(doc: string): KmCodeblock[] {
  const blocks: KmCodeblock[] = [];

  // Match ```km followed by optional whitespace and newline, then content
  // Content ends either at closing ``` or end of document
  const regex = /```km[ \t]*\r?\n([\s\S]*?)(?:```|$)/g;
  let match;

  while ((match = regex.exec(doc)) !== null) {
    const fullMatch = match[0];
	if(fullMatch) {
		const content = match[1];
		// Content starts after ```km\n
		const contentStart = match.index + fullMatch?.indexOf(content);
		const contentEnd = contentStart + content.length;
	
		blocks.push({
		  contentStart,
		  contentEnd,
		  content,
		});
	}
  }

  return blocks;
}

/**
 * Represents a parse/validation error.
 */
interface ParseError {
  start: number;
  end: number;
  severity: "error" | "warning" | "info";
  message: string;
  quickFixes?: Array<{ label: string; replacement: string }>;
}

/**
 * Check if a handler name is valid.
 */
function isValidHandler(name: string): boolean {
  return getAllHandlers().some(h => h.name === name);
}

/**
 * Get all valid handler names for suggestions.
 */
function getValidHandlerNames(): string[] {
  return getAllHandlers().map(h => h.name);
}

/**
 * Get valid option keys for a handler.
 */
function getValidOptionKeys(handlerName: string): string[] {
  const meta = getHandlerMetadata(handlerName);
  if (!meta?.optionsSchema) {
    return [];
  }

  const keys: string[] = [];
  try {
    const def = (meta.optionsSchema as any).internal?.structure;
    if (def) {
      for (const key of Object.keys(def)) {
        if (key !== "+") {
          keys.push(key.replace(/\?$/, ""));
        }
      }
    }
  }
  catch {
    // Ignore
  }
  return keys;
}

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      }
      else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find the closest match from a list of valid options.
 */
function suggestClosest(invalid: string, validOptions: string[]): string | null {
  let closest: string | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const valid of validOptions) {
    const distance = levenshteinDistance(invalid.toLowerCase(), valid.toLowerCase());
    if (distance < minDistance && distance <= 3) {
      minDistance = distance;
      closest = valid;
    }
  }

  return closest;
}

/**
 * Find unbalanced parentheses or braces.
 */
function findUnbalancedBrackets(text: string): ParseError[] {
  const errors: ParseError[] = [];
  const stack: Array<{ char: string; pos: number }> = [];
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : "";

    // Handle strings
    if (prevChar !== "\\" && (char === "\"" || char === "'")) {
      if (!inString) {
        inString = true;
        stringChar = char;
      }
      else if (char === stringChar) {
        inString = false;
      }
    }

    if (inString) {
      continue;
    }

    // Track brackets
    if (char === "(" || char === "{" || char === "[") {
      stack.push({ char, pos: i });
    }
    else if (char === ")" || char === "}" || char === "]") {
      const expected = char === ")" ? "(" : char === "}" ? "{" : "[";
      const last = stack.pop();

      if (!last) {
        errors.push({
          start: i,
          end: i + 1,
          severity: "error",
          message: `Unexpected closing '${char}'`,
        });
      }
      else if (last.char !== expected) {
        errors.push({
          start: i,
          end: i + 1,
          severity: "error",
          message: `Mismatched bracket: expected '${expected === "(" ? ")" : expected === "{" ? "}" : "]"}' but found '${char}'`,
        });
      }
    }
  }

  // Check for unclosed brackets
  for (const unclosed of stack) {
    const expected = unclosed.char === "(" ? ")" : unclosed.char === "{" ? "}" : "]";
    errors.push({
      start: unclosed.pos,
      end: unclosed.pos + 1,
      severity: "error",
      message: `Unclosed '${unclosed.char}' - expected '${expected}'`,
    });
  }

  return errors;
}

/**
 * Validate the handler name.
 */
function validateHandlerName(text: string): ParseError[] {
  const errors: ParseError[] = [];
  const match = text.match(/^([A-Z][a-zA-Z]*)/);

  if (!match) {
    // No handler detected - might still be typing
    if (text.trim().length > 0 && !/^[A-Z]/.test(text.trim())) {
      errors.push({
        start: 0,
        end: text.trim().length,
        severity: "error",
        message: "Handler name must start with a capital letter",
      });
    }
    return errors;
  }

  const handlerName = match[1];
  if (!isValidHandler(handlerName)) {
    const suggestion = suggestClosest(handlerName, getValidHandlerNames());
    const message = suggestion
      ? `Unknown handler '${handlerName}'. Did you mean '${suggestion}'?`
      : `Unknown handler '${handlerName}'. Valid handlers: ${getValidHandlerNames().join(", ")}`;

    errors.push({
      start: 0,
      end: handlerName.length,
      severity: "error",
      message,
      quickFixes: suggestion
        ? [{ label: `Change to ${suggestion}`, replacement: suggestion }]
        : undefined,
    });
  }

  return errors;
}

/**
 * Validate option keys within the options hash.
 */
function validateOptionKeys(text: string): ParseError[] {
  const errors: ParseError[] = [];
  const handlerName = getHandlerFromContext(text);

  if (!handlerName || !isValidHandler(handlerName)) {
    return errors;
  }

  const validKeys = getValidOptionKeys(handlerName);
  if (validKeys.length === 0) {
    return errors;
  }

  // Find the options hash
  const optionsMatch = text.match(/\{([^}]*)\}?/);
  if (!optionsMatch) {
    return errors;
  }

  const optionsStart = text?.indexOf("{") + 1;
  const optionsContent = optionsMatch[1];

  // Parse option keys
  const keyMatches = optionsContent.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g);

  for (const match of keyMatches) {
    const key = match[1];
    if (!validKeys.includes(key)) {
      const suggestion = suggestClosest(key, validKeys);
      const keyStart = optionsStart + match.index!;
      const keyEnd = keyStart + key.length;

      const message = suggestion
        ? `Unknown option '${key}'. Did you mean '${suggestion}'?`
        : `Unknown option '${key}'. Valid options for ${handlerName}: ${validKeys.join(", ")}`;

      errors.push({
        start: keyStart,
        end: keyEnd,
        severity: "error",
        message,
        quickFixes: suggestion
          ? [{ label: `Change to ${suggestion}`, replacement: suggestion }]
          : undefined,
      });
    }
  }

  return errors;
}

/**
 * Validate scalar (positional) parameters.
 * Checks if handler accepts scalars and if the provided values match expectations.
 */
function validateScalarParams(text: string): ParseError[] {
  const errors: ParseError[] = [];
  const handlerName = getHandlerFromContext(text);

  if (!handlerName || !isValidHandler(handlerName)) {
    return errors;
  }

  const meta = getHandlerMetadata(handlerName);
  if (!meta) {
    return errors;
  }

  // Extract scalar parameters (everything between ( and { or ))
  const paramsMatch = text.match(/^[A-Z][a-zA-Z]*\(([^{]*?)(?:\{|$)/);
  if (!paramsMatch) {
    return errors;
  }

  const paramsText = paramsMatch[1].trim();

  // If handler doesn't accept scalars, validate that none are provided
  if (!meta.acceptsScalars && paramsText && paramsText !== ")") {
    // Find the start and end of the scalar params
    const openParenPos = text?.indexOf("(");
    const firstBracePos = text?.indexOf("{");
    const closeParenPos = text?.indexOf(")");

    let paramsEnd = closeParenPos;
    if (firstBracePos !== -1 && (firstBracePos < closeParenPos || closeParenPos === -1)) {
      paramsEnd = firstBracePos;
    }

    errors.push({
      start: openParenPos + 1,
      end: paramsEnd,
      severity: "error",
      message: `${handlerName} does not accept positional parameters. Use options hash instead: ${handlerName}({...})`,
    });
  }

  return errors;
}

/**
 * Validate a KM block and return any errors.
 */
function validateKmBlock(content: string): ParseError[] {
  const errors: ParseError[] = [];

  // Skip empty content
  if (!content.trim()) {
    return errors;
  }

  // Check for syntax errors (unbalanced brackets)
  errors.push(...findUnbalancedBrackets(content));

  // Validate handler name
  errors.push(...validateHandlerName(content));

  // Validate scalar parameters
  errors.push(...validateScalarParams(content));

  // Validate option keys
  errors.push(...validateOptionKeys(content));

  return errors;
}

/**
 * Convert our ParseError to CodeMirror Diagnostic format.
 */
function toCodeMirrorDiagnostic(error: ParseError): Diagnostic {
  return {
    from: error.start,
    to: error.end,
    severity: error.severity,
    message: error.message,
    actions: error.quickFixes?.map(fix => ({
      name: fix.label,
      apply: (view: EditorView, from: number, to: number) => {
        view.dispatch({
          changes: { from, to, insert: fix.replacement },
        });
      },
    })),
  };
}

/**
 * Create the KM linter extension.
 * Validates only content within ```km codeblocks with a 300ms debounce.
 */
export const kmLinter = linter(
  (view: EditorView): Diagnostic[] => {
    const doc = view.state.doc.toString();
    const codeblocks = findKmCodeblocks(doc);
    const diagnostics: Diagnostic[] = [];

    for (const block of codeblocks) {
      // Validate each line within the codeblock
      const lines = block.content.split("\n");
      let lineOffset = 0;

      for (const line of lines) {
        if (line.trim()) {
          const errors = validateKmBlock(line);
          // Adjust error positions to be relative to the document
          for (const error of errors) {
            diagnostics.push({
              from: block.contentStart + lineOffset + error.start,
              to: block.contentStart + lineOffset + error.end,
              severity: error.severity,
              message: error.message,
              actions: error.quickFixes?.map(fix => ({
                name: fix.label,
                apply: (v: EditorView, from: number, to: number) => {
                  v.dispatch({
                    changes: { from, to, insert: fix.replacement },
                  });
                },
              })),
            });
          }
        }
        lineOffset += line.length + 1; // +1 for newline
      }
    }

    return diagnostics;
  },
  { delay: 300 },
);

/**
 * Export the linter for use in km_lang.
 */
export function km_linter() {
  return kmLinter;
}
