import { 
	Api, 
	EmptyObject, 
	EscapeFunction, 
	If, 
	IsEqual, 
	Keys, 
	TypedFunction, 
	createFnWithProps, 
	ensureLeading, 
	isFunction 
} from "inferred-types";
import KindModelPlugin from "../main";
import { ObsidianCalloutColors, ObsidianFoldOptions } from "../types/ObsidianCallouts";
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
	WARN_ICON 
} from "../constants/obsidian-constants";
import { isDvPage } from "../utils/type_guards/isDvPage";
import { DvPage, Link } from "../types/dataview_types";
import { isLink } from "../utils/type_guards/isFileLink";
import { CssDisplay, CssPosition } from "../types/css";

type WrapperCallback = (items: string) => string;

type ListItemsApi<_W extends WrapperCallback> = {
	/** indent the list a level using same OL or UL nomenclature */
	indent: (...items: string[]) => string;
	done: EscapeFunction
};

type Gap = `${number}px` | `${number}em` | `${number}rem` | `${number}%` | `calc(${string})`;

export type CssCursor = "help" | "wait" | "crosshair" | "zoom-in" | "grab" | "auto" | "default" | "none" | "context-menu" | "pointer" | "progress" | "cell" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "grabbing" | "all-scroll" | "col-resize" | "row-resize" | "n-resize" |  "e-resize" | "s-resize" | "w-resize" | "ne-resize" | "nw-resize" | "se-resize" | "sw-resize" | "eq-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "zoom-in" | "zoom-out";

type UserStyleOptions = {
	/** padding for top,bottom,left, and right */
	p?: string;
	/** padding top */
	pt?: string;
	/** padding bottom */
	pb?: string;
	/** pad left */
	pl?: string;
	/** pad right */
	pr?: string;
	/** padding top and bottom */
	py?: string;
	/** padding left and right */
	px?: string;

	/** margin applied to all sides */
	m?: string;
	/** margin to left and right */
	mx?: string;
	/** margin to top and bottom */
	my?: string; 
	/** margin top */
	mt?: string;
	/** margin bottom */
	mb?: string;	
	/** margin left */
	ml?: string;
	/** margin right */
	mr?: string;

	/**
	 * text size
	 */
	ts?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | `${number}rem` | `${number}rem`

	/** width */
	w?: string;
	/**
	 * font weight
	 */
	fw?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
	/** font style */
	fs?: "italic" | "none" | "oblique" | `oblique ${number}deg` | "unset" | "inherit" | "revert" | "revert-layer";

	flex?: boolean;
	display?: CssDisplay;
	direction?: "row" | "column";
	grow?: number;

	/**
	 * [alignItems](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-items)
	 * 
	 * This defines the default behavior for how flex items are laid out along 
	 * the cross axis on the current line. Think of it as the justify-content 
	 * version for the cross-axis (perpendicular to the main-axis).
	 */
	alignItems?: "center" | "baseline" | "start" | "end" | "revert" | "stretch";

	/**
	 * [alignContent](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-content)
	 * 
	 * aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.
	 */
	alignContent?: "normal" | "start" | "end" | "center" | "space-between" | "space-around" | "space-evenly" | "stretch";
	/** 
	 * [justify-content](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-justify-content)
	 * 
	 * defines the alignment along the main axis. It helps distribute extra free 
	 * space leftover when either all the flex items on a line are inflexible, or 
	 * are flexible but have reached their maximum size. It also exerts some 
	 * control over the alignment of items when they overflow the line.
	 */
	justifyContent?: "start" | "end" | "left" | "right" | "center" | "space-between" | "space-around" | "space-evenly";
	justifyItems?: "space-around" ;


	gap?: Gap | `${Gap} ${Gap}` | "inherit" | "initial" | "revert" |"unset" | "revert-layer";
	cursor?: CssCursor;

	/** add in some other bespoke CSS key/values */
	bespoke?: string[];

	/**
	 * the position property in CSS (e.g., relative, absolute, sticky, etc.)
	 */
	position?: CssPosition;

	opacity?: string | number;
}

