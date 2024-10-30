import { 
	Container,
	Dictionary,
	ExpandDictionary,
	isArray, 
	isContainer, 
	isDefined, 
	isNumber, 
	isString, 
	stripLeading 
} from "inferred-types";

import KindModelPlugin from "~/main";


import {  
	isDvPage, 
	isFileLink, 
	isFrontmatter, 
	isPageInfo
} from "~/type-guards";
import { 
	DvPage, 
	Classification, 
	PageBanners, 
	PageIcons, 
	PageSuggestion, 
	TAbstractFile, 
	TFile, 
	Tag, 
	PageReference, 
	FileLink,
	PropertyType,
	PageCategory,
	PageSubcategory,
	PageInfo,
	DecomposedTag,
	DecomposedCategoryTag,
	DecomposedSubcategoryTag,
	DecomposedKindTag,
	Frontmatter
} from "../types";
import { BuildingBlocksApi } from "../types";
import { getPropertyType } from "./getPropertyType";
import { toArray } from "~/helpers/toArray";
import { getPage } from "~/page";
import { lookupKindByTag, lookupKnownKindTags } from "~/cache";

/**
 * returns all Kind tags which have `tag` as part of them; all tags 
 * are passed back if tag is _undefined_.
 */
export const getKnownKindTags = (p: KindModelPlugin) => (
	tag?: string
): string[] => {
	
	return tag
		? Array.from(p.cache?.kindDefinitionsByTag?.keys() || []).filter(i => i.includes(tag))
		: Array.from(p.cache?.kindDefinitionsByTag?.keys() || []);
}


export const isKeyOf = <
	TContainer,
	TKey
>(container: TContainer, key: TKey): key is TContainer extends Container ? TKey & keyof TContainer : TKey => {
	return (
		isContainer(container) && (isString(key) || isNumber(key)) && key in container ? true : false
	);
}

/** 
 * Boolean test whether the passed in tag is a known `kind` tag
 */
export const isKindTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(stripLeading(tag, "#"), "kind/");
	const parts = safeTag.split("/");
	const valid = getKnownKindTags(p)();

	return valid.includes(safeTag);
}

/**
 * indicates whether page has a tag which defines itself as a "category"
 */
export const hasCategoryTagDefn = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const hasBareCategory = page.file.etags.find(t => t.startsWith(`#category/`) ) ? true : false;
		const hasKindCategory = page.file.etags.find(t => t.split("/")[1] === "category" && t.split("/").length === 3)
		return hasBareCategory || hasKindCategory ? true :false;
	}

	return false;
}

/**
 * indicates whether page has a tag which defines itself as a "subcategory"
 */
export const hasSubcategoryTagDefn = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg); 

	if (page) {
		const hasBareSubcategory = page.file.etags.find(t => t.startsWith(`#subcategory/`) ) ? true : false;
		const hasKindSubcategory = page.file.etags.find(t => t.split("/")[1] === "subcategory" && t.split("/").length === 4)
		return hasBareSubcategory || hasKindSubcategory  ? true :false;
	}

	return false;
}

/**
 * checks whether a kinded page 
 */
export const hasSubcategoryTag = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);
	const kinds = lookupKnownKindTags(p);
	
	return (
		page && 
		page.file.etags.some(i => i.split("/").length === 3 &&  
			kinds.includes(stripLeading(i.split("/")[0], "#"))
		))
		? true
		: false
}

/**
 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
 * 
 * Note:
 * - this will _never_ be true for a page which is a category page or a kinded definition
 */
export const hasCategoryTag = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg); 

	if(page) {
		const kindTags = Array.from(page.file.tags).filter((t: Tag) => isKindTag(stripLeading(t.split("/")[0], "#"))) as string[];
		const withCategory = kindTags.filter(t => t.split("/").length > 1).map(t => t.split("/")[1]);

		return withCategory.length > 0;
	}

	return false;
}


/**
 * Boolean operator which reports on whether:
 * 
 * 1. the given page has a property `category` and
 * 2. the property value is a `FileLink`
 */
export const hasCategoryProp = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg); 

	if (page) {
		return page.category && isFileLink(page.category) ? true : false;
	}

	return false;
}

/**
 * boolean operation which checks that page has a `categories` property, it is an array, and at least
 * on element in the array is a `FileLink`.
 */
export const hasCategoriesProp = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg); 

	if (page) {
		return (
			page.categories && 
			Array.isArray(page.categories) && 
			page.categories.filter(isFileLink).length > 0
		) ? true : false;
	}

	return false;
}

