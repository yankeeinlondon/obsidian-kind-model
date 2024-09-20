import { isArray, isDefined, isString, stripLeading } from "inferred-types";
import { MarkdownView } from "obsidian";
import KindModelPlugin from "../../main";
import { Kind, PageBlock } from "../../types/settings_types";
import { isMarkdownView } from "../../utils/type_guards/isMarkdownView";
import { isTFile } from "../../utils/type_guards/isTFile";
import { DvPage, FileLink, Link } from "../../types/dataview_types";
import { isFileLink, isLink } from "../../utils/type_guards/isFileLink";
import { isDataviewPage } from "../../utils/type_guards/isDataviewPage";
import { dv_page } from "../../dv_queries/dv_page";
import { back_links } from "../../dv_queries/back_links";
import { page_entry } from "../../dv_queries/page_entry";
import { book } from "../../dv_queries/book";
import { kind_table } from "../../dv_queries/kind_table";
import { video_gallery } from "../../dv_queries/video_gallery";
import { TAbstractFile, TFile } from "../../types/Obsidian";
import { getKindDefnFromCache, getKindTagsFromCache, getPage, hasPageInfo, lookupPageInfo } from "./cache";
import { getKindTags } from "./getKindTags";
import { Classification } from "types/Classification";
import { Tag } from "types/general";
import { isDvPage } from "utils/type_guards";
import { getPath } from "./getPath";

export type PageIcons = {
	hasIcon?: boolean;
	typeIcon?: string;
	kindIcon?: string;
	categoryIcon?: string;
	subcategoryIcon?: string;
	pageIcon?: string;
}
export type PageBanners = {
	hasBanner?: boolean;
	typeBanner?: string;
	kindBanner?: string;
	categoryBanner?: string;
	subcategoryBanner?: string;
	pageBanner?: string;
}

export type PageSuggestion = 
| "add-kind-prop"
| "add-kind-tag"
| "add-kinded-prop"
| "add-kinded-tag"
| "add-category-tag"
| "add-category-prop"
| "add-subcategory-tag"
| "add-subcategory-prop";

/** 
 * boolean test if the passed in tag is found in the vault or not (note: will filter out any
 * unneeded leading `#` symbols)
 */
const isKindTag = (p: KindModelPlugin) => (tag: string): boolean => {
	const found = getKindTagsFromCache(stripLeading(tag, "#")).filter(t => t === stripLeading(tag, "#"));
	return found ? true : false;
}

/**
 * indicates whether page has a tag which defines itself as a "category"
 */
const hasCategoryTagDefn = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasSubcategoryTagDefn = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasCategoryTag = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasCategoryProp = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasCategoriesProp = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const isCategoryPage = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const isSubcategoryPage = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasMultipleKinds = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasKindTag = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasKindDefinitionTag = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasTypeDefinitionTag = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasKindProp = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasKindsProp = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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
const hasTypeProp = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
	const page = getPage(p)(pg);

	if (page) {
		return isDefined(page.type) && isFileLink(page.type);
	}
	return false;
}



const getPageIcons = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): PageIcons => {
	return { 
		hasIcon: false
	}
}

const getPageBanners = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): PageBanners => {
	return { 
		hasBanner: false
	}
}

