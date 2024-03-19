import KindModelPlugin from "../main";
import { DvPage } from "../types/dataview_types";
import { get_page } from "./get_page";
import { as_array } from "../utils/as_array";
import { strip_page_alias } from "../utils/strip_page_alias";

/**
 * - get's an array of page references and converts all valid references into a `DataviewPage` element
 * - invalid references are filtered out
 */
export const get_pages = (plugin: KindModelPlugin) => (pages: unknown): DvPage[] => {
	const result = as_array(pages).map(i => get_page(plugin)(strip_page_alias(i as string)));
	plugin.warn("getting pages", result, pages, as_array(pages));
	return result.filter(i => i !== null) as DvPage[]
}