/**
 * tests whether a page is a "category page" which is ascertained by:
 * 
 * 1. is there a tag definition for the category (e.g., `#software/category/foo`)
 * 2. is there a property "role" which points to the `kind/category` definition?
 */
export const isCategoryPage = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);

	return page && page.file.etags.some(i => i.split("/").length === 3 && i.split("/")[1] === "category")
		? true 
		: false;
}

/**
 * tests whether a page is a "subcategory page" which is ascertained by:
 * 
 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
 * 2. is there a property "role" which points to the `[kind]/subcategory` definition?
 */
export const isSubcategoryPage = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);
	
	return page && page.file.etags.some(i => i.split("/").length === 4 && i.split("/")[1] === "subcategory")
		? true 
		: false;
}

/**
 * boolean operator which reports on whether the page has multiple "kinds" which it is _kinded_ by.
 */
export const hasMultipleKinds = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const tags = page.file.tags;
		const kindTags = tags.filter(t => isKindTag(p)(stripLeading( t.split("/")[0], "#" )));
		return kindTags.length > 1 ? true : false;
	}

	return false;
}

/**
 * boolean operator which indicates whether the page has a 
 * "kind tag" (not a kind definition tag).
 */
export const hasKindTag = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const tags = page.file.etags;
		const kindTags = tags
			.filter(
				t => isKindTag(p)(stripLeading( t.split("/")[0], "#" )) ||
					(t.split("/").length === 3 && t.split("/")[1] === "category") ||
					(t.split("/").length === 4 && t.split("/")[1] === "subcategory")
			);
		return kindTags.length > 0 ? true : false;
	}

	return false;
}

/**
 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
 */
export const hasKindDefinitionTag = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const tags = page.file.tags.filter(t => t.startsWith(`#kind/`));

		return tags.length > 0 ? true : false;
	}

	return false;
}

/**
 * boolean operator which indicates whether the page has a tag starting with `#type/`.
 */
export const hasTypeDefinitionTag = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const tags = page.file.tags.filter(t => t.startsWith(`#type/`));

		return tags.length > 0 ? true : false;
	}

	return false;
}

/**
 * a boolean operator which reports on whether the page has a `kind` property which is a `FileLink` to 
 * a page in the vault.
 */
export const hasKindProp = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const page = getPage(p)(pg);

	return page && isDefined(page.kind) && isFileLink(page.kind)
		? true
		: false;
}

/**
 * a boolean operator which reports on whether the page has a `kinds` property which is an array with at least
 * one `FileLink` in it.
 */
export const hasKindsProp = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		return (
			isDefined(page.kinds) && 
			isArray(page.kinds) && 
			page.kinds.some(p => isFileLink(p))
		);
	}
	return false;
}

/**
 * a boolean operator which reports on whether the page has a `type` property which is a `FileLink` to 
 * a page in the vault.
 */
export const hasTypeProp = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		return isDefined(page.type) && isFileLink(page.type);
	}
	return false;
}

/**
 * a boolean operator which reports on whether the page has a `type` tag indicating that
 * the page is a Type definition page.
 */
export const hasTypeTag = (p: KindModelPlugin) => (pg: PageReference | undefined): boolean => {
	const page = getPage(p)(pg);
	if(page) {
		const found = page.file.etags.find(i => i.startsWith("type/"));
		return found ? true : false
	}
	return false;
}

export const isCategoryDefnTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(tag, "#");
	const parts = safeTag.split("/");
	return parts.length === 3 && parts[1] === "category"
		? true
		: false
}

export const isSubcategoryDefnTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(tag, "#");
	const parts = safeTag.split("/");
	return parts.length === 4 && parts[1] === "subcategory"
		? true
		: false
}

export const isKindedWithCategoryTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(tag, "#");
	const parts = safeTag.split("/");
	return (
		
		parts.length === 2 && isKindTag(p)(parts[0])
	);
}

export const isKindedWithSubcategoryTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(tag, "#");
	const parts = safeTag.split("/");
	return (
		parts.length === 3 && 
		!["category","subcategory"].includes(parts[1]) &&
		isKindTag(p)(parts[0])
		? true
		: false
	);
}

export const isTypeDefnTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const safeTag = stripLeading(tag, "#");
	return safeTag.startsWith("type/")
}

