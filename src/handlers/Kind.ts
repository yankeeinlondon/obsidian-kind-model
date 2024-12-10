import type { DvPage } from "~/types";
import { isDvPage } from "~/type-guards";
import { createHandler } from "./createHandler";

export const Kind = createHandler("Kind")
  .scalar(
    "kind AS opt(string)",
    "category AS opt(string)",
    "subcategory AS opt(string)",
  )
  .options({
    show: "array(string)",
    hide: "array(string)",
  })
  .handler(async (evt) => {
    const p = evt.plugin;
    const page = evt.page;

    if (page) {
      const { table } = page;
      const fmt = p.api.format;
      const {
        showCategories,
        showSubcategories,
        showDesc,
        showLinks,
        createFileLink,
      } = p.api;

      let { kind, category, subcategory } = evt.scalar;

      kind = kind || page.kindTags[0];

      const pages = subcategory
        ? page.pages(`#${kind}/${category}/${subcategory}`)
        : category
          ? page.pages(`#${kind}/${category}`)
          : page.pages(`#${kind}`);

      // const tbl = createTable
      // 	.basedOn("kind","category","subcategory");

      if (pages.length > 0) {
        table(
          [
            "Page",
            !page.isCategoryPage ? "Category" : undefined,
            "Subcategory",
            "Desc",
            "Links",
          ].filter(i => i) as string[],
          pages
            .sort(p => p.file.mday)
            .map((p) => {
              const pg = isDvPage(p)
                ? p
                : (page.page(p) as DvPage);

              return [
                createFileLink(pg),
                !page.isCategoryPage
                  ? showCategories(pg, { currentPage: page })
                  : undefined,
                showSubcategories(pg),
                showDesc(pg),
                showLinks(pg),
              ].filter(i => i);
            }),
        );
      }
      else {
        const msg = subcategory
          ? fmt.as_tag(`${kind}/${category}/${subcategory}`)
          : category
            ? fmt.as_tag(`${kind}/${category}`)
            : `${fmt.as_tag(kind as string)}`;

        page.callout(
          "note",
          `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`,
        );
      }
    }
  });
