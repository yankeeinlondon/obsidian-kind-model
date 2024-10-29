import KindModelPlugin from "~/main";
import { buildingBlocks } from "./buildingBlocks";
import { getPath } from "./getPath";
import { createPageView } from "./createPageView";
import { createPageInfo } from "../page/getPageInfo";
import { formattingApi } from "./formattingApi";
import { renderApi } from "./renderApi";
import { iconApi } from "./iconApi";
import { showApi } from "./showApi";
import { createPageInfoBlock } from "../page/getPageBlock";
import { queryHandlers } from "~/handlers";
import { obsidianApi } from "./obsidian";
import { getPage } from "~/page";

export const api = (plugin: KindModelPlugin) => ({
	/**
	 * The **Query Handler** API surface.
	 * 
	 * - `back_links`
	 * - `video_gallery`
	 * - etc.
	 */
	queryHandlers: queryHandlers(plugin),

	...buildingBlocks(plugin),
	...showApi(plugin),
	...iconApi(plugin),
	...obsidianApi(plugin),

	/**
	 * **render**`(el, filePath) -> API`
	 * 
	 * You can gain access to the **Render API** if you provide an HTMLElement and filePath.
	 */
	render: renderApi(plugin),

	/**
	 * **Formatting API**, designed to help you build useful HTML blocks that work
	 * well with Obsidian.
	 */
	format: formattingApi(plugin),

	/**
	 * Returns a `DvPage` when given a valid path to a file in the vault.
	 * 
	 * - also ensures that `DvPage` is added to the cache
	 */
	getPage: getPage(plugin),

	/**
	 * Returns the _file path_ to a page when any `PageReference` is passed in.
	 */
	getPath,


	/** 
	 * Converts a `MarkdownView` to a `PageView`.
	 * 
	 * A `PageView` is a `PageInfo` on steroids. It provides
	 * things like _content_, _content structure_, and several 
	 * DOM entry points.
	 * 
	 * Note: from a caching standpoint, the `PageInfo` is cached
	 * but the remaining props which separate a `PageView` from
	 * `PageInfo` are all derived from the view that was passed in
	 * (and therefore are not cached).
	 */
	createPageView: createPageView(plugin),

	/**
	 * Creates a `PageInfoBlock` type which builds on the `PageInfo` type but with the benefit of having the following core types of 
	 * information:
	 * 
	 * - the source of the code block
	 * - the code block's HTML container element
	 * - Obsidian's `Component` (which we're probably not taking full advantage of yet)
	 */
	createPageInfoBlock: createPageInfoBlock(plugin),

	/**
	 * Converts a `PageReference` into a `PageInfo` which has
	 * tons of extra meta properties and functions along with 
	 * a `page` property which represents the `DvPage` API surface
	 * for this page.
	 */
	createPageInfo: createPageInfo(plugin),



});
