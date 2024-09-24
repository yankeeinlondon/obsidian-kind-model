import { getProp, showAbout, showCategoriesFor, showCreatedDate, showDesc, showDueDate, showKind, showLinks, showMetrics, showModifiedDate, showPeers, showProp, showSlider, showSubcategoriesFor, showTags, showWhen } from "~/api"


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
	showCategoriesFor: ReturnType<typeof showCategoriesFor>;
	/**
	 * Provides a string output which is a comma separated list of subcategories
	 * for the passed in page.
	 */
	showSubcategoriesFor: ReturnType<typeof showSubcategoriesFor>;
	/**
	 * list out all tags on the page (excluding those added to `exclude` property)
	 */
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
