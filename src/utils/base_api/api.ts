import { isString } from "inferred-types";
import { Link } from "obsidian-dataview"
import { MarkdownView, TFile } from "obsidian";
import { Page } from "../../helpers/page";
import KindModelPlugin from "../../main";
import { Kind, PageBlock } from "../../types/settings_types";
import { KindPage, KindPage } from "../../types/PageContext";
import { isMarkdownView } from "../../utils/type_guards/isMarkdownView";
import { isTFile } from "../../utils/type_guards/isTFile";
import { DvPage, FileLink } from "../../types/dataview_types";
import { isFileLink } from "../../utils/type_guards/isFileLink";
import { isDataviewPage } from "../../utils/type_guards/isDataviewPage";
import { getBasePageContext } from "../page/getBasePageContext";
import { Tag } from "types/general";

export const api = (plugin: KindModelPlugin) => ({

	/**
	 * **kinds**()
	 * 
	 * Get all the known kinds defined in the vault.
	 */
	kinds: async(): Promise<Kind[]> => {
		return []
	},

	kind_tags: (): Set<Tag> => {
		return plugin.settings.cache?.kind_tags
			? plugin.settings.cache?.kind_tags
			: plugin.error(`Call to kind_tags() prior to cache having this set!`);
	},

	/**
	 * **kind_pages**(kind?)
	 * 
	 * Gets pages which have a "kind" specified to define them.
	 * 
	 * Note: while specifically a **Type**, a **Category**, etc. are
	 * examples of kind_pages they are _not_ returned as part of this
	 * query result. This instead returns pages which _are_ of a particular
	 * "kind".
	 */
	kind_pages: async (kind?: string | Kind<"Kind">): Promise<KindPage[]> => {
		const pages = await plugin._cache["kind_pages"];
		return kind
			? pages.filter(i => i.file.name === kind)
			: pages;
	},

	/**
	 * **types**()
	 * 
	 * Get all the known types defined in the vault.
	 */
	types: (): Kind<"Type">[] => {
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
