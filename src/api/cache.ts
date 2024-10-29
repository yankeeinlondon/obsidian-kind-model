import { stripLeading } from "inferred-types";
import KindModelPlugin from "../main";

import { DvPage } from "../types";
import { getPath } from "./getPath"
import { PageInfo, PageReference } from "../types";
import { decomposeTag, getCategoryTags, getSubcategoryTags, isKindTag } from "./buildingBlocks";
import { toArray } from "~/helpers/toArray";
import { getPage } from "~/page";

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
 * Keeps a record of all fully qualified tag names. This includes:
 * 
 * - Kind Definition (e.g., `kind/xxx` )
 * - Type Definition (e.g., `type/xxx` )
 * - Category Pages (e.g., `[kind]/category/xxx)`)
 * - Subcategory Pages (e.g., `[kind]/subcategory/xxx/yyy)`)
 * 
 * - **keys** are the tag names (no `#` symbol)
 * - **values** are an array of file paths to the definition of the kind
 * 
 * Note: we should only seen one item in the values array but this presumes there are never
 * duplicates so we should _not_ assume that :)
 */
let TAG_CACHE: Record<string, Set<string>> | null = null;
let REV_TAG_CACHE: Map<string, string> | null = null;


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


/**
 * initializes the tag cache with:
 * 		- Kind Definitions
 * 		- Type Definitions
 * if you want to add categories and subcategories tags too
 * then you'll need to call `initializeClassifications`.
 */
export const initializeTagCache = (p: KindModelPlugin) => {
	if(!TAG_CACHE) {
		TAG_CACHE = {};
		const kindDefn = p.dv.pages(`#kind`);
		const typeDefn = p.dv.pages(`#type`);

		for (const pg of kindDefn) {
			const path = pg.file.path;
			
			const tag = pg.file.etags.find(
				i => i.startsWith(`#kind/`)
			)?.split("/")[1];
			
			if (tag) {
				if (`kind/${tag}` in TAG_CACHE) {
					TAG_CACHE[`kind/${tag}`].add(path);
				} else {
					TAG_CACHE[`kind/${tag}`] = new Set(path);
				}
			} else {
				p.info(`no kind: ${pg.file.name}`, toArray(pg.file.etags))
			}

		}
		for (const pg of typeDefn) {
			const path = pg.file.path;
			const typeTag = pg.file.etags.find(i => decomposeTag(p)(i).type === "kind");
			const tag = typeTag
				? decomposeTag(p)(typeTag)
				: undefined;

			if(tag && tag.type === "type") {
				if (tag.typeDefnTag in TAG_CACHE) {
					TAG_CACHE[tag.typeDefnTag].add(path);
				} else {
					TAG_CACHE[tag.typeDefnTag] = new Set(path);
				}
			}
		}

		const sample = Object.keys(TAG_CACHE).slice(0,8).join(", ") + ` ...`;

		p.info(`Initialized Tag cache [${Object.keys(TAG_CACHE).length}]`, sample)
	} else {
		p.debug(`Kind Tag Cache already cached`)
	}
}

/**
 * Get a list of all valid `kind` tags (e.g., `software`, `hardware`, etc.)
 */
export const lookupKindTags = (p: KindModelPlugin) => {
	initializeTagCache(p);

	return TAG_CACHE 
		? Object.keys(TAG_CACHE)
			.filter(i => i.startsWith(`kind/`))
			.map(i => i.replace(`kind/`, ""))
		: [];
}

let classificationTags = false;

