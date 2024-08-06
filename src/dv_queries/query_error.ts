import { Component, MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "../main";
import { ERROR_ICON } from "../constants/obsidian-constants";
import { 
	describe_query, 
	QUERY_DEFN_LOOKUP, 
	QueryCmd 
} from "../helpers/QueryDefinition";



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
	const dv = p.api.dv_page(source, container, component, filePath);
	p.warn(err);

	const desc = query in QUERY_DEFN_LOOKUP
	? describe_query(QUERY_DEFN_LOOKUP[query as keyof typeof QUERY_DEFN_LOOKUP])
	: `no query definition for ${query} command!`

	dv.fmt.callout("error", `<div style="display:flex; flex-direction: row"><span style="display: flex">Invalid</span>&nbsp;${dv.fmt.inline_codeblock("km")}&nbsp;<span style="display: flex">Query</span></div>`, {
		content: [
			`Problems parsing parameters passed into the&nbsp;${dv.fmt.bold(`${query}()`)}&nbsp;${dv.fmt.inline_codeblock("km")}&nbsp;<span style="display: flex">query.`,
			`<span><b>Error:</b> ${err?.message || String(err)}</span>`,
			`<span style="margin-top: 0.75rem">This query command is defined as:</span>`,
			desc
		],
		icon: ERROR_ICON,
		toRight: dv.fmt.inline_codeblock(` ${query}(${params_str?.trim() || ""}) `)
	});

}
