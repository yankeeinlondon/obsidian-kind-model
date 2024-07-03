
import { ExternalLink, PagePath, Tag } from "./general";



export interface KindCache {
	external_links: Map<PagePath, ExternalLink>;

	/**
	 * Kind definitions
	 */
	kinds: Map<string, unknown>,
	/** 
	 * **pages**
	 * 
	 * A dictionary of `KindedPage` types for each relevant page which
	 * Kind Model is aware of. The dictionaries keys represent the
	 * fully qualified path to the page.
	 */
	pages: Map<string, KindPage>,
	/**
	 * **tag_lookup**
	 * 
	 * A dictionary where any tag being used in **Kind Model** can be
	 * looked up and an array of _paths_ to pages will be returned.
	 * 
	 * **Note:** the tag's name is the index for the lookup and _should not_ contain
	 * a leading `#` symbol.
	 */
	tag_lookup: Map<string, Set<string>>,

	kind_lookup: Map<string, Set<string>>,

	/**
	 *  **name_lookup**
	 * 
	 * Provides the ability to provide just the "name" of a page and
	 * a Set of fully qualified paths will be returned (note: typically 
	 * this should just be one).
	 */
	name_lookup: Map<string, Set<string>>,

	kind_tags: Set<Tag>
}
