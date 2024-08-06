import { 
	ensureTrailing,
	isCssAspectRatio, 
	isInlineSvg, 
	isRepoUrl, 
	isString, 
	isUrl 
} from "inferred-types";
import KindModelPlugin from "../main";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { DvPage } from "../types/dataview_types";
import { isWikipediaUrl } from "../utils/type_guards/isWikipediaUrl";
import { find_in } from "../utils/type_guards/find_in";
import { MARKDOWN_PAGE_ICON } from "../constants/obsidian-constants";
import { 
	OptionParam, 
	QueryDefinition, 
	ScalarParams 
} from "../helpers/QueryDefinition";

export const page_entry_defn = {
	kind: "query-defn",
	type: "PageEntry",
	scalar: [],
	options: {
		verbose: "bool"
	}
} as const satisfies QueryDefinition;

/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const page_entry = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => async <
	TScalar extends ScalarParams<typeof page_entry_defn>,
	TOption extends OptionParam<typeof page_entry_defn>
>(
_scalar: TScalar,
_opt: TOption
) => {
	const dv = p.api.dv_page(source, container, component, filePath);
	const {fmt, current} = dv;

	const banner_img = isUrl(dv.current["_banner"]) ? dv.current["_banner"] : undefined ;
	const banner_aspect = isCssAspectRatio(dv.current["_banner_aspect"])
		? dv.current["_banner_aspect"]
		: "32/12";

	const hasBanner = isUrl(banner_img);

	let [_p1, icon] = dv.get_prop(dv.current, "icon","_icon","svgIcon", "_svgIcon");
	const hasIcon = isInlineSvg(icon);

	let [_p2, desc] = dv.get_prop(dv.current, "desc","description","about","tagline", "summary");
	const hasDesc = isString(desc);

	const type = current.type
		? dv.fmt.internalLink(dv.page(current.type) as DvPage)
		: undefined;

	const kind = current.kind
		? dv.fmt.internalLink(dv.page(current.kind) as DvPage)
		: undefined;

	const category = current.category
		? dv.fmt.internalLink(dv.page(current.category) as DvPage)
		: undefined;

	const categories = current.categories
		? current.categories
			.map(c => dv.fmt.internalLink(dv.page(c) as DvPage))
			.join(fmt.light(" | ", {opacity: 0.5 }))
		: undefined;
	
	const subcategory = current.subcategory
		? dv.fmt.internalLink(dv.page(current.subcategory) as DvPage)
		: undefined;


	const wiki = isWikipediaUrl(current.wiki) 
		? fmt.link("Wikipedia", current.wiki)
		: isWikipediaUrl(current.wikipedia)
		? fmt.link("Wikipedia", current.wikipedia)
		: undefined;

	const siblings=dv.get_internal_links(dv.current, "about", "related", "competitors", "partners").map(i => fmt.internalLink(i))
	const parents=dv.get_internal_links(dv.current, "parent", "parents", "father", "mother", "belongs_to", "member_of", "child_of").map(i => fmt.internalLink(i))
	const children=dv.get_internal_links(dv.current, "child", "children", "son", "daughter", ).map(i => fmt.internalLink(i))

	/** page **does** have siblings but no parents or children */
	const siblingsNoOthers = siblings.length > 0 && parents.length === 0 && children.length === 0;

	const repo= find_in(isRepoUrl)(current.repo, current.github, current.git, current.homepage, current.url, current.home);
	const repo_lnk= repo ? fmt.link("Repo", repo) : undefined;
	
	const shouldDisplay = hasIcon || hasDesc || type || kind || category || categories;

	if (shouldDisplay) {

		const breadcrumbs = [ type,kind,category,categories,subcategory ]
			.filter(i => i)
			.join(fmt.light("&nbsp;>&nbsp;", {opacity: 0.5 }));

		const ext_links = [ wiki, repo_lnk ]
			.filter(i => i)
			.join(", ");

		// SECTIONS
		const title = isString(desc)
			? desc.length < 120 
				? desc
				: ext_links
			: ext_links;
		
		const body = isString(desc) && desc.length >= 120
			? ensureTrailing(desc as string, ".")
			: undefined;

		const right = breadcrumbs.length>0 
			? siblingsNoOthers
				? `${breadcrumbs} [ ${siblings} ]`
				: breadcrumbs 
			: fmt.light("<i>no classification</i>")

		await fmt.callout("example", title, {
			style: {
				mt: "0.55rem",
				mb: "1rem"
			},
			icon: hasIcon ? icon : MARKDOWN_PAGE_ICON,
			content: body as string | undefined,
			toRight: right,
			fold: "+"
		});
	}

	if(hasBanner) {
		dv.renderValue(`<img src="${banner_img}" style="width:100%;aspect-ratio:${banner_aspect}; object-fit: cover"> `)
	}

}

