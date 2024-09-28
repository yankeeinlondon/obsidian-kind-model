import { DvPage } from "./dataview_types";
import { PageCategory, PageSubcategory } from "./Page";


export type ClassificationTuple = [tag: string, page: DvPage];

/**
 * Provides a definition for a page's classification structure.
 * 
 * - **Type** `>` **Kind** `>` **Category** `>` **Subcategory**
 * - **Type** `>` **Kind** `>` **Categories[]** 
 */
export type Classification = {
	/** the "type" which this page is */
	type?: DvPage;
	kind: DvPage;
	kindTag: string;
	/**
	 * a single "kind" can have zero or more categories associated
	 * to the page and the kind.
	 */
	categories: PageCategory[];
	/**
	 * a single "kind" can only have a single subcategory
	 */
	subcategory?: PageSubcategory;
}
