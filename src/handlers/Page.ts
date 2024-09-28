import {  MarkdownPostProcessorContext } from "obsidian";
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
	const page = p.api.createPageInfoBlock(
		source,
		container,
		component,
		filePath
	);
	
	if(page) {
		const fmt = page.format;
		page.paragraph(fmt.bold("Page Information<br/>"));

		p.info("Page()",page);
		page.render(fmt.twoColumnTable(
			"",
			"Value",
			[
				fmt.bold("Kind of Page"), page.type
			],
			[
				fmt.bold("Type"), page.classifications[0].type?.file?.name || ""
			],
			[
				fmt.bold("Kind"), page.classifications[0].kind?.file?.name
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
