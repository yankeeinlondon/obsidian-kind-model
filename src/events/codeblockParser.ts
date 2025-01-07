import type { BaseKindError } from "@yankeeinlondon/kind-error";
import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent } from "~/types";

import type { Link } from "~/types/dataview_types";
import { isKindError } from "@yankeeinlondon/kind-error";
import { isObject } from "inferred-types";
import { renderApi } from "~/api";
import { ERROR_ICON } from "~/constants";
import { isError } from "~/type-guards";

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
		  const err = outcomes.find(i => isError(i[1])) as Error | undefined;

		  const render = renderApi(p)(el, ctx.sourcePath);
		  const { format } = p.api;

		  if (err) {
		    if (isKindError(err)) {
		      p.warn(...((err as BaseKindError)?.asBrowserMessages() || []));
		    }

		    render.callout(
		      "error",
		      `<div style="display:flex; flex-direction: row"><span style="display: flex">Error running </span>&nbsp;${format.inline_codeblock("km")}&nbsp;<span style="display: flex">Query</span></div>`,
		      {
		        content: [
		          `Problems parsing parameters passed into the&nbsp;${format.bold(`${source}`)}&nbsp;${format.inline_codeblock("km")}&nbsp;<span style="display: flex">query.`,
		          `<span><b>Error:</b> ${err?.message || String(err)}</span>`,
		        ],
		        icon: ERROR_ICON,
		        toRight: format.inline_codeblock(`${source?.trim() || ""} `),
		      },
		    );

		    // p.error(err);
		  }
		  else {
		    render.callout(
		      "error",
		      `The KM query "${source}" is not recognized!`,
		    );
		  }
		}
  };
  // register callback
  const registration = p.registerMarkdownCodeBlockProcessor(
    "km",
    callback,
  );
  registration.sortOrder = -100;
}
