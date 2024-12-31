import type KindModelPlugin from "~/main";
import type { DvPage } from "~/types";
import { isArray, stripLeading } from "inferred-types";
import { isPageReference } from "~/type-guards";
import { getPage } from "./getPage";
import { getPageType, getTypeTag, hasTypeTag } from "~/api";
import { getPageKinds } from "./getPageKinds";

/**
 * **getTypePage**`(page, singular)`
 *
 * Provides the **Type** of a page by looking at both local properties
 * and tags as well as via _inheritance_ from an associated Kind or
 * Category.
 *
 * - use of the `singular` property expresses the asumptive cardinality
 * of the number of **Kinds** involved.
 */
export function getTypeForPage(p: KindModelPlugin) {
	return (page: DvPage): DvPage[] => {
		const pageType = getPageType(p)(page);

		switch(pageType) {
			case "kind-defn":
				return isPageReference(page.type)
					? [ getPage(p)(page.type) ]
					: page.file.tags.some(i => i.startsWith(`#type/`))
						? [
							getTypeDefinitionPageFromTag(p)(stripLeading(
								page.file.tags.find(i => i.startsWith("#type/")),
								"#type/"
							) as string)
						] as DvPage[]
						: [] as DvPage[]
			case "type-defn":
				return [] as DvPage[];
			case "kinded":
			case "kinded > category":
			case "kinded > subcategory": 
				const kindPage = getPageKinds(p)(page)[0] as DvPage | undefined;
				return isPageReference(page.type)
					? [ getPage(p)(page.type) ] as DvPage[]
					: page.file.tags.some(i => i.startsWith(`#type/`))
						? [
							getTypeDefinitionPageFromTag(p)(stripLeading(
								page.file.tags.find(i => i.startsWith("#type/")),
								"#type/"
							) as string)
						] as DvPage[]
					: kindPage && isPageReference(kindPage.type)
						? [ getPage(p)(kindPage.type) ] as DvPage[]
					: pageType === "kinded > category" && hasTypeTag(p)(page)
						? [ getTypeDefinitionPageFromTag(p)(
							getTypeTag(p)(page) as string
						)]  as DvPage[]
						: []  as DvPage[];
			case "multi-kinded":
			case "multi-kinded > category":
			case "multi-kinded > subcategory":
				const kindPages = getPageKinds(p)(page).filter(i => isPageReference(i.type)) as DvPage[];
				return isArray(page.types) && page.types.some(i => isPageReference(i))
					? page.types.map(i => isPageReference(i) ? getPage(p)(i) : undefined).filter(i => i) as DvPage[]
					: page.file.tags.some(i => i.startsWith(`#type/`))
						? (Array.from(page.file.tags) as string[]).filter(i => i.startsWith("#type/"))
							.map(i => 
								getTypeDefinitionPageFromTag(p)(stripLeading(i, "#type/"))
							)
							.filter(i => i) as DvPage[]
					: kindPages.length > 0 
						? kindPages
							.map(i => isPageReference(i.type) ? getPage(p)(i.type) : undefined) as DvPage[]
					: pageType === "multi-kinded > category" && hasTypeTag(p)(page)
						? [ getTypeDefinitionPageFromTag(p)(
							getTypeTag(p)(page) as string
						)]  as DvPage[]
						: []  as DvPage[];
			case "none": 
				return [];

		}
	}
}

export function getTypeDefinitionPageFromTag(p: KindModelPlugin) {
  return (tag: string): DvPage | undefined => {
    const safeTag = stripLeading(
      stripLeading(tag, "#"),
      "type/",
    );

    const data = p.dv.pages(`#type/${safeTag}`).filter(pg => {
		const pageType = getPageType(p)(pg);
		return pageType === "type-defn"
	});
    return data.length > 0
      ? data[0] as DvPage
      : undefined;
  }
}
