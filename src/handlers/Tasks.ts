import type { TupleToUnion } from "inferred-types";
import type { Tag } from "../types/general";

import type { DataArray, ObsidianTask } from "~/types";
import { createHandler } from "./createHandler";

export const COLUMN_CHOICES = [
  "when",
  "created",
  "modified",
  "links",
  "desc",
  "classification",
  "category",
  "subcategory",
  "kind",
  "related",
  "about",
  "company",
  /^#[a-zA-Z/]+ AS [a-zA-Z].*/ as unknown as `#${string} AS ${string}`,
] as const;

export type ColumnChoice = TupleToUnion<typeof COLUMN_CHOICES>;

export interface BackLinkOptions {
  /**
   * rather than back links auto determining how to layout your links
   * you can instead specify which columns you'd like
   */
  columns?: ColumnChoice[];

  /**
   * you can specify tags that indicate that a back linked page should be
   * filtered from the list
   */
  filterTags?: Tag[];

  /**
   * the property you want to sort by
   */
  sortProperty?: string;

  /**
   * the sort order (either ASC or DESC)
   */
  sortOrder?: "ASC" | "DESC";
}

/**
 * Renders any tasks on other pages which refernce the given page
 */
export const Tasks = createHandler("Tasks")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { page, createTable, dv } = evt;

    /**
     * all in-bound links for the page with the exception of self-references
     */
    const tasks = (dv.array(page.inlinkTasks) as DataArray<ObsidianTask>)
      .sort(p => p?.completed);

    await createTable("Desc", "Source Page")(
      i => [
        i.showProp("text"),
        i.showProp("link"),
      ],
      {
        renderWhenNoRecords: () => `- no back links found to this page`,
      },
    )(tasks);

    return true;
  });
