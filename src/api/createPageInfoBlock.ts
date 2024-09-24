import KindModelPlugin from "main";
import { createPageInfo } from "./createPageInfo";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { PageInfoBlock } from "types";
import { renderApi } from "./renderApi";

/**
 * Creates a `PageInfoBlock` type which builds on the `PageInfo` type
 * but with the benefit of having the following core types of information:
 * 
 * 1. the `source` of the code block
 * 2. the code block's HTML container element
 * 3. Obsidian's `Component` (which we're probably not taking full advantage of yet)
 */
export const createPageInfoBlock = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string,
): PageInfoBlock | undefined => {
	const page = createPageInfo(p)(filePath);
	if (page) {
		return {
			...page,
			content: source,
			container,
			component,
			...renderApi(p)(container,filePath)
		} as PageInfoBlock
	}
}
