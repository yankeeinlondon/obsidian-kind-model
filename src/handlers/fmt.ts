import type KindModelPlugin from "../main";
import type { ObsidianCalloutColors } from "../types/ObsidianCallouts";
import type {
  BlockQuoteOptions,
  DvPage,
  Link,
  ListItemsCallback,
  ListStyle,
  StyleOptions,
} from "~/types";
import { ensureLeading } from "inferred-types";
import { renderListItems, style } from "~/api";
import { isDvPage, isLink } from "~/type-guards";
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
} from "../constants/obsidian-constants";

function obsidian_blockquote(kind: ObsidianCalloutColors,	title: string,	opts?: BlockQuoteOptions) {
  return [
    `<div data-callout-metadata="" data-callout-fold="${opts?.fold || ""}" data-callout="${kind}" class="callout" ${style(opts?.style || {})}>`,
    `<div class="callout-title" style="gap:15px; align-items: center">`,
    ...(opts?.icon
      ? [`<div class="callout-icon">${opts?.icon}</div>`]
      : []),
    `<div class="callout-title-inner" style="display: flex; flex-direction: row;">${title}</div>`,
    ...(opts?.toRight
      ? [
          `<div class="callout-title-right" style="display: flex; flex-grow: 1; justify-content: right">${opts.toRight}</div>`,
        ]
      : []),
    `</div>`,
    ...(opts?.content
      ? typeof opts.content === "string"
        ? [
            `<div class="callout-content" ${style(opts.contentStyle || {})}>`,
            `<p>${opts.content}</p>`,
            `</div>`,
          ]
        : [
            `<div class="callout-content" style="display: flex; flex-direction: column; space-between: 4px;">`,
            ...opts.content.map(
              c =>
                `<div class="content-element" ${style({ flex: true, ...(opts.contentStyle || {}) })}>${c}</div>`,
            ),
            `</div>`,
          ]
      : []),

    ...(opts?.belowTheFold
      ? [
          `<div class="below-the-fold" ${style(opts?.belowTheFoldStyle || {})}>${opts?.belowTheFold}</div>`,
        ]
      : [""]),
    `</div>`,
  ]
    .filter(i => i)
    .join("\n");
}

function empty_callout(fmt?: StyleOptions) {
  return [
    `<div class="callout" ${style(fmt)}>`,
    `<div class="callout-title">&nbsp;</div>`,
    `<div class="callout-content">&nbsp;</div>`,
    `</div>`,
  ].join("\n");
}

/**
 * **blockquote**`(kind, title, opts)`
 *
 * Generates the HTML necessary to show a callout/blockquote in Obsidian.
 */
function blockquote(kind: ObsidianCalloutColors,	title: string,	opts?: BlockQuoteOptions) {
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
      ? {
          ...opts,
          icon: iconLookup[opts.icon as keyof typeof iconLookup],
        }
      : opts,
  );
}

function span(text: string | number, fmt?: StyleOptions) {
  return `<span ${style(fmt || { fw: "400" })}>${text}</span>`;
}
function italics(text: string | number, fmt?: Omit<StyleOptions, "fs">) {
  return `<span ${style({ ...(fmt || { fw: "400" }), fs: "italic" } as StyleOptions)}>${text}</span>`;
}

function bold(text: string, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "700" } as StyleOptions)}>${text}</span>`;
}

function light(text: string | number, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "300" } as StyleOptions)}>${text}</span>`;
}

function thin(text: string | number, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "100" } as StyleOptions)}>${text}</span>`;
}
function medium(text: string | number, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "500" } as StyleOptions)}>${text}</span>`;
}

