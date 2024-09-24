import KindModelPlugin from "main";
import { 
	getKindDefnFromCache, 
	getKindTagsFromCache, 
	getPage, 
	getTagPathFromCache, 
	initializeKindedTagCache, 
	isTagCacheReady, 
	lookupPageInfo, 
} from "./cache";
import { 
	Dictionary,
	isArray, 
	isDefined, 
	stripLeading 
} from "inferred-types";

import {  hasFileLink, isFileLink } from "type-guards";
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
	PropertyType
} from "types";
import { BuildingBlocksApi } from "types/BuildingBlocksApi";


/**
 * returns all Kind tags which have `tag` as part of them; all tags 
 * are passed back if tag is _undefined_.
 */
export const getKnownKindTags = (p: KindModelPlugin) => (
	tag?: string
) => {
	if (!isTagCacheReady()) {
		initializeKindedTagCache(p);
	}
	
	return getKindTagsFromCache(tag);
}

/**
 * for any page, it will return the `kind` (one or more)
 * for that page.
 */
export const getKindTagsOfPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): string[] => {
	const page = getPage(p)(pg);
	if(page) {
		return Array.from(
			p.api.isKindDefnPage(page)
			? page.file.tags.find(i => i.startsWith("#kind/"))
					? [ page.file.tags.find(i => i.startsWith("#kind/")) ]
					: []
			: page.file.tags.filter(t => isKindTag(p)(t.split("/")[0]))
		) as string[]
	}
	return [];
}

/** 
 * boolean test if the passed in tag is found in the vault or not (note: will filter out any
 * unneeded leading `#` symbols)
 */
export const isKindTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const found = getKindTagsFromCache(stripLeading(tag, "#")).filter(t => t === stripLeading(tag, "#"));
	return found ? true : false;
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
		const hasKindSubcategory = page.file.etags.find(t => t.split("/")[2] === "subcategory" && t.split("/").length === 4)
		return hasBareSubcategory || hasKindSubcategory  ? true :false;
	}

	return false;
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
		return page.category && isFileLink(page.category);
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
export const isCategoryPage = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);
	const cat = getPage(p)(getKindDefnFromCache(p)("category"));

	if (page) {
		return (
			hasCategoryTagDefn(p)(page) || (
				page.role && isFileLink(page.role) && page.role.path === cat?.file?.path
			)
		) ? true : false;
	}


	return false;
}

/**
 * tests whether a page is a "subcategory page" which is ascertained by:
 * 
 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
 * 2. is there a property "role" which points to the `kind/subcategory` definition?
 */
export const isSubcategoryPage = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);
	const sub = getPage(p)(getKindDefnFromCache(p)("subcategory"));

	if (page) {
		return (
			hasSubcategoryTagDefn(p)(page) || (
				page.role && isFileLink(page.role) && page.role.path === sub?.file?.path
			)
		) ? true : false;
	}


	return false;
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
 * boolean operator which indicates whether the page has a "kind tag" (not a kind definition tag).
 */
export const hasKindTag = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		const tags = page.file.tags;
		const kindTags = tags.filter(t => isKindTag(p)(stripLeading( t.split("/")[0], "#" )));
		return kindTags.length > 0 ? true : false;
	}

	return false;
}

/**
 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
 */
export const hasKindDefinitionTag = (p: KindModelPlugin) => (pg: PageReference): boolean => {
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
export const hasKindProp = (p: KindModelPlugin) => (pg: PageReference): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		return isDefined(page.kind) && isFileLink(page.kind);
	}
	return false;
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

export type PageCategory = {
	kind: string;
	categories: DvPage[];
}

/**
 * gets all "categories" associated with page:
 * 
 * - takes from `category` and `categories` props
 * - spans _all_ kinds which were defined
 */
export const getCategories = (p: KindModelPlugin) => (pg: PageReference): PageCategory[] => {
	const classy = getClassification(p)(pg);
	let categories: PageCategory[] = [];

	for (const c of classy) {
		const cat: DvPage[] = isFileLink(c.category) ? [p.api.getPage(c.category.path)] as [DvPage] : [];
		const cats: DvPage[] = hasFileLink(c.categories) 
			? c.categories
				.map(i => isFileLink(i) ? p.api.getPage(i) : undefined)
				.filter(i => i) as DvPage[]
			: [];
		const all: DvPage[] = [...cat,...cats];

		if (all.length > 0) {
			categories.push(
				{ kind: c.kind, categories: all}
			)
		}
	}

	return categories;
}

