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
	const page = p.api.createPageInfoBlock(source, container, component, filePath);

	if (page) {
		const icon = (i: string & keyof typeof page.page) => `<span class="icon" style="display: flex; max-width: 32px; max-height: 32px;">${page.page[i]}</span>`;

		const meta = getMetadata(p)(page);

		p.info("Icon Props", {meta})

		page.table(
			["name", "icon"],
			meta["svg::inline"]?.map(i => [
				i,
				icon(i)
			])
		)
	}

}