export const decomposeTag = (
	p: KindModelPlugin
) => (tag: string): DecomposedTag => {
	const safeTag = stripLeading(tag, "#");
	const parts = safeTag.split("/");
	if (!isKindTag(p)(parts[0])) {
		return {
			type: "unknown",
			tag,
			safeTag
		}
	}

	const partial: Partial<DecomposedTag> = {
		tag,
		safeTag,
		kindTag: parts[0],
		kindDefnTag: `kind/${parts[0]}`,
	}

	if (isCategoryDefnTag(p)(safeTag)) {
		return {
			type: "category",
			...partial,
			categoryTag: parts[2],
			categoryDefnTag: safeTag,
			isCategoryDefn: true,
			isSubcategoryDefn: false,
			isKindDefn: false
		} as DecomposedCategoryTag
	} else if (isKindedWithCategoryTag(p)(safeTag)) {
		return {
			type: "category",
			...partial,
			categoryTag: parts[1],
			categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
			isCategoryDefn: false,
			isSubcategoryDefn: false,
			isKindDefn: false
		} as DecomposedCategoryTag
	} else if (isKindedWithSubcategoryTag(p)(safeTag)) {
		return {
			type: "subcategory",
			...partial,
			categoryTag: parts[1],
			categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
			subcategoryTag: parts[2],
			subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}`,
			isCategoryDefn: false,
			isSubcategoryDefn: false,
			isKindDefn: false
		} as DecomposedSubcategoryTag
	} else if (isSubcategoryDefnTag(p)(safeTag)) {
		return {
			type: "subcategory",
			...partial,
			categoryTag: parts[2],
			categoryDefnTag: `${parts[0]}/category/${parts[2]}`,
			subcategoryTag: parts[3],
			subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}/${parts[3]}`,
			isCategoryDefn: false,
			isSubcategoryDefn: true,
			isKindDefn: false
		} as DecomposedSubcategoryTag
	} else if (isTypeDefnPage(p)(safeTag)) {
		return {
			type: "type",
			typeDefnTag: `type/${parts[1]}`,
			typeTag: parts[1],
			tag,
			safeTag,
			isCategoryDefn: false,
			isSubcategoryDefn: false,
			isKindDefn: false
		}
	}

	return {
		type: "kind",
		...partial,
		isCategoryDefn: false,
		isSubcategoryDefn: false,
		isKindDefn: safeTag.includes("kind/")
	} as DecomposedKindTag

}
/**
 * higher order function which after passed the plugin, will take a 
 * _page reference_ or an object representing a frontmatter key/value
 * object.
 * 
 * This function utility is to ensure regardless of the input type that
 * a valid Frontmatter type is returned.
 */
export const getFrontmatter = (p: KindModelPlugin) => (
	from: PageReference | Frontmatter
): Frontmatter => {
	if(isDvPage(from)) {
		return from.file.frontmatter;
	} 

	if(isPageInfo(from)) {
		return from.fm;
	}

	if(isFrontmatter(from)) {
		return from;
	}

	const page = getPage(p)(from);
	
	if(page) {
		return page.file.frontmatter;
	} else {
		p.debug(`call to getFrontmatter() was unable to load a valid page so returned an empty object.`, {from})
		return {} as Frontmatter;
	}
}


/**
 * gets all "categories" associated with page:
 * 
 * - takes from `category` and `categories` props
 * - spans _all_ kinds which were defined
 */
export const getCategories = (p: KindModelPlugin) => (
	pg: PageReference
): PageCategory[] => {
	const page = getPage(p)(pg);
	const categories: PageCategory[] = [];

	if(page) {
		/** tags with category info */
		const tags = getCategoryTags(p)(page);
		p.info("cat tags", tags)

		return tags.map(t => {
				return {
					...t,
					category: getPage(p)(t.defnTag)
				} as PageCategory
		}); 
	}

	return categories;
}

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export const getSubcategories = (p: KindModelPlugin) => (
	pg: PageReference
): PageSubcategory[] => {
	const page = getPage(p)(pg);
	if(page) {
		const tags = getSubcategoryTags(p)(page)
		.map(t => {
			const subcategory = getPage(p)(t.defnTag) as DvPage;
			if(subcategory) {
				return {
					...t,
					subcategory
				}
			}

			return undefined;
		}).filter(i => i) as PageSubcategory[];

		return tags;
	}

	return [];
}



export const getPageIcons = (p: KindModelPlugin) => (pg: PageReference): PageIcons => {
	return { 
		hasIcon: false
	}
}

export const getPageBanners = (p: KindModelPlugin) => (pg: PageReference): PageBanners => {
	return { 
		hasBanner: false
	}
}

export const getSuggestedActions = (p: KindModelPlugin) => (pg: PageReference): PageSuggestion[] => {
	return [];
}

