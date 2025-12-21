import type { TupleToUnion } from "inferred-types";
import type { Tag } from "../types/general";

import type KindModelPlugin from "~/main";
import type { DataArray, Link, PageInfoBlock } from "~/types";
import { type } from "arktype";
import { stripLeading } from "inferred-types";
import { obApp } from "~/globals";
import { getPage, getPageInfo } from "~/page";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

export const COLUMN_CHOICES = [
  "when",
  "created",
  "modified",
  "links",
  "desc",
  "classification",
  "category",
  "subcategory",
  "kind",
  "related",
  "about",
  "company",
  /^#[a-zA-Z/]+ AS [a-zA-Z].*/ as unknown as `#${string} AS ${string}`,
] as const;

export type ColumnChoice = TupleToUnion<typeof COLUMN_CHOICES>;

/**
 * Classification pattern supporting:
 * - kind only: `"software"`
 * - kind/category: `"software/development"`
 * - kind/category/subcategory: `"hardware/automation/switch"`
 *
 * Note: Omit the leading `#` symbol - it will be normalized internally.
 *
 * @example
 * // Exclude all software pages
 * { exclude: "software" }
 *
 * @example
 * // Exclude pages in specific category
 * { exclude: "hardware/automation" }
 *
 * @example
 * // Exclude multiple classifications
 * { exclude: ["software/development", "hardware/automation/switch"] }
 */
export type Classification = `${string}${"" | `/${string}` | `/${string}/${string}`}`;

/**
 * Normalize classification by removing leading # if present
 */
function normalizeClassification(classification: string): string {
  return classification.startsWith("#")
    ? classification.slice(1)
    : classification;
}

/**
 * Parsed classification structure for matching
 */
interface ParsedClassification {
  kind: string;
  category?: string;
  subcategory?: string;
}

/**
 * Parse a classification string into its component parts
 */
function parseClassification(classification: string): ParsedClassification {
  const parts = classification.split("/");
  return {
    kind: parts[0],
    category: parts[1],
    subcategory: parts[2],
  };
}

/**
 * Check if a page matches any of the excluded classifications
 */
function matchesClassification(
  p: KindModelPlugin,
  link: Link,
  classifications: Classification[],
): boolean {
  const pageInfo = getPageInfo(p)(link);
  // Conservative: if we can't analyze the page, don't exclude it
  if (!pageInfo) {
    return false;
  }

  return classifications.some((classification) => {
    const parsed = parseClassification(normalizeClassification(classification));

    // Check if page's kind matches (kindTags are without # prefix)
    const kindMatches = pageInfo.kindTags.includes(parsed.kind);
    if (!kindMatches) {
      return false;
    }
    if (!parsed.category) {
      return true; // Just kind match
    }

    // Check category (pages can have multiple categories)
    const categoryMatches = pageInfo.categories.some(
      c => c.category === parsed.category,
    );
    if (!categoryMatches) {
      return false;
    }
    if (!parsed.subcategory) {
      return true; // Kind + category match
    }

    // Check subcategory
    return pageInfo.subcategories.some(
      s => s.subcategory === parsed.subcategory,
    );
  });
}

/**
 * Filter backlinks by excluding specified classifications
 */
function filterByClassification(p: KindModelPlugin) {
  return (
    links: DataArray<Link>,
    exclude?: Classification | Classification[],
  ): DataArray<Link> => {
    if (!exclude) {
      return links;
    }

    const exclusions = Array.isArray(exclude) ? exclude : [exclude];
    return links.where(l => !matchesClassification(p, l, exclusions));
  };
}

/**
 * Filter out backlinks that are already shown in the page body (outlinks).
 * Returns a curried function that accepts links and an optional dedupe flag.
 *
 * Uses Obsidian's MetadataCache directly for fresh outlinks data instead of
 * Dataview's potentially stale cache.
 *
 * @param page - The PageInfoBlock containing page path
 * @returns A function that filters links based on dedupe option
 */
function filterDedupe(page: PageInfoBlock) {
  return (links: DataArray<Link>, dedupe: boolean = true): DataArray<Link> => {
    if (!dedupe)
      return links;

    // Get fresh outlinks from Obsidian's MetadataCache (not Dataview's stale cache)
    const outlinkPaths = new Set(obApp.resolvedLinksFor(page.path));

    // Filter out backlinks that are also outlinks (already in page body)
    return links.where(l => !outlinkPaths.has(l.path));
  };
}

/**
 * Filter out backlinks that only appear in completed tasks.
 * Links that appear in both completed and non-completed contexts are kept.
 */
function filterCompletedTasks(page: PageInfoBlock) {
  return (
    links: DataArray<Link>,
    excludeCompleted = true,
  ): DataArray<Link> => {
    if (!excludeCompleted)
      return links;

    // Get paths from completed tasks (tasks in OTHER pages that link to THIS page)
    const completedTaskPaths = new Set(
      page.inlinkTasks
        .filter(t => t.completed)
        .map(t => t.link?.path)
        .filter(Boolean),
    );

    // Get paths from non-completed tasks
    const nonCompletedPaths = new Set(
      page.inlinkTasks
        .filter(t => !t.completed)
        .map(t => t.link?.path)
        .filter(Boolean),
    );

    // Filter out links that ONLY appear in completed tasks
    return links.where((l) => {
      if (!completedTaskPaths.has(l.path))
        return true;
      // Keep if also appears in non-completed context
      return nonCompletedPaths.has(l.path);
    });
  };
}

export interface BackLinkOptions {
  /**
   * rather than back links auto determining how to layout your links
   * you can instead specify which columns you'd like
   */
  columns?: ColumnChoice[];

