/* eslint-disable @typescript-eslint/no-explicit-any */

import KindModelPlugin from "../main";
import {  DvPage } from "../types/dataview_types";
import { isDataviewFile } from "../utils/type_guards/isDataviewFile";
import { isDataviewPage } from "../utils/type_guards/isDataviewPage";
import { isStringPageRef } from "../utils/type_guards/isStringPageRef";
import { extract_page_reference } from "../utils/extract_page_reference";
import { strip_page_alias } from "../utils/strip_page_alias";
import { isFileLink } from "../utils/type_guards/isFileLink";
import { convertToPageWithArrays } from "../utils/convertToPageWithArrays";



/**
 * **get_page**(plugin)(ref) -> `DataviewPage | null` 
 * 
 * Gets a page (`DataviewPage`) using the **Dataview** API or returns `null`
 * if not found.
 */
export const get_page = (plugin: KindModelPlugin) => (page: unknown): DvPage | null => {
	const dv = plugin.dv;
	if (isFileLink(page)) {
		const path = String((page as any).path.replace('.md',''));
		const p = dv.page(path);
		return p && p.file
			? convertToPageWithArrays(p)
			: null;
	} else if (isDataviewFile(page)) {
		return convertToPageWithArrays(page);
	} else if (isDataviewPage(page)) {
		return page;
	} else if (isStringPageRef(page)) {
		try {
			const p = dv.page(extract_page_reference(strip_page_alias(page)));
			plugin.warn(
				"extracted and stripped",
				page,
				extract_page_reference(page),
				extract_page_reference(strip_page_alias(page))
			);
			return p ? convertToPageWithArrays(p.file) : null;
		} catch {
			plugin.error(`Problem getting the page reference using the get_page() abstraction around a dataview query`, extract_page_reference(page));
			return null;
		}
	} else {
		return null;
	}
}