function normal(text: string | number, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "400" } as StyleOptions)}>${text}</span>`;
}

export interface LinkOptions {
  style?: StyleOptions;
  iconUrl?: string;
  svgInline?: string;
  titlePosition?: "top" | "bottom";
}

/**
 * **fmt**
 *
 * A set of formatting functions which are provide to `dv_page` or other
 * interfaces to render to a page.
 */
export function fmt(p: KindModelPlugin) {
  return (container: HTMLElement, filePath: string) => ({
    async ul(...items: readonly (string | ListItemsCallback)[]) {
      return p.dv.renderValue(
        renderListItems(wrap_ul, items),
        container,
        p,
        filePath,
        false,
      );
    },

    /**
     * Uses the underlying `renderValue()` functionality exposed by
     * dataview to render data to the page.
     */
    async render(data: unknown): Promise<void> {
      await p.dv.renderValue(data, container, p, filePath, false);
    },

    /**
     * returns the HTML for an unordered list but doesn't render
     */
    html_ul(
      items: readonly (string | ListItemsCallback | undefined)[],
      opts?: ListStyle,
    ) {
      return renderListItems(
        wrap_ul,
        items.filter(i => i !== undefined),
        opts,
      );
    },
    async ol(...items: readonly (string | ListItemsCallback)[]) {
      return p.dv.renderValue(
        renderListItems(wrap_ol, items),
        container,
        p,
        filePath,
        false,
      );
    },

    code: (code: string) =>
      p.dv.renderValue(
        `<code>${code}</code>`,
        container,
        p,
        filePath,
        true,
      ),

    /**
     * **renderToRight**`(text)`
     *
     * Takes text/html and renders it to the right.
     *
     * Note: use `toRight` just to wrap this text in the appropriate HTML
     * to move content to right.
     */
    renderToRight: (text: string) =>
      p.dv.renderValue(
        `<span class="to-right" style="display: flex; flex-direction: row; width: auto;"><span class="spacer" style="display: flex; flex-grow: 1">&nbsp;</span><span class="right-text" style: "display: flex; flex-grow: 0>${text}</span></span>`,
        container,
        p,
        filePath,
        true,
      ),

    toRight: (
      content: string,
      fmt?: StyleOptions<{ position: "relative" }>,
    ) => {
      const html = [
        `<div class="wrapper-to-right" style="display: relative">`,
        `<span class="block-to-right" style="position: absolute; right: 0">`,
        `<span ${style({ ...fmt, position: "relative" })}>`,
        content,
        `</span>`,
        `</div>`,
      ].join("\n");
      return html;
    },

    /**
     * Adds an HTML link tag `<a></a>` to an internal resource in the vault.
     *
     * Note: for external links use the `link` helper instead as the generated link
     * here provides the reference as meta-data other then the traditional `href`
     * property.
     */
    internalLink: (
      ref: DvPage | Link,
      opt?: LinkOptions & { title?: string },
    ) => {
      const link = (href: string, title: string) =>
        `<a data-tooltip-position="top" aria-label="${href}" data-href="${href}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${href}" style="">${title}</a>`;

      return isDvPage(ref)
        ? link(ref.file.path, opt?.title || ref.file.name)
        : isLink(ref)
          ? link(ref.path, opt?.title || ref?.hover || "link")
          : "";
    },

    /**
     * Add a span element with optional formatting
     */
    span,
    italics,
    bold,
    light,
    thin,
    medium,
    normal,

    /**
     * Wrap children items with DIV element; gain formatting control for block
     */
    wrap: (
      children: (string | number | undefined)[],
      fmt?: StyleOptions,
    ) => {
      return [
        `<div class="wrapped-content" ${style(fmt || {})}>`,
        ...children.filter(i => i !== undefined),
        `</div>`,
      ].join("\n");
    },

    link: (title: string, url: string, opts?: LinkOptions) => {
      return [
        `<a href="${url}" >`,
        ...(opts?.iconUrl || opts?.svgInline
          ? opts?.titlePosition === "top"
            ? [normal(title)]
            : [
                `<span class="grouping" ${style(opts?.style || { alignItems: "center", flex: true })}>`,
                opts?.iconUrl
                  ? `<img src="${opts.iconUrl}" style="padding-right: 4px">`
                  : opts?.svgInline,
                normal(title),
                `</span>`,
              ]
          : [normal(title)]),
        `</a>`,
      ].join("\n");
    },

    /**
     * **as_tag**`(text)`
     *
     * Puts the provided text into a _code block_ and ensures that the
     * leading character is a `#` symbol.
     */
    as_tag: (text: string) =>
      `<code class="tag-reference">${ensureLeading(text, "#")}</code>`,

    inline_codeblock: (text: string) =>
      `<code class="inline-codeblock" style="display: flex; flex-direction: row;">${text}</code>`,

    /**
     * **blockquote**`(kind, title, opts)`
     *
     * Produces the HTML for a callout.
     *
     * **Note:** use `callout` for same functionality but
     * with HTML _rendered_ rather than _returned_.
     */
    blockquote: (
      kind: ObsidianCalloutColors,
      title: string,
      opts?: BlockQuoteOptions,
    ) => blockquote(kind, title, opts),

    /**
     * **callout**`(kind, title, opts)`
     *
     * Renders a callout to the current block.
     *
     * **Note:** use `blockquote` for same functionality but
     * with HTML returned rather than _rendered_.
     */
    callout: (
      kind: ObsidianCalloutColors,
      title: string,
      opts?: BlockQuoteOptions,
    ) =>
      p.dv.renderValue(
        blockquote(kind, title, opts),
        container,
        p,
        filePath,
        false,
      ),

    empty_callout,
  });
}

/**
 * **Fmt**
 *
 * A formatting API surface to more quickly produce page output in Obsidian.
 */
export type Fmt = ReturnType<ReturnType<typeof fmt>>;
