import { 
	Container,
	Dictionary,
	ensureLeading,
	ExpandDictionary,
	isArray, 
	isContainer, 
	isDefined, 
	isNumber, 
	isString, 
	isYouTubeVideosInPlaylist, 
	isYouTubeVideoUrl, 
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
	Tag, 
	PageReference, 
	PropertyType,
	PageCategory,
	PageSubcategory,
	DecomposedTag,
	DecomposedCategoryTag,
	DecomposedSubcategoryTag,
	DecomposedKindTag,
	Frontmatter,
	Link,
	PageMetadata
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


const catTag = (kind: string, cat: string) => {
	return `${ensureLeading(kind, "#")}/${cat}`;
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
		const kindedCat = page.file.etags.filter(
			t => t.split("/").length === 3 && t.split("/")[1] === "category"
		).map(i => catTag( i.split("/")[0], i.split("/")[2]) );
		const kindedSubcat = page.file.etags.filter(
			t => t.split("/").length === 4 && t.split("/")[1] === "subcategory"
		).map(i => catTag(i.split("/")[0], i.split("/")[2]));
		const kinded = page.file.etags.filter(
			t => t.split("/").length > 1 && !["category","subcategory"].includes(t.split("/")[1]) && isKindTag(p)(t.split("/")[0])
		).map(i => catTag(i.split("/")[0], i.split("/")[1]));


		/** unique set of tags in format of `#kind/cat` */
		const tags = new Set<string>(
			[
				...kinded,
				...kindedCat,
				...kindedSubcat,
			]
		);
		const missing: string[] = [];
		const pages = Array.from<string>(tags).map(
			t => {
				const pgs = p.dv.pages(`${t}`);
				if (pgs.length > 0) {
					return [t, getPage(p)(pgs[0] as Link)] as [string, DvPage]
				} else {
					missing.push(`${t} on page "${page.file.path}"`);
					return undefined;
				}
			}
		).filter(i => i) as [string, DvPage][];

		if (missing.length > 0) {
			p.warn("Some category tags didn't not map to a page", missing)
		}

		return pages.map(
			([t, pg]) => {

				return {
					kind: stripLeading(t.split("/")[0], "#"),
					page: pg,
					category: t.split("/")[1],
					kindedTag: ensureLeading(t, "#"),
					defnTag: `${ensureLeading(t.split("/")[0], "#")}/category/${t.split("/")[1]}`
				} as PageCategory
			}
		);

		// /** tags with category info */
		// const tags = getCategoryTags(p)(page);
		// p.info("cat tags", tags)

		// return tags.map(t => {
		// 		return {
		// 			...t,
		// 			category: getPage(p)(t.defnTag)
		// 		} as PageCategory
		// }); 
	}

	return categories;
}

