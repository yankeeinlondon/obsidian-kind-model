import type { TypeDefinition } from "inferred-types";
import type { KindDefinition } from "./KindDefinition";
import type {
  CARDINALITY_TYPES,
  CLASSIFICATION,
  LOG_LEVELS,
  TAG_HANDLING,
  UOM_TYPES,
} from "~/utils/Constants";
import type { Mutable, TupleToUnion } from "~/utils/type-utils";

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

/**
 * The settings which get saved for mobile and desktop configurations
 * for a given vault.
 */
export interface KindModelSettings {
  /** used to populate the kinds cache */
  kinds?: KindDefinition[];
  /** used to populate the types cache */
  types?: TypeDefinition[];
  /** the default folder for kind definitions */
  kind_folder?: string;
  handle_tags: TagHandler;
  default_classification: KindClassification;

  page_blocks?: PageBlock[];
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
