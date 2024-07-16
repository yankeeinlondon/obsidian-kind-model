import { isString } from "inferred-types";
import { MarkdownView, TFile } from "obsidian";
import KindModelPlugin from "../../main";
import { Kind, PageBlock } from "../../types/settings_types";
import { isMarkdownView } from "../../utils/type_guards/isMarkdownView";
import { isTFile } from "../../utils/type_guards/isTFile";
import { DvPage, FileLink, Link } from "../../types/dataview_types";
import { isFileLink } from "../../utils/type_guards/isFileLink";
import { isDataviewPage } from "../../utils/type_guards/isDataviewPage";
import { getBasePageContext } from "../page/getBasePageContext";
import { Tag } from "../../types/general";
import { dv_page } from "../../dv_queries/dv_page";
import { back_links } from "../../dv_queries/back_links";
import { page_entry } from "../../dv_queries/page_entry";
import { book } from "../../dv_queries/book";
import { kind_table } from "../../dv_queries/kind_table";
import { video_gallery } from "../../dv_queries/video_gallery";

export const api = (plugin: KindModelPlugin) => ({
	/**
	 * Get the `dv_page` helper utility to build a Dataview query
	 * for a given page.
	 */
	dv_page: dv_page(plugin),

	/**
	 * Service a `km` code block with a back links section
	 */
	back_links: back_links(plugin),

	/**
	 * Service a `km` code block with entry content for a page
	 */
	page_entry: page_entry(plugin),

	/**
	 * Produces a nice book summary widget on a page with book metadata
	 */
	book: book(plugin),

	/**
	 * Produces a table summary of all pages of a particular kind
	 */
	kind_table: kind_table(plugin),

	/**
	 * Produces a video 
	 */
	video_gallery: video_gallery(plugin),


	/**
	 * **kinds**()
	 * 
	 * Get all the defined _kinds_ in vault as a 
	 */
	kinds: async(): Promise<Kind[]> => {
		return []
	},

	/**
	 * **kind_tags**
	 */
	kind_tags: (): Set<Tag> => {
		return plugin.settings.cache?.kind_tags
			? plugin.settings.cache?.kind_tags
			: plugin.error(`Call to kind_tags() prior to cache having this set!`);
	},

	/**
	 * **types**()
	 * 
	 * Get all the known types defined in the vault.
	 */
	types: async(): Promise<Kind<"Type">[]> => {
		return [];
	},

	/**
	 * **categories**(for?: string)
	 * 
	 * Returns an array of categories in the vault (all by default, but filtered
	 * down to just those for a particular Kind if specified)
	 */
	categories: (kind?: string | Kind): Kind<"Category">[] => {
		return [];
	},

	/**
	 * **subcategories**(for?: string)
	 * 
	 * Returns an array of subcategories in the vault (all by default, but filtered
	 * down to just those for a particular category if specified)
	 */
	subcategories: async (category?: string | Kind): Promise<Kind<"Subcategory">[]> => {
		const sub = await plugin._cache["subcategories"];
		const name = isString(category) ? category : category?.name;
		return category
			? sub.filter(i => i.name === name)
			: sub;
	},

	/**
	 * **page_blocks**()
	 * 
	 * Returns a list of page blocks defined in the vault.
	 */
	page_blocks: (): PageBlock[] => {
		return [];
	},

	/**
	 * **icon_sets**()
	 * 
	 * Provides a list of pages in the vault which are designated as "icon sets"
	 */
	icon_sets: () => {
		return []; 
	},

	/**
	 * **get_dv_page(...)**
	 * 
	 * Get a Dataview's conception of a "page". The input provided can be 
	 * any one of a of page reference variants and the end result is a `DvPage`
	 * interface.
	 * 
	 * **Note:** this uses Dataview to get the page (ignoring the Kind cache)
	 */
	get_dv_page: (page: TFile | FileLink | string | MarkdownView | DvPage): DvPage | null => {
		if (isDataviewPage(page)) {
			return page;
		} else {
			const dataview_page = isTFile(page)
				? plugin.dv.page(page.path)
				: isFileLink(page)
					? plugin.dv.page(page.path)
					: isMarkdownView(page) && typeof page.file === "string"
						? plugin.dv.page(page.file)
						: isMarkdownView(page) && isTFile(page.file)
						? plugin.dv.page(page.file.path)
						: isString(page)
							? plugin.dv.page(page)
							: null;
	
			return isDataviewPage(dataview_page) ? dataview_page : null;
		}
	},

	/**
	 * **get_kinded_page**(page, _view_)
	 * 
	 * Get's a `KindedView` structure 
	 */
	get_kinded_page: (
		page: TFile | FileLink | string | MarkdownView | DvPage
	): KindPage | null => {
		const context = getBasePageContext(plugin, page);

		return null;
	},

	/**
	 * **create_link**(text, path)
	 * 
	 * Utility which converts the provided _text_ into a link to another page
	 * in the vault.
	 */
	create_link: (text: string, path: string | Kind, hover?: string): Link => {

	},

	/**
	 * **create_link_ext**(text, uri, _hover_)
	 * 
	 * Utility to create a link external to this vault
	 */
	create_link_ext: (text: string, uri: string, hover?: string): string => {
		return ""
	},

	set_page_icon: (page: string | Kind | Page, icon: string ): void => {
		// 
	},


});
