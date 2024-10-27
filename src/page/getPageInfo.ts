import KindModelPlugin from "~/main";
import { getPath } from "../api/getPath";
import {  getPage,  hasPageInfo, lookupPageInfo, removeFromPageCache, updatePageInfoCache } from "../api/cache";
import { PageInfo, PageReference } from "~/types";
import { 
	getCategories,
	getClassification, 
	getPageBanners, 
	getPageIcons, 
	getSubcategories, 
	getSuggestedActions, 
	hasCategoryProp, 
	hasCategoryTag, 
	hasKindDefinitionTag, 
	hasKindProp, 
	hasKindsProp, 
	hasKindTag, 
	hasMultipleKinds, 
	hasTypeDefinitionTag, 
	isCategoryPage, 
	isKindDefnPage, 
	isKindedPage, 
	isSubcategoryPage, 
	isTypeDefnPage 
} from "../api/buildingBlocks";
import { formattingApi } from "../api/formattingApi";
import { showApi } from "../api/showApi";

/**
 * Creates an entry in PAGE_INFO_CACHE for a page in the vault.
 * 
 * - if `DvPage` for this page was in PAGE_CACHE it will be removed
 * - the `page` property on `PageInfo` is now the reference to the `DvPage`
 * API surface
 */
export const createPageInfo = (p: KindModelPlugin) => (
	pg: PageReference
): PageInfo | undefined => {
	const path = getPath(pg);

	if(path && hasPageInfo(p)(path)) {
		// already in cache
		return lookupPageInfo(p)(path);
	}

	const page = getPage(p)(pg);

	if (path && page) {
		const info: PageInfo  = {
			page,
			path,
			type: isKindDefnPage(p)(page)
				? "kind-defn"
				: isTypeDefnPage(p)(page)
				? "type-defn"
				: isKindedPage(p)(page) && isCategoryPage(p)(page)
					? "kinded > category"
					: isKindedPage(p)(page) && isSubcategoryPage(p)(page)
					? "kinded > subcategory"
					: isKindedPage(p)(page)
					? "kinded"
					: "none",	
			fm: page.file.frontmatter,
			categories: getCategories(p)(page),
			subcategories: getSubcategories(p)(page),
			classifications: getClassification(p)(page),

			hasCategoryProp: hasCategoryProp(p)(page),
			hasCategoryTag: hasCategoryTag(p)(page),
			hasKindProp: hasKindProp(p)(page),
			hasKindDefinitionTag: hasKindDefinitionTag(p)(page),
			hasKindsProperty: hasKindsProp(p)(page),
			hasKindTag: hasKindTag(p)(page),
			hasMultipleKinds: hasMultipleKinds(p)(page),
			hasTypeDefinitionTag: hasTypeDefinitionTag(p)(page),
			isCategoryPage: isCategoryPage(p)(page),
			isSubcategoryPage: isSubcategoryPage(p)(page),
			getBanners: () => getPageBanners(p)(page),
			getIcons: () => getPageIcons(p)(page),
			getSuggestedActions: () => getSuggestedActions(p)(page),
			format: formattingApi(p),
			getPage: getPage(p),
			...showApi(p)
		}

		updatePageInfoCache(p)(path, info);
		removeFromPageCache(p)(path);

	}
}