const subCatTag = (kind: string, cat: string, sub: string) => {
	return `${ensureLeading(kind, "#")}/${cat}/${sub}`;
}

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export const getSubcategories = (p: KindModelPlugin) => (
	pg: PageReference
): PageSubcategory[] => {
	const page = getPage(p)(pg);
	if(page) {
		const kindedSubcat = page.file.etags.filter(
			t => t.split("/").length === 4 && t.split("/")[1] === "subcategory"
		).map(i => subCatTag(i.split("/")[0], i.split("/")[2], i.split("/")[3]));
		const kinded = page.file.etags.filter(
			t => t.split("/").length === 3 && !["category", "subcategory"].includes(t.split("/")[1]) && isKindTag(p)(t.split("/")[0])
		).map(i => subCatTag(i.split("/")[0], i.split("/")[1], i.split("/")[2]));


		/** unique set of tags in format of `#kind/cat` */
		const tags = new Set<string>(
			[
				...kinded,
				...kindedSubcat,
			]
		);
		const missing: string[] = [];
		const pages = Array.from<string>(tags).map(
			t => {
				const pgs = p.dv.pages(`${t}`);
				if (pgs.length > 0) {
					return [t, getPage(p)(pgs[0] as Link)] as [string, DvPage]
				} else {
					missing.push(`${t} on page "${page.file.path}"`);
					return undefined;
				}
			}
		).filter(i => i) as [string, DvPage][];

		if (missing.length > 0) {
			p.warn("Some subcategory tags didn't not map to a page", missing)
		}

		return pages.map(
			([t, pg]) => {
				const parts = t.split("/");

				return {
					kind: stripLeading(parts[0], "#"),
					page: pg,
					category: parts[1],
					subcategory: parts[2],
					kindedTag: ensureLeading(t, "#"),
					defnTag: `${ensureLeading(parts[0], "#")}/subcategories/${parts[1]}/${t.split("/)")}`
				} as PageSubcategory
			}
		);
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
		const kindedCat = page.file.etags.filter(
			t => t.split("/").length === 3 && t.split("/")[1] === "category"
		).map(i => i.split("/")[0]);
		const kindedSubcat = page.file.etags.filter(
			t => t.split("/").length === 4 && t.split("/")[1] === "subcategory"
		).map(i => i.split("/")[0]);
		const kinded = page.file.etags.filter(
			t => isKindTag(p)(t.split("/")[0]) && !["category","subcategory"].includes(t.split("/")[1])
		).map(i => i.split("/")[0]);
		const kindDefn = page.file.etags.filter(
			t => t.startsWith("#kind/")
		).map(i => i.split("/")[1]);

		const tags = new Set<string>(
			[
				...kinded,
				...kindedCat,
				...kindedSubcat,
				...kindDefn
			]
		)

		return Array.from<string>(tags).map(i => stripLeading(i, "#"));
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
			const type = getPropertyType(p)(fm[key]);
			if (type && !type.startsWith("other")) {
				meta[type] = meta[type] ? [...meta[type], key] : [key];
				kv[key] = [fm[key], type]
			} else {
				meta["other"] = meta.other ? [...meta.other, key] : [key];;
				kv[key] = [fm[key], type]
			}
		}

		meta.hasLinks = () => {
			return Object.keys(meta).includes("link") ||
			Object.keys(meta).includes("link_image") ||
			Object.keys(meta).includes("link_md") ||
			Object.keys(meta).includes("link_drawing") ||
			Object.keys(meta).includes("link_vector") ||
			Object.keys(meta).includes("link_unknown")
		}
		meta.hasUrls = () => {
			return Object.keys(meta).includes("url") ||
			Object.keys(meta).includes("url_social") ||
			Object.keys(meta).includes("url_book") ||
			Object.keys(meta).includes("url_retail") ||
			Object.keys(meta).includes("url_profile") ||
			Object.keys(meta).includes("url_repo") ||
			Object.keys(meta).includes("url_news") ||
			Object.keys(meta).includes("url_youtube")
		}
		meta.hasGeoInfo = () => {
			return Object.keys(meta).includes("geo") ||
			Object.keys(meta).includes("geo_country") ||
			Object.keys(meta).includes("geo_zip") ||
			Object.keys(meta).includes("geo_state") ||
			Object.keys(meta).includes("geo_city")
		}
		meta.getYouTubeVideoLinks = () => {
			if(
				!(
					Object.keys(meta).includes("url_youtube") ||
					Object.keys(meta).includes("list_url_youtube")
				)
			) {
				return []
			}

			const unitLinks = (meta["url_youtube"] || []).map(
				(i: string & keyof typeof meta) => meta[i]
			);
			const listLinks = (meta["list_url_youtube"] || []).flatMap(
				(i: string & keyof typeof meta) => meta[i]
			)
			
			const links = [
				...unitLinks, 
				...listLinks
			].filter(i => isYouTubeVideoUrl(i));

			return links as string[];
		}

		
		return meta as Record<Partial<PropertyType>,string[]> & PageMetadata;
	} else {
		p.debug(`no metadata found on page ${pg ? pg : "unknown"}`)
	}

	return {} as Record<Partial<PropertyType>,string[]>;
}


export const getClassification = (p: KindModelPlugin) => (
	pg: PageReference | undefined,
	cats?: PageCategory[] | undefined,
	subCats?: PageSubcategory[] | undefined
): Classification[] => {
	const page = pg ? getPage(p)(pg) : undefined; 
	const classification: Classification[] = [];

	
	if(page) {
		const pgCats = cats ? cats : getCategories(p)(page);
		const pgSubCats = subCats? subCats : getSubcategories(p)(page);

		const kinds: DvPage[] = getKindPages(p)(page);

		for (const k of kinds) {
			let kindTag = k?.file?.etags.find(i => i.startsWith(`#kind/`))?.split("/")[1] as string | undefined;

			if(!kindTag) {
				// solve for when kinded page acting as category or subcat
				kindTag = k?.file?.etags.find(
					i => ["category", "subcategory"].includes(i.split("/")[1])
				)?.split("/")[0]
			}

			if (!kindTag) {
				// solve for a subtyped tag where the leading tag is a
				// known "kind"
				kindTag = k?.file?.etags.find(
					i => i.split("/").length > 0 && 
					!["category", "subcategory"].includes(i.split("/")[1]) &&
					i.split("/").length < 4
				)?.split("/")[0]
			}
			
			if(kindTag) {
				classification.push({
					kind: k,
					kindTag,
					categories: pgCats.filter(c => c.kind === stripLeading(kindTag, "#")),
					subcategory: pgSubCats.find(c => c.kind === stripLeading(kindTag, "#"))
				})
			} else {
				const meta = getMetadata(p)(page);
				
				p.warn(`no 'kind' could be identified for the page ${page.file.path}`)
			}
		}
	}

	p.info("classification", classification);
	
	return classification
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
