import { Kind, KindModelPlugin } from "types/settings-types";


export const CLASSIFICATION = [
  "category",
  "category and subcategory",
  "categories",
  "grouped categories"
] as const;

export const TAG_HANDLING = [
  "Always move to Frontmatter",
  "Always move to Page",
  "Do not Change"
] as const;

export const LOG_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
] as const;

export const DEFAULT_SETTINGS: KindModelPlugin = {
  kinds: {},
  types: {},
	kind_folder: "kind",
  handle_tags: "Do not Change",
  other_type: false,
  default_classification: "category and subcategory",
  page_blocks: [],
  url_patterns: [],
  url_props: [],
  log_level: "warn"
};

export const DEFAULT_KIND: Kind = {
  name: "",
  classification_type: "category and subcategory",
  filename_date_prefix: false,
  folder_include_cwd: false,
  folder_choices_sub_dirs: false,
  folder_favorite: "",
  show_sub_dirs: false,
  relationships: [],
  tag: "",
  metric_props: [],
  class_inside_kind: false,
};

export const FOLDER_DEFAULT = [
  "Favorite folder is default",
  "Current folder is default"
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
  "0:M"
] as const;
