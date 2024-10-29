import { 
	createFnWithProps, 
	ensureLeading, 
	EscapeFunction, 
	isFunction, 
	TypedFunction 
} from "inferred-types";
import {  listStyle, style } from "../api";
import KindModelPlugin from "../main";
import { 
	BlockQuoteOptions,  
	ListStyle, 
	ObsidianCalloutColors, 
	PageReference, 
	StyleOptions 
} from "../types";
import { blockquote } from "./formatting/blockquote";
import { getPage } from "~/page";

type WrapperCallback = (items: string) => string;

type ListItemsApi<_W extends WrapperCallback> = {
	/** indent the list a level using same OL or UL nomenclature */
	indent: (...items: string[]) => string;
	done: EscapeFunction
};



export const removePound = (tag: string | undefined) => {
	return typeof tag === "string" && tag?.startsWith("#")
		? tag.slice(1)
		: tag
}

const list_items_api = <
	W extends WrapperCallback
>(wrapper: W): ListItemsApi<W> => ({
	indent: (...items: string[]) => renderListItems(wrapper,items),
	done: createFnWithProps(() => "", { escape: true })
});

type ListItemsCallback = <T extends ListItemsApi<WrapperCallback>>(api:T) => unknown;

/** wrap text in `<ol>...</ol>` tags */
const wrap_ol = (items: string, opts?: ListStyle) => `<ol ${listStyle(opts)}>${items}</ol>`

/** wrap text in `<ul>...</ul>` tags */
const wrap_ul = (items: string, opts?: ListStyle) => `<ul ${listStyle(opts)}>${items}</ul>`

/** wraps an ordered or unordered list recursively */
export const renderListItems = (
	wrapper: (items: string, opts?: ListStyle) => string,
	items: readonly (string | ListItemsCallback | undefined )[],
	opts?: ListStyle
) => wrapper(
	items
		.filter(i => i !== undefined)
		.map(i => (
			isFunction(i)
				? isFunction((i as TypedFunction)(list_items_api))
					? ""
					: (i as TypedFunction)(list_items_api)
				: `<li ${style((opts?.li ? isFunction(opts?.li) ? opts.li(i ? i : "") : opts.li : {}))}>${i}</li>`
		) as unknown as string)
		.filter(i => i !== "")
		.join("\n") as string,
	opts
);

const span = (text: string | number, fmt?: StyleOptions) => {
	return `<span ${style(fmt || {fw: "400"})}>${text}</span>`
};
const italics = (text: string | number, fmt?: Omit<StyleOptions, "fs">) => {
	return `<span ${style({...(fmt || { fw: "400"}), fs: "italic" } as StyleOptions)}>${text}</span>`
};

const bold = (text: string, fmt?: Omit<StyleOptions, "fw">) => {
	return `<span ${style({...(fmt || {}), fw: "700" } as StyleOptions)}>${text}</span>`
};

const light = (text: string | number, fmt?: Omit<StyleOptions, "fw">) => {
	return `<span ${style({...(fmt || {}), fw: "300" } as StyleOptions)}>${text}</span>`
};

const thin =(text: string | number, fmt?: Omit<StyleOptions, "fw">) => {
	return `<span ${style({...(fmt || {}), fw: "100" } as StyleOptions)}>${text}</span>`
};
const medium = (text: string | number, fmt?: Omit<StyleOptions, "fw">) => {
	return `<span ${style({...(fmt || {}), fw: "500" } as StyleOptions)}>${text}</span>`
};

const normal = (text: string | number, fmt?: Omit<StyleOptions, "fw">) => {
	return `<span ${style({...(fmt || {}), fw: "400" } as StyleOptions)}>${text}</span>`
}

const emptyCallout = (fmt?: StyleOptions) => [
	`<div class="callout" ${style(fmt)}>`,
	`<div class="callout-title">&nbsp;</div>`,
	`<div class="callout-content">&nbsp;</div>`,
	`</div>`
	].join("\n");


export type LinkOptions = {
	style?: StyleOptions;
	iconUrl?: string;
	svgInline?: string;
	titlePosition?: "top" | "bottom";
}


