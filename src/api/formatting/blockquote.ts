import type { BlockQuoteOptions, ObsidianCalloutColors } from "~/types";
import { style } from "~/api";
import {
  BUG_ICON,
  ERROR_ICON,
  EXAMPLE_ICON,
  INFO_ICON,
  NOTE_ICON,
  QUESTION_ICON,
  QUOTE_ICON,
  SUCCESS_ICON,
  SUMMARY_ICON,
  TIP_ICON,
  WARN_ICON,
} from "~/constants";

function obsidian_blockquote(kind: ObsidianCalloutColors,	title: string,	opts?: BlockQuoteOptions) {
  return [
    `<div data-callout-metadata="" data-callout-fold="${opts?.fold || ""}" data-callout="${kind}" class="callout" ${style(opts?.style || {})}>`,
    `<div class="callout-title" style="gap:15px; align-items: center">`,
    ...(
      opts?.icon
        ? [`<div class="callout-icon">${opts?.icon}</div>`]
        : []
    ),
    `<div class="callout-title-inner" style="display: flex; flex-direction: row;">${title}</div>`,
    ...(
      opts?.toRight
        ? [
            `<div class="callout-title-right" style="display: flex; flex-grow: 1; justify-content: right">${opts.toRight}</div>`,
          ]
        : []
    ),
    `</div>`,
    ...(
      opts?.content
        ? typeof opts.content === "string"
          ? [
              `<div class="callout-content" ${style(opts.contentStyle || {})}>`,
              `<p>${opts.content}</p>`,
              `</div>`,
            ]
          : [
              `<div class="callout-content" style="display: flex; flex-direction: column; space-between: 4px;">`,
              ...opts.content.map(c => `<div class="content-element" ${style({ flex: true, ...(opts.contentStyle || {}) })}>${c}</div>`),
              `</div>`,
            ]
        : []
    ),

    ...(
      opts?.belowTheFold
        ? [`<div class="below-the-fold" ${style(opts?.belowTheFoldStyle || {})}>${opts?.belowTheFold}</div>`]
        : [""]
    ),
    `</div>`,
  ].filter(i => i).join("\n");
}

/**
 * **blockquote**`(kind, title, opts)`
 *
 * Generates the HTML necessary to show a callout/blockquote in Obsidian.
 */
export function blockquote(kind: ObsidianCalloutColors,	title: string,	opts?: BlockQuoteOptions) {
  const iconLookup: Record<ObsidianCalloutColors, string> = {
    warning: WARN_ICON,
    quote: QUOTE_ICON,
    info: INFO_ICON,
    tip: TIP_ICON,
    summary: SUMMARY_ICON,
    bug: BUG_ICON,
    example: EXAMPLE_ICON,
    question: QUESTION_ICON,
    success: SUCCESS_ICON,
    error: ERROR_ICON,
    note: NOTE_ICON,
  };

  return obsidian_blockquote(
    kind,
    title,
    opts?.icon && opts.icon in iconLookup
      ? { ...opts, icon: iconLookup[opts.icon as keyof typeof iconLookup] }
      : opts,
  );
}
