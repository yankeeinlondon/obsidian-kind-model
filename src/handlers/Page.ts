import { isFunction } from "inferred-types";
import { htmlLink } from "~/api";
import { asDisplayTag } from "~/helpers";
import { createHandler } from "./createHandler";

export const Page = createHandler("Page")
  .scalar()
  .options()
  .handler(async (evt) => {
    const p = evt.plugin;
    const page = evt.page;
    const fmt = p.api.format;

    p.info(`Page Details`, page);

    page.render(fmt.bold("Page Information<br/>"));

    const kindOfPage = [
      fmt.bold("Kind of Page"), //
      `${page.pageType} [multi: ${page.hasMultipleKinds}]`,
    ];
    const types
      = [
        fmt.bold("Types(s)"), //
        page.type
          ? htmlLink(p)(page.type)
          : Array.isArray(page.types)
            ? page.types.map(i => htmlLink(p)(i)).join(", ")
            : page.typeTag
              ? `none (but has _type tag_ of ${asDisplayTag(page.typeTag)})`
              : "none",
      ];
    const kinds
      = page.kindTags?.length > 0
        ? [fmt.bold("Kind(s)"), page.kindTags.join(", ")]
        : undefined;

    const cats
      = page.categories?.length > 0
        ? [
            fmt.bold("Category(s)"),
            page.categories.map(i => i.category).join(", "),
          ]
        : undefined;

    const subCats
      = page.subcategories?.length > 0
        ? [
            fmt.bold("Subcategories(s)"),
            page.subcategories.map(i => i.subcategory).join(", "),
          ]
        : undefined;

    const metadata
      = Object.keys(page.metadata).length > 0
        ? [
            fmt.bold("Frontmatter"),
            Object.keys(page.metadata)
              .filter(k => !isFunction(page.metadata[k as any]))
              .map(k => `${k}(${page.metadata[k as any].join(", ")})`)
              .join("<br/>"),
          ]
        : undefined;

    const classy = [
      fmt.bold("Classification"),
      JSON.stringify(
        page.classifications.map(c => ({
          kind: c.kindTag,
          categories: c.categories.map(cc => cc.category),
          subcategories: c.subcategory?.subcategory,
        })),
      ),
    ];

    const report = [kindOfPage, types, kinds, cats, subCats, metadata, classy].filter(
      i => i,
    ) as [left: string, right: string][];

    page.render(fmt.twoColumnTable("", "Value", ...report));
  });
