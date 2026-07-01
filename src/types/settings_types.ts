import type {
  CARDINALITY_TYPES,
  CLASSIFICATION,
  LOG_LEVELS,
  TAG_HANDLING,
  UOM_TYPES,
} from "~/utils/Constants";
import type { TupleToUnion } from "~/utils/type-utils";

export type KindClassificationConfig = typeof CLASSIFICATION[number];
export interface ClassificationMeta {
  name: KindClassificationConfig;
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
  TSettings extends Record<string, unknown> | null = null,
> {
  /** the property name which is used on this Kind model */
  prop: string;
  /** a reference to the other kind which is being referenced */
  fk_kind: TSettings extends null
    ? string
    : TSettings extends Record<string, unknown>
      ? keyof TSettings["kinds"]
      : never;
  cardinality: Cardinality;
}

export interface ListReln extends Relationship {
  cardinality: "0:M";
}

export interface ItemReln extends Relationship {
  cardinality: "0:1";
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

export interface Kind {
  name: string;
  _classification_type: KindClassificationConfig;
  _filename_date_prefix: boolean;
  _folder_include_cwd: boolean;
  _folder_choices_sub_dirs: boolean;
  _folder_favorite: string;
  _show_sub_dirs: boolean;
  _relationships: Relationship[];
  tag: string;
  _metric_props: Metric[];
  _aliases_lowercase: boolean;
  _aliases_plural: boolean;
}

/**
 * The settings which get saved for mobile and desktop configurations
 * for a given vault.
 */
export interface KindModelSettings {

  /**
   * the **log level** being reported to the developer console
   */
  log_level: LogLevel;

  /**
   * how to manage tags between page body and frontmatter
   */
  handle_tags: TagHandler;

  /**
   * legacy/default folder used by existing event handlers and settings UI
   */
  kind_folder: string;

  /**
   * default classification model for newly created kind definitions
   */
  default_classification: KindClassificationConfig;

  /** paths to all known Kind pages */
  kindPaths: string[];

  /**
   * page template blocks available to kinds
   */
  page_blocks: PageBlock[];

  kinds: Kind[];
  types: TypeGrouping[];
  url_props: UrlProp[];
  url_patterns: UrlPattern[];
  /**
   * the base directory which all Kind Definition pages
   * should be moved to. If not set then this means
   * that they can be stored anywhere.
   */
  kindDefnBaseDir?: string;

  /**
   * the base directory which all Type Definition pages
   * should be moved to. If not set then this means
   * that they can be stored anywhere.
   */
  typeDefnBaseDir?: string;

}