const getSuggestedActions = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): PageSuggestion[] => {
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
const isKindedPage = (p: KindModelPlugin) => (pg: DvPage | TFile | Link | TAbstractFile | string): boolean => {
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

const isKindDefnPage = (p: KindModelPlugin) => (pg: DvPage | TFile | TAbstractFile | string) => {
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

/**
 * return all valid kind tags on a given page
 */
const getPageKindTags = (p: KindModelPlugin) => (pg: DvPage | TFile | TAbstractFile | string | undefined) => {
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


const getClassification = (p: KindModelPlugin) => (
	pg: DvPage | TFile | Link | TAbstractFile | string | undefined
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
 * creates an entry in PAGE_INFO_CACHE for a page in the vault
 */
export const createPageInfo = (p: KindModelPlugin) => (
	pg: DvPage | TFile |TAbstractFile | Link | string
) => {
	const path = getPath(pg);

	if(path &&  hasPageInfo(p)(path)) {
		// already in cache
		return lookupPageInfo(p)(path);
	}

	const page = isDvPage(pg)
		? pg
		: getPage(p)(path);

	if (page) {
		return {
			page,
			type
		}
	}



}


export const api = (plugin: KindModelPlugin) => ({
	/**
	 * Boolean operator which reports on whether:
	 * 
	 * 1. the given page has a property `category` and
	 * 2. the property value is a `FileLink`
	 */
	hasCategoryProp: hasCategoryProp(plugin),

	/**
	 * boolean operation which checks that page has a `categories` property, it is an array, and at least
	 * on element in the array is a `FileLink`.
	 */
	hasCategoriesProp: hasCategoriesProp(plugin),

	/**
	 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
	 * 
	 * Note:
	 * - this will _never_ be true for a page which is a category page or a kinded definition
	 */
	hasCategoryTag: hasCategoryTagDefn(plugin),


	/**
	 * boolean operator which indicates whether the page has a tag starting with `#type/`.
	 */
	hasTypeDefinitionTag: hasTypeDefinitionTag(plugin),
	/**
	 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
	 */
	hasKindDefinitionTag: hasKindDefinitionTag(plugin),

	/**
	 * a boolean operator which reports on whether the page has a `kind` property which is a `FileLink` to 
	 * a page in the vault.
	 */
	hasKindProp: hasKindProp(plugin),
	/**
	 * a boolean operator which reports on whether the page has a `kinds` property which is an array with at least
	 * one `FileLink` in it.
	 */
	hasKindsProp: hasKindsProp(plugin),

	/**
	 * a boolean operator which reports on whether the page has a `type` property which is a `FileLink` to 
	 * a page in the vault.
	 */
	hasTypeProp: hasTypeProp(plugin),

	/**
	 * boolean operator which reports on whether the page has multiple "kinds" which it is _kinded_ by.
	 */
	hasMultipleKinds: hasMultipleKinds(plugin),


	/**
	 * Boolean operator which reports on whether:
	 * 
	 * 1. the given page has a property `category` and
	 * 2. the property value is a `FileLink`
	 */
	hasCategoryProp: hasCategoryProp(plugin),


	/**
	 * boolean operation which checks that page has a `categories` property, it is an array, and at least
	 * on element in the array is a `FileLink`.
	 */
	hasCategoriesProp: hasCategoriesProp(plugin),

	/**
	 * Indicates whether page has a tag which defines itself as a "category"
	 * 
	 * - e.g., `#software/category/foobar` would resolve to **true**
	 */
	hasCategoryTagDefn: hasCategoryTagDefn(plugin),

	/**
	 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
	 * 
	 * Note:
	 * - this will _never_ be true for a page which is a category page or a kinded definition
	 * - this WILL pickup the tag `#software/ai`, 
	 * - it WILL NOT pickup the category page `#software/category/ai`
	 * - check out `hasCategoryTagDefn()` if this is not what you were looking for
	 */
	hasCategoryTag: hasCategoryTag(plugin),

	/**
	 * indicates whether page has a tag which defines itself as a "subcategory"
	 * (e.g., `#software/subcategory/foo/bar`)
	 */
	hasSubcategoryTagDefn: hasSubcategoryTagDefn(plugin),

	/**
	 * tests whether a page is a "category page" which is ascertained by:
	 * 
	 * 1. is there a tag definition for the category (e.g., `#software/category/foo`)
	 * 2. is there a property "role" which points to the `kind/category` definition?
	 */
	isCategoryPage: isCategoryPage(plugin),

	/**
	 * tests whether a page is a "subcategory page" which is ascertained by:
	 * 
	 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
	 * 2. is there a property "role" which points to the `kind/subcategory` definition?
	 */
	isSubcategoryPage: isSubcategoryPage(plugin),

	/**
	 * checks whether the given page is a "kinded" page (aka, a page defined by a Kind definition,
	 * but not a _kind definition_ itself)
	 */
	isKindedPage: isKindedPage(plugin),


	/**
	 * checks whether the given page is a _kind definition_
	 */
	isKindDefnPage: isKindDefnPage(plugin),

	/**
	 * Provides one (or more) classifications for a given page.
	 */
	getClassification: getClassification(plugin),

	/**
	 * Return the valid kind tags in the vault. If you pass in a value 
	 * for the `tag` property then the tags will be reduced to only those which
	 * include this tag string.
	 * 
	 * Note: _the tags do not have the leading `#` symbol_
	 */
	getKindTags: getKindTags(plugin),


	/** 
	 * boolean test if the passed in tag is found in the vault or not (note: will filter out any
	 * unneeded leading `#` symbols)
	 */
	isKindTag: isKindTag(plugin),



	// QUERY HANDLERS

	/**
	 * Get the `dv_page` helper utility to build a Dataview query
	 * for a given page.
	 */
	dv_page: dv_page(plugin),

	/**
	 * Service a `km` code block with a back links section
	 */
	back_links: back_links(plugin),

	/**
	 * Service a `km` code block with entry content for a page
	 */
	page_entry: page_entry(plugin),

	/**
	 * Produces a nice book summary widget on a page with book metadata
	 */
	book: book(plugin),

	/**
	 * Produces a table summary of all pages of a particular kind
	 */
	kind_table: kind_table(plugin),

	/**
	 * Produces a video 
	 */
	video_gallery: video_gallery(plugin),




	/**
	 * **kind_tags**
	 * 
	 * Get all the _kind_ tags known in the vault.
	 * 
	 * Note: the result will be tags _without_ the leading `#` symbol
	 */
	kind_tags: (): Set<string> => {
		return new Set();
	},

	/**
	 * **types**()
	 * 
	 * Get all the known types defined in the vault.
	 */
	types: async(): Promise<Kind<"Type">[]> => {
		return [];
	},

	/**
	 * **categories**(for?: string)
	 * 
	 * Returns an array of categories in the vault (all by default, but filtered
	 * down to just those for a particular Kind if specified)
	 */
	categories: (kind?: string | Kind): Kind<"Category">[] => {
		return [];
	},

	/**
	 * **subcategories**(for?: string)
	 * 
	 * Returns an array of subcategories in the vault (all by default, but filtered
	 * down to just those for a particular category if specified)
	 */
	subcategories: async (category?: string | Kind): Promise<any> => {
		return null;
	},

	/**
	 * **page_blocks**()
	 * 
	 * Returns a list of page blocks defined in the vault.
	 */
	page_blocks: (): PageBlock[] => {
		return [];
	},

	/**
	 * **icon_sets**()
	 * 
	 * Provides a list of pages in the vault which are designated as "icon sets"
	 */
	icon_sets: () => {
		return []; 
	},

	/**
	 * **get_dv_page(...)**
	 * 
	 * Get a Dataview's conception of a "page". The input provided can be 
	 * any one of a of page reference variants and the end result is a `DvPage`
	 * interface.
	 * 
	 * **Note:** this uses Dataview to get the page (ignoring the Kind cache)
	 */
	get_dv_page: (page: TFile | FileLink | string | MarkdownView | DvPage): DvPage | null => {
		if (isDataviewPage(page)) {
			return page;
		} else {
			const dataview_page = isTFile(page)
				? plugin.dv.page(page.path)
				: isFileLink(page)
					? plugin.dv.page(page.path)
					: isMarkdownView(page) && typeof page.file === "string"
						? plugin.dv.page(page.file)
						: isMarkdownView(page) && isTFile(page.file)
						? plugin.dv.page(page.file.path)
						: isString(page)
							? plugin.dv.page(page)
							: null;
	
			return isDataviewPage(dataview_page) ? dataview_page : null;
		}
	},




});
