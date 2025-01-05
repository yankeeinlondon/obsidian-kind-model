import type { TupleToUnion } from "inferred-types";
import type { Tag } from "../types/general";

import { createHandler } from "./createHandler";
import { dvApi } from "~/globals";
import { DataArray, Link } from "~/types";

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
 * Renders back links for any obsidian page
 */
export const BackLinks = createHandler("BackLinks")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { plugin: p, page, createTable, dv, report } = evt;

    /**
     * all in-bound links for the page with the exception of self-references
     */
    const links = (dv.array(page.inlinks) as DataArray<Link>)
      .sort(p => p?.path)
      .where(p => p.path !== page.path);

    await createTable("Backlink", "Classification(s)", "Desc", "Links")(
      i => [
        i.createFileLink() || i.page.name,
        i.showClassifications(),
        i.showDesc(),
        i.showLinks(),
      ],
      {
        renderWhenNoRecords: () => `- no back links found to this page`,
      },
    )(links);

    return true;
  });

