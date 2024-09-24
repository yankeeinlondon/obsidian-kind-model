import {  isUndefined, stripLeading } from "inferred-types";
import KindModelPlugin from "../main";

import { DvPage } from "../types";

import { getPath } from "./getPath"
import { isDvPage, isPageInfo } from "../type-guards";
import { PageInfo, PageReference } from "../types";
import { isKindTag } from "./buildingBlocks";

/**
 * caching of `DvPage`'s we're interested in
 * which have not yet been more qualified to the
 * `PAGE_INFO_CACHE`.
 */
let PAGE_CACHE: Record<string, DvPage> = {};

/** 
 * pages which are known to be a "kinded page", the 
 * keys of the cache are the filepath to a given page
 * and the values are an array of `kind` types which
 * are associated.
 */
let PAGE_INFO_CACHE: Record<string, PageInfo> = {};

/**
 * All of the "kind definitions" in the vault.
 * 
 * - **keys** are the tag names (no `#` symbol)
 * - **values** are an array of file paths to the definition of the kind
 * 
 * Note: we should only seen one item in the values array but this presumes there are never
 * duplicates so we should _not_ assume that :)
 */
let KIND_TAG_CACHE: Record<string, string[]> | null = null;

/**
 * All of the "type definitions" in the vault.
 * 
 * - **keys** are the tag names (no `#` symbol)
 * - **values** are an array of `TagDefnItem` elements
 * 
 * Note: we should only seen one item in the values array but this presumes there are never
 * duplicates so we should _not_ assume that :)
 */
let TYPE_TAG_CACHE: Record<string, string[]> = {};

/**
 * the Category tag cache is organized by the **kind's** tag and then the tag for the category.
 * 
 * - for example:
 * ```ts
 * { 
 * 		"software": { 
 * 			ai: "path-to-category-page"
 * 		}
 * }
 * ```
 */
let CATEGORY_TAG_CACHE: Record<string, Record<string, string[]>> | null = null;


const pushPage = (pg: DvPage | undefined) => {
	if (pg) {
		PAGE_CACHE[pg.file.path] = pg;
		return pg;
	}
}


export const initializeTypeTagCache = (p: KindModelPlugin) => {
	if(!TYPE_TAG_CACHE) {
		TYPE_TAG_CACHE = {};
		const definitions = p.dv.pages(`#type`);
		for (const pg of definitions) {
			const path = pg.file.path;
			const tag = pg.file.etags.find(i => i.startsWith(`#type/`))?.split("/")[1];
			if (tag && tag in TYPE_TAG_CACHE) {
				TYPE_TAG_CACHE[tag].push(path);
			} else if (tag) {
				TYPE_TAG_CACHE[tag] = [path];
			}
		}
		p.info(`Initialized Type Definition Tag cache [${definitions.length}]`)
	}	
}

export const initializeCategoryTagCache = (p: KindModelPlugin) => {
	if(!CATEGORY_TAG_CACHE) {
		initializeKindTagCache(p);
		CATEGORY_TAG_CACHE = {};
		for (const kt of Object.keys(KIND_TAG_CACHE || {})) {
			const cats: DvPage[] = Array.from(p.dv.pages(`#${kt}/category`)) as DvPage[];
			if (!CATEGORY_TAG_CACHE[kt]) {
				CATEGORY_TAG_CACHE[kt] = {};
			};
			for (const cat of cats) {
				const myCat = cat.file.etags.find(
					t => t.split("/")[1] === "category" && t.split("/")[0] === `#${kt}`
				)
				if (myCat) {
					if(!CATEGORY_TAG_CACHE[kt][myCat]) {
						CATEGORY_TAG_CACHE[kt][myCat] = [];
					}
					if (!CATEGORY_TAG_CACHE[kt][myCat].includes(cat.file.path)) {
						CATEGORY_TAG_CACHE[kt][myCat].push(cat.file.path);
					}
				}
			}
		}
	}
};

/**
 * produces a list of valid category tags for the given kind tag passed in
 */
export const getAllCategoryTagsForKind = (p: KindModelPlugin) => (k: string) => {
	if (isKindTag(p)(k)) {
		initializeCategoryTagCache(p);
		return Object.keys((CATEGORY_TAG_CACHE || {})[k]);
	}
}


export const initializeKindTagCache = (p: KindModelPlugin) => {
	if(!KIND_TAG_CACHE) {
		KIND_TAG_CACHE = {};
		const definitions = p.dv.pages(`#kind`);
		for (const pg of definitions) {
			const path = pg.file.path;
			const tag = pg.file.etags.find(i => i.startsWith(`#kind/`))?.split("/")[1];
			if (tag && tag in KIND_TAG_CACHE) {
				KIND_TAG_CACHE[tag].push(path);
			} else if (tag) {
				KIND_TAG_CACHE[tag] = [path];
			}
		}
		p.info(`Initialized Kind Tag cache [${definitions.length}]`)
	}
}


