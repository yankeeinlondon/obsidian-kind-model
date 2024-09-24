import {  MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "~/main";
import { ObsidianComponent } from "~/types";


export const Page = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: ObsidianComponent | MarkdownPostProcessorContext,
	filePath: string
) => {
	const page = p.api.createPageInfoBlock(
		source,
		container,
		component,
		filePath
	);

	if(page) {
		page.paragraph("Page Information")
	}

}
