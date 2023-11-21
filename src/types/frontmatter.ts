import { Tag } from "@markdoc/markdoc";
import { HEADING_LEVELS } from "utils/Constants";
import { TupleToUnion } from "utils/type-utils";
import { Link } from "obsidian-dataview";


export interface FrontmatterDefaults extends Record<string, unknown | undefined> {
  kind?: string;
  type?: string;
  category?: any;
  sub_category?: any;
  parent?: any;
  siblings?: any[];
  date?: any;
}

export type Frontmatter<T extends Record<string, unknown> = FrontmatterDefaults> = Record<string, unknown> & T;

export interface CommonAttrs {
  /** found on code blocks */
  "data-language"?: "dataview" | "dataviewjs" | "js" | "ts" | "rust" | "etc";
}

/**
 * Valid Heading levels in Markdown / HTML
 */
export type HeadingLevel = TupleToUnion<typeof HEADING_LEVELS>;

/**
 * A simple representation of a `H1`..`H6` level tag
 */
export interface HeadingTag<
  TLevel extends number
> {
  /** the level of the header tag */
  level: TLevel;
  /** the textual content of the Header tag; all HTML elements removed */
  name: string;
  /** the textual content of the Header tag; untouched including any HTMl elements */
  content: string;

  /**
   * A `Link` from the **Dataview** plugin
   */
  link: Link;

  /** any HTML attributes set on the H tag (this is not that common for headers) */
  attributes: Record<string, string>;

  /** 
   * **children**
   * 
   * the content inside of the heading level tag represented by an array 
   * MarkDoc's `Tag` elements which in effect are block-level elements
   * that fit underneath the given level of heading.
   */
  children: Tag[];
}
