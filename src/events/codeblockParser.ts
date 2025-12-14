import type { BaseKindError } from "@yankeeinlondon/kind-error";
import type { Component, MarkdownPostProcessorContext } from "obsidian";
import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent } from "~/types";

import type { Link } from "~/types/dataview_types";
import { isKindError } from "@yankeeinlondon/kind-error";
import { isObject } from "inferred-types";
import { Notice } from "obsidian";
import { renderApi } from "~/api";
import { ERROR_ICON } from "~/constants";
import { isError } from "~/type-guards";
import { getKmBlockTracker } from "./km-block-refresh";

export function isPageLink(v: unknown): v is Link {
  return !!(isObject(v) && "file" in v && isObject(v.file) && "path" in v.file);
}

/**
 * Register a KM block for auto-refresh when its host file changes.
 * Creates a re-render callback that processes handlers fresh each time.
 */
function registerForAutoRefresh(
  p: KindModelPlugin,
  filepath: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext & Component,
  source: string,
): void {
  const tracker = getKmBlockTracker(p);
  if (!tracker) {
    return;
  }

  // Create a refresh callback that re-processes handlers
  const refreshCallback = async (
    src: string,
    element: HTMLElement,
    context: MarkdownPostProcessorContext & Component,
  ) => {
    // Re-process handlers with fresh data
    const event: ObsidianCodeblockEvent = { source: src, el: element, ctx: context };
    const handlers = p.api.queryHandlers(event);

    type Outcome = [handler: string, status: boolean | Error];
    const outcomes: Outcome[] = [];

    for (const h of handlers) {
      const outcome = await h();
      outcomes.push([h.handlerName, outcome]);
    }

    handleOutcomes(p, src, element, context, outcomes);
  };

  tracker.register(filepath, {
    el,
    ctx,
    source,
    callback: refreshCallback,
  });
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
  /**
   * Process the km codeblock handlers
   */
  const processHandlers = async (
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext & Component,
  ) => {
    const event: ObsidianCodeblockEvent = { source, el, ctx };
    const handlers = p.api.queryHandlers(event);

    type Outcome = [handler: string, status: boolean | Error];
    const outcomes: Outcome[] = [];

    for (const h of handlers) {
      const outcome = await h();
      const handler = h.handlerName;
      outcomes.push([handler, outcome]);
    }

    return outcomes;
  };

  const callback = async (
    source: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext & Component,
  ) => {
    el.style.overflowX = "auto";

    // If Dataview isn't ready yet, defer processing until it is
    if (p.dvStatus !== "ready") {
      // Show loading indicator
      const loadingEl = el.createDiv({ cls: "km-loading" });
      loadingEl.innerHTML = `<span style="opacity: 0.6; font-style: italic;">Loading...</span>`;

      // Defer until Dataview is ready
      p.deferUntilDataviewReady(async () => {
        // Clear loading indicator
        el.empty();
        el.style.overflowX = "auto";

        // Process handlers now that Dataview is ready
        const outcomes = await processHandlers(source, el, ctx);
        handleOutcomes(p, source, el, ctx, outcomes);

        // Register for auto-refresh
        registerForAutoRefresh(p, ctx.sourcePath, el, ctx, source);
      });

      return;
    }

    // Dataview is ready, process immediately
    const outcomes = await processHandlers(source, el, ctx);
    handleOutcomes(p, source, el, ctx, outcomes);

    // Register for auto-refresh
    registerForAutoRefresh(p, ctx.sourcePath, el, ctx, source);
  };

  // register callback
  const registration = p.registerMarkdownCodeBlockProcessor(
    "km",
    callback,
  );
  registration.sortOrder = -100;
}

type Outcome = [handler: string, status: boolean | Error];

/**
 * Handle the outcomes from processing km codeblock handlers
 */
function handleOutcomes(
  p: KindModelPlugin,
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext & Component,
  outcomes: Outcome[],
) {
  p.info(`code block processed against handlers`, outcomes.reduce(
    (acc, i) => ({
      ...acc,
      [i[0] as string]: i[1],
    }),
    {},
  ));

  if (!outcomes.some(i => i[1] === true)) {
    const errorOutcome = outcomes.find(i => isError(i[1]));
    const err = errorOutcome?.[1] as Error | undefined;
    const handlerName = errorOutcome?.[0] || "unknown";

    const render = renderApi(p)(el, ctx.sourcePath);
    const { format } = p.api;

    if (err) {
      // Use KindError's browser messages if available
      if (isKindError(err)) {
        p.warn(...((err as BaseKindError)?.asBrowserMessages() || []));
      }

      // Check if debug mode is enabled via log level
      const isDebugMode = p.settings.log_level === "debug";

      // Build enhanced error content with context
      const errorContent = [
        `<b>Handler:</b> ${format.inline_codeblock(handlerName)}`,
        `<b>Query:</b> ${format.inline_codeblock(source?.trim() || "")}`,
        `<b>Error:</b> ${err?.message || String(err)}`,
        isDebugMode && err?.stack
          ? `<details><summary>Stack Trace</summary><pre>${err.stack}</pre></details>`
          : null,
      ].filter(Boolean) as string[];

      render.callout(
        "error",
        `Error in ${format.inline_codeblock("km")} handler`,
        {
          content: errorContent,
          icon: ERROR_ICON,
        },
      );

      // Show Notice for critical errors to ensure visibility
      new Notice(`Kind Model: Error in ${handlerName} handler. Check the document for details.`, 5000);
    }
    else {
      render.callout(
        "error",
        `The KM query "${source}" is not recognized!`,
        {
          icon: ERROR_ICON,
        },
      );

      // Show Notice for unrecognized handlers
      new Notice(`Kind Model: Unknown query handler "${source}"`, 4000);
    }
  }
}
