import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent } from "~/types";
import { Accounts } from "./Accounts";
import { BackLinks } from "./BackLinks";
import { Book } from "./Book";
import { Children } from "./Children";
import { Debug } from "./Debug";
import { IconPage } from "./IconPage";
import { Journal } from "./Journal";
import { Kind } from "./Kind";
import { PageEntry } from "./PageEntry";
import { Tasks } from "./Tasks";
import { VideoGallery } from "./VideoGallery";

export * from "./createHandler";

export type QueryHandlerContext = [
  source: string,
  container: HTMLElement,
  component: Component & MarkdownPostProcessorContext,
  filePath: string,
];

/**
 * **queryHandlers**`(p)`
 *
 * A higher order function which produces either a partial application
 * of the query handlers when passed just the plugin as `p` or a
 * _full application_ when passed both `p` and `ctx` parameters.
 *
 * ```ts
 * const partial = queryParameter(p);
 * const full = queryParameters(p, {source, container, component, filePath});
 * ```
 */
export function queryHandlers(p: KindModelPlugin) {
  return (ctx: ObsidianCodeblockEvent) => ([
    IconPage(p)(ctx),
    Children(p)(ctx),
    BackLinks(p)(ctx),
    Accounts(p)(ctx),
    Book(p)(ctx),
    Kind(p)(ctx),
    PageEntry(p)(ctx),
    Debug(p)(ctx),
    Tasks(p)(ctx),
    Journal(p)(ctx),
    VideoGallery(p)(ctx),
  ]);
}

export {
	Accounts,
	BackLinks,
	Book,
	Children,
	Debug, IconPage,
	Journal,
	Kind,
	PageEntry,
	Tasks,
	VideoGallery
};

