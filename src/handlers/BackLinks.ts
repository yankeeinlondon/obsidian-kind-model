import type { Tag } from "../types/general";
import type KindModelPlugin from "~/main";

import type { DataArray, Link } from "~/types";
import { stripLeading, type TupleToUnion } from "inferred-types";
import { getPage } from "~/page";
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

function keepPage(p: KindModelPlugin) {
  return (l: Link, ignore: string[]) => {
    const page = getPage(p)(l);

    if (page) {
      const tagSegments = new Set(
        page.file.tags.flatMap(t => t.split("/").map(i => stripLeading(i, "#"))),
      );
      const ignoreTags = ignore.flatMap(t => t.split("/").map(i => stripLeading(i, "#")));

      return ignoreTags.every(t => !tagSegments.has(t));
    }

    return false;
  };
}

/**
 * Renders back links for any obsidian page
 */
export const BackLinks = createHandler("BackLinks")
  .scalar()
  .options({
    ignoreTags: "array(string)",
  })
  .handler(async (evt) => {
    const { plugin: p, page, createTable, dv, options } = evt;

    const { inline_codeblock, bulletPoints, light } = p.api.format;

    const whereTags = (l: Link) => Array.isArray(options?.ignoreTags)
      ? keepPage(p)(l, options?.ignoreTags)
      : true;

    const exception = options?.ignoreTags
      ? light(` <i style="display:flex">(except for those pages tagged with &nbsp;${options.ignoreTags.map(inline_codeblock).join(", ")}&nbsp;)</i>`)
      : "";

    /**
     * all in-bound links for the page with the exception of self-references
     */
    const links = (dv.array(page.inlinks) as DataArray<Link>)
      .sort(p => p?.path)
      .where(p => p.path !== page.path && whereTags(p));

    await createTable(
      "Backlink",
      "Classification",
      "Desc",
      "Links",
    )(
      i => [
        i.createFileLink(),
        i.showClassifications(),
        i.showDesc(),
        i.showLinks(),
      ],
      {
        renderWhenNoRecords: () => bulletPoints(`no back links found to this page ${exception}`),
        hideColumnIfEmpty: ["Links", "Desc"],
      },
    )(links);

    return true;
  });
