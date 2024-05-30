import { 
	Api, 
	EscapeFunction, 
	createFnWithProps, 
	isFunction 
} from "inferred-types";
import KindModelPlugin from "main";
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


type WrapperCallback = (items: string) => string;

type ListItemsApi<_W extends WrapperCallback> = Api<{
	/** indent the list a level using same OL or UL nomenclature */
	indent: (...items: string[]) => string;
	done: EscapeFunction<() => "">
}>;

type StyleOptions = {
	/** padding top */
	pt?: string;
	/** padding bottom */
	pb?: string;
	/** margin top */
	mt?: string;
	/** margin bottom */
	mb?: string;

	/** pad left */
	pl?: string;
	/** pad right */
	pr?: string;
}

type BlockQuoteOptions = {
	content?: string;
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
};

const style = (opts: StyleOptions) => {
	let fmt = [];
	if(opts?.pb) {
		fmt.push(`padding-bottom: ${opts.pb}`)
	}
	if(opts?.pt) {
		fmt.push(`padding-top: ${opts.pt}`);
	}
	if(opts?.mb) {
		fmt.push(`margin-bottom: ${opts.mb}`)
	}
	if(opts?.mt) {
		fmt.push(`margin-top: ${opts.mt}`);
	}

	return fmt.length === 0 
		? `style=""`
		: `style="${fmt.join("; ")}"`
}

const obsidian_blockquote = (
	kind: string,
	title: string,
	content: string | undefined,
	icon: string,
	fold: "" | "-" | "+",
	belowTheFold: string | undefined,
	formatting: StyleOptions = {}
) =>  [
	`<div data-callout-metadata="" data-callout-fold="${fold}" data-callout="${kind}" class="callout" ${style(formatting)}>`,
		`<div class="callout-title">`,
			`<div class="callout-icon">${icon}</div>`,
			`<div class="callout-title-inner">${title}</div>`,
		`</div>`,
		...(
			content
			? [
				`<div class="callout-content">`,
				`<p>${content}</p>`,
				`</div>`
			]
			: []
		),
	...(
		belowTheFold
		? [`<div class="below-the-fold" style="padding: var(--callout-content-padding)">${belowTheFold}</div>`]
		: ['']
	),
	`</div>`
].filter(i => i).join("\n");

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
		opts?.content,
		opts?.icon || iconLookup[kind],
		opts?.fold || "",
		opts?.belowTheFold,
		opts?.style || {}
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
const wrap_ol = (items: string) => `<ol>${items}</ol>`
/** wrap text in `<ul>...</ul>` tags */
const wrap_ul = (items: string) => `<ul>${items}</ul>`
/** wraps an ordered or unordered list recursively */
const render_list_items = (
	wrapper: (items: string) => string,
	items: readonly (string | ListItemsCallback)[]
) => wrapper(
	items
		.map(i => (
			isFunction(i)
				? isFunction(i(list_items_api))
					? ""
					: i(list_items_api)
				: `<li>${i}</li>`
		) as unknown as string)
		.filter(i => i !== "")
		.join("\n") as string
);

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
	async ol(...items: readonly (string | ListItemsCallback)[]) {
		
		
		return p.dv.renderValue(
			render_list_items(wrap_ol, items), 
			container, p, filePath, false
		);
	},
	italics: (text: string) => `<em>${text}</em>`,
	bold: (text: string) => `<b>${text}</b>`,
	code: (code: string) => p.dv.renderValue(
		`<code>${code}</code>`, 
		container,p, filePath, true
	),
	toRight: (text: string) => p.dv.renderValue(
		`<span class="to-right" style="display: flex; flex-direction: row; width: auto;"><span class="spacer" style="display: flex; flex-grow: 1">&nbsp;</span><span class="right-text" style: "display: flex; flex-grow: 0>${text}</span></span>`, 
		container,p, filePath, true
	),



	callout: (kind: ObsidianCalloutColors, title: string, opts?: BlockQuoteOptions) => 
		p.dv.renderValue(
			blockquote(kind,title,opts), 
			container,p, filePath, false
		),

});



