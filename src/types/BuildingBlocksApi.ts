
import { 
	isKeyOf,
	getCategories,
	getClassification, 
	getKindPages, 
	getKindTagsOfPage, 
	getKnownKindTags, 
	getMetadata, 
	hasCategoriesProp, 
	hasCategoryProp, 
	hasCategoryTag, 
	hasCategoryTagDefn, 
	hasKindDefinitionTag, 
	hasKindProp, 
	hasKindsProp, 
	hasMultipleKinds, 
	hasSubcategoryTagDefn, 
	hasTypeDefinitionTag, 
	hasTypeProp, 
	isCategoryPage, 
	isKindDefnPage, 
	isKindedPage, 
	isKindTag, 
	isSubcategoryPage, 
	hasAnyCategoryProp
} from "~/api/buildingBlocks";


export type BuildingBlocksApi = {
	/**
	 * **isKeyOf**`(container, key)`
	 * 
	 * Boolean check whether `key` is _key of_ `container`.
	 */
	isKeyOf: typeof isKeyOf
	/**
		 * Boolean operator which reports on whether:
		 * 
		 * 1. the given page has a property `category` and
		 * 2. the property value is a `FileLink`
		 */
	hasCategoryProp: ReturnType<typeof hasCategoryProp>,

	/**
	 * boolean operation which checks that page has a `categories` property, it is an array, and at least
	 * on element in the array is a `FileLink`.
	 */
	hasCategoriesProp: ReturnType<typeof hasCategoriesProp>,

	/**
	 * **hasAnyCategoryProp** 
	 * 
	 * Boolean flag which indicates if _either_ the `category` or `categories` 
	 * property is set. 
	 * 
	 * **Notes:**
	 * - a `categories` property which is empty or missing any vault links is not
	 * considered valid and ignored in check
	 * - a `category` which is not a vault link is also ignored
	 */
	hasAnyCategoryProp: ReturnType<typeof hasAnyCategoryProp>,

	/**
	 * **hasAnySubcategoryProp** 
	 * 
	 * Boolean flag which indicates if _either_ the `subcategory` or `subcategories` 
	 * property is set. 
	 * 
	 * **Notes:**
	 * - a `subcategories` property which is empty or missing any vault links is not
	 * considered valid and ignored in check
	 * - a `subcategory` which is not a vault link is also ignored
	 */
	hasAnySubcategoryProp: ReturnType<typeof hasAnyCategoryProp>,

	/**
	 * boolean operator which indicates whether the page has a tag starting with `#type/`.
	 */
	hasTypeDefinitionTag: ReturnType<typeof hasTypeDefinitionTag>,

	/**
	 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
	 */
	hasKindDefinitionTag: ReturnType<typeof hasKindDefinitionTag>,

	/**
	 * a boolean operator which reports on whether the page has a `kind` property which is a `FileLink` to 
	 * a page in the vault.
	 */
	hasKindProp: ReturnType<typeof hasKindProp>,
	/**
	 * a boolean operator which reports on whether the page has a `kinds` property which is an array with at least
	 * one `FileLink` in it.
	 */
	hasKindsProp: ReturnType<typeof hasKindsProp>,

	/**
	 * a boolean operator which reports on whether the page has a `type` property which is a `FileLink` to 
	 * a page in the vault.
	 */
	hasTypeProp: ReturnType<typeof hasTypeProp>,

	/**
	 * boolean operator which reports on whether the page has multiple "kinds" which it is _kinded_ by.
	 */
	hasMultipleKinds: ReturnType<typeof hasMultipleKinds>,

	/**
	 * Indicates whether page has a tag which defines itself as a "category"
	 * 
	 * - e.g., `#software/category/foobar` would resolve to **true**
	 */
	hasCategoryTagDefn: ReturnType<typeof hasCategoryTagDefn>,

	/**
	 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
	 * 
	 * Note:
	 * - this will _never_ be true for a page which is a category page or a kinded definition
	 * - this WILL pickup the tag `#software/ai`, 
	 * - it WILL NOT pickup the category page `#software/category/ai`
	 * - check out `hasCategoryTagDefn()` if this is not what you were looking for
	 */
	hasCategoryTag: ReturnType<typeof hasCategoryTag>,

	/**
	 * gets all categories associated with the page
	 */
	getCategories: ReturnType<typeof getCategories>,

	/**
	 * indicates whether page has a tag which defines itself as a "subcategory"
	 * (e.g., `#software/subcategory/foo/bar`)
	 */
	hasSubcategoryTagDefn: ReturnType<typeof hasSubcategoryTagDefn>,

	/**
	 * tests whether a page is a "category page" which is ascertained by:
	 * 
	 * 1. is there a tag definition for the category (e.g., `#software/category/foo`)
	 * 2. is there a property "role" which points to the `kind/category` definition?
	 */
	isCategoryPage: ReturnType<typeof isCategoryPage>,

	/**
	 * tests whether a page is a "subcategory page" which is ascertained by:
	 * 
	 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
	 * 2. is there a property "role" which points to the `kind/subcategory` definition?
	 */
	isSubcategoryPage: ReturnType<typeof isSubcategoryPage>,

	/**
	 * checks whether the given page is a "kinded" page (aka, a page defined by a Kind definition,
	 * but not a _kind definition_ itself)
	 */
	isKindedPage: ReturnType<typeof isKindedPage>,


	/**
	 * checks whether the given page is a _kind definition_
	 */
	isKindDefnPage: ReturnType<typeof isKindDefnPage>,

	/**
	 * Provides one (or more) classifications for a given page.
	 */
	getClassification: ReturnType<typeof getClassification>,

	/**
	 * Return the valid kind tags in the vault. If you pass in a value 
	 * for the `tag` property then the tags will be reduced to only those which
	 * include this tag string.
	 * 
	 * Note: _the tags do not have the leading `#` symbol_
	 */
	getKnownKindTags: ReturnType<typeof getKnownKindTags>,


	/**
	 * Take a page reference and all the **kind** _tags_ this page has.
	 */
	getKindTagsOfPage: ReturnType<typeof getKindTagsOfPage>,


	/**
	 * Provided a valid page reference input, it will return all the kind pages which
	 * define this page.
	 */
	getKindPages: ReturnType<typeof getKindPages>,

	/**
	 * Provides the _type_ (e.g., `PageType`) of data contained in each property of the page reference passed in.
	 */
	getMetadata: ReturnType<typeof getMetadata>,


	/** 
	 * boolean test if the passed in tag is found in the vault or not (note: will filter out any
	 * unneeded leading `#` symbols)
	 */
	isKindTag: ReturnType<typeof isKindTag>,
}
