import type {
  CssColor,
  CssDefinition,
  EscapeFunction,
  FixedLengthArray,
  Length,
  TypedFunction,
  UnionArrayToTuple
} from "inferred-types";
import type KindModelPlugin from "~/main";
import type {
  BlockQuoteOptions,
  ListStyle,
  ObsidianCalloutColors,
  PageReference,
  StyleOptions,
} from "~/types";
import {
  createFnWithProps,
  cssFromDefinition,
  ensureLeading,
  isFunction,
  isString,
} from "inferred-types";
import { getPage } from "~/page";
import { listStyle, style } from "../api";
import { blockquote } from "./formatting/blockquote";

type WrapperCallback = (items: string) => string;

interface ListItemsApi<_W extends WrapperCallback> {
  /** indent the list a level using same OL or UL nomenclature */
  indent: (...items: string[]) => string;
  done: EscapeFunction;
}

export function badge(text: string,	color: CssColor = "gray" as CssColor,	textColor: CssColor = "white" as CssColor) {
  return `<span class="badge" style="background-color: ${color}; padding: 0.25rem; font-size: 10px; border-radius: 8px; text-color: ${textColor}">${text}</span>`;
}

export function removePound(tag: string | undefined) {
  return typeof tag === "string" && tag?.startsWith("#") ? tag.slice(1) : tag;
}

function list_items_api<W extends WrapperCallback>(wrapper: W): ListItemsApi<W> {
  return {
    indent: (...items: string[]) => renderListItems(wrapper, items),
    done: createFnWithProps(() => "", { escape: true }),
  };
}

type ListItemsCallback = <T extends ListItemsApi<WrapperCallback>>(
  api: T,
) => unknown;

/** wrap text in `<ol>...</ol>` tags */
export function wrap_ol(items: string, opts?: ListStyle) {
  return `<ol ${listStyle(opts)}>${items}</ol>`;
}

/** wrap text in `<ul>...</ul>` tags */
export function wrap_ul(items: string, opts?: ListStyle) {
  return `<ul ${listStyle(opts)}>${items}</ul>`;
}

/** wraps an ordered or unordered list recursively */
export function renderListItems(wrapper: (items: string, opts?: ListStyle) => string,	items: readonly (string | ListItemsCallback | undefined)[],	opts?: ListStyle) {
  return wrapper(
    items
      .filter(i => i !== undefined)
      .map(
        i =>
          (isFunction(i)
            ? isFunction((i as TypedFunction)(list_items_api))
              ? ""
              : (i as TypedFunction)(list_items_api)
            : `<li ${style(opts?.li ? (isFunction(opts?.li) ? opts.li(i || "") : opts.li) : {})}>${i}</li>`) as unknown as string,
      )
      .filter(i => i !== "")
      .join("\n") as string,
    opts,
  );
}

function span(text: string | number, fmt?: StyleOptions) {
  return `<span ${style(fmt || { fw: "400" })}>${text}</span>`;
}
function italics(text: string | number, fmt?: Omit<StyleOptions, "fs">) {
  return `<span ${style({ ...(fmt || { fw: "400" }), fs: "italic" } as StyleOptions)}>${text}</span>`;
}

export function italic(text: string | number, fmt?: Omit<StyleOptions, "fs">) {
  return italics(text, fmt);
}

export function bold(text: string, fmt?: Omit<StyleOptions, "fw">) {
  return `<span ${style({ ...(fmt || {}), fw: "700" } as StyleOptions)}>${text}</span>`;
}

