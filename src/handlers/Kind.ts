import type { Component, MarkdownPostProcessorContext } from "obsidian";
import {  OptionParam, QueryDefinition, ScalarParams } from "~/helpers/QueryDefinition";

import { DvPage } from "~/types";
import KindModelPlugin from "~/main";
import { isDvPage } from "~/type-guards";
import { getPageInfoBlock, showKind } from "~/api";

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
	const dv = getPageInfoBlock(p)(source, container, component, filePath);
	if (dv) {
		const {
			table, 
			showCategories, 
			showSubcategories, 
			showDesc, 
			showLinks, 
			createFileLink
		} = dv;
		const fmt = dv.format;
		const [kind, category, subcategory] = scalar;
			
		const pages = subcategory 
			? dv.pages(`#${kind}/${category}/${subcategory}`)
			: category
			? dv.pages(`#${kind}/${category}`)
			: dv.pages(`#${kind}`)
	
	
		if (pages.length > 0) {
			table(
				[ "Repo", "Category", "Subcategory", "Desc", "Links" ],
				pages
					.sort(p => p.file.mday)
					.map(p => {
					const pg = isDvPage(p) ? p : dv.page(p) as DvPage;
	
					return [
						createFileLink(pg),
						showCategories(pg),
						showSubcategories(pg),
						showDesc(pg),
						showLinks(pg)
					]
				})
			)
		} else {
			const msg = subcategory
				? fmt.as_tag(`${kind}/${category}/${subcategory}`)
				: category
				? fmt.as_tag(`${kind}/${category}`)
				: `${fmt.as_tag(kind as string)}`;

			dv.callout("note", `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`)
		}
	}
}
