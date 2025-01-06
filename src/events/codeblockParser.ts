import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent } from "~/types";
import type { Link } from "~/types/dataview_types";

import { isObject } from "inferred-types";
import { isError } from "~/type-guards";
import { createPageView } from "~/page/createPageView";
import { renderApi } from "~/api";
import { ERROR_ICON } from "~/constants";
import { isKindError } from "@yankeeinlondon/kind-error";

export function isPageLink(v: unknown): v is Link {
	return !!(isObject(v) && "file" in v && isObject(v.file) && "path" in v.file);
}

/**
 * **codeblockParser**`(p) => void`
 *
 * Registers a handler with Obsidian to handle the `km` codeblock language.
 *
 * - it parses blocks and hands off responsibility to the appropriate handler
 * - if no handler is found, an error is raised in the UI
 */
export function codeblockParser(p: KindModelPlugin) {
	const callback = async (
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext & Component,
	) => {
		el.style.overflowX = "auto";

		const event: ObsidianCodeblockEvent = { source, el, ctx };
		const handlers = p.api.queryHandlers(event);

		type Outcome = [handler: string, status: boolean | Error];
		const outcomes: Outcome[] = [];

		for (const h of handlers) {
			const outcome = await h();
			const handler = h.handlerName;
			outcomes.push([handler, outcome]);
		}

		p.info(`code block processed against handlers`, outcomes.reduce(
			(acc, i) => ({
				...acc,
				[i[0] as string]: i[1],
			}),
			{},
		));

		if (!outcomes.some(i => i[1] === true)) {
			// no handlers attempted to handle the event payload
			const handlerNames = outcomes.map((i) => i[0]);
			const err = outcomes.find((i) => isError(i[1])) as Error | undefined;

			const render = renderApi(p)(el, ctx.sourcePath);
			const { format } = p.api;

			if (err) {
				render.callout(
					"error",
					`<div style="display:flex; flex-direction: row"><span style="display: flex">Error running </span>&nbsp;${format.inline_codeblock("km")}&nbsp;<span style="display: flex">Query</span></div>`,
					{
						content: [
							`Problems parsing parameters passed into the&nbsp;${format.bold(`${source}`)}&nbsp;${format.inline_codeblock("km")}&nbsp;<span style="display: flex">query.`,
							`<span><b>Error:</b> ${err?.message || String(err)}</span>`
						],
						icon: ERROR_ICON,
						toRight: format.inline_codeblock(`${source?.trim() || ""} `)
					}
				);
				if(isKindError(err)) {
					p.warn(...(err?.asBrowserMessages() || []))

				}
				// p.error(err);
			} else {

				render.callout(
					"error",
					`The KM query "${source}" is not recognized!`
				)
			}

		}
	}
	// register callback
	const registration = p.registerMarkdownCodeBlockProcessor(
		"km", 
		callback
	);
	registration.sortOrder = -100;

}