/**
 * looks at the passed in page's "kind" property as well as the tag reference if available to and returns the _kinds_ 
 * this page is identified as.
 */
export const getKindDefinitions = (p: KindModelPlugin) => (pg: PageReference | undefined): DvPage[] => {
	const page = getPage(p)(pg);
	if(page) {
		if (page.kind && isFileLink(page.kind)) {
			return [getPage(p)(page.kind.path)] as DvPage[];
		} else if (page.kinds && Array.isArray(page.kinds) && page.kinds.some(i => isFileLink(i))) {
			return page.kinds.filter(i => isFileLink(i)).map(i => getPage(p)(i.path)).filter(i => i) as DvPage[]
		}
		const tags = getKindTagsOfPage(p)(page);


	}


	return [];
}


/**
 * A page is a kinded page if:
 * 
 * 1. it has a `kind` property pointing to another page in the vault
 * 2. it has a tag which is known to be for a kind definition
 * 
 * Note: we don't require that the `kind` property point to a Kind Definition but 
 * this will show up on calling `kindErrors`
 */
export const isKindedPage = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	// get DvPage (from cache or into)
	const page = getPage(p)(pg);
	
	if (page) {
		return hasKindProp(p)(page) && !hasKindDefinitionTag(p)(page)
			? true
			: hasKindTag(p)(page)
			? true
			: false
	} 

	const err = new Error(`Call to isKindedPage() was unable to resolve the page reference to a page in the vault: ${JSON.stringify(page)}`);
	p.error(err);
	return false;
}

export const isKindDefnPage = (p: KindModelPlugin) => (
	ref: PageReference
): boolean => {
	const page = getPage(p)(ref);

	return page && page.file.etags.some(i => i.startsWith("#kind/"))
		? true 
		: false
}

export const isTypeDefnPage = (p: KindModelPlugin) => (ref: PageReference) => {
	const page = getPage(p)(ref);

	return page && page.file.etags.some(i => i.startsWith("#type/"))
		? true 
		: false
}


/**
 * For a given page, it will return the "kind tags" of that page. 
 * 
 * For instance:
 * 
 * - a page with the tag `#software/category/ai` would return `["software"]`.
 * - a page with the tag `#kind/software` would also return `["software"]`
 */
export const getKindTagsOfPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): string[] => {
	const page = getPage(p)(pg);
	if(page) {
		const tags = page.file.etags.filter(t => isKindTag(p)(t));
		return Array.from<string>(tags).map(t => t.replace("#kind/",""));
	}
	return [];
}

/**
 * get's a `DvPage` object for every kind definition that this page 
 * is a part of.
 */
export const getKindPages = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): DvPage[] => {
	const page = getPage(p)(pg);
	if (page) {
		const pages = getKindTagsOfPage(p)(page)
			.map(i => lookupKindByTag(p)(i))
			.map(i => i ? getPage(p)(i.path) : undefined)
			.map(i => i) as DvPage[];

		return pages;
	}

	return [];
}

/**
 * Gets the metadata from a page reference categorized by type of content.
 */
export const getMetadata = (p: KindModelPlugin) => (
	pg: PageReference | undefined | Frontmatter
): Record<Partial<PropertyType>,string[]> => {
	const fm = pg ? getFrontmatter(p)(pg) : undefined;
	const kv: Dictionary = {};
	
	if (fm) {
		let meta: Dictionary<string, any> = {};
		
		for (const key of Object.keys(fm)) {
			const type = getPropertyType(fm[key]);
			if (type && !type.startsWith("other")) {
				meta[type] = meta[type] ? [...meta[type], key] : [key];
				kv[key] = [fm[key], type]
			} else {
				meta["other"] = meta.other ? [...meta.other, key] : [key];;
				kv[key] = [fm[key], type]
			}
		}
		
		p.warn("getMetadata() passed FM", {fm, meta, kv})
		return meta as Record<Partial<PropertyType>,string[]>;
	} else {
		p.debug(`no metadata found on page ${pg ? pg : "unknown"}`)
	}

	return {} as Record<Partial<PropertyType>,string[]>;
}

/**
 * given a page, returns the Subcategory tags found (if any)
 */
