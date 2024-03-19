import { Tag } from "@markdoc/markdoc";
import { Link } from "obsidian-dataview";
import { HEADING_LEVELS } from "../utils/Constants";
import { TupleToUnion } from "../utils/type-utils";
import { DataArray } from "./dataview_types";
import { Relationship } from "./settings_types";


export type FmPropSuggestions = {
	kind?: Link  | string | null;
	type?: Link | string | null;
	category?: Link | string | null;
	categories?: DataArray<Link | string> | null;
	subcategory?: Link | string | null;
	website?: Link | string | null;
	company?: Link | string | null; 
	[key: string]: unknown
}

/**
 * **LinkedAsset**
 * 
 * Allows pointer to a page's property
 */
export type LinkedAsset = { page: Link, prop: string };


export type PropertyType = "string" | "string[]" | "number" | "number[]" | "boolean" | "boolean[]" | "metric";

/**
 * A string which describes a property in a Kind model as being:
 * 
 * 1. of a particular type (defined by `PropertyType` union)
 * 2. of a given name
 */
export type PropertyDefn = `${string}::${PropertyType}`

export type FmPropMetaSuggestions = {
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



export type Frontmatter = {
	[key: string]: string | number | boolean | unknown[] | Record<string, unknown>
} & FmPropSuggestions & FmPropMetaSuggestions;

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

