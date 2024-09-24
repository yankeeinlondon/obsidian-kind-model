import KindModelPlugin from "main";
import { DvPage, PageReference, FileLink, ShowApi } from "types";
import { getPage, getTagPathFromCache } from "./cache";
import { isArray, isString, keysOf } from "inferred-types";
import { isKeyOf } from "handlers/dv_page";
import { isDvPage, isLink } from "type-guards";
import { DateTime } from "luxon";

const DEFAULT_LINK = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#a3a3a3" d="M134.71 189.19a4 4 0 0 1 0 5.66l-9.94 9.94a52 52 0 0 1-73.56-73.56l24.12-24.12a52 52 0 0 1 71.32-2.1a4 4 0 1 1-5.32 6A44 44 0 0 0 81 112.77l-24.13 24.12a44 44 0 0 0 62.24 62.24l9.94-9.94a4 4 0 0 1 5.66 0Zm70.08-138a52.07 52.07 0 0 0-73.56 0l-9.94 9.94a4 4 0 1 0 5.71 5.68l9.94-9.94a44 44 0 0 1 62.24 62.24L175 143.23a44 44 0 0 1-60.33 1.77a4 4 0 1 0-5.32 6a52 52 0 0 0 71.32-2.1l24.12-24.12a52.07 52.07 0 0 0 0-73.57Z"/></svg>`;


export const showCreatedDate = (pg: DvPage, format?: string) => {
	return format 
		? pg.file.cday.toFormat(format)
		: pg.file.cday
}

export function showModifiedDate(pg: DvPage, format?: string) {
	return format 
		? pg.file.mday.toFormat(format)
		: pg.file.mday
}

export const showDueDate = (p: KindModelPlugin) => (
	page: PageReference,
	prop: string = "due",
	format?: string
) => {
	const pg = getPage(p)(page);
	if (pg && pg[prop] !== undefined) {
		return typeof pg[prop] ===  "number"
			? format 
				? DateTime.fromMillis(pg[prop]).toFormat(format)
				: DateTime.fromMillis(pg[prop])
			: typeof pg[prop] === "object" && pg[prop] instanceof DateTime
				? format
					? pg[prop].toFormat(format)
					: pg[prop]
			: typeof pg[prop] === "string" && DateTime.fromISO(pg[prop])
				? format
					? DateTime.fromISO(pg[prop]).toFormat(format)
					: DateTime.fromISO(pg[prop])
			: "";

	} else {
		return ""
	}
}

/**
 * **show_desc**`()`
 * 
 * Looks for a description in all common _description_
 * properties
 */
export const showDesc = (p: KindModelPlugin) => (pg: DvPage) => {
	const desc = showProp(p)(pg, "about","desc","description")
	if (typeof desc == "string") {
		return `<span style="font-weight:200; font-size: 14px">${desc}</span>`
	} else {
		return ""
	}
};

/**
 * **when**
 * 
 * A smart date field which tries to express the most
 * relevant date info for a page.
 */
export const showWhen = (_p: KindModelPlugin) => (
	pg: DvPage | undefined,
	format: string = "LLL yyyy"
) => {
	if (pg) {
		const created = pg.file.cday;
		const modified = pg.file.mday;
		const deltaCreated = Math.abs(created.diffNow('days').days);
		const deltaModified = Math.abs(modified.diffNow('days').days);

		// TODO: add in linking to day page if present
		if (deltaCreated < 14) {
			const desc = created.toRelative();
			return `<span style="cursor: default"><i style="font-weight: 150">created</i> ${desc}</span>`;
		} else if (deltaModified < 14) {
			const desc = modified.toRelative();
			return `<span style="cursor: default"><i style="font-weight: 150">modified</i> ${desc}</span>`
		} else {
			return `<span style="cursor: default">${modified.toFormat(format)}</span>`
		}

	} else {
		return ""
	}
}

