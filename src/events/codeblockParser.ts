import { isObject, stripBefore, retainUntil } from "inferred-types";
import { MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "../main";
import {  Link } from "../types/dataview_types";
import { query_error } from "../handlers/query_error";
import { evaluate_query_params } from "../helpers/QueryDefinition";
import { kind_defn } from "../handlers/Kind";
import { video_defn } from "../handlers/VideoGallery";
import { page_entry_defn } from "../handlers/PageEntry";


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
export const codeblockParser = (plugin: KindModelPlugin) => {
	let processor = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		el.style.overflowX = "auto"; 
		
		const back_links = /BackLinks\((.*)\)/;
		const page_entry = /PageEntry\((.*)\)/;
		const book = /Book\((.*)\)/; 
		const kind = /Kind\((.*)\)/;
		const videos = /Videos\((.*)\)/;
		const icons = /Icons\((.*)\)/;

		const { 
			BackLinks,
			Book,
			PageEntry,
			Kind,
			VideoGallery,
			Icons
		} = plugin.api.queryHandlers

		if (back_links.test(source)) {
			const [_, params] = Array.from(source.match(back_links) || []);
			await BackLinks(source,el,ctx,ctx.sourcePath)(params);
			plugin.debug(`back links rendered on "${ctx.sourcePath}"`)
		}
		else if (page_entry.test(source)) {
			let p = evaluate_query_params(plugin)(
				page_entry, source, page_entry_defn
			);
			if (p.isOk) {
				await PageEntry(source,el,ctx,ctx.sourcePath)(p.scalar, p.options);
				plugin.debug(`page entry rendered on "${ctx.sourcePath}"`);
			} else {
				query_error(plugin)(source,el,ctx,ctx.sourcePath)(
					"PageEntry",
					p.error,
					p.param_str
				)
				return
			}
		}
		else if (book.test(source)) {
			await Book(source,el,ctx,ctx.sourcePath);
			plugin.debug(`book rendered on "${ctx.sourcePath}"`);
		} 
		else if (kind.test(source)) {
			let p = evaluate_query_params(plugin)(kind, source, kind_defn);
			if (p.isOk) {
				plugin.debug(p)
				await Kind(
					source,el,ctx,ctx.sourcePath
				)(p.scalar, p.options);
			} else {
				query_error(plugin)(source,el,ctx,ctx.sourcePath)(
					"Kind",
					p.error,
					p.param_str
				)
				return
			} 
		}
		else if (videos.test(source)) {
			let p = evaluate_query_params(plugin)(kind, source, kind_defn);
			if (p.isOk) {
				await VideoGallery(
					source,el,ctx,ctx.sourcePath
				)(p.scalar, p.options);
			} else {
				query_error(plugin)(source,el,ctx,ctx.sourcePath)(
					"VideoGallery",
					p.error,
					p.param_str
				)
				return
			} 
		} else if (icons.test(source)) {
			let p = evaluate_query_params(plugin)(kind, source, kind_defn);
			if (p.isOk) {
				await Icons(
					source,el,ctx,ctx.sourcePath
				)(p.scalar, p.options);
			} else {
				query_error(plugin)(source,el,ctx,ctx.sourcePath)(
					"Icons",
					p.error,
					p.param_str
				)
				return
			} 
		}
		else {
			// doesn't match any known syntax
			const command_attempt = source.includes("(")
				? retainUntil(source, "(")
				: "Unknown";
			const params_attempt = command_attempt === "Unknown"
				? ""
				: source.replace(command_attempt + "(", "").replace(/\)$/, "");

			query_error(plugin)(source,el,ctx,ctx.sourcePath)(
				command_attempt as any,
				new Error(`Unknown query command: ${command_attempt}()`),
				params_attempt
			);
		}
	}

	let registration = plugin.registerMarkdownCodeBlockProcessor(
		"km", 
		processor
	);
	registration.sortOrder = -100;
}