type StyleOptions<
	TOverride extends UserStyleOptions = EmptyObject
> = UserStyleOptions;

// If<
// 	IsEqual<EmptyObject, TOverride>,  
// 	UserStyleOptions, 
// 	Omit<UserStyleOptions, Keys<TOverride>> & TOverride
// >;

type BlockQuoteOptions = {
	/**
	 * The content area directly below the title line.
	 */
	content?: string | string[];

	/**
	 * Add content on title row but pushed to the right
	 */
	toRight?: string;

	contentStyle?: StyleOptions;

	/**
	 * The style for the overall callout block
	 */
	style?: StyleOptions;
	fold?: ObsidianFoldOptions;
	/** 
	 * if you want to override the "kind" of callout's
	 * default icon you can by passing in inline SVG.
	 */
	icon?: string;
	/**
	 * content below callout area but still within the 
	 * folding region that is registered.
	 */
	belowTheFold?: string;

	/**
	 * style attributes which effect the `belowTheFold`
	 * section when used.
	 * 
	 * @default padding: var(--callout-content-padding)
	 */
	belowTheFoldStyle?: StyleOptions;


	/**
	 * Adds a DIV below the content section and makes it a `flex` _with_
	 * **grow** on. The intent is to _grow_ this blockquote into the available
	 * vertical space of the parent container.
	 * 
	 * @default false
	 */
	growHeight?: boolean;
};


// LI
// padding-top: var(--list-spacing)
// padding-bottom: var(--list-spacing)

// UL
// padding-inline-start: var(--list-indent)
// margin-block-start: var(--p-spacing)
// margin-block-end: var(--p-spacing)

type ListStyle = {
	/**
	 * Set the indentation level on the `UL` or `OL` element
	 */
	indentation?: "default" | "12px" | "16px" | "20px" | "24px" |"none";
	/**
	 * set the top margin for the list block (using `margin-block-start`)
	 */
	mt?: "default" |"none" | "tight" | "spaced" | `${number}px` | `${number}rem`;
	/**
	 * set the top margin for the list block (using `margin-block-end`)
	 */
	mb?: "default" | "none" | "tight" | "spaced" | `${number}px` | `${number}rem`;
	/**
	 * set _both_ top and bottom margins for the list block
	 */
	my?: "default" | "none" |  "tight" | "spaced" | `${number}px` | `${number}rem`;
	/** styling for list items */
	li?: StyleOptions | ((text: string) => StyleOptions);
}