export const showCategoriesFor = (p: KindModelPlugin) => (pg: PageReference | undefined): string => {
	const page = getPage(p)(pg);
	
	if (pg) {
		const kind = p.api.getKindTagsOfPage(page);
		switch(kind.length) {
			case 0: 
				return ""
			case 1: 
				const categories = p.dv.pages(`#${kind}/category OR #category/${kind}`);
				return categories.map(c => c.file.link).join(", ")
			default:
				// multiple kinds
				const queries = kind.map(k => [
					p.dv.pages(`#${k}/category OR #category/${k}`).map(
						i => `#${getTagPathFromCache(p)(i.file.name)}/${i.file.link}`
					),
				]);

				return queries.join(", ")
		}
	}

	return ""
}

export const showSubcategoriesFor = (p: KindModelPlugin) => (
	pg: PageReference | undefined,
	/** the category which you want to get subcategories for */
	category: string 
): string => {
	const page = getPage(p)(pg);
	
	if (pg) {
		const kind = p.api.getKindTagsOfPage(page);
		switch(kind.length) {
			case 0: 
				return ""
			case 1: 
				const categories = p.dv.pages(`#${kind}/subcategory/${category} OR #subcategory/${category}/${kind}`);
				return categories.map(c => c.file.link).join(", ")
			default:
				// multiple kinds
				const queries = kind.flatMap(k => [
					p.dv.pages(`#${k}/category OR #category/${k}`).map(
						i => `#${getTagPathFromCache(p)(i.file.name)}/${i.file.link}`
					),
				]);

				return queries.join(", ")
		}
	}

	return ""
}

export const showTags   = (p: KindModelPlugin) => (pg: DvPage, ...exclude: string[]) => {
	return pg.file.etags.filter( t => !exclude.some(i => t.startsWith(i) ? true : false))
	.map(t => `\`${t}\``).join(', ') || "";
}

export const showLinks = (p: KindModelPlugin) => (pg: DvPage) => {
	const [_,pageIcon] = getProp(p)(pg, "icon", "svg_icon","_icon","_svg_icon");

	const link_props = {
		website: "website",
		wikipedia: "wikipedia",
		company: "company",
		retailer: "company",
		docs: "documentation",
		retail_urls: "retail",
		retail: "retail",
		url: "link",
		repo: "repo",
		review: "review",
		reviews: "review",
		blog: "blog",
		api: "api",
		map: "map",
		place: "pin",
		home: "home",
		office: "office",
		offices: "office",
		work: "office",
		employer: "office",
		playground: "playground",
		demo: "playground",
		support: "support",
		help: "support"
	} as Record<string, string>;
	
	const create_lnk = (
		icon: string, 
		/** the URL to the external site */
		url: string, 
		/** the property in metadata which this URL was found in */
		prop: string
	) => {
		icon = prop === "website" && isString(pageIcon) 
			? pageIcon
			: /youtube.com/.test(url) 
			? "you_tube" 
			: icon;
		p.debug(prop,pageIcon)
		return `<a href="${url}" data-href="${url}" alt="${prop}" style="display: flex; align-items: baseline; padding-right: 2px" data-tooltip-position="top"><span class="link-icon" style="display: flex;width: auto; max-width: 24px; max-height: 24px; height: 24px">${icon}</span></a>`;
	}
	const links: [prop:string, link: string][] = [];
	
	for (const prop of keysOf(pg)) {
		if(prop in pg && isString(pg[prop])) {
			// check if property is a HTTP link or an array of them
			if(Array.isArray(pg[prop])) {
				pg[prop].forEach((p: unknown) => { 
					if(isString(p)  &&/^http/.test(p)) {
						links.push([prop,p]);
					} 
				})
			} else if (isString(pg[prop]) && !prop.startsWith("_")&& /^http/.test(pg[prop])) {
				links.push([prop, pg[prop]]);
			}
		}
	}

	const icons = p.api.linkIcons;

	const prettify = (tuple: [prop: string, url: string]) => {
		const [prop, url] = tuple;
		if(prop in link_props) {

			if(link_props[prop] in icons) {
				return create_lnk(icons[link_props[prop]], url, prop);
			} else {
				return create_lnk(DEFAULT_LINK, url, prop);
			}
		} else {
			return create_lnk(DEFAULT_LINK, url, prop);
		}
	}


	return `<span style='display: flex; flex-direction: row;'>${links.map(prettify).join(" ")}</span>`;
}