export const internalLink = (p: KindModelPlugin) => (
	ref: PageReference | undefined, 
	opt?: LinkOptions & {title?: string}
) => {
	const link = (href: string, title: string) => `<a data-tooltip-position="top" aria-label="${href}" data-href="${href}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${href}" style="">${title}</a>`
	let page = getPage(p)(ref);

	if (page) {

		link(page.file.path, opt?.title || page.file.name)
	}

	return ""
};




/**
 * An API to help you generate HTML structures which work well
 * in Obsidian.
 */
export const formattingApi = (p: KindModelPlugin) =>{
	return {

		/** removes the pound symbol from a string */
		removePound,

		/**
		 * returns the HTML for an unordered list
		 */
		ul(items: readonly (string | ListItemsCallback |undefined )[], opts?: ListStyle) {
			return renderListItems(wrap_ul, items.filter(i => i !== undefined), opts);
		},



	
	
		// /**
		//  * **renderToRight**`(text)`
		//  * 
		//  * Takes text/html and renders it to the right.
		//  * 
		//  * Note: use `toRight` just to wrap this text in the appropriate HTML
		//  * to move content to right.
		//  */
		// renderToRight: (text: string) => p.dv.renderValue(
		// 	`<span class="to-right" style="display: flex; flex-direction: row; width: auto;"><span class="spacer" style="display: flex; flex-grow: 1">&nbsp;</span><span class="right-text" style: "display: flex; flex-grow: 0>${text}</span></span>`, 
		// 	container,p, filePath, true
		// ),
	
		toRight: (content: string, fmt?: StyleOptions<{ position: "relative" }>) => {
			const html = [
				`<div class="wrapper-to-right" style="display: relative">`,
				`<span class="block-to-right" style="position: absolute; right: 0">`,
				`<span ${style({...fmt, position: "relative"})}>`,
				content,
				`</span>`,
				`</div>`
			].join("\n")
			return html
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
		wrap: (children: (string|number|undefined)[], fmt?: StyleOptions) => {
			return [
				`<div class="wrapped-content" ${style(fmt || {})}>`,
				...children.filter(i => i !== undefined),
				`</div>`
			].join("\n")
		},


	
		link: (title: string, url: string, opts?: LinkOptions) => {
			return [
				`<a href="${url}" >`,
				...(
					opts?.iconUrl || opts?.svgInline
						? opts?.titlePosition === "top"
							? [
								normal(title),
							]
							: [
								`<span class="grouping" ${style(opts?.style || { alignItems: "center", flex: true })}>`,
								opts?.iconUrl
									? `<img src="${opts.iconUrl}" style="padding-right: 4px">`
									: opts?.svgInline,
								normal(title),
								`</span>`
							]
						: [
							normal(title)
						]
				),
				`</a>`
			].join("\n")
		},


		/**
		 * **as_tag**`(text)`
		 * 
		 * Puts the provided text into a _code block_ and ensures that the
		 * leading character is a `#` symbol.
		 */
		as_tag: (text: string | undefined) => text 
			? `<code class="tag-reference" style="background-color: transparent">${ensureLeading(text, "#")}</code>`
			: "",
	
		inline_codeblock: (text: string) => `<code class="inline-codeblock" style="display: flex; flex-direction: row;">${text}</code>`,
	
	
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
			opts?: BlockQuoteOptions
		) => blockquote(kind,title,opts),


		list: (
			format: StyleOptions,
			...blocks: string[]
		) => {
			const html = [
				`<div class="list-block" style="${style(format)}">`,
				blocks.join("\n\t"),
				`</div>`
			].join("\n")

			return html;
		},

		/** draws a two column table using markdown rather than HTML */
		twoColumnTable: (
			leftHeading: string | undefined,
			rightHeading: string | undefined,
			...data: [left: string, right: string][]
		) => {
			let lines: string[] = [];
			for (const datum of data) {
				const [left, right] = datum;
				lines.push(`| ${left} | ${right}|`)
			}
			if (!leftHeading && !rightHeading) {
				return lines.join("\n") + "\n";
			} else {
				const preamble = `| ${leftHeading} | ${rightHeading} |\n| --- | --- |\n`; 
				return preamble + lines.join("\n") + "\n"
			}
		}
	
		
	}
}


export type FormattingApi = ReturnType<typeof formattingApi>;
