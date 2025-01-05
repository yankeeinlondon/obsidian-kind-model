import { htmlLink } from "~/api";
import { asDisplayTag } from "~/helpers";
import { isDvPage, isFuturePage } from "~/type-guards";
import { createHandler } from "./createHandler";
import KindModelPlugin from "~/main";
import { KindClassification, KindClassifiedCategory, PageSubcategory } from "~/types";

function showCategories(p: KindModelPlugin) {
	return <
		T extends KindClassification
	>(classy: T, showKind: boolean = false) => {
		const cats = classy.category 
			? [ classy.category ] as KindClassifiedCategory[]
			: classy.categories 
				? classy.categories as KindClassifiedCategory[]
				: [];
		if(cats.length === 0) {
			return `nothing found for ${asDisplayTag(`#${classy.kindTag}/category/{name}`)}`;
		}

		const kindPrefix = `#${classy.kindTag}/`;

		const output = cats.map(
			i => `${htmlLink(p)(i.page)} [${asDisplayTag(kindPrefix + i.tag)}]`
		)

		return output.join("<br>\n")
	}
}

function showSubcategories(p: KindModelPlugin) {
	return (subCats: PageSubcategory[]) => {
		return subCats.map(
			i => `${htmlLink(p)(i.page)} [${asDisplayTag(i.kindedTag)}]`
		).join("<br>\n")
	}

}


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
          page.classifications.map(
			c => isFuturePage(c)
				? `Future(${c.kind.file.name} [${asDisplayTag(c.kindTag)}])`
				: `${c.kind.file.name} [${asDisplayTag(c.kindTag)}]`
		  ).join("<br>\n")
            
        ]
      : undefined;

    const cats = page.categories?.length > 0
        ? [
            fmt.bold(`Category(s)`),
			page.classifications.length === 1
				? showCategories(p)(page.classifications[0])
				: page.classifications.length > 1
				? page.classifications.map(
					c => showCategories(p)(c)
				).join("<br>\n")
				: "none"
          ]
        : undefined;

    const subCats
      = page.subcategories?.length > 0
        ? [
            page.subcategories?.length > 1
			? fmt.bold("Subcategories")
			: fmt.bold("Subcategory"),
            showSubcategories(p)(page.subcategories)
          ]
        : undefined;
		
    const metadata
      = Object.keys(page.frontmatterTypes).length > 0
        ? [
            fmt.bold("Frontmatter"),
            Object.keys(page.frontmatterTypes)
              .map(
				k => `${fmt.bold(k)}: [ ${page.frontmatterTypes[k as any].join(", ")} ]`)
              .join("<br/>"),
          ]
        : undefined;

    // const classy = [
    //   fmt.bold("Classification"),
    //   JSON.stringify(
    //     page.classifications.map(c => ({
    //       kind: c.kindTag,
    //       categories: c.categories.map(cc => cc.category),
    //       subcategories: c.subcategory?.subcategory,
    //     })),
    //   ),
    // ];

    const report = [kindOfPage, types, kinds, cats, subCats, metadata].filter(
      i => i,
    ) as [left: string, right: string][];

    render.render(fmt.twoColumnTable("", "Value", ...report));
    return true;
  });
