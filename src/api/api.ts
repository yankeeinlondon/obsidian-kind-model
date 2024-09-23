import KindModelPlugin from "../main";
import { DvPage } from "../types/dataview_types";

import { dv_page } from "../handlers/dv_page";
import { queryHandlers } from "./queryHandlers";
import { buildingBlocks } from "./buildingBlocks";
import {  isDvPage, isPageInfo } from "type-guards";
import { PageReference } from "types";
import { getPath } from "./getPath";
import { createPageView } from "./createPageView";
import { createPageInfo } from "./createPageInfo";
import { getPage } from "./cache";
import { formattingApi } from "./formattingApi";
import { HtmlElement } from "inferred-types";
import { renderApi } from "./renderApi";


export const api = (plugin: KindModelPlugin) => ({

	...buildingBlocks(plugin),
	...queryHandlers(plugin),

	/**
	 * Returns a `DvPage` when given a valid path to a file in the vault.
	 * 
	 * - also ensures that `DvPage` is added to the cache
	 */
	getPage: getPage(plugin),

	/**
	 * Returns the _file path_ to a page when any `PageReference` is passed in.
	 */
	getPath,

	/**
	 * Formatting to help you build useful HTML blocks that work
	 * well with Obsidian.
	 */
	format: formattingApi(plugin),

	/**
	 * You can gain access to the Render API if you provide an HTMLElement and filePath.
	 */
	render: (el: HTMLElement, filePath: string) => renderApi(plugin,el,filePath),
	
	/** 
	 * Converts a `MarkdownView` to a `PageView`.
	 * 
	 * A `PageView` is a `PageInfo` on steroids. It provides
	 * things like _content_, _content structure_, and several 
	 * DOM entry points.
	 * 
	 * Note: from a caching standpoint, the `PageInfo` is cached
	 * but the remaining props which separate a `PageView` from
	 * `PageInfo` are all derived from the view that was passed in
	 * (and therefore are not cached).
	 */
	createPageView: createPageView(plugin),

	createPageInfoPlus: null,

	/**
	 * Converts a `PageReference` into a `PageInfo` which has
	 * tons of extra meta properties and functions along with 
	 * a `page` property which represents the `DvPage` API surface
	 * for this page.
	 */
	createPageInfo: createPageInfo(plugin),


	/**
	 * **get_dv_page(...)**
	 * 
	 * Get a Dataview's conception of a "page". The input provided can be 
	 * any one of a of page reference variants and the end result is a `DvPage`
	 * interface.
	 * 
	 * **Note:** this uses Dataview to get the page (ignoring the Kind cache)
	 */
	get_dv_page: (page: PageReference): DvPage | null => {
		if (isDvPage(page)) {
			return page;
		} else if (isPageInfo(page)) {
			return page.page;
		} else {
			const path = getPath(page);
			if(path) {
				return plugin.dv.page(path) || null;
			}
	
			return null;
		}
	},

});
