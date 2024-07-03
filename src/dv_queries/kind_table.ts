import KindModelPlugin from "../main";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { DvPage } from "../types/dataview_types";
import { isDvPage } from "../utils/type_guards/isDvPage";


/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const kind_table = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	/** the parameters as a raw string from user's query */
	params_str: string
) => {
	const dv = p.api.dv_page(source, container, component, filePath);
	const table = dv.table;
	const {createFileLink, show_when, show_desc, show_links, fmt} = dv;

	let params: string[] = [];

	try {
		params = JSON.parse(`[ ${params_str} ]`);
	} catch {
		fmt.callout("error", "Invalid Kind() query!", {
			content: `Kind(${params_str}) is not valid:`
		})
		return
	}

	const [kind,category,subcategory] = params;
		
	const pages = subcategory 
		? dv.pages(`#${kind}/${category}/${subcategory}`)
		: category
		? dv.pages(`#${kind}/${category}`)
		: dv.pages(`#${kind}`)


	if (pages.length > 0) {
		table(
			[ "Repo", "When", "Desc", "Links" ],
			pages
				.sort(p => p.file.mday)
				.map(p => {
				const pg = isDvPage(p) ? p : dv.page(p) as DvPage;
				return [
					createFileLink(pg),
					show_when(pg),
					show_desc(pg),
					show_links(pg)
				]
			})
		)
	} else {
		const msg = subcategory
			? fmt.as_tag(`${kind}/${category}/${subcategory}`)
			: category
			? fmt.as_tag(`${kind}/${category}`)
			: `${fmt.as_tag(kind)}`;
		fmt.callout("note", `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`)
	}
}