/**
 * Gets the path to the Kind Definition when passed a kind tag.
 * 
 * Note: only the first Kind Definition with that tag is evaluated, duplicates ignored.
 */
export const getKindPathFromTag = (p: KindModelPlugin) => (tag: string): string | undefined =>  {
	initializeKindTagCache(p);

	return KIND_TAG_CACHE && tag in KIND_TAG_CACHE
		? KIND_TAG_CACHE[tag][0]
		: undefined;
}

/**
 * Gets the path to the Kind Definition when passed a kind tag.
 * 
 * Note: only the first Kind Definition with that tag is evaluated, duplicates ignored.
 */
export const getKindPageFromTag = (p: KindModelPlugin) => (tag: string): DvPage | undefined =>  {
	initializeKindTagCache(p);

	return KIND_TAG_CACHE && tag in KIND_TAG_CACHE
		? p.api.getPage(KIND_TAG_CACHE[tag][0])
		: undefined;
}

export const getKindTagsFromCache = (tag?: string) => {
	const tags = KIND_TAG_CACHE ? Object.keys(KIND_TAG_CACHE) : [];
	if (tag) {
		return tags.filter(i => i.includes(tag));
	} else {
		return tags;
	}
}

/**
 * Returns the _first_ path to the Kind tag if it exists, otherwise returns undefined.
 */
export const getTagPathFromCache = (p: KindModelPlugin) =>  (tag: string) => {
	initializeKindTagCache(p);

	if (KIND_TAG_CACHE && tag in KIND_TAG_CACHE) {
		return KIND_TAG_CACHE[tag][0]
	}

	return undefined
}

/**
 * Get a Kind Definition from the cache.
 * 
 * - you may use optional `at` property to distinguish between two file paths in cases
 * where there are duplicates
 * - if `at` not used, the first page will be returned (if any exist)
 */
export const getKindDefnFromCache = (p: KindModelPlugin) => (tag: string, at?: string) => {
	if (!KIND_TAG_CACHE) {
		initializeKindTagCache(p);
	}
	if (KIND_TAG_CACHE && tag in KIND_TAG_CACHE && KIND_TAG_CACHE[tag].length > 0) {
		return at
			? KIND_TAG_CACHE[tag].find(p => p === at)
			: KIND_TAG_CACHE[tag][0];
	}
}

export const kindDefinitionsWithDuplicates = (p: KindModelPlugin) => () => {
	if (!KIND_TAG_CACHE) {
		initializeKindTagCache(p);
	}
	if (KIND_TAG_CACHE) {
		const dups = [];

		for (const tag of Object.keys(KIND_TAG_CACHE)) {
			if(KIND_TAG_CACHE[tag].length > 1) {
				dups.push(tag)
			}
		}

		return dups;
	} 

	return [];
}


/**
 * returns a `DvPage` from the page cache _or_ the page info cache (when available); otherwise 
 * will run a query to get it and ensure that's placed in the page cache.
 */
export const getPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined,
	force?: boolean
): DvPage | undefined => {
	if (isDvPage(pg)) {
		return pg.file.path in PAGE_CACHE
			? pg
			: pushPage(pg);
	}
	if (isPageInfo(pg)) {
		return pg.page;
	}
	
	if (isUndefined(pg)) {
		return undefined;
	}

	const path = getPath(pg);
	
	if (path) {
		if (path in PAGE_INFO_CACHE) {
			return PAGE_INFO_CACHE[path].page;
		} else if (path in PAGE_CACHE) {
			return PAGE_CACHE[path];
		} else {
			return pushPage(p.dv.page(path))
		}
	}

	return undefined;
}

/** remove an item from the PAGE cache */
export const removeFromPageCache = (p: KindModelPlugin) => (
	pg: PageReference
) => {
	const path = getPath(pg);

	if (PAGE_CACHE && path && path in PAGE_CACHE) {
		delete PAGE_CACHE[path]
	}
}


/**
 * checks whether a given file path is found in the PAGE_INFO_CACHE.
 */
export const hasPageInfo = (p: KindModelPlugin) => (
	pg: PageReference
): boolean => {
	const path = getPath(pg);
	
	return path && path in PAGE_INFO_CACHE
		? true
		: false
}

/** add or update an entry  in the PAGE INFO cache */
export const updatePageInfoCache = (p: KindModelPlugin) => (
	path: string,
	info: PageInfo
) => {
	if(!PAGE_INFO_CACHE) {
		PAGE_INFO_CACHE = {};
	}

	PAGE_INFO_CACHE[path] = info;
}





export const lookupPageInfo = (p: KindModelPlugin) => (
	pg: PageReference
): PageInfo | undefined => {
	let path: string | undefined = getPath(pg);

	if (!path) {
		p.warn(`failed to identify a valid file path from the page representation passed to lookupPageType()`, p);
		return undefined;
	}

	if (path in PAGE_INFO_CACHE) {
		return PAGE_INFO_CACHE[path] as PageInfo;
	} else {
		return undefined
	}
}


