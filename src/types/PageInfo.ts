import { PageBanners, PageIcons, PageSuggestion } from "api/api";
import { DvPage, Link } from "./dataview_types";
import { Classification } from "./Classification";
import { TAbstractFile, TFile } from "./Obsidian";

export type PageType = "kinded" | "kind-defn" | "type-defn" | "none";


export type PageInfo<T extends PageType = PageType> = {
	/** 
	 * whether page is _kinded_, a _kind definition_, a _type definition_, or none of the above.
	 */
	type: T;

	/** the full path to the page */
	path: string;

	/** boolean flag indicating whether page is a **category** page for a `kind` */
	isCategoryPage: boolean;

	hasCategoryTag: boolean;
	hasCategoryProp: boolean;


	/** boolean flag indicating whether page is a **subcategory** page for a `kind` */
	isSubcategoryPage: boolean;
	/**
	 * whether a kinded page has _multiple_ kinds in claims membership to
	 */
	hasMultipleKinds: boolean;

	/**
	 * whether the page has a tag which indicates the page's "kind"
	 * but is _not_ a Kind Definition tag.
	 */
	hasKindTag: boolean;

	hasKindDefinitionTag: boolean;
	hasTypeDefinitionTag: boolean;

	/**
	 * whether the page has a "kind" property which indicates the page's "kind"; 
	 * this is **any** "kind" property which links to another page inside
	 * the vault (aka, it should be a kind definition but for this flag it doesn't
	 * have to be). 
	 * 
	 * The one exception, is when the kind property points directly to the `kind` Kind definition
	 * as this indicates it is a 
	 */
	hasKindProp: boolean;


	/**
	 * the Classifications of the page
	 */
	classifications: Classification[];

	/**
	 * whether the page has a "kinds" property which indicates the page's "kind"
	 * (or multiple kinds); this looks for a list where at least one item in the 
	 * list is a link to another page in the vault.
	 */
	hasKindsProperty: boolean;

	/** get the icons associated with this page */
	getIcons(): PageIcons;
	/** get the banners associated with this page */
	getBanners(): PageBanners;
	

	getSuggestedActions(): PageSuggestion[];

	/** 
	 * The `DvPage` API surface for the given page
	 */
	page: DvPage;
}


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


export type PageReference = PageInfo | DvPage | TFile |TAbstractFile | Link | string;
