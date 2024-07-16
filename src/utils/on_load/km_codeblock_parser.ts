import { isObject } from "inferred-types";
import { MarkdownPostProcessorContext } from "obsidian";
import KindModelPlugin from "../../main";
import {  Link } from "../../types/dataview_types";
import { isOkUserParam, parseParams } from "../../helpers/parseParams";

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
			plugin.debug(`backlinks rendered on "${ctx.sourcePath}"`)
		}
		else if (page_entry.test(source)) {
			await plugin.api.page_entry(source,el,ctx,ctx.sourcePath);
			plugin.debug(`page entry rendered on "${ctx.sourcePath}"`);
		}
		else if (book.test(source)) {
			await plugin.api.book(source,el,ctx,ctx.sourcePath);
			plugin.debug(`book rendered on "${ctx.sourcePath}"`);
		} 
		else if (kind.test(source)) {
			const kindParams = parseParams(
				"string AS Kind", 
				"opt(string) AS Category", 
				"opt(string) AS Subcategory"
			)(o => o
				.strings("category", "subcategory")
				.stringArrays("categories", "subcategories","show_cols","hide_cols")
				.numerics("max")
			)(source.match(kind));
			
			
			if (isOkUserParam(kindParams)) {
				plugin.debug("OK",kindParams)
			} else {
				plugin.debug("ERR", kindParams)
			}

			// const [_, params] = Array.from(source.match(kind) || []);
			if (kindParams.isOk) {
				await plugin.api.kind_table(source,el,ctx,ctx.sourcePath)(kindParams.kind === "no-parameters" ? [] : kindParams.params);
				plugin.debug(`Kind Table rendered on "${ctx.sourcePath}"`)
			}	
				
		}
		else if (videos.test(source)) {
			const outcome = parseParams()(o => o
				.enums("size", "S","M", "L")
				.stringArrays("exclude"),
			)(source.match(videos));
			if (outcome.isOk) {
				await plugin.api.video_gallery(source,el,ctx,ctx.sourcePath)("");
				plugin.debug(`Video Gallery rendered on ${ctx.sourcePath}`)
			} else {
				// 
			}
		}
		else {
			// query error
		}
	}

	let registration = plugin.registerMarkdownCodeBlockProcessor(
		"km", 
		processor
	);
	registration.sortOrder = -100;
}
