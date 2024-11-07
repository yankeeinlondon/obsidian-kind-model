import type { Component, MarkdownPostProcessorContext } from "obsidian";
import {  OptionParam } from "~/helpers/QueryDefinition";

import { DvPage } from "~/types";
import KindModelPlugin from "~/main";
import { isDvPage } from "~/type-guards";
import { getPageInfoBlock, showKind } from "~/api";
import { createHandler } from "./createHandler";

export type KindQueryOptions = {
	category?: string;
	subcategory?: string;
	categories?: string[];
	subcategories?: string[];
	show_cols?: string[];
	hide_cols?: string[];
}


export const Kind = createHandler("Kind")
	.scalar(
		"kind AS string",
		"category AS opt(string)",
		"subcategory AS opt(string)",
	)
	.options({
		add_columns: `array(string)`,
		remove_columns: "enum(when,desc,links)",
	})
	.handler(async(evt) => {
		const p = evt.plugin;
		const page = evt.page;
		if (page) {
			const {
				table, 
			} = page;
			const fmt = p.api.format;
			const {
				showCategories, 
				showSubcategories, 
				showDesc, 
				showLinks, 
				createFileLink
			} = p.api;
			
			const {kind, category, subcategory} = evt.scalar;
				
			const pages = subcategory 
				? page.pages(`#${kind}/${category}/${subcategory}`)
				: category
				? page.pages(`#${kind}/${category}`)
				: page.pages(`#${kind}`);
		
		
			if (pages.length > 0) {
				table(
					[ "Repo", "Category", "Subcategory", "Desc", "Links" ],
					pages
						.sort(p => p.file.mday)
						.map(p => {
						const pg = isDvPage(p) ? p : page.page(p) as DvPage;
		
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
	
				page.callout("note", `none found currently<span style="font-weight: 150; position: absolute; right: 8px;">${msg}</span>`)
			}
		}
	});

