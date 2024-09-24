import {  isUndefined, stripLeading } from "inferred-types";
import KindModelPlugin from "../main";

import { DvPage } from "../types";

import { getPath } from "./getPath"
import { isDvPage, isPageInfo } from "../type-guards";
import { PageInfo, PageReference } from "../types";

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
let KIND_DEFN_TAG_CACHE: Record<string, string[]> | null = null;

/**
 * All of the "type definitions" in the vault.
 * 
 * - **keys** are the tag names (no `#` symbol)
 * - **values** are an array of `TagDefnItem` elements
 * 
 * Note: we should only seen one item in the values array but this presumes there are never
 * duplicates so we should _not_ assume that :)
 */
let TYPE_DEFN_TAG_CACHE: Record<string, string[]> = {};

/**
 * Dictionary where:
 * 
 * - **key** is the tag name (with no leading `#`), 
 * - **value** is an an array of file paths which define this `kind`
 * 
 * Note: we expect only ONE definition but we need a way to capture
 * duplicates if they exist in the vault.
 */
let KINDED_TAG_CACHE: null | Record<string, TagCacheItem[]> = null;





const pushPage = (pg: DvPage | undefined) => {
	if (pg) {
		PAGE_CACHE[pg.file.path] = pg;
		return pg;
	}
}

export const isTagCacheReady = () => KINDED_TAG_CACHE !== null ? true : false;

type TagDefnItem = {
	/** the path to the kind definition */
	path: string;
	/** the path to the type this kind belongs to */
	type?: string;
}

type TagCacheItem = {
	path: string;
	/** boolean flag to indicate if this page is acting as a "category page" for the given kind */
	isCategory?: boolean;
	/** boolean flag to indicate if this page is acting as a "subcategory page" for the given kind */
	isSubcategory?: boolean;

	/** the category of a kinded page */
	category?: string;
	/** the category of a kinded page */
	subcategory?: string;
}

export const initializeTypeDefinitionTagCache = (p: KindModelPlugin) => {
	if(!TYPE_DEFN_TAG_CACHE) {
		TYPE_DEFN_TAG_CACHE = {};
		const definitions = p.dv.pages(`#type`);
		for (const pg of definitions) {
			const path = pg.file.path;
			const tag = pg.file.etags.find(i => i.startsWith(`#type/`))?.split("/")[1];
			if (tag && tag in TYPE_DEFN_TAG_CACHE) {
				TYPE_DEFN_TAG_CACHE[tag].push(path);
			} else if (tag) {
				TYPE_DEFN_TAG_CACHE[tag] = [path];
			}
		}
		p.info(`Initialized Type Definition Tag cache [${definitions.length}]`)
	}	
}


export const initializeKindDefinitionTagCache = (p: KindModelPlugin) => {
	if(!KIND_DEFN_TAG_CACHE) {
		KIND_DEFN_TAG_CACHE = {};
		const definitions = p.dv.pages(`#kind`);
		for (const pg of definitions) {
			const path = pg.file.path;
			const tag = pg.file.etags.find(i => i.startsWith(`#kind/`))?.split("/")[1];
			if (tag && tag in KIND_DEFN_TAG_CACHE) {
				KIND_DEFN_TAG_CACHE[tag].push(path);
			} else if (tag) {
				KIND_DEFN_TAG_CACHE[tag] = [path];
			}
		}
		p.info(`Initialized Kind Definition Tag cache [${definitions.length}]`)
	}
}


/**
 * initializes the **Kinded Tag** cache (if not already initialized); because
 * this _depends on_ the **Kind Definition** cache, this too will be initialized.
 */
export const initializeKindedTagCache = (p: KindModelPlugin) => {
	initializeKindDefinitionTagCache(p);

	if (!isTagCacheReady()) {
		KINDED_TAG_CACHE = {};
		const definitions = Object.keys(KIND_DEFN_TAG_CACHE || {});
		if (definitions.length>0) {
			const pages = p.dv.pages(definitions.map(i => `#${i}`).join(" OR "))
				.filter(
					p => p.file.tags.filter(
						i => definitions.includes( stripLeading(i.split("/")[0], "#")) 
					).length > 0 ? true : false
				)
				.map(
					p=> {
						const path = p.file.path;
						const kinds = p.file.tags.filter(
							t => definitions.includes( stripLeading(t.split("/")[0], "#")) 
						);
						for (const k of kinds) {
							const [base, uno, dos, tres, quatro ] = k.split("/");
							const isCategory = uno === "category" && dos !== undefined;
							const isSubcategory = uno === "subcategory" && dos !== undefined && tres !== undefined;

							if (KINDED_TAG_CACHE && base in KINDED_TAG_CACHE) {
								KINDED_TAG_CACHE[base].push({
									path,
									isCategory,
									isSubcategory,
									category: isCategory 
										? dos
										: isSubcategory
										? tres
										: dos,
									subcategory: isCategory
										? undefined
										: isSubcategory
										? quatro
										: tres

								} as TagCacheItem)
							} else if (KINDED_TAG_CACHE) {
								KINDED_TAG_CACHE[base] = [{
									path,
									isCategory,
									isSubcategory,
									category: isCategory 
										? dos
										: isSubcategory
										? tres
										: dos,
									subcategory: isCategory
										? undefined
										: isSubcategory
										? quatro
										: tres
								}]
							}

						}
					}
				);
			p.info(`- added ${pages.length} kinded pages to the Tag cache`)
		}
	}
}

export const getKindTagsFromCache = (tag?: string) => {
	const tags = KINDED_TAG_CACHE ? Object.keys(KINDED_TAG_CACHE) : [];
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
	initializeKindedTagCache(p);

	if (KIND_DEFN_TAG_CACHE && tag in KIND_DEFN_TAG_CACHE) {
		return KIND_DEFN_TAG_CACHE[tag][0]
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
	if (!KIND_DEFN_TAG_CACHE) {
		initializeKindDefinitionTagCache(p);
	}
	if (KIND_DEFN_TAG_CACHE && tag in KIND_DEFN_TAG_CACHE && KIND_DEFN_TAG_CACHE[tag].length > 0) {
		return at
			? KIND_DEFN_TAG_CACHE[tag].find(p => p === at)
			: KIND_DEFN_TAG_CACHE[tag][0];
	}
}

export const kindDefinitionsWithDuplicates = (p: KindModelPlugin) => () => {
	if (!KIND_DEFN_TAG_CACHE) {
		initializeKindDefinitionTagCache(p);
	}
	if (KIND_DEFN_TAG_CACHE) {
		const dups = [];

		for (const tag of Object.keys(KIND_DEFN_TAG_CACHE)) {
			if(KIND_DEFN_TAG_CACHE[tag].length > 1) {
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


