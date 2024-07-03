import { KindCache } from "main";
import { Link } from "obsidian-dataview";
import { CARDINALITY_TYPES, CLASSIFICATION, LOG_LEVELS, TAG_HANDLING, UOM_TYPES } from "utils/Constants";
import { Mutable, TupleToUnion } from "utils/type-utils";

export type KindClassification = TupleToUnion<Mutable<typeof CLASSIFICATION>>;
export interface ClassificationMeta {
  name: KindClassification;
  /**
   * A list of properties expected to be on a _kinded page_ and which
   * will point to pages associated with `kind`.
   * 
   * // example: [ "category", "sub_category" ]
   */
  kind_props: string[];
  /**
   * A dictionary where the keys represent a classification property
   * and the value represents a property expected on pages which 
   * represent that classification.
   */
  other_props: Record<string, string>;

  /**
   * A description of the classification strategy
   */
  desc: string;
}

export type UomType = TupleToUnion<typeof UOM_TYPES>;

export interface Metric {
  name: string;
  uom_type: UomType;
}

export type Cardinality = TupleToUnion<typeof CARDINALITY_TYPES>;

export interface Relationship<
  TSettings extends Record<string, unknown> | null = null
> {
	/** the property name which is used on this Kind model */
	prop: string;
	/** a reference to the other kind which is being referenced */
	fk_kind: TSettings extends null 
	? string 
	: TSettings extends Record<string, unknown> 
		? keyof TSettings["kinds"] 
		: never,
	cardinality: Cardinality;
}

export interface ListReln extends Relationship {
  cardinality: "0:M"
}

export interface ItemReln extends Relationship {
  cardinality: "0:1"
}



export type Kind<T extends string = string> = {
	name: T;
	type?: string | Link;
	tag: string;
	/** should this kind always allow the CWD to be where a page is saved? */
	_folder_include_cwd: boolean;
	/** each kind model can specify one folder as their "favorite" */
	_folder_favorite?: string;
	/** should subdirectories of "folder_choices" or CWD be included too? */
	_folder_choices_sub_dirs?: boolean;
	/** 
	 * determines whether just the favorite and CWD directories are shown or
	 * if there sub directories are shown too
	 */
	_show_sub_dirs?: boolean;

	/**
	 * Indicates whether pages of this kind should have their names
	 * prefixed with a date.
	 */
	_filename_date_prefix?: boolean;

	/** direct relationships a kind has with another */
	_relationships: Relationship[];

	/**
	 * The abstracted classification types this "kind" will use
	 */
	_classification_type: KindClassification;

	/** Metric properties associated with a Kind */
	_metric_props: Metric[];

	/**
	 * The icon to use if no other icon matching rules matched first
	 */
	_icon?: string | undefined;

	_cover?: string | undefined;

	/**
	 * When set, this indicates that the "kind" (or page) should have plural aliases
	 * added to all pages. If the page name is already plural then nothing is done.
	 */
	_aliases_plural: boolean;
	/**
	 * When set, an alias is created for all 
	 */
	_aliases_lowercase: boolean;
}

export type TagHandler = TupleToUnion<typeof TAG_HANDLING>;

export interface TypeGrouping {
  name: string;
  desc?: string;
  kinds: string[];
}

export interface UrlProp {
  prop: string;
  default_icon: string;

}

/** 
 * Means to detect a URL pattern and modify
 * the `icon` which represents it.
 */
export interface UrlPattern {
  /** a regex expression that will be tested before changing props */
  pattern: string;

}

export interface PageBlock {

}

export type LogLevel = TupleToUnion<typeof LOG_LEVELS>;


export interface KindModelSettings {
	kinds: Record<string, Kind>;
	kind_folder: string;
	handle_tags: TagHandler;
	types: Record<string, TypeGrouping>;
	default_classification: KindClassification;
	/**
	 * The "cache" of pages and lookups which this plugin 
	 * is responsible for managing.
	 */
	cache: KindCache | null;
	url_props: UrlProp[];
	url_patterns: UrlPattern[];

	page_blocks: PageBlock[];
	/** 
	 * the **log level** being reported to the developer console 
	 */
	log_level: LogLevel;

	/**
	 * to query the [World Cat](https://search.worldcat.org) 
	 * service for books you need to know the _version_ of the API. 
	 * Not sure the frequency of it changing but we will cache it so 
	 * that we can get fast results _until_ we have to re-scrape to
	 * get a new one.
	 */
	worldCatApiVersion?: string;
}
