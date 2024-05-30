import { isObject } from "inferred-types";
import KindModelPlugin from "main";
import { MarkdownPostProcessorContext } from "obsidian";
import {  Link } from "../../types/dataview_types";

export const isPageLink= (v: unknown): v is Link => {
	return isObject(v) && "file" in v && isObject(v.file) && "path" in v.file
	? true
	: false
}

export const km_codeblock_parser = (plugin: KindModelPlugin) => {
	let processor = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		el.style.overflowX = "auto";
		
		if (/BackLinks\((.*)\)/.test(source)) {
			await plugin.api.back_links(source,el,ctx,ctx.sourcePath);
			plugin.debug(`backlinks rendered on "${ctx.sourcePath}"`)
		}

	}

	let registration = plugin.registerMarkdownCodeBlockProcessor(
		"km", 
		processor
	);
	registration.sortOrder = -100;
}