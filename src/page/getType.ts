import type KindModelPlugin from "~/main";
import type { DvPage, PageType } from "~/types";
import { stripLeading } from "inferred-types";
import { getPageInfo } from "./getPageInfo";
import { isPageReference } from "~/type-guards";
import { getPage } from "./getPage";

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
export function getTypeOfPage(p: KindModelPlugin) {
  return <
    TSingular extends boolean,
  >(
    pg: DvPage,
    singular: TSingular,
  ): [TSingular] extends [true] ? undefined | DvPage : undefined | DvPage[] => {
    const page = getPageInfo(p)(pg);

    	const {
    		current,
    		typeTag, pageType,
    		hasMultipleKinds,
    		isCategoryPage, isKindDefnPage
    	} = page;

    	const typeProp = isPageReference(current.type)
    		? getPage(p)(current.type) as DvPage
    		: undefined;

    	// const typePropFromTag = (
    	// 	isString(typeTag) && (isCategoryPage || isKindDefnPage)
    	// )
    	// 	? getTypeDefinitionPageFromTag(p)(typeTag)
    	// 	: undefined;

    	const kindPage = !hasMultipleKinds && isPageReference(current.kind)
    		? getPage(p)(current.kind) as DvPage
    		: undefined;

    	const kindPages = hasMultipleKinds && current.kinds && current.kinds.some(i => isPageReference(i))
    		? current.kinds.map(getPage(p)).filter(i => i)  as DvPage[]
    		: undefined;

    	const kindTypeProp = kindPage && isPageReference(kindPage.type)
    		? getPage(p)(kindPage.type) as DvPage
    		: undefined;

    	const kindsTypeProps = kindPages
    		? kindPages.map(pg => pg.type && isPageReference(pg.type) ? getPage(p)(pg.type) : undefined).filter(i => i)
    		: undefined;

    	const singularNever = ["type-defn","multi-kinded", ] as PageType[];

    	const multiNever = ["kind-defn", "type-defn", "kinded", "kinded > category", "kinded > subcategory"] as PageType[];

    	return (
    		singular
    		// SINGULAR
    		? singularNever.includes(pageType)
    			? undefined
    			: typeProp ||  kindTypeProp
    		// MULTI
    		: multiNever.includes(pageType)
    			? undefined
    			: kindsTypeProps
    	) as unknown as [TSingular] extends [true]
    		? undefined | DvPage
    		: undefined | DvPage[];

    }
}

export function getTypeDefinitionPageFromTag(p: KindModelPlugin) {
  return (tag: string): DvPage | undefined => {
    const safeTag = stripLeading(
      stripLeading(tag, "#"),
      "type/",
    );

    const data = p.dv.pages(`#type/${safeTag}`);
    return data.length > 0
      ? data[0] as DvPage
      : undefined;
  };
}
