import { Component, MarkdownPostProcessorContext } from "obsidian";
import { YouTubeVideoUrl,  youtubeEmbed } from "inferred-types";

import KindModelPlugin from "../main";
import { PageContent, pageContent } from "../helpers/pageContent";
import { PagePath } from "../types/general";
import { OptionParam, QueryDefinition, ScalarParams } from "../helpers/QueryDefinition";
import { createPageInfoBlock } from "~/api";

export const video_defn = {
	kind: "query-defn",
	type: "Videos",
	scalar: [],
	options: {
		size: "enum(S,M,L)"
	}
} as const satisfies QueryDefinition;

/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const video_gallery = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async <
	TScalar extends ScalarParams<typeof video_defn>,
	TOption extends OptionParam<typeof video_defn>
>(
	scalar: TScalar,
	opt: TOption
) => {
	const page = createPageInfoBlock(p)(source, container, component, filePath);

	if(page) {
		const { page: current, format: fmt } = page;
	
		type Video = {
			url: YouTubeVideoUrl;
			filepath: PagePath;
			title: string;
		}
		// all the videos found on pages which link to current page
		let videos: Video[] = []
		
		let backLinks = page.as_array(current.file.inlinks);
		let backPages: PageContent[]  = await Promise.all(
			backLinks.map(i => pageContent(p)(i))
		).then(pgs => pgs.filter(i => i) as PageContent[])
	
	
		backPages.forEach(pg => {
			let [ links ] = pg.externalLinks();
			videos = [
				...videos, 
				...links
					.filter(i => i.domain === "youtube-video")
					.map(i => ({ 
						...i, 
						title: i.title.toLowerCase() === "video" ? pg.page.file.name : i.title,
						filepath: pg.filepath
					})) as Video[]
			];
		});
	
		let size = opt.size || "M";
	
		const grid_cols = size == "L"
			? 2
			: size == "M"
			? 3
			: size == "S"
			? 4
			: 5
		const dom = [
			`<div class="video-gallery" style="display: grid; grid-template-columns: repeat(${grid_cols}, minmax(0, 1fr)); gap: 8px;">`,
				...videos.map(v => {
					const src = youtubeEmbed(v.url);
					const node = [
						`<div class="video-stack" style="display: flex; flex-direction: column; aspect-ratio: 1.75 auto">`,
							`<iframe class="video-ref" content-editable="false" aria-multiline="true" allow="fullscreen" frameborder="0" sandbox="allow-same-origin allow-modals allow-popups allow-presentation allow-forms" src="${src}"></iframe>`,
							`<a data-tooltip-position="top" aria-label="${v.filepath}" data-href="${v.filepath}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${v.filepath}" style="">${v.title}</a>`,
						`</div>`
					].join("\n")
					return node
				}),
				
	
			'</div>'
		].join("\n")
	
		page.render(dom);
	}

}
