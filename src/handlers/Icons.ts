import KindModelPlugin from "main";
import { Component, MarkdownPostProcessorContext } from "obsidian";


export const Icons  = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => {
	const page = p.api.getPageInfoBlock(source, container, component, filePath);

	if (page) {
		const icon = (i: string & keyof typeof page.page) => `<span class="icon" style="display: flex; max-width: 32px; max-height: 32px;">${page.page[i]}</span>`;

		const iconProps = p.api.getIconProperties(page);

		page.table(
			["name", "icon"],
			iconProps.map(i => [
				i,
				page.page[i]
			])
		)

	}

}


