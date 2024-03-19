import { TFile } from "obsidian"
import { BasePageContext } from "../types/PageContext"
import KindModelPlugin from "../main"
import { DvPage } from "../types/dataview_types"
import { pageName } from "./page";

export type GetRefFromProp = (plugin: KindModelPlugin) => (page: string | TFile | BasePageContext, prop: string) => DvPage | null;

export type GetRefsFromProp = (plugin: KindModelPlugin) => (page: string | TFile | BasePageContext, prop: string) => DvPage[] | null;


/**
 * Returns a single `DataviewPage` for the property is defined and points
 * to a valid page in the vault.
 * 
 * - if you may have multiple property references in this property than
 * you should use the `getRefsFromProp` function instead.
 */
export const getRefFromProp: GetRefFromProp = (plugin) => (page, prop) => {
	plugin.debug(`getRefFromProp(${pageName(page)}, ${prop})`);
	return null;
}

/**
 * Returns a list of `DataviewPage` properties for each value in the 
 * frontmatter's property on the specified page.
 * 
 * - always returns an array even if the property only actually only has
 * a singular reference
 */
export const getRefsFromProp: GetRefsFromProp = (plugin) => (page, prop) => {
	return [];
}
