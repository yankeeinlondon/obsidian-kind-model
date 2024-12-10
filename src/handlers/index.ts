import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent } from "~/types";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { IconPage } from "./IconPage";
import { Journal } from "./Journal";
import { Kind } from "./Kind";
import { Page } from "./Page";
import { PageEntry } from "./PageEntry";
import { Subcategories } from "./Subcategories";
import { VideoGallery } from "./VideoGallery";

export * from "./createHandler";

export type QueryHandlerContext = [
	source: string,
	container: HTMLElement,
	component: Component & MarkdownPostProcessorContext,
	filePath: string,
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
export function queryHandlers(p: KindModelPlugin) {
  return (ctx: ObsidianCodeblockEvent) => [
    IconPage(p)(ctx),
    BackLinks(p)(ctx),
    Book(p)(ctx),
    Kind(p)(ctx),
    PageEntry(p)(ctx),
    Page(p)(ctx),
    Journal(p)(ctx),
    VideoGallery(p)(ctx),
    Subcategories(p)(ctx),
  ];
}

export {
  BackLinks,
  Book,
  IconPage,
  Journal,
  Kind,
  Page,
  PageEntry,
  VideoGallery,
};
