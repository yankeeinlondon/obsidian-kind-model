import type { Link } from "./dataview_types";
import type { PageId, PageIdType } from "./PageId";
import type { Metric, Relationship } from "./settings_types";

export type KindDefinition<T extends PageIdType[] = ["tag"] | ["path"] | ["tag", "path"]> = PageId<T> & {
  hash: number;
  type?: string | Link;

  /** each kind model can specify one folder as their "favorite" */
  folder_favorite?: string;

  /**
   * Indicates whether pages of this kind should have their names
   * prefixed with a date.
   */
  filename_date_prefix?: boolean;

  /** direct relationships a kind has with another */
  relationships?: Relationship[];

  requiredProps?: string[];

  /** Metric properties associated with a Kind */
  metricProps?: Metric[];

  /**
   * The icon to use if no other icon matching rules matched first
   */
  icon?: string | undefined;

  cover?: string | undefined;

};
