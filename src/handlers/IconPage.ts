import { MarkdownPostProcessorContext } from "obsidian";
import {  getMetadata } from "~/api/buildingBlocks";
import { OptionParam, QueryDefinition, ScalarParams } from "~/helpers/QueryDefinition";
import KindModelPlugin from "~/main";
import { ObsidianComponent } from "~/types";


export const iconPageDefn = {
	kind: "query-defn",
	type: "IconPage",
	scalar: [],
	options: {
		remove_columns: "enum(when,desc,links)",
		add_columns: "columns()"
	}
} as const satisfies QueryDefinition;

export const IconPage = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: ObsidianComponent | MarkdownPostProcessorContext,
	filePath: string
) => async <
	TScalar extends ScalarParams<typeof iconPageDefn>,
	TOption extends OptionParam<typeof iconPageDefn>
>(
	scalar: TScalar,
	opt: TOption
) => {
	p.debug("entering Icons handler")
	const page = p.api.getPageInfoBlock(source, container, component, filePath);

	if (page) {
		const icon = (i: string & keyof typeof page.current) => `<span class="icon" style="display: flex; max-width: 32px; max-height: 32px;">${page.current[i]}</span>`;

		const meta = getMetadata(p)(page);

		p.info("Icon Props", {meta})

		page.render(`## **${page.current.file.name}** is an Icon Page`);
		page.render(`> _To define one of the icons here to be used as "icon" for another page you'll prefix the name with #icon/link._`)

		page.table(
			["name", "icon"],
			meta["svg_inline"]?.map(i => [
				i,
				icon(i)
			])
		)
	}

}