/**
 * - higher order display prop which receives the plugin and then a page with a set of props
 * - the output is displayed in the column based on the _type_ of content found
 */
export const showProp = (plugin: KindModelPlugin) => (
	pg: DvPage & Record<string, unknown>, 
	...props: [string, ...string[]]
) => {
	if(!pg?.file?.name) {
		throw new Error(`Attempt to call get_prop(pg, ${props.join(", ")}) with an invalid page passed in!`);
	}
	const found = props.find(prop => isKeyOf(pg, prop) && pg[prop] !== undefined) as (string) | undefined;

	if (!found) {
		return "";
	}
	if(isKeyOf(pg, found)) {
		const value = pg[found];
		try {
			return isString(value)
				? value
				: isLink(value)
				? value
				: isDvPage(value)
				? value?.file.link
				: isArray(value)
				? value.map(v => isLink(v) ? v : isDvPage(v) ? v.file.link : "")
					.filter(i => i)
					.join(", ")
				: ""
		} catch (e) {
			plugin.error(`Ran into problem displaying the "${found}" property on the page "${pg.file.path}" passed in while calling show_prop().`, e);

			return ""
		}
	}
}



/** 
 * similar to showProp but this function returns a tuple of `[prop,value]` and 
 * is not meant to be directly put into a table output like show_prop is.
 * 
 * Note: if a `link` or array of `links` is found it will resolve these
 * to `DvPage` objects.
 */
export const getProp = (plugin: KindModelPlugin) => (
	pg: DvPage & Record<string, unknown>,
	...props: [string, ...string[]]
) => {
	if(!pg?.file?.name) {
		plugin.error(`Call to get_prop(pg) passed in an invalid DvPage`, {pg,props});
		return [undefined, undefined];
	}

	const found = props.find(prop => isKeyOf(pg, prop) && pg[prop] !== undefined) as (string) | undefined;
	if (!found) {
		return [undefined, undefined];
	} else {
		const value = pg[found];

		return [
			found,
			isLink(value)
			? plugin.dv.page(value)
			: Array.isArray(value)
			? value.map(i => isLink(i) ? plugin.dv.page(i) : i)
			: value
		]
	}
}

export const showAbout = (p: KindModelPlugin) => (pg: PageReference): FileLink[] => {
	return [] as FileLink[];
}

export const showPeers = (p: KindModelPlugin) => (pg: PageReference): string => {
	return ""
}

export const showKind = (p: KindModelPlugin) => (pg: PageReference): string => {
	return ""
}



export const showMetrics = (p: KindModelPlugin) => (pg: PageReference): string => {
	return ""
}

export const showSlider = (p: KindModelPlugin) => (pg: PageReference): string => {
	return ""
}




/**
 * The Show API surface is for presenting a column in a tabular report.
 */
export const showApi = (p: KindModelPlugin): ShowApi => ({
	/** show the creation date */
	showCreatedDate,
	/** show last modified date */
	showModifiedDate,
	/** show _due_ date */
	showDueDate: showDueDate(p),
	showWhen: showWhen(p),

	showDesc: showDesc(p),

	showTags: showTags(p),
	showLinks: showLinks(p),
	// showAbout: showAbout(p),

	showProp: showProp(p),
	getProp: getProp(p),

	showAbout: showAbout(p),
	showPeers: showPeers(p),
	showKind: showKind(p),
	showCategoriesFor: showCategoriesFor(p),
	showSubcategoriesFor: showSubcategoriesFor(p),
	showMetrics: showMetrics(p),
	showSlider: showSlider(p),
}) as const;


