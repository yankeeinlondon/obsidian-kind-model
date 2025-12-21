import type { Tag } from "@markdoc/markdoc";
import type { Date, ExpandDictionary, Iso8601, Narrowable } from "inferred-types";
import type { HEADING_LEVELS } from "../utils/Constants";
import type { TupleToUnion } from "../utils/type-utils";
import type { DataArray, Link } from "./dataview_types";
import type { Relationship } from "./settings_types";

export interface FmPropSuggestions {
  "kind"?: Link | string | null;
  "kinds"?: (Link | string)[];
  "type"?: Link | string | null;
  "category"?: Link | string | null;
  "categories"?: DataArray<Link | string> | null;
  "subcategory"?: Link | string | null;
  "website"?: Link | string | null;
  "company"?: Link | string | null;
  "date"?: Date;
  "created"?: Date | Iso8601;
  "modified"?: Date | Iso8601;
  "publish"?: boolean;
  "author"?: string;
  "inactive"?: boolean;
  "archived"?: boolean;
  "closed"?: boolean;
  "title"?: string;
  "desc"?: string;
  "description"?: string;
  "exclude-from-search"?: boolean;

  [key: string]: Narrowable;
}

/**
 * **LinkedAsset**
 *
 * Allows pointer to a page's property
 */
export interface LinkedAsset { page: Link; prop: string }

export interface FmPropMetaSuggestions {
  /**
   * The cover image to display at the top of the page
   */
  _cover?: string | LinkedAsset;
  _icon?: string | LinkedAsset;
  _favicon?: string;
  _relationships?: Relationship[];
  _required_props?: string[];
  _optional_props?: string[];
}

export type Frontmatter = ExpandDictionary<
    {
      [key: string]: Narrowable;
    } & FmPropSuggestions
    & FmPropMetaSuggestions
>;

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
export interface HeadingTag<TLevel extends number> {
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
