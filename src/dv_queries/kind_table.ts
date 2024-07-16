import KindModelPlugin from "../main";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { DvPage } from "../types/dataview_types";
import { isDvPage } from "../utils/type_guards/isDvPage";

export type KindQueryOptions = {
	category?: string;
	subcategory?: string;
	categories?: string[];
	subcategories?: string[];
	show_cols?: string[];
	hide_cols?: string[];
}

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
	params_str: [string, string, KindQueryOptions]
) => {
	const dv = p.api.dv_page(source, container, component, filePath);
	const table = dv.table;
	const {createFileLink, show_when, show_desc, show_links, fmt} = dv;

	const [kind, category, opts] = params_str;
		
	const pages = opts.subcategory 
		? dv.pages(`#${kind}/${category}/${opts.subcategory}`)
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
		const msg = opts.subcategory
			? fmt.as_tag(`${kind}/${category}/${opts.subcategory}`)
			: category
			? fmt.as_tag(`${kind}/${category}`)
			: `${fmt.as_tag(kind)}`;
		fmt.callout("note", `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`)
	}
}