const style = <T extends StyleOptions<any>>(opts?: T) => {
	let fmt = [];
	if(opts?.pb) {
		fmt.push(`padding-bottom: ${opts.pb}`)
	}
	if(opts?.pt) {
		fmt.push(`padding-top: ${opts.pt}`);
	}

	if(opts?.py) {
		fmt.push(`padding-top: ${opts.py}`);
		fmt.push(`padding-bottom: ${opts.py}`);
	}
	if(opts?.px) {
		fmt.push(`padding-left: ${opts.px}`);
		fmt.push(`padding-right: ${opts.px}`);
	}

	if(opts?.pl) {
		fmt.push(`padding-left: ${opts.pl}`);
	}
	if(opts?.pr) {
		fmt.push(`padding-right: ${opts.pr}`);
	}
	if(opts?.p) {
		fmt.push(`padding: ${opts.p}`);
	}

	if(opts?.m) {
		fmt.push(`margin-top: ${opts.m}`);
		fmt.push(`margin-bottom: ${opts.m}`);
		fmt.push(`margin-left: ${opts.m}`);
		fmt.push(`margin-right: ${opts.m}`);
	}
	if(opts?.mb) {
		fmt.push(`margin-bottom: ${opts.mb}`)
	}
	if(opts?.mt) {
		fmt.push(`margin-top: ${opts.mt}`);
	}
	if(opts?.my) {
		fmt.push(`margin-top: ${opts.mx}`);
		fmt.push(`margin-bottom: ${opts.mx}`);
	}
	if(opts?.mx) {
		fmt.push(`margin-left: ${opts.mx}`);
		fmt.push(`margin-right: ${opts.mx}`);
	}
	if(opts?.ml) {
		fmt.push(`margin-left: ${opts.ml}`);
	}
	if(opts?.mr) {
		fmt.push(`margin-right: ${opts.mr}`);
	}
	if(opts?.bespoke) {
		fmt.push(...opts.bespoke)
	}
	if(opts?.w) {
		fmt.push(`weight: ${opts.w}`);
	}
	if(opts?.fw) {
		fmt.push(`font-weight: ${opts.fw}`)
	}
	if(opts?.fs) {
		fmt.push(`font-style: ${opts.fs}`);
	}
	if(opts?.ts) {
		switch(opts.ts) {
			case "xs": 
				fmt.push(`font-size: 0.75rem`);
				fmt.push(`line-height: 1rem`)
				break;
			case "sm":
				fmt.push(`font-size: 0.875rem`);
				fmt.push(`line-height: 1.25rem`)
				break;
			case "base":
				fmt.push(`font-size: 1rem`);
				fmt.push(`line-height: 1.5rem`)
				break;
			case "lg":
				fmt.push(`font-size: 1.125rem`);
				fmt.push(`line-height: 1.75rem`);
				break;	
			case "xl":
				fmt.push(`font-size: 1.25rem`);
				fmt.push(`line-height: 1.75rem`);
				break;	
			case "2xl":
				fmt.push(`font-size: 1.5rem`);
				fmt.push(`line-height: 2rem`);
				break;	
			default:
				fmt.push(`font-size: ${opts.ts}`);
				fmt.push(`line-height: auto`);
			}
	}
	if(opts?.flex) {
		fmt.push(`display: flex`);
	}
	if(opts?.direction) {
		fmt.push(`flex-direction: ${opts.direction}`)
	}
	if(opts?.grow) {
		fmt.push(`flex-grow: ${opts.grow}`);
	}
	if(opts?.gap) {
		fmt.push(`gap: ${opts.gap}`);
	}
	if(opts?.cursor) {
		fmt.push(`cursor: ${opts.cursor}`);
	}
	if(opts?.alignItems) {
		fmt.push(`align-items: ${opts.alignItems}`);
	}
	if(opts?.justifyItems) {
		fmt.push(`justify-items: ${opts.justifyItems}`);
	}
	if(opts?.justifyContent) {
		fmt.push(`justify-content: ${opts.justifyContent}`);
	}
	if(opts?.position) {
		fmt.push(`position: ${opts.position}`)
	}
	if(opts?.display) {
		fmt.push(`display: ${opts.display}`)
	}
	if(opts?.opacity) {
		fmt.push(`opacity: ${opts.opacity}`)
	}

	return fmt.length === 0 
		? `style=""`
		: `style="${fmt.join("; ")}"`
}


const listStyle = (opts: ListStyle = {}) => {
	let fmt: string[] = [];

	if(opts?.indentation && opts.indentation !== "default") {
		switch(opts.indentation) {
			case "24px":
				fmt.push(`padding-inline-start: 24px`);
				break;
			case "20px":
				fmt.push(`padding-inline-start: 20px`);
				break;
			case "16px":
				fmt.push(`padding-inline-start: 16px`);
				break;
			case "12px":
				fmt.push(`padding-inline-start: 12px`);
				break;
			case "none":
				fmt.push(`padding-inline-start: 0px`);
				break;
		}
	}

	if(opts?.mt && opts.mt !== "default") {
		fmt.push(`margin-block-start: ${opts.mt === "tight" ? "2px" : opts.mt === "none" ? "0px" : opts.mt === "spaced" ? "1.5rem" : opts.mt }`);
	}

	if(opts?.mb && opts.mb !== "default") {
		fmt.push(`margin-block-end: ${opts.mb === "tight" ? "2px" : opts.mb === "none" ? "0px" : opts.mb === "spaced" ? "1.5rem" : opts.mb }`);
	}

	if(opts?.my && opts.my !== "default") {
		fmt.push(`margin-block-start: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my }`);
		fmt.push(`margin-block-end: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my }`);
	}

	return fmt.length === 0 
	? `style=""`
	: `style="${fmt.join("; ")}"`
}