export type PageSubcategory = {
	kind: string;
	/** the "path" to the category which the subcategories are a part of */
	categoryPath: string;
	/** 
	 * The subcategories associated with this page, kind, and category.
	 * 
	 * **Note:** we typically only expect ONE but in order to support future flexibility the
	 * data structure allows for more.
	 */
	subcategories: DvPage[];
}

export const getSubcategories = (p: KindModelPlugin) => (pg: PageReference): PageSubcategory[] => {
	const classy = getClassification(p)(pg);
	let subcategories: PageSubcategory[] = [];

	for (const c of classy) {
		const cat: DvPage[] = isFileLink(c.subcategory) ? [p.api.getPage(c.subcategory.path)] as [DvPage] : [];
		const cats: DvPage[] = hasFileLink(c.categories) 
			? c.categories
				.map(i => isFileLink(i) ? p.api.getPage(i) : undefined)
				.filter(i => i) as DvPage[]
			: [];
		const all: DvPage[] = [...cat,...cats];

		if (all.length > 0) {
			subcategories.push(
				{ kind: c.kind, categoryPath: "", subcategories: all}
			)
		}
	}

	return subcategories;
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
	// leverage page cache if we can to tell us the answer
	let info = lookupPageInfo(p)(pg);
	if (info) {
		return info.type === "kinded";
	}

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

export const isKindDefnPage = (p: KindModelPlugin) => (pg: DvPage | TFile | TAbstractFile | string) => {
	let info = lookupPageInfo(p)(pg);
	if (info) {
		return info.type === "kind-defn";
	}

	// get DvPage (from cache or into)
	const page = getPage(p)(pg);
	const kindMaster = getPage(p)(getKindDefnFromCache(p)("kind"));
	if (page) {
		const kindProp = isFileLink(page?.kind)
			? getPage(p)(page.kind.path)
			: undefined;
		
		return hasKindDefinitionTag(p)(page)
			? true
			: kindProp && kindProp.file.path === kindMaster?.file.path
			? true
			: false
	}
}

export const isTypeDefnPage = (p: KindModelPlugin) => (pg: DvPage | TFile | TAbstractFile | string) => {
	let info = lookupPageInfo(p)(pg);
	if (info) {
		return info.type === "type-defn";
	}

	// get DvPage (from cache or into)
	const page = getPage(p)(pg);
	const typeMaster = getPage(p)(getKindDefnFromCache(p)("type"));
	if (page) {
		const kindProp = isFileLink(page?.kind)
			? getPage(p)(page.kind.path)
			: undefined;
		
		return hasTypeDefinitionTag(p)(page)
			? true
			: kindProp && kindProp.file.path === typeMaster?.file.path
			? true
			: false
	}
}

/**
 * return all valid kind tags on a given page
 */
const getPageKindTags = (p: KindModelPlugin) => (pg: DvPage | TFile | TAbstractFile | string | undefined): string[] => {
	const page = pg ? getPage(p)(pg) : undefined;
	const tags: string[] = [];
	
	if (page) {
		for (const t of page.file.tags.map(i => stripLeading(i.split("/")[0], "#"))) {
			if (isKindTag(p)(t)) {
				tags.push(t)
			}
		}
	}

	return tags;
}

export const getKindPages = (p: KindModelPlugin) => (pg: PageReference | undefined): DvPage[] => {
	const page = getPage(p)(pg);
	if (page) {
		const tags = getPageKindTags(p)(page);
		const paths = new Set<string>(...tags.map(t => getTagPathFromCache(p)(t)).filter(i => i));

		if (page.kind && isFileLink(page.kind) && !paths.has(page.kind.path)) {
			paths.add(page.kind.path);
		}
		if (page.kinds && Array.isArray(page.kinds) && page.kinds.some(i => isFileLink(i))) {
			const links = page.kinds.filter(i => isFileLink(i)) as FileLink[];
			for (const link of links) {
				if (!paths.has(link.path)) {
					paths.add(link.path);
				}
			}
		}

		return Array.from(paths).map(path => getPage(p)(path)).filter(i => i) as DvPage[]
	}

	return [];
}

export const getMetadata = (p: KindModelPlugin) => (pg: PageReference | undefined): Record<Partial<PropertyType>,string[]> => {
	const page = getPage(p)(pg);

	if (page) {
		let meta: Dictionary<string, any> = {};
	
	
		let fm = page.file.frontmatter;
	
		for (const key of Object.keys(fm)) {
			const type = get_property_type(fm[key]);
			if (meta[type]) {
				meta[type].push(key);
			} else {
				meta[type] = [key];
			}
		}
		
		return meta as Record<Partial<PropertyType>,string[]>;
	}

	return {} as Record<Partial<PropertyType>,string[]>;
}


export const getClassification = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): Classification[] => {
	const page = pg ? getPage(p)(pg) : undefined; 

	if(page) {
		let info = lookupPageInfo(p)(page.file.path);
		if(info) {
			return info.classifications;
		} else {
			/** tags on this page which are valid "kind tags" */
			let kindTags = getPageKindTags(p)(page).map(i => getPage(p)(i)).filter(i => i) as DvPage[];

			let kindProp = page.kind && isFileLink(page.kind)
				? getPage(p)(page.kind.path)
				: undefined;

			let kindsProp = page.kinds && isArray(page.kinds) && page.kinds.filter(isFileLink).length > 0
				? page.kinds.filter(isFileLink).map(l => getPage(p)(l.path)) as DvPage[]
				: [];

			
			if (!kindProp && kindTags.length === 0 && kindsProp.length === 0) {
				// nothing found for kind
				p.debug(`no kind information for page "${page.file.path}"`);
				return [];
			}

			if ([...kindsProp, kindProp].filter(i => i).length !== kindTags.length) {
				p.debug(`The kind information from tags and properties does not match for "${page.file.path}" [variant count]`);
			} else if (![...kindsProp, kindProp].filter(i => i).every(
				(i: DvPage) => kindTags.map(t => t.file.path).includes(i.file.path))
			) {
				p.debug(`The kind information from tags and properties does not match for "${page.file.path}" [variant paths]`);
			}

			const kindPaths = new Set([...kindsProp, kindProp, ...kindTags].filter(i => i).map((i: DvPage) => i.file.path));
			const kinds = Array.from(kindPaths).map(k => getPage(p)(k));
			
			if (isKindDefnPage(p)(page)) {
				let masterKindDefn = getPage(p)(getKindDefnFromCache(p)("kind"));

				// because it's a Kind Definition; only concerned with "type" and "kind"
				if (!masterKindDefn) {
					p.warn(`This vault does not appear to have a page for the #kind/kind definition page!`);
				} else if (kinds.length === 0)  {
					p.info(`The page "${page.file.path}" appears to be a kind definition but does not define a "kind" property!`);
				} else if (kinds.length > 1) {
					p.info(`The page "${page.file.path}" has more than one "kind" associated with it. This is ok in general but this page appears to be a "kind definition" page!`)
				}

				return kinds.map((k: DvPage) => ({
					kind: k.file.name,
					kindPath: k.file.path,
					kindTag: "",
					...(
						page.type && isFileLink(page.type) && getPage(p)(page.type.path)
						? {
							type: getPage(p)(page.type.path)?.file.name,
							typePath: getPage(p)(page.type.path)?.file.path,
							typeTag: ""
						}
						: k.type && isFileLink(k.type) && getPage(p)(k.type.path)
						? {
							type: getPage(p)(k.type.path)?.file.name,
							typePath: getPage(p)(k.type.path)?.file.path,
							typeTag: ""
						}
						: {}
					)
				})) as Classification[];
			} else if (isKindedPage(p)(page)) {
				// KINDED PAGES
				const classification: Classification[] = [];
				for (const kind of kinds) {
					
				}

			} else {
				// not a Kind Definition or a KINDED age
				return []
			}
		}
	}

	return [];

};


/**
 * API surface with build block functions
 */
export const buildingBlocks = (plugin: KindModelPlugin): BuildingBlocksApi => ({
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
