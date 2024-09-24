import KindModelPlugin from "~/main";
import { MarkdownPostProcessorContext } from "obsidian";
import { ObsidianComponent } from "~/types";


export const Icons  = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: ObsidianComponent | MarkdownPostProcessorContext,
	filePath: string
) => async(
	params_str: string = ""
) => {
	const page = p.api.createPageInfoBlock(source, container, component, filePath);

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
