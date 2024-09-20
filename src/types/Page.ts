import { PageBanners, PageIcons, PageSuggestion } from "utils/base_api/api";
import { DvPage } from "./dataview_types";
import { Classification } from "./Classification";

export type PageType = "kinded" | "kind-defn" | "type-defn" | "none";


export type PageTypeInfo<T extends PageType = PageType> = {
	/** 
	 * whether page is _kinded_, a _kind definition_, a _type definition_, or none of the above.
	 */
	type: T;

	/** the full path to the page */
	path: string;

	/** boolean flag indicating whether page is a **category** page for a `kind` */
	isCategoryPage: T extends "kinded-defn" ? boolean : false;

	hasCategoryTag: boolean;
	hasCategoryProp: boolean;


	/** boolean flag indicating whether page is a **subcategory** page for a `kind` */
	isSubcategoryPage: T extends "kinded-defn" ? boolean : false;
	/**
	 * whether a kinded page has _multiple_ kinds in claims membership to
	 */
	hasMultipleKinds: T extends "kinded-defn" ? boolean : false;

	/**
	 * whether the page has a tag which indicates the page's "kind"
	 * but is _not_ a Kind Definition tag.
	 */
	hasKindTag: T extends "kinded-defn" ? boolean : false;

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
	 * Either the `kind` or `kinds` properties reference the `kind` page indicating that this
	 * page is a Kind Definition.
	 */
	hasKindDefinitionProp: boolean;

	/**
	 * the Classifications of the page
	 */
	classifications: Classification[];

	/**
	 * whether the page has a "kinds" property which indicates the page's "kind"
	 * (or multiple kinds); this looks for a list where at least one item in the 
	 * list is a link to another page in the vault.
	 */
	hasKindsProperty: T extends "kinded-defn" ? boolean : false;

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
