import KindModelPlugin from "~/main";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { IconPage } from "./IconPage";
import { Kind } from "./Kind";
import { Journal } from "./Journal";
import { PageEntry } from "./PageEntry";
import { VideoGallery } from "./VideoGallery";
import { Page } from "./Page";
import { Subcategories } from "./Subcategories";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { ObsidianCodeblockEvent } from "~/types";

export * from "./createHandler";

export type QueryHandlerContext = [
	source: string,
	container: HTMLElement,
	component: Component & MarkdownPostProcessorContext,
	filePath: string
];


/**
 * **queryHandlers**
 * 
 * a higher order function which produces either a partial application
 * of the query handlers when passed just the plugin as `p` or a 
 * _full application_ when passed both `p` and `ctx` parameters.
 * 
 * ```ts
 * const partial = queryParameter(p);
 * const full = queryParameters(p, {source, container, component, filePath})
 * ```
 */
export const queryHandlers = (
	p: KindModelPlugin
) => (ctx: ObsidianCodeblockEvent) => [
	IconPage(p)(ctx),
	BackLinks(p)(ctx),
	Book(p)(ctx),
	Kind(p)(ctx),
	PageEntry(p)(ctx),
	Page(p)(ctx),
	Journal(p)(ctx),
	VideoGallery(p)(ctx),
	Subcategories(p)(ctx)
];

export { 
	BackLinks,
	Book,
	IconPage,
	Kind,
	Journal,
	PageEntry,
	VideoGallery,
	Page
}
