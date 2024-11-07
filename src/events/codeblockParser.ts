import { isObject } from "inferred-types";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "~/main";
import {  Link } from "~/types/dataview_types";

import { ObsidianCodeblockEvent, PageInfoBlock } from "~/types";
import { ERROR_ICON } from "~/constants";
import { isError } from "~/type-guards";
import { getPageInfoBlock } from "~/api";


export const isPageLink= (v: unknown): v is Link => {
	return isObject(v) && "file" in v && isObject(v.file) && "path" in v.file
	? true
	: false
}

/**
 * **codeblockParser**`(p) => void`
 * 
 * Registers a handler with Obsidian to handle the `km` codeblock language.
 * 
 * - it parses blocks and hands off responsibility to the appropriate handler
 * - if no handler is found, an error is raised in the UI
 */
export const codeblockParser = (p: KindModelPlugin) => {
	let callback = async (
		source: string, 
		el: HTMLElement, 
		ctx: MarkdownPostProcessorContext & Component
	) => {
		el.style.overflowX = "auto"; 

		const event: ObsidianCodeblockEvent = {source,el,ctx};
		const page = getPageInfoBlock(p)(event) as PageInfoBlock;
		const handlers = p.api.queryHandlers(event);
		const fmt = p.api.format;

		const outcomes = await Promise.all(handlers.map(i => i()));
		p.info(`code block processed`, outcomes)

		if (!outcomes.some(i => i)) {
			// no handlers attempted to handle the event payload
			const handlerNames = handlers.map(i => i.handlerName);
			const withError = handlers.find(i => isError(i));

			// page.callout(
			// 	"error", 
			// 	`<div style="display:flex; flex-direction: row"><span style="display: flex">Invalid</span>&nbsp;${fmt.inline_codeblock("km")}&nbsp;<span style="display: flex">Query</span></div>`, {
			// content: [
			// 	`Problems parsing parameters passed into the&nbsp;${fmt.bold(`${query}()`)}&nbsp;${fmt.inline_codeblock("km")}&nbsp;<span style="display: flex">query.`,
			// 	`<span><b>Error:</b> ${err?.message || String(err)}</span>`,
			// 	desc
			// ],
			// icon: ERROR_ICON,
			// toRight: fmt.inline_codeblock(` ${query}(${params_str?.trim() || ""}) `)
		}
	}

	
	let registration = p.registerMarkdownCodeBlockProcessor(
		"km", 
		callback
	);
	registration.sortOrder = -100;
}
