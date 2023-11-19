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
  TSettings extends Record<string, any> | null = null
> {
  /** the property name which is used on this Kind model */
  prop: string;
  /** a reference to the other kind which is being referenced */
  fk_kind: TSettings extends null ? string : TSettings extends Record<string, any> ? keyof TSettings["kinds"] : never;
  cardinality: Cardinality;
}

export interface ListReln extends Relationship {
  cardinality: "0:M"
}

export interface ItemReln extends Relationship {
  cardinality: "0:1"
}

export interface Kind {
  name: string;
  type?: string;
  tag: string;
	/** should this kind always allow the CWD to be where a page is saved? */
	folder_include_cwd: boolean;
	/** each kind model can specify one folder as their "favorite" */
	folder_favorite: string;
	/** should subdirectories of "folder_choices" or CWD be included too? */
	folder_choices_sub_dirs: boolean;
  /** 
   * determines whether just the favorite and CWD directories are shown or
   * if there sub directories are shown too
   */
  show_sub_dirs: boolean;

  filename_date_prefix: boolean;

  /** direct relationships a kind has with another */
  relationships: Relationship[];

  /**
   * Whether the classification properties (e.g., `category`, `sub_category`, etc.)
   * should always be managed inside of the folder specified as the "kind folder".
   */
  class_inside_kind: boolean;
	
	/**
	 * The abstracted classification types this "kind" will use
	 */
	classification_type: KindClassification;

  /** Metric properties associated with a Kind */
  metric_props: Metric[];

  /**
   * The icon to use if no other icon matching rules matched first
   */
  default_icon?: string | undefined;

  default_cover?: string | undefined;
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


export interface KindModelPlugin {
	kinds: Record<string, Kind>;
	kind_folder: string;
  handle_tags: TagHandler;
  types: Record<string, TypeGrouping>;
  default_classification: KindClassification;
  other_type: boolean;
  url_props: UrlProp[];
  url_patterns: UrlPattern[];
  
  page_blocks: PageBlock[];
  /** 
   * the **log level** being reported to the developer console 
   */
  log_level: LogLevel;
}