export function light(text: string | number,	fmt?: Omit<StyleOptions, "fw">) {
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

function emptyCallout(fmt?: StyleOptions) {
  return [
    `<div class="callout" ${style(fmt)}>`,
    `<div class="callout-title">&nbsp;</div>`,
    `<div class="callout-content">&nbsp;</div>`,
    `</div>`,
  ].join("\n");
}

export interface LinkOptions {
  style?: StyleOptions;
  iconUrl?: string;
  svgInline?: string;
  titlePosition?: "top" | "bottom";
}

export function internalLink(p: KindModelPlugin) {
  return (
    ref: PageReference | undefined,
    opt?: LinkOptions & { title?: string },
  ) => {
    const link = (href: string, title: string) =>
      `<a data-tooltip-position="top" aria-label="${href}" data-href="${href}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${href}" style="">${title}</a>`;
    const page = getPage(p)(ref);

    if (page) {
      link(page.file.path, opt?.title || page.file.name);
    }

    return "";
  };
}

export type Column<T extends string = string> = T | (() => [name: T, style: CssDefinition]);

export type TableData<
	T extends readonly Column[]
> = FixedLengthArray<string, T["length"]>[];

export type HtmlTable<
	T extends readonly Column[]
> = (<TData extends TableData<T>>(data: TData) => string) & {
	kind: "HtmlTable",
	columns: T,
	style: {
		table?: CssDefinition;	
		headings?: CssDefinition;
	}
};

type ToCols<
	T extends readonly Column[]
> = {
	[K in keyof T]: T[K] extends string
		? T[K]
		: T[K] extends () => [infer Name, CssDefinition]
			? Name
			: never;
}


export function htmlTable(p: KindModelPlugin) {
	/**
	 * Provide the columns for an HTML table.
	 * 
	 * - on next call you'll be asked for the data
	 */
	return <
		TCol extends readonly Column<N>[], 
		N extends string
	>(
		columns: TCol, 
		style?: {
			table?: CssDefinition;	
			headings?: CssDefinition;
			highlightFirstColumn?: boolean;
		}
	): HtmlTable<ToCols<UnionArrayToTuple<TCol>>> => {
		const take = (val: string | (() => [string, CssDefinition])) => {
			return isString(val) 
				? { val, style: "" }
				: { val: val()[0], style: cssFromDefinition(val()[1], "", true) }
		}
		
		const fn = <
			TData extends TableData<UnionArrayToTuple<TCol>>
		>(data: TData) => {

			const output = [
				`<table style="${style?.table ? cssFromDefinition(style.table, "", true): ""}">`,
					`<thead>`,
						`<tr>`,
							columns.map(c => `<th scope="col" style="${take(c).style}">${take(c).val}</th>`),
						`</tr>`,
					`</thead>`,
					`<tbody>`,
						data.map(
							(row) => [
								`<tr>`,
									row.map((col,idx) => 
										idx === 0 && style?.highlightFirstColumn
											? `<th scope="row">${col}</th>`
											: `<td>${col}</td>`
									).join("\n"),
								`</tr>`
							]
						).join("\n"),
					`</tbody>`,
				`</table>`
			]

			return output.join("\n")
		}

		const props = {
			kind: "HtmlTable",
			columns,
			style
		}

		return createFnWithProps(fn, props) as unknown as HtmlTable<ToCols<UnionArrayToTuple<TCol>>>;
	}
}

/**
 * An API to help you generate HTML structures which work well
 * in Obsidian.
 */
export function formattingApi(p: KindModelPlugin) {
  return {
    /** removes the pound symbol from a string */
    removePound,

    /**
     * returns the HTML for an unordered list
     */
    ul(
      items: readonly (string | ListItemsCallback | undefined)[],
      opts?: ListStyle,
    ) {
      return renderListItems(
        wrap_ul,
        items.filter(i => i !== undefined),
        opts,
      );
    },

	bulletPoints(...bullets: string[]) {
		return renderListItems(
			wrap_ul,
			bullets.filter(i => i !== undefined).map(i => `<span style="display:inline-flex">${i}</span>`)
		)
	},


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
    internalLink: internalLink(p),

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

    emptyCallout,

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
    as_tag: (text: string | undefined) =>
      text
        ? `<code class="tag-reference" style="background-color: transparent">${ensureLeading(text, "#")}</code>`
        : "",

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

    list: (format: StyleOptions, ...blocks: string[]) => {
      const html = [
        `<div class="list-block" style="${style(format)}">`,
        blocks.join("\n\t"),
        `</div>`,
      ].join("\n");

      return html;
    },

    /** draws a two column table using markdown rather than HTML */
    twoColumnTable: (
      leftHeading: string | undefined,
      rightHeading: string | undefined,
      ...data: [left: string, right: string][]
    ) => {
      const lines: string[] = [];
      for (const datum of data) {
        const [left, right] = datum;
        lines.push(`| ${left} | ${right}|`);
      }
      if (!leftHeading && !rightHeading) {
        return `${lines.join("\n")}\n`;
      }
      else {
        const preamble = `| ${leftHeading} | ${rightHeading} |\n| --- | --- |\n`;
        return `${preamble + lines.join("\n")}\n`;
      }
    },

	/**
	 * **htmlTable**`(columns, [tableCss]) -> (data) -> HTML`
	 * 
	 * higher order function to create an HTML table.
	 * 
	 * - columns can be either a string or a tuple of:
	 * 		- `[ name: string, css: CssDefinition ]`
	 */
	htmlTable: htmlTable(p)
	
  };
}

export type FormattingApi = ReturnType<typeof formattingApi>;
