import { listStyle, style } from "api";



import { 
	createFnWithProps, 
	ensureLeading, 
	EscapeFunction, 
	isFunction, 
	TypedFunction 
} from "inferred-types";
import KindModelPlugin from "main";
import { BlockQuoteOptions, DvPage, Link, ListStyle, ObsidianCalloutColors, StyleOptions } from "types";
import { isDvPage, isLink } from "type-guards";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { blockquote } from "./formatting/blockquote";

type WrapperCallback = (items: string) => string;

type ListItemsApi<_W extends WrapperCallback> = {
	/** indent the list a level using same OL or UL nomenclature */
	indent: (...items: string[]) => string;
	done: EscapeFunction
};


const list_items_api = <
	W extends WrapperCallback
>(wrapper: W): ListItemsApi<W> => ({
	indent: (...items: string[]) => render_list_items(wrapper,items),
	done: createFnWithProps(() => "", { escape: true })
});

type ListItemsCallback = <T extends ListItemsApi<WrapperCallback>>(api:T) => unknown;

/** wrap text in `<ol>...</ol>` tags */
const wrap_ol = (items: string, opts?: ListStyle) => `<ol ${listStyle(opts)}>${items}</ol>`

/** wrap text in `<ul>...</ul>` tags */
const wrap_ul = (items: string, opts?: ListStyle) => `<ul ${listStyle(opts)}>${items}</ul>`

/** wraps an ordered or unordered list recursively */
const render_list_items = (
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


export type LinkOptions = {
	style?: StyleOptions;
	iconUrl?: string;
	svgInline?: string;
	titlePosition?: "top" | "bottom";
}


/**
 * An API to help you generate HTML structures which work well
 * in Obsidian.
 */
export const formattingApi = (p: KindModelPlugin) =>{
	return {
		// async ul(...items: readonly (string | ListItemsCallback)[]) {
		
		// 	return p.dv.renderValue(
		// 		render_list_items(wrap_ul, items), 
		// 		container, p, filePath, false
		// 	);
		// },
	

	
		/**
		 * returns the HTML for an unordered list
		 */
		ul(items: readonly (string | ListItemsCallback |undefined )[], opts?: ListStyle) {
			return render_list_items(wrap_ul, items.filter(i => i !== undefined), opts);
		},


		// async ol(...items: readonly (string | ListItemsCallback)[]) {
			
			
		// 	return p.dv.renderValue(
		// 		render_list_items(wrap_ol, items), 
		// 		container, p, filePath, false
		// 	);
		// },
		
		// code: (code: string) => p.dv.renderValue(
		// 	`<code>${code}</code>`, 
		// 	container,p, filePath, true
		// ),
	
	
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
		internalLink: (ref: DvPage | Link, opt?: LinkOptions & {title?: string}) => {
			const link = (href: string, title: string) => `<a data-tooltip-position="top" aria-label="${href}" data-href="${href}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${href}" style="">${title}</a>`
	
			return isDvPage(ref) 
				? link(ref.file.path, opt?.title || ref.file.name)
				: isLink(ref)
					? link(ref.path , opt?.title || ref?.hover || "link" )
					: ""
	
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
		as_tag: (text: string) => `<code class="tag-reference">${ensureLeading(text, "#")}</code>`,
	
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
	
		// /**
		//  * **callout**`(kind, title, opts)`
		//  * 
		//  * Renders a callout to the current block.
		//  * 
		//  * **Note:** use `blockquote` for same functionality but 
		//  * with HTML returned rather than _rendered_.
		//  */
		// callout: (kind: ObsidianCalloutColors, title: string, opts?: BlockQuoteOptions) => 
		// 	p.dv.renderValue(
		// 		blockquote(kind,title,opts), 
		// 		container,p, filePath, false
		// 	),
	
	}
}