export const getSubcategoryTags = (p: KindModelPlugin) => (
	pg: PageReference
): Omit<PageSubcategory, "subcategory">[] => {
	const page = getPage(p)(pg);
	if(page) {
		const tags = page.file.etags.filter(
			t => isKindedWithSubcategoryTag(p)(t) || isSubcategoryDefnTag(p)(t)
		);

		return toArray(tags).map((t: Tag) => {

			const tag = decomposeTag(p)(t);

			if (tag.type === "subcategory") {
				return {
					rawTag: tag.tag,
					kindTag: tag.kindTag,
					categoryTag: tag.categoryTag,
					subcategoryTag: tag.subcategoryTag,
					defnTag: tag.subcategoryDefnTag,
					kindedTag: `${tag.kindTag}/${tag.categoryTag}/${tag.subcategoryTag}`
				} as PageSubcategory
			} else {
				return undefined
			}
		}).filter(i => i) as unknown as Omit<PageSubcategory, "subcategory">[];
	}

	return [];
}

/**
 * Given a page, returns the category tags associated with the page.
 */
export const getCategoryTags = (p: KindModelPlugin) => (
	pg: PageReference,
	filterByKindTag?: string
): ExpandDictionary<Omit<PageCategory, "category">>[] => {
	const page = getPage(p)(pg);
	if(page) {
		const tags = toArray(page.file.etags).map(
			t => decomposeTag(p)(t)
		).filter(t => t.type === "category" || t.type ==="subcategory");

		const cats: Omit<PageCategory, "category">[] = [];

		for (const tag of tags) {
			if(tag.type === "category" || tag.type === "subcategory") {
		
				if(
					filterByKindTag === undefined || 
					tag.kindTag === filterByKindTag
				) {
					cats.push({
						rawTag: tag.tag,
						kindTag: tag.kindTag,
						categoryTag: tag.categoryTag,
						defnTag: tag.categoryDefnTag,
						kindedTag: `${tag.kindTag}/${tag.categoryTag}`
					});
				}
			}
		}

		return cats;
	} else {
		p.debug(`failed to get page`, `when calling getCategoryTags()`);
	}


	return [];
}

export const getClassification = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): Classification[] => {
	const page = pg ? getPage(p)(pg) : undefined; 

	if(page) {
		
			const kinds: DvPage[] = getKindPages(p)(page);
			const classification: Classification[] = [];
			for (const kind of kinds) {
				const kindTag = getKindTagsOfPage(p)(kind)[0];

				const type: DvPage | undefined = kind.type && isFileLink(kind.type)
					? p.api.getPage(kind.type)
					: page.type && isFileLink(page.type)
					? p.api.getPage(page.type)
					: undefined;

				
				const partial = getSubcategoryTags(p)(page.subcategory)[0];
				const subcategory: PageSubcategory | undefined = partial ? {
					...partial,
					subcategory: getPage(p)(partial.defnTag) as DvPage
				}
				: undefined;
				const categories = getCategoryTags(p)(page, kindTag).map(
					c => {
						if (page.file.etags.includes(`#${c.defnTag}`)) {
							addTagToCache(p)(c.defnTag, page.file.path);
							return {
								...c,
								category: page
							}
						} else {
							return {
								...c,
								category: lookupPageFromTag(p)(c.defnTag)  as DvPage
							}
						}
					}
				);


				classification.push({
					type,
					kind,
					kindTag,
					categories,
					subcategory
				} as Classification)

			}
			
			p.info("classification", classification);
			return classification

	}

	return [];

};


/**
 * API surface with build block functions
 */
export const buildingBlocks = (plugin: KindModelPlugin): BuildingBlocksApi => ({
	isKeyOf: isKeyOf,

	hasCategoryProp: hasCategoryProp(plugin),
	hasCategoriesProp: hasCategoriesProp(plugin),
	hasTypeDefinitionTag: hasTypeDefinitionTag(plugin),
	hasKindDefinitionTag: hasKindDefinitionTag(plugin),
	hasKindProp: hasKindProp(plugin),
	hasKindsProp: hasKindsProp(plugin),
	hasTypeProp: hasTypeProp(plugin),
	hasMultipleKinds: hasMultipleKinds(plugin),
	hasCategoryTagDefn: hasCategoryTagDefn(plugin),
	hasCategoryTag: hasCategoryTag(plugin),
	getCategories: getCategories(plugin),
	hasSubcategoryTagDefn: hasSubcategoryTagDefn(plugin),
	isCategoryPage: isCategoryPage(plugin),
	isSubcategoryPage: isSubcategoryPage(plugin),
	isKindedPage: isKindedPage(plugin),
	isKindDefnPage: isKindDefnPage(plugin),
	getClassification: getClassification(plugin),
	getKnownKindTags: getKnownKindTags(plugin),
	getKindPages: getKindPages(plugin),

	getMetadata: getMetadata(plugin),

	getKindTagsOfPage: getKindTagsOfPage(plugin),
	isKindTag: isKindTag(plugin),
})
