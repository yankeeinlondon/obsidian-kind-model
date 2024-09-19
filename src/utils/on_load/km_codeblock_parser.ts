import { isObject, stripBefore, retainUntil } from "inferred-types";
import { MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "../../main";
import {  Link } from "../../types/dataview_types";
import { query_error } from "../../dv_queries/query_error";
import { evaluate_query_params } from "../../helpers/QueryDefinition";
import { kind_defn } from "../../dv_queries/kind_table";
import { video_defn } from "../../dv_queries/video_gallery";
import { page_entry_defn } from "../../dv_queries/page_entry";


export const isPageLink= (v: unknown): v is Link => {
	return isObject(v) && "file" in v && isObject(v.file) && "path" in v.file
	? true
	: false
}

export const km_codeblock_parser = (plugin: KindModelPlugin) => {
	let processor = async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		el.style.overflowX = "auto"; 
		
		const back_links = /BackLinks\((.*)\)/;
		const page_entry = /PageEntry\((.*)\)/;
		const book = /Book\((.*)\)/; 
		const kind = /Kind\((.*)\)/;
		const videos = /Videos\((.*)\)/;

		if (back_links.test(source)) {
			const [_, params] = Array.from(source.match(back_links) || []);
			await plugin.api.back_links(source,el,ctx,ctx.sourcePath)(params);
			plugin.debug(`back links rendered on "${ctx.sourcePath}"`)
		}
		else if (page_entry.test(source)) {
			let p = evaluate_query_params(plugin)(
				page_entry, source, page_entry_defn
			);
			if (p.isOk) {
				await plugin.api.page_entry(source,el,ctx,ctx.sourcePath)(p.scalar, p.options);
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
			await plugin.api.book(source,el,ctx,ctx.sourcePath);
			plugin.debug(`book rendered on "${ctx.sourcePath}"`);
		} 
		else if (kind.test(source)) {
			let p = evaluate_query_params(plugin)(kind, source, kind_defn);
			if (p.isOk) {
				plugin.debug(p)
				await plugin.api.kind_table(
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
			let p = evaluate_query_params(plugin)(kind, source, video_defn);
			if (p.isOk) {
				await plugin.api.video_gallery(
					source,el,ctx,ctx.sourcePath
				)(p.scalar, p.options);
			} else {
				query_error(plugin)(source,el,ctx,ctx.sourcePath)(
					"Videos",
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
