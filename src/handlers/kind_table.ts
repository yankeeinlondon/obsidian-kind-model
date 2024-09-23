import type { Component, MarkdownPostProcessorContext } from "obsidian";
import {  OptionParam, QueryDefinition, ScalarParams } from "../helpers/QueryDefinition";

import { DvPage } from "../types/dataview_types";
import { DvQuerySurface } from "./dv_page";
import KindModelPlugin from "../main";
import { isDvPage } from "type-guards";

export type KindQueryOptions = {
	category?: string;
	subcategory?: string;
	categories?: string[];
	subcategories?: string[];
	show_cols?: string[];
	hide_cols?: string[];
}


export const kind_defn = {
	kind: "query-defn",
	type: "Kind",
	scalar: [
		"kind AS string",
		"category AS opt(string)",
		"subcategory AS opt(string)",
	],
	options: {
		remove_columns: "enum(when,desc,links)",
		add_columns: "columns()"
	}
} as const satisfies QueryDefinition;


/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const kind_table = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async <
	TScalar extends ScalarParams<typeof kind_defn>,
	TOption extends OptionParam<typeof kind_defn>
>(
	scalar: TScalar,
	opt: TOption
) => {
	const dv: DvQuerySurface = p.api.dv_page(source, container, component, filePath);
	const table = dv.table;
	const {createFileLink, show_when, show_desc, show_links, fmt} = dv;
	const [kind, category, subcategory] = scalar;

		
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
			: `${fmt.as_tag(kind as string)}`;
		fmt.callout("note", `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`)
	}
}
