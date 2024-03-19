import KindModelPlugin from "main";
import { TFile } from "obsidian";
import {  Link } from "obsidian-dataview";
import { BasePageContext } from "../types/PageContext";
import { Frontmatter } from "../types/frontmatter";
import { isTFile } from "../utils/type_guards/isTFile";
import { isBasePageContext } from "../utils/type_guards/isBasePageContext";
import { get_page } from "../dv_queries/get_page";
import { DvPage } from "../types/dataview_types";

/**
 * **Page**
 * 
 * The `Page` interface provides a convenient way to interact with
 * a file/page in this plugin.
 */
export interface Page {
	filename: string;
	path: () => string;
	frontmatter: Frontmatter | null;
	blocks: unknown[];
}

/**
 * **ConfiguredPageLoader**
 * 
 * Converts a file path or `TFile` reference into a `Page` API surface.
 */
export type ConfiguredPageLoader = <TFile extends BasePageContext>(file: TFile) => Page

/**
 * **ConfiguredPageCreator**(file, kind, fm, content, options)
 * 
 * Creates a new page in the vault when provided:
 * - a _filename_ (with path), 
 * - the _kind_ of the new file (or `null` for none)
 * - the _frontmatter_ as a dictionary object (or `null` for no frontmatter)
 * - the page's _content_
 */
export type ConfiguredPageCreator = (file: string | TFile) => Page

/**
 * **loadPage**(plugin) -> (file) -> `Page`
 * 
 * Loads a file from the vault into the `Page` API surface.
 */
export type PageLoader = (plugin: KindModelPlugin) => ConfiguredPageLoader;


export type PageCreator = (plugin: KindModelPlugin) => ConfiguredPageCreator;

/**
 * **loadPage**(plugin) -> (file) -> `Page`
 * 
 * Loads a file from the vault into the `Page` API surface.
 */
export const loadPage: PageLoader = (plugin) => (file) => {

	return {
		filename: "",
		path: () => "",
		frontmatter: null,
		blocks: [],
	}
}

export const createPage: PageCreator = (plugin) => (file) =>  {

	return {
		filename: "",
		path: () => "",
		frontmatter: null,
		blocks: []
	}
}

/**
 * Provides the "name" of a page from several data structures.
 */
export const pageName = <T extends string | TFile | BasePageContext>(p: T) => {
	return isBasePageContext(p)
		? p.file.name
		: isTFile(p)
			? p.basename
			: p;
}

/**
 * Provides the "path" of a page from several data structures.
 */
export const pagePath = <T extends string | TFile | BasePageContext>(p: T) => {
	return isBasePageContext(p)
		? p.file.path
		: isTFile(p)
			? p.path
			: p;
}


export const createLink = <T extends string | TFile | BasePageContext>(p: T): Link => {

}


export type GetDataviewPage = (
	plugin: KindModelPlugin
) => (
	file: string | TFile | BasePageContext | DvPage
) => DvPage | null;

/**
 * **getDataviewPage**(plugin) -> (file) -> `DataviewPage`
 * 
 * Given a _string_, `TFile` reference, or a full `BasePageContext`; this 
 * function is responsible to converting it to `DataviewPage` structure.
 */
export const getDataviewPage: GetDataviewPage = (plugin) => (file): DvPage | null => {
	if (isBasePageContext(file)) {
		return { 
			aliases: file.meta.aliases,
				name: file.file.name, 
				link: file.file.link, 
				frontmatter: file.meta.fm, 
				tags: file.meta.tags, 
				etags: file.meta.etags,
				inlinks: file.meta.inlinks,
				outlinks: file.meta.outlinks,
				tasks: file.meta.tasks,
				lists: file.meta.lists,

				cday: file.meta.datetime.cday,
				ctime: file.meta.datetime.ctime,
				mday: file.meta.datetime.mday,
				mtime: file.meta.datetime.mtime,
				
		} as DvPage;
	} else if (isTFile(file)) {
		const page = get_page(plugin)(file);
		return {
			aliases: [],
			file: {
				name: file.basename,
				link: createLink(file),
				frontmatter: {},
				tags: [],
				etags: [],
				mday: new Date(),
				mtime: new Date(),
				cday: new Date(),
				ctime: new Date()
			}
		} as DvPage;
	}  else {
		plugin.error("Call to getDataViewPage got invalid file reference", file);
		return null
	}

}