export const initializeClassificationTags = (p: KindModelPlugin) => {
	initializeTagCache(p);
	const kinds = lookupKindTags(p);
	
	if(!classificationTags && TAG_CACHE) {
		classificationTags = true;
		let cats = 0;
		let subs = 0;
		for (const kind of kinds) {
			const categoryPages: DvPage[] = kind 
				? toArray(
					p.dv.pages(`#${kind}/category`)
				)
				: [];
			const subcategoryPages = toArray(
				p.dv.pages(`#${kind}/subcategory`)
			);

			// cats = cats + categories.length;
			subs = subs + subcategoryPages.length;
				
			for (const c of categoryPages) {
				const tags = getCategoryTags(p)(c);
				for (const tag of tags) {
					cats = cats + 1;
					const cat = tag?.defnTag;
					if(!cat) {
						p.warn(`Missing tag definition`, {
							tag, page: c.file.name,
						})
					} else {
						if(cat in TAG_CACHE) {
							TAG_CACHE[cat].add(c.file.path);
						} else if (TAG_CACHE) {
							TAG_CACHE[cat] = new Set(c.file.path);
						}	
					}
				}
				
			}
			for (const c of subcategoryPages) {
				const tags = getSubcategoryTags(p)(c);
				for (const tag of tags) {
					
					const cat = tag.defnTag;
					if(cat in TAG_CACHE) {
						TAG_CACHE[cat].add(c.file.path);
					} else if (TAG_CACHE) {
						TAG_CACHE[cat] = new Set(c.file.path);
					}
				}
			}		
		}
		const catSample = Object.keys(TAG_CACHE).filter(i => i.includes("category/")).slice(0,8);
		const subSample = Object.keys(TAG_CACHE).filter(i => i.includes("subcategory/")).slice(0,8);

		p.info(`Initialized Classification Tags`, {
			categories: cats, 
			subcategories: subs,
			catSample, subSample,
			all: Object.keys(TAG_CACHE)
		});
		classificationTags = true;
	}

}

/**
 * Gets the path to the Kind Definition when passed a kind tag.
 * 
 * Note: only the first Kind Definition with that tag is evaluated, duplicates ignored.
 */
export const lookupTag = (p: KindModelPlugin) => (tag: string): string | undefined =>  {
	initializeTagCache(p);

	return TAG_CACHE && tag in TAG_CACHE
		? Array.from(TAG_CACHE[tag])[0]
		: undefined;
}


export const initializeReverseKindTagLookup = (p: KindModelPlugin) => {
	initializeTagCache(p);

	if(TAG_CACHE) {
		if(!REV_TAG_CACHE) {
			REV_TAG_CACHE = new Map<string, string>();
			for (const tag of Object.keys(TAG_CACHE)) {
				for (const path of (TAG_CACHE)[tag]) {
					REV_TAG_CACHE.set(path, tag);
				}
			}
		}
	}

	return undefined;
}

/**
 * returns all kind tags (both definitions and kinded pages) on the page
 */
export const getKindTagsFromPage = (p: KindModelPlugin) => (
	ref: PageReference
): string[] => {
	const page = p.api.getPage(ref);
	if(page) {
		return Array.from(page.file.etags)
			.filter((i: string) => isKindTag(p)(i))
			.map((i: string) => i.replace(`#kind/`, "")
		) as string[]
	}


	return [];
}

/**
 * Gets the path to the Kind Definition when passed a kind tag.
 * 
 * Note: only the first Kind Definition with that tag is evaluated, duplicates ignored.
 */
export const getKindPageFromTag = (p: KindModelPlugin) => (tag: string): DvPage | undefined =>  {
	initializeTagCache(p);
	const safeTag = stripLeading(tag, "#");

	return TAG_CACHE && safeTag in TAG_CACHE
		? p.api.getPage(Array.from(TAG_CACHE[safeTag])[0])
		: undefined;
}

export const getKindTagsFromCache = (tag?: string) => {
	const tags = TAG_CACHE ? Object.keys(TAG_CACHE).filter(i => i.startsWith("kind/")) : [];
	if (tag) {
		return tags.filter(i => i.includes(tag)).map(i => i.replace(`#kind/`, ""));
	} else {
		return tags.map(i => i.replace(`#kind/`, ""));
	}
}

/**
 * Returns the _first_ path to the Kind tag if it exists, otherwise returns undefined.
 */
export const getTagPathFromCache = (p: KindModelPlugin) =>  (tag: string) => {
	initializeTagCache(p);

	if (TAG_CACHE && tag in TAG_CACHE) {
		return Array.from(TAG_CACHE[tag])[0]
	}

	return undefined
}


export const lookupTagSuggestions = (p: KindModelPlugin) => (tag: string): string[] => {
	initializeClassificationTags(p);
	if(TAG_CACHE) {
		const safeTag = stripLeading(tag, "#") as string;
		const withTags = safeTag.split("/").filter(
			i => !["category","subcategory"].includes(i)
		);
		return Object.keys(TAG_CACHE).filter(i => withTags.some(t => i.includes(t)))
	}
	return [];
}

