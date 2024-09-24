import { getProp, showAbout, showCategories, showClassifications, showCreatedDate, showDesc, showDueDate, showKind, showLinks, showMetrics, showModifiedDate, showPeers, showProp, showSlider, showSubcategories, showTags, showWhen } from "~/api"


export type ShowApi = {
	showCreatedDate: typeof showCreatedDate;
	showModifiedDate: typeof showModifiedDate;
	showDueDate: ReturnType<typeof showDueDate>;
	showDesc: ReturnType<typeof showDesc>;
	showWhen: ReturnType<typeof showWhen>;

	/**
	 * Provides a string output which is a comma separated list of categories
	 * for the passed in page.
	 */
	showCategories: ReturnType<typeof showCategories>;
	/**
	 * Provides a string output which is a comma separated list of subcategories
	 * for the passed in page.
	 */
	showSubcategories: ReturnType<typeof showSubcategories>;
	/**
	 * list out all tags on the page (excluding those added to `exclude` property)
	 */
	showClassifications: ReturnType<typeof showClassifications>;
	showTags: ReturnType<typeof showTags>;
	showLinks: ReturnType<typeof showLinks>;
	showProp: ReturnType<typeof showProp>;
	getProp: ReturnType<typeof getProp>;
	showAbout: ReturnType<typeof showAbout>;
	showPeers: ReturnType<typeof showPeers>;
	showKind: ReturnType<typeof showKind>;
	showMetrics: ReturnType<typeof showMetrics>;
	showSlider: ReturnType<typeof showSlider>;
}
