import {  isString } from "inferred-types";
import { MarkdownView } from "obsidian";
import KindModelPlugin from "../main";
import { isMarkdownView } from "../utils/type_guards/isMarkdownView";
import { isTFile } from "../utils/type_guards/isTFile";
import { DvPage, FileLink } from "../types/dataview_types";
import { isFileLink } from "../utils/type_guards/isFileLink";
import { isDataviewPage } from "../utils/type_guards/isDataviewPage";
import { dv_page } from "../handlers/dv_page";
import {  TFile } from "../types/Obsidian";
import { queryHandlers } from "./queryHandlers";
import { buildingBlocks } from "./buildingBlocks";


export const api = (plugin: KindModelPlugin) => ({

	...buildingBlocks(plugin),
	...queryHandlers(plugin),

	/**
	 * Get the `dv_page` helper utility to build a Dataview query
	 * for a given page.
	 */
	dv_page: dv_page(plugin),


	/**
	 * **get_dv_page(...)**
	 * 
	 * Get a Dataview's conception of a "page". The input provided can be 
	 * any one of a of page reference variants and the end result is a `DvPage`
	 * interface.
	 * 
	 * **Note:** this uses Dataview to get the page (ignoring the Kind cache)
	 */
	get_dv_page: (page: TFile | FileLink | string | MarkdownView | DvPage): DvPage | null => {
		if (isDataviewPage(page)) {
			return page;
		} else {
			const dataview_page = isTFile(page)
				? plugin.dv.page(page.path)
				: isFileLink(page)
					? plugin.dv.page(page.path)
					: isMarkdownView(page) && typeof page.file === "string"
						? plugin.dv.page(page.file)
						: isMarkdownView(page) && isTFile(page.file)
						? plugin.dv.page(page.file.path)
						: isString(page)
							? plugin.dv.page(page)
							: null;
	
			return isDataviewPage(dataview_page) ? dataview_page : null;
		}
	},

});