const obsidian_blockquote = (
	kind: ObsidianCalloutColors,
	title: string,
	opts?: BlockQuoteOptions
) =>  [
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
						`<div class="callout-title-right" style="display: flex; flex-grow: 1; justify-content: right">${opts.toRight}</div>`
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
					`</div>`
				]
				: [
					`<div class="callout-content" style="display: flex; flex-direction: column; space-between: 4px;">`,
					...opts.content.map(c => `<div class="content-element" ${style({ flex: true, ...(opts.contentStyle || {})})}>${c}</div>`),
					`</div>`
				]
			: []
		),

	...(
		opts?.belowTheFold
		? [`<div class="below-the-fold" ${style(opts?.belowTheFoldStyle || {})}>${opts?.belowTheFold}</div>`]
		: ['']
	),
	`</div>`
].filter(i => i).join("\n");

const empty_callout = (fmt?: StyleOptions) => [
`<div class="callout" ${style(fmt)}>`,
`<div class="callout-title">&nbsp;</div>`,
`<div class="callout-content">&nbsp;</div>`,
`</div>`
].join("\n");

/**
 * **blockquote**`(kind, title, opts)`
 * 
 * Generates the HTML necessary to show a callout/blockquote in Obsidian.
 */
const blockquote = (
	kind: ObsidianCalloutColors,
	title: string,
	opts?: BlockQuoteOptions
) => {
	const iconLookup: Record<ObsidianCalloutColors,string> = {
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
		note: NOTE_ICON
	}

	return obsidian_blockquote(
		kind,
		title,
		opts?.icon && opts.icon in iconLookup
			? { ...opts, icon: iconLookup[opts.icon as keyof typeof iconLookup]}
			: opts
	)
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
 * **fmt**
 * 
 * A set of formatting functions which are provide to `dv_page` or other
 * interfaces to render to a page.
 */
export const fmt = (p: KindModelPlugin) => (
	container: HTMLElement,
	filePath: string
) => ({
	async ul(...items: readonly (string | ListItemsCallback)[]) {
		
		return p.dv.renderValue(
			render_list_items(wrap_ul, items), 
			container, p, filePath, false
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
	html_ul(items: readonly (string | ListItemsCallback |undefined )[], opts?: ListStyle) {
		return render_list_items(wrap_ul, items.filter(i => i !== undefined), opts);
	},
	async ol(...items: readonly (string | ListItemsCallback)[]) {
		
		
		return p.dv.renderValue(
			render_list_items(wrap_ol, items), 
			container, p, filePath, false
		);
	},
	
	code: (code: string) => p.dv.renderValue(
		`<code>${code}</code>`, 
		container,p, filePath, true
	),


	/**
	 * **renderToRight**`(text)`
	 * 
	 * Takes text/html and renders it to the right.
	 * 
	 * Note: use `toRight` just to wrap this text in the appropriate HTML
	 * to move content to right.
	 */
	renderToRight: (text: string) => p.dv.renderValue(
		`<span class="to-right" style="display: flex; flex-direction: row; width: auto;"><span class="spacer" style="display: flex; flex-grow: 1">&nbsp;</span><span class="right-text" style: "display: flex; flex-grow: 0>${text}</span></span>`, 
		container,p, filePath, true
	),

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

	/**
	 * **callout**`(kind, title, opts)`
	 * 
	 * Renders a callout to the current block.
	 * 
	 * **Note:** use `blockquote` for same functionality but 
	 * with HTML returned rather than _rendered_.
	 */
	callout: (kind: ObsidianCalloutColors, title: string, opts?: BlockQuoteOptions) => 
		p.dv.renderValue(
			blockquote(kind,title,opts), 
			container,p, filePath, false
		),

	empty_callout
});

/**
 * **Fmt**
 * 
 * A formatting API surface to more quickly produce page output in Obsidian.
 */
export type Fmt = ReturnType<ReturnType<typeof fmt>>;

