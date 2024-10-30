import {  MarkdownPostProcessorContext } from "obsidian";
import { lookupKnownKindTags } from "~/cache";
import KindModelPlugin from "~/main";
import { ObsidianComponent } from "~/types";


export const Page = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: ObsidianComponent | MarkdownPostProcessorContext,
	filePath: string
) => (
	scalar: any[],
	obj: any
) => {
	const page = p.api.getPageInfoBlock(
		source,
		container,
		component,
		filePath
	);
	
	if(page) {
		const fmt = p.api.format;
		const api = p.api;

		p.info(`Page`, { page });
		console.log(page)
		console.log(lookupKnownKindTags(p));
		fmt.bold("Page Information<br/>");

		page.render(fmt.twoColumnTable(
			"",
			"Value",
			[
				fmt.bold("Kind of Page"), page.type
			],
			[
				fmt.bold("Type"), 
				page.classifications.length > 0 
				? page.classifications[0].type?.file?.name || ""
				: "<i>undefined</i>"
			],
			[
				fmt.bold("Kind"), 
				page.classifications.length > 0
				? page.classifications[0].kind?.file?.name
				: "<i>undefined</i>"
			],
			[
				fmt.bold("Category(s)"), page.categories.map(i => i.categoryTag).join(", ")
			],
			[
				fmt.bold("Subcategories(s)"), page.subcategories.map(i => i.subcategoryTag).join(", ")
			]
		));

	}

}
