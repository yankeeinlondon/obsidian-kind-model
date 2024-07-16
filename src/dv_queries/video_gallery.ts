import KindModelPlugin from "../main";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { YouTubeVideoUrl, isObject, youtubeEmbed } from "inferred-types";
import { PageContent, pageContent } from "../helpers/pageContent";
import { PagePath } from "types/general";


export type VideoGalleryOptions = {
	size?: "S" | "M" | "L"
	exclude?: string[]
}
const isVideoGalleryOptions = <T>(val: T): val is T & VideoGalleryOptions => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return isObject(val) && Object.keys(val).every(k => ["size","exclude"].includes(k)) && ["S","M","L", undefined].includes((val as any)?.size)
}

const defaultOptions: Required<VideoGalleryOptions> = {
	size: "M",
	exclude: []
}

/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const video_gallery = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async(
	/** the parameters as a raw string from user's query */
	params_str: string
) => {
	let params: [ opts?: VideoGalleryOptions ]= [];
	const dv = p.api.dv_page(source, container, component, filePath);
	const { current, fmt} = dv;

	try {
		params = params_str === "" 
			? {}
			: JSON.parse(`[ ${params_str} ]`);
		
	} catch {
		fmt.callout("error", "Invalid Videos() query!", {
			content: `Videos(${params_str ? `${params_str}` : ""}) is not valid:`
		})
		return
	}

	type Video = {
		url: YouTubeVideoUrl;
		filepath: PagePath;
		title: string;
	}
	// all the videos found on pages which link to current page
	let videos: Video[] = []
	
	
	let backlinks = dv.as_array(current.file.inlinks);
	let backPages: PageContent[]  = await Promise.all(
		backlinks.map(i => pageContent(p)(i))
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

		p.debug("Videos", {links, videos, ...pg, tree: pg.renderableTree()})
	});


	if (isVideoGalleryOptions(params[0] || {})) {
		const opts: Required<VideoGalleryOptions> = {
			...defaultOptions,
			...(params[0] || {})
		}

		const grid_cols = opts.size == "L"
			? 2
			: opts.size == "M"
			? 3
			: opts.size == "S"
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

		fmt.render(dom);
	}

}