/**
 * attempts to resolve to a `DvPage` when passed a fully qualified path
 */
export const lookupPageFromTag = (p: KindModelPlugin) => (
	tag: string
): DvPage | undefined => {
	initializeTagCache(p);
	let rebuiltTag: string | undefined = undefined;

	if(TAG_CACHE) {
		const safeTag = stripLeading(tag, "#");
		const parts = decomposeTag(p)(safeTag);
		rebuiltTag = parts.type === "kind"
			? parts.kindTag
			: parts.type === "category"
			? parts.categoryDefnTag
			: parts.type === "subcategory"
			? parts.subcategoryDefnTag
			: undefined;

		if(!rebuiltTag) {
			p.info("invalid tag", `lookupPageFromTag(${tag}) called but this is an unknown tag (aka, not kind, category, or subcategory)`, parts);

			return undefined;
		}
	
		if (rebuiltTag in TAG_CACHE) {
			const pathOptions = TAG_CACHE[rebuiltTag]
			if (!pathOptions) {
				p.warn(`Missing Tag`, { tag, rebuiltTag, keys: Object.keys(TAG_CACHE)});
			}
			const path = Array.from(pathOptions).pop();
			if (pathOptions.size > 1) {
				p.debug(`call to lookupPageFromTag(${tag}) resolved to MORE than one [${pathOptions.size}] path but we returned the first one: "${path}"`)
			}

			const page = pathOptions.size > 0 
				? getPage(p)(path) 
				: undefined;
	
			if(pathOptions && !page) {
				p.warn(`call to lookupPageFromTag(${tag}) and the path was resolved as "${path}" but no page could be found at this location!`)
			}

			return page;
		}
	
		initializeClassificationTags(p);
		if (rebuiltTag in TAG_CACHE) {
			const path = TAG_CACHE[stripLeading(tag, "#")]
			return path.size > 0 ? getPage(p)(Array.from(path.values())[0]) : undefined;
		} else {
			p.warn(`Tag ${tag} not Found!`, {
				rebuiltTag, 
				suggestions: lookupTagSuggestions(p)(rebuiltTag)
			})
			return undefined;
		}
	}
	p.warn(`Call to lookupPageFromTag() found empty cache after initialization!`);

	return undefined;
}

export const addTagToCache = (p: KindModelPlugin) => (
	tag: string,
	path: string
) => {
	initializeTagCache(p);

	if(TAG_CACHE) {
		p.debug('adding tag to cache', {tag,path})
		if(tag in TAG_CACHE) {
			TAG_CACHE[tag].add(path);
		} else {
			TAG_CACHE[tag] = new Set(path);
		}
	}
}


/**
 * Get a Kind Definition from the cache.
 * 
 * - you may use optional `at` property to distinguish between two file paths in cases
 * where there are duplicates
 * - if `at` not used, the first page will be returned (if any exist)
 */
export const getKindDefnFromCache = (p: KindModelPlugin) => (tag: string, at?: string) => {
	if (!TAG_CACHE) {
		initializeTagCache(p);
	}
	if (TAG_CACHE && tag in TAG_CACHE && TAG_CACHE[tag].size > 0) {
		return at
			? Array.from(TAG_CACHE[tag]).find(p => p === at)
			: Array.from(TAG_CACHE[tag])[0];
	}
}

export const kindDefinitionsWithDuplicates = (p: KindModelPlugin) => () => {
	if (!TAG_CACHE) {
		initializeTagCache(p);
	}
	if (TAG_CACHE) {
		const dups = [];

		for (const tag of Object.keys(TAG_CACHE)) {
			if(TAG_CACHE[tag].size > 1) {
				dups.push(tag)
			}
		}

		return dups;
	} 

	return [];
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

export const hasCacheTag = (p: KindModelPlugin) => (tag: string) => {
	initializeTagCache(p);
	const safeTag = stripLeading(tag, "#");

	return TAG_CACHE && safeTag in TAG_CACHE
		? true
		: false
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


