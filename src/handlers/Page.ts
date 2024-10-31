import { isFunction } from "inferred-types";
import {  MarkdownPostProcessorContext } from "obsidian";
import { isKindTag } from "~/api/buildingBlocks";
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

		p.info(`Page Details`, { page });
		console.log(page)
		fmt.bold("Page Information<br/>");

		const kindOfPage = [ fmt.bold("Kind of Page"), page.type ];
		const types = page.typeTags?.length > 0 
			?  [ fmt.bold("Types(s)"), page.kindTags.join(", ") ]
			: undefined; 
		const kinds = page.kindTags?.length > 0 
			? [ fmt.bold("Kind(s)"), page.kindTags.join(", ") ]
			: undefined;

		const cats = page.categories?.length > 0
			? [
				fmt.bold("Category(s)"), page.categories.map(i => i.category).join(", ")
			]
			: undefined;
		
		const subCats = page.subcategories?.length > 0
			? [
				fmt.bold("Subcategories(s)"), page.subcategories.map(i => i.subcategory).join(", ")
			]
			: undefined;

		const metadata = Object.keys(page.metadata).length > 0 
			? [ 
				fmt.bold("Frontmatter"), 
				Object
					.keys(page.metadata)
					.filter(k => !isFunction(page.metadata[k as any]))
					.map(
						k => `${k}(${page.metadata[k as any].join(", ")})`
					)
					.join("<br/>")
			]
			: undefined;

		const report = [

			kindOfPage,
			types,
			kinds,
			cats,
			subCats,
			metadata
		].filter(i => i) as [left: string, right: string][];

		page.render(fmt.twoColumnTable(
			"",
			"Value",
			...report
		));

	}

}
