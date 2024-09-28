import { Component, MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "~/main";
import { ERROR_ICON } from "~/constants";
import { 
	describe_query, 
	QUERY_DEFN_LOOKUP, 
	QueryCmd 
} from "~/helpers/QueryDefinition";


export const query_error = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	query: QueryCmd,
	err: Error,
	params_str: string
) => {
	const page = p.api.createPageInfoBlock(source, container, component, filePath);
	p.warn(err);
	
	if (page) {
		const desc = query in QUERY_DEFN_LOOKUP
		? `<span style="margin-top: 0.75rem">This query command is defined as:</span>` + describe_query(QUERY_DEFN_LOOKUP[query as keyof typeof QUERY_DEFN_LOOKUP])
		: `<br>${query} is not a recognized command!`
	
		page.callout("error", `<div style="display:flex; flex-direction: row"><span style="display: flex">Invalid</span>&nbsp;${page.format.inline_codeblock("km")}&nbsp;<span style="display: flex">Query</span></div>`, {
			content: [
				`Problems parsing parameters passed into the&nbsp;${page.format.bold(`${query}()`)}&nbsp;${page.format.inline_codeblock("km")}&nbsp;<span style="display: flex">query.`,
				`<span><b>Error:</b> ${err?.message || String(err)}</span>`,
				desc
			],
			icon: ERROR_ICON,
			toRight: page.format.inline_codeblock(` ${query}(${params_str?.trim() || ""}) `)
		});
	}
}
