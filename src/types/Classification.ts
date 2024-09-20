
/**
 * Provides a definition for a page's classification structure.
 * 
 * - **Type** `>` **Kind** `>` **Category** `>` **Subcategory**
 * - **Type** `>` **Kind** `>` **Categories[]** 
 */
export type Classification = {
	type?: string;
	typePath?: string;
	typeTag?: string;

	kind: string;
	kindPath: string;
	kindTag?: string;

	category?: string;
	categories?: [string, string][];
	categoryPath?: string;
	categoryTag?: string;

	subcategory?: string;
	subcategoryPath?: string;
	subcategoryTag?: string;
}
