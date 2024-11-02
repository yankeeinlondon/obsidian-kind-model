import KindModelPlugin from "~/main";
import { getPath } from "../api/getPath";
import { PageInfo, PageReference } from "~/types";
import { 
	getCategories,
	getClassification, 
	getKindTagsOfPage, 
	getMetadata, 
	getSubcategories, 
	hasAnyCategoryProp, 
	hasAnyKindProp, 
	hasAnySubcategoryProp, 
	hasCategoriesProp, 
	hasCategoryProp, 
	hasCategoryTag, 
	hasKindDefinitionTag, 
	hasKindProp, 
	hasKindsProp, 
	hasKindTag, 
	hasSubcategoriesProp, 
	hasSubcategoryProp, 
	hasSubcategoryTag, 
	hasSubcategoryTagDefn, 
	hasTypeDefinitionTag, 
	isCategoryPage, 
	isKindDefnPage, 
	isKindedPage, 
	isSubcategoryPage, 
	isTypeDefnPage 
} from "../api/buildingBlocks";
import { getPage } from "./getPage";
import { isPageInfo } from "~/type-guards";
import { fmApi } from "~/api";


/**
 * Creates an entry in PAGE_INFO_CACHE for a page in the vault.
 * 
 * - if `DvPage` for this page was in PAGE_CACHE it will be removed
 * - the `page` property on `PageInfo` is now the reference to the `DvPage`
 * API surface
 */
export const getPageInfo = (p: KindModelPlugin) => (
	pg: PageReference
): PageInfo | undefined => {

	if(isPageInfo(pg)) {
		return pg;
	}

	const path = getPath(pg);
	const page = getPage(p)(pg);

	if (path && page) {
		const meta = {
			categories: getCategories(p)(page),
			subcategories: getSubcategories(p)(page),

			hasCategoryProp: hasCategoryProp(p)(page),
			hasCategoriesProp: hasCategoriesProp(p)(page),
			hasAnyCategoryProp: hasAnyCategoryProp(p)(page),
			hasSubcategoryProp: hasSubcategoryProp(p)(page),
			hasSubcategoriesProp: hasSubcategoriesProp(p)(page),
			hasAnySubcategoryProp: hasAnySubcategoryProp(p)(page),

			hasCategoryTag: hasCategoryTag(p)(page),
			hasSubcategoryTag: hasSubcategoryTag(p)(page),
			hasSubcategoryDefnTag: hasSubcategoryTagDefn(p)(page),

			hasKindProp: hasKindProp(p)(page),
			hasKindsProp: hasKindsProp(p)(page),
			hasAnyKindProp: hasAnyKindProp(p)(page),

			hasKindTag: hasKindTag(p)(page),
			hasKindDefinitionTag: hasKindDefinitionTag(p)(page),
			hasTypeDefinitionTag: hasTypeDefinitionTag(p)(page),
			
			isCategoryPage: isCategoryPage(p)(page),
			isSubcategoryPage: isSubcategoryPage(p)(page),
			isKindDefnPage: isKindDefnPage(p)(page),
			isTypeDefnPage: isTypeDefnPage(p)(page),
			isKindedPage: isKindedPage(p)(page),

			kindTags: getKindTagsOfPage(p)(page),
			typeTags: [],
		}

		const info: PageInfo  = {
			current: page,
			path,
			name: page.file.name,
			ext: page.file.ext,
			classifications: getClassification(p)(
				page, 
				meta.categories, 
				meta.subcategories
			),
			hasMultipleKinds: meta.kindTags.length > 1,
			type: meta.isKindDefnPage
				? "kind-defn"
				: meta.isTypeDefnPage
				? "type-defn"
				: meta.isKindedPage && meta.isCategoryPage
					? "kinded > category"
					: meta.isKindedPage && meta.isSubcategoryPage
					? "kinded > subcategory"
					: meta.isKindedPage
					? "kinded"
					: "none",	
			fm: page.file.frontmatter,
			...fmApi(p, path),
			metadata: getMetadata(p)(page),
			...meta
		}

		return info;
	}
}
