import { htmlLink } from "~/api";
import { asDisplayTag } from "~/helpers";
import { isDvPage, isFuturePage } from "~/type-guards";
import { createHandler } from "./createHandler";

export const Debug = createHandler("Debug")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { page, render, plugin: p } = evt;

    const fmt = p.api.format;

    p.info(`Page Details (${page.pageType})`, page);

    render.render(fmt.bold(`Page Information<br/>`));

    const pl = page.hasMultipleKinds ? `s` : "";

    const kindOfPage = [
      fmt.bold("Kind of Page"), //
      `${page.pageType} [multi: ${page.hasMultipleKinds}]`,
    ];
    const types
      = [
        fmt.bold(`Type${pl}`), //
        page.type
          ? htmlLink(p)(page.type)
          : Array.isArray(page.types)
            ? page.types.map(i => htmlLink(p)(i)).join(", ")
            : page.typeTag
              ? `none (but has _type tag_ of ${asDisplayTag(page.typeTag)})`
              : "none",
      ];
    const kinds = page.kindTags?.length > 0
      ? [
          fmt.bold(`Kind${pl}`),
          page.hasMultipleKinds
            ? page.kindTags.join(", ")
            : page.kind
              ? `${page.kind.file.name} ${asDisplayTag(page.kindTags[0])}`
              : page.kindTags[0] || "",
        ]
      : undefined;

    const cats
      = page.categories?.length > 0
        ? [
            fmt.bold(`Category(s)`),
            page.categories.map(i => i.page 
				? isFuturePage(i.page)
					? `Future( ${i.page.file.name} )`
					: `${i.page.file.name} ${asDisplayTag(i.category)}`
				: `page for ${asDisplayTag(i.category)} missing`
			).join(", "),
          ]
        : undefined;

    const subCats
      = page.subcategories?.length > 0
        ? [
            fmt.bold("Subcategories(s)"),
            page.subcategories.map(i => isDvPage(i.page)
              ? `${i.page.file.name} ${asDisplayTag(i.subcategory)}`
              : isFuturePage(i.page)
                ? `Future( ${i.page.file.name} )`
                : null as never,
            ).join(", "),
          ]
        : undefined;
		
    const metadata
      = Object.keys(page.frontmatterTypes).length > 0
        ? [
            fmt.bold("Frontmatter"),
            Object.keys(page.frontmatterTypes)
              .map(k => `${k}: [ ${page.frontmatterTypes[k as any].join(", ")} ]`)
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

    render.render(fmt.twoColumnTable("", "Value", ...report));
    return true;
  });
