import type { KindModelSettings } from "~/types";

export const CLASSIFICATION = [
  "category",
  "category and subcategory",
  "categories",
  "grouped categories",
] as const;

export const TAG_HANDLING = [
  "Always move to Frontmatter",
  "Always move to Page",
  "Do not Change",
] as const;

export const LOG_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
] as const;

/** Days of the Week */
export const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"];

export const DEFAULT_SETTINGS: KindModelSettings = {
  kind_folder: "kind",
  handle_tags: "Do not Change",
  default_classification: "category and subcategory",
  page_blocks: [],
  log_level: "warn",
};

export const DEFAULT_KIND: Kind = {
  name: "",
  _classification_type: "category and subcategory",
  _filename_date_prefix: false,
  _folder_include_cwd: false,
  _folder_choices_sub_dirs: false,
  _folder_favorite: "",
  _show_sub_dirs: false,
  _relationships: [],
  tag: "",
  _metric_props: [],
  _aliases_lowercase: false,
  _aliases_plural: false,
};

export const FOLDER_DEFAULT = [
  "Favorite folder is default",
  "Current folder is default",
] as const;

export const UOM_TYPES = [
  "mass",
  "volume",
  "density",
  "speed",
  "currency",
  "distance",
  "duration_min",
  "duration_sec",
  "duration_ms",
] as const;

export const CARDINALITY_TYPES = [
  "0:1",
  "0:M",
] as const;

export const HEADING_LEVELS = [
  1,
  2,
  3,
  4,
  5,
  6,
] as const;

export const OBSIDIAN_CSS_VARIABLES = [

];