  /**
   * you can specify tags that indicate that a back linked page should be
   * filtered from the list
   */
  filterTags?: Tag[];

  /**
   * the property you want to sort by
   */
  sortProperty?: string;

  /**
   * the sort order (either ASC or DESC)
   */
  sortOrder?: "ASC" | "DESC";

  /**
   * Remove backlinks that are already shown in the page body.
   * @default true
   */
  dedupe?: boolean;

  /**
   * Exclude backlinks by classification (kind, kind/category, or kind/category/subcategory).
   * Can be a single classification or an array.
   */
  exclude?: Classification | Classification[];

  /**
   * Remove backlinks that only appear in completed tasks.
   * @default true
   */
  excludeCompletedTasks?: boolean;
}

function keepPage(p: KindModelPlugin) {
  return (l: Link, ignore: string[]) => {
    const page = getPage(p)(l);

    if (page) {
      const tagSegments = new Set(
        page.file.tags.flatMap(t => t.split("/").map(i => stripLeading(i, "#"))),
      );
      const ignoreTags = ignore.flatMap(t => t.split("/").map(i => stripLeading(i, "#")));

      return ignoreTags.every(t => !tagSegments.has(t));
    }

    return false;
  };
}

/**
 * ArkType schema for BackLinks options.
 * This is the single source of truth for both runtime validation and TypeScript types.
 *
 * Translation from TypeToken:
 * - "array(string)" → "string[]"
 * - "opt(bool)" → "boolean" with optional key "?"
 * - "opt(string|array(string))" → "string | string[]" with optional key "?"
 */
export const BackLinksOptionsSchema = type({
  "+": "reject", // Reject unknown keys (matches TypeToken behavior)
  "ignoreTags?": "string[]",
  "dedupe?": "boolean",
  "exclude?": "string | string[]",
  "excludeCompletedTasks?": "boolean",
});

/** Inferred type from the schema */
export type BackLinksSchemaOptions = typeof BackLinksOptionsSchema.infer;

// Register the handler with the registry
registerHandler({
  name: "BackLinks",
  scalarSchema: null,
  optionsSchema: BackLinksOptionsSchema,
  acceptsScalars: false,
  description: "Shows pages that link to the current page",
  examples: [
    "BackLinks()",
    "BackLinks({dedupe: false})",
    "BackLinks({exclude: \"software\"})",
    "BackLinks({exclude: [\"software\", \"hardware/automation\"]})",
  ],
});

/**
 * Renders back links for any obsidian page
 */
export const BackLinks = createHandlerV2("BackLinks")
  .noScalar()
  .optionsSchema(BackLinksOptionsSchema)
  .handler(async (evt) => {
    const { plugin: p, page, createTable, dv, options } = evt;

    const { inline_codeblock, bulletPoints, light } = p.api.format;

    const whereTags = (l: Link) => Array.isArray(options?.ignoreTags)
      ? keepPage(p)(l, options?.ignoreTags)
      : true;

    /**
     * all in-bound links for the page with the exception of self-references
     */
    const allInlinks = (dv.array(page.inlinks) as DataArray<Link>)
      .sort(p => p?.path)
      .where(p => p.path !== page.path);

    // Apply ignoreTags filter and track if it reduced the count
    let links = allInlinks.where(whereTags);

    // Apply new filters in optimized order:
    // 1. dedupe - cheap Set lookup, reduces set size first
    // 2. classification - expensive (calls getPageInfo per link)
    // 3. completed tasks - cheap Set lookup
    // Track which filters actually reduced the result set
    const filterStart = Date.now();
    const filterDescriptions: string[] = [];

    // Check if ignoreTags actually filtered anything
    if (links.length < allInlinks.length && options?.ignoreTags) {
      filterDescriptions.push(`tagged with ${options.ignoreTags.map(inline_codeblock).join(", ")}`);
    }

    // Apply dedupe filter
    let beforeCount = links.length;
    links = filterDedupe(page)(links, options?.dedupe ?? true);
    if (links.length < beforeCount) {
      filterDescriptions.push("links which already existed on the page (dedupe)");
    }

    // Apply classification filter
    beforeCount = links.length;
    links = filterByClassification(p)(links, options?.exclude);
    if (links.length < beforeCount && options?.exclude) {
      const exc = Array.isArray(options.exclude) ? options.exclude : [options.exclude];
      filterDescriptions.push(`classified as ${exc.map(inline_codeblock).join(", ")}`);
    }

    // Apply completed tasks filter
    beforeCount = links.length;
    links = filterCompletedTasks(page)(links, options?.excludeCompletedTasks ?? true);
    if (links.length < beforeCount) {
      filterDescriptions.push("completed task references");
    }

    const filterTime = Date.now() - filterStart;
    if (filterTime > 100) {
      p.warn(`BackLinks filtering took ${filterTime}ms for ${links.length} remaining links`);
    }

    // Format list with "and" before last item
    const formatList = (items: string[]): string => {
      if (items.length === 0)
        return "";
      if (items.length === 1)
        return items[0];
      if (items.length === 2)
        return `${items[0]} and ${items[1]}`;
      return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
    };

    const exception = filterDescriptions.length > 0
      ? light(`&nbsp;<i>(excluding ${formatList(filterDescriptions)})</i>`)
      : "";

    await createTable(
      "Backlink",
      "Classification",
      "Desc",
      "Links",
    )(
      i => [
        i.createFileLink(),
        i.showClassifications(),
        i.showDesc(),
        i.showLinks(),
      ],
      {
        renderWhenNoRecords: () => bulletPoints(`no back links found to this page ${exception}`),
        hideColumnIfEmpty: ["Links", "Desc"],
      },
    )(links);

    return true;
  });
