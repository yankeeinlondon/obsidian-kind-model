import { 
	ensureTrailing,
	isCssAspectRatio, 
	isInlineSvg, 
	isRepoUrl, 
	isString, 
	isUrl 
} from "inferred-types";
import type { Component, MarkdownPostProcessorContext } from "obsidian";
import { DvPage } from "~/types";
import { MARKDOWN_PAGE_ICON } from "~/constants";
import KindModelPlugin from "~/main";
import { 
	OptionParam, 
	QueryDefinition, 
	ScalarParams 
} from "../helpers/QueryDefinition";
import { find_in, isWikipediaUrl } from "~/type-guards";

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
export const PageEntry = (p: KindModelPlugin) => (
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
	const page = p.api.getPageInfoBlock(source, container, component, filePath);
	if(page) {
		const fmt = page?.format;
		const current = page.current;
		// const {fmt, current} = dv;
	
		const banner_img = isUrl(page.current["_banner"]) 
			? page.current["_banner"] 
			: undefined;
		const banner_aspect = isCssAspectRatio(page.current["_banner_aspect"])
			? page.current["_banner_aspect"]
			: "32/12";
	
		const hasBanner = isUrl(banner_img);
	
		let [_p1, icon] = page.getProp(page.current, "icon","_icon","svgIcon", "_svgIcon");
		const hasIcon = isInlineSvg(icon);
	
		let [_p2, desc] = page.getProp(page.current, "desc","description","about","tagline", "summary");
		const hasDesc = isString(desc);
	
		const type = current.type
			? fmt.internalLink(page.page(current.type) as DvPage)
			: undefined;
	
		const kind = current.kind
			? fmt.internalLink(page.page(current.kind) as DvPage)
			: undefined;
	
		const category = current.category
			? fmt.internalLink(page.page(current.category) as DvPage)
			: undefined;
	
		const categories = current.categories
			? current.categories
				.map(c => fmt.internalLink(page.page(c) as DvPage))
				.join(fmt.light(" | ", {opacity: 0.5 }))
			: undefined;
		
		const subcategory = current.subcategory
			? fmt.internalLink(page.page(current.subcategory) as DvPage)
			: undefined;
	
	
		const wiki = isWikipediaUrl(current.wiki) 
			? fmt.link("Wikipedia", current.wiki)
			: isWikipediaUrl(current.wikipedia)
			? fmt.link("Wikipedia", current.wikipedia)
			: undefined;
	
		const siblings=page.get_internal_links(page.current, "about", "related", "competitors", "partners").map(i => fmt.internalLink(i))
		const parents=page.get_internal_links(page.current, "parent", "parents", "father", "mother", "belongs_to", "member_of", "child_of").map(i => fmt.internalLink(i))
		const children=page.get_internal_links(page.current, "child", "children", "son", "daughter", ).map(i => fmt.internalLink(i))
	
		/** page **does** have siblings but no parents or children */
		const siblingsNoOthers = siblings.length > 0 && parents.length === 0 && children.length === 0;
	
		const repo= find_in(isRepoUrl)(current.repo, current.github, current.git, current.homepage, current.url, current.home);
		const repo_lnk= repo ? fmt.link("Repo", repo) : undefined;
		
		const shouldDisplay = hasIcon || hasDesc || type || kind || category || categories;
	
		if (shouldDisplay) {
	
			const breadcrumbs = [ type,kind,category,categories,subcategory ]
				.filter(i => i)
				.join(
					fmt.light("&nbsp;>&nbsp;", {opacity: 0.5 })
				);
	
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
	
			await page.callout("example", title, {
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
			page.renderValue(`<img src="${banner_img}" style="width:100%;aspect-ratio:${banner_aspect}; object-fit: cover"> `)
		}

	}

}

