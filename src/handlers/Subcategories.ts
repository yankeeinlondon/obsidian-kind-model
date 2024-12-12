import type { PageReference } from "~/types";
import { ensureLeading, stripLeading } from "inferred-types";
import { createFileLink, showDesc, showLinks } from "~/api";
import { showQueryError } from "~/utils";
import { createHandler } from "./createHandler";

export const Subcategories = createHandler("Subcategories")
  .scalar("category AS opt(string)")
  .options()
  .handler(async (evt) => {
    const { plugin: p, page, scalar } = evt;

    const kind = page.kindTags[0];

    const categories
      = scalar.category && scalar.category.includes("/")
        ? [
            [
              ensureLeading(scalar.category.split("/")[0], "#"),
              "subcategory",
              scalar.category.split("/")[1],
            ].join("/"),
          ]
        : scalar.category && kind
          ? [
              `${ensureLeading(kind, "#")}/subcategory/${stripLeading(scalar.category, "#")}`,
            ]
          : page.categories.map((i) => {
              const [k, c] = i.kindedTag.split("/");
              return `${ensureLeading(k, "#")}/subcategory/${c}`;
            });

    if (categories.length === 0) {
      showQueryError(p)("Subcategories", page, `no subcategories`);
    }
    else {
      for (const cat of categories) {
        // page.renderValue(`#### Subcategories for ${cat}`);
        // if(categories.length !== 1) {
        // }
        const pages = p.dv.pages(cat).sort(i => i.file.name);

        if (pages.length > 0) {
          page.table(
            ["Subcategory", "Desc", "Links"],
            pages.map((i: PageReference) => [
              createFileLink(p)(i),
              showDesc(p)(i),
              showLinks(p)(i),
            ]),
          );
        }
        else {
          page.renderValue(
            `- _no subcategories for ${ensureLeading(cat.split("/")[2], "#")} category_`,
          );
        }
      }
    }
  });
