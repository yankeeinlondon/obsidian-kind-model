/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
	Api,
	AsArray, 
	Container, 
	EscapeFunction, 
	Never, 
	OptionalSpace, 
	StripLeading, 
	createFnWithProps, 
	isArray, 
	isContainer, 
	isFunction, 
	isNumber,  
	isString, 
	isUndefined, 
	keysOf 
} from "inferred-types";
import { Component, MarkdownPostProcessorContext } from "obsidian";
import { DateTime, Duration } from "luxon";
import KindModelPlugin from "../main";
import { DataArray, DvPage, Grouping, Link, SListItem } from "../types/dataview_types";
import { isDvPage } from "../utils/type_guards/isDvPage";
import { isFileLink, isLink } from "../utils/type_guards/isFileLink";
import { fmt } from "./fmt";
import { PropertyKind } from "types/general";
import { get_property_type } from "utils/page/get_property_type";

const DEFAULT_LINK = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#a3a3a3" d="M134.71 189.19a4 4 0 0 1 0 5.66l-9.94 9.94a52 52 0 0 1-73.56-73.56l24.12-24.12a52 52 0 0 1 71.32-2.1a4 4 0 1 1-5.32 6A44 44 0 0 0 81 112.77l-24.13 24.12a44 44 0 0 0 62.24 62.24l9.94-9.94a4 4 0 0 1 5.66 0Zm70.08-138a52.07 52.07 0 0 0-73.56 0l-9.94 9.94a4 4 0 1 0 5.71 5.68l9.94-9.94a44 44 0 0 1 62.24 62.24L175 143.23a44 44 0 0 1-60.33 1.77a4 4 0 1 0-5.32 6a52 52 0 0 0 71.32-2.1l24.12-24.12a52.07 52.07 0 0 0 0-73.57Z"/></svg>`;


export const isKeyOf = <
	TContainer,
	TKey
>(container: TContainer, key: TKey): key is TContainer extends Container ? TKey & keyof TContainer : TKey => {
	return (
		isContainer(container) && (isString(key) || isNumber(key)) && key in container ? true : false
	);
}

type UlApi = Api<{
	/** indent the unordered list a level */
	indent: (...items: string[]) => string;
	done: EscapeFunction<() => "">
}>;

type UlCallback = <T extends UlApi>(api:T) => unknown;

function extractTitle<
	T extends unknown  | undefined
>(s: T) {
	return (
		s && typeof s === "string"
			? s.replace(/\d{0,4}-\d{2}-\d{2}\s*/, "")
			: s
	) as T extends string ? StripLeading<T, `${number}-${number}-${number}${OptionalSpace}`>: T;
}

function get_classification(pg: DvPage | undefined): PageClassification {
	if(pg === undefined) {
		return { isCategory: false, isSubcategory: false, category: undefined, subcategory: undefined};
	}
	const directCat = pg.file.etags.find(
		t => t?.startsWith(`#category/`)
	);
	const directSubCat = pg.file.etags.find(
		t => t?.startsWith(`#subcategory/`)
	);
	const indirectCat = pg.file.etags.find(
		t => t?.split("/").length > 2 && t?.split("/")[1] === "category" 
	);
	const indirectSubCat =  pg.file.etags.find(
		t => t?.split("/").length > 2 && t.split("/")[1] === "subcategory" 
	);
	const kindedPage = pg.file.etags.find(t => 
		t?.split("/").length > 1 && 
		!["#category","#subcategory"].includes(t.split("/")[0]) &&
		!["category","subcategory"].includes(t.split("/")[1])
	)

	return directCat
		? {
			isCategory: true,
			isSubcategory: false,
			category: directCat.split("/")[1],
			subcategory: undefined
		}
		: directSubCat
		? {
			isCategory: false,
			isSubcategory: true,
			category: directSubCat.split("/")[1],
			subcategory: directSubCat.split("/")[2],
		}
		: indirectCat
		? {
			isCategory: true,
			isSubcategory: false,
			category: indirectCat.split("/")[2],
			subcategory: undefined
		}
		: indirectSubCat
		? {
			isCategory: false,
			isSubcategory: true,
			category: indirectSubCat.split("/")[2],
			subcategory: indirectSubCat.split("/")[3]
		}
		: kindedPage
		? {
			isCategory: false,
			isSubcategory: false,
			category: kindedPage.split("/")[1],
			subcategory: kindedPage.split("/")[2],
		}
		: { 
			isCategory: false, 
			isSubcategory: false, 
			category: undefined, 
			subcategory: undefined
		};
}

function removePound(tag: string | undefined){
	return typeof tag === "string" && tag?.startsWith("#")
		? tag.slice(1)
		: tag
}




/**
 * returns a list of any youtube videos referenced on a page
 * along with whether or not the page is tagged as the appropriate
 * kind/category for this.
 */
const get_youtube_videos = (plugin: KindModelPlugin) => (
	pg: Link | DvPage
) => {
	const page = isDvPage(pg) 
	? pg 
	: isFileLink(pg)
		? plugin.dv.page(pg)
		: undefined;

	if(!page) {

	}
}

const extractPath = (path: DvPage | string | Link) => {
	return isDvPage(path)
		? path.file.path
		: isLink(path)
		? path.path
		: isString(path)
		? path
		: Never
}

const isKindedPage = (plugin: KindModelPlugin) => (
	pg: DvPage | undefined, 
	category?: DvPage | string | Link,
	subcategory?: DvPage | string | Link
) => {
	return isUndefined(pg)
		? false
		: get_classification(pg).isCategory === false && 
			get_classification(pg).isSubcategory === false &&
			!pg.file.etags.find(i => i.startsWith("#kind"))
			? isUndefined(category)
				? true
				: pg.category 
					? plugin.dv.page(pg.category)?.file?.path === extractPath(category)
						? isUndefined(subcategory)
							? true
							: pg.subcategory && plugin.dv.page(pg.subcategory)?.file?.path === extractPath(subcategory)
						: false
					: false
			: false;
}

function isKindDefnPage(pg: DvPage | undefined) {
	return isUndefined(pg)
		? false
		: pg.file.etags.find(t => t.startsWith(`#kind/`));
}

const get_kind_prop = (p: KindModelPlugin) => (
	pg: DvPage | string | undefined
): {kind: Partial<DvPage>  | undefined; tag: string | undefined} => {
	if(!pg) {
		return {kind: undefined, tag: undefined};
	}
	if(!isDvPage(pg)) {
		return get_kind_prop(p)(p.dv.page(pg as string));
	} else {
		let [_,kind] = get_prop(p)(pg as DvPage, "kind");

		return isDvPage(kind)
		? {
			kind,
			tag: get_kind_tag(p)(kind)
		}
		: {
			kind: {},
			tag: undefined
		}
	}
}


const get_kind_tag = (p: KindModelPlugin) => (pg: DvPage) => {
	return pg.file.etags.find(i => i?.startsWith(`#kind/`))
		// kind definition
		? pg.file.etags.find(i => i?.startsWith(`#kind/`))?.split("/")[1]
		// category or subcategory pages
		: removePound(
			pg.file.etags.find(
				t => 
					!t.startsWith("#category") &&
					!t.startsWith("#subcategory") &&
					!(
						t.split("/")[1] === "category" || 
						t.split("/")[1] === "subcategory"
					)
			)?.split("/")[0]
		) || get_kind_prop(p)(pg).tag || "unknown";
}

function as_array<V>(val: V): AsArray<V> {
	return (
		Array.isArray(val)
		? val
		: [val]
	) as unknown as AsArray<V>
}


function show_tags(pg: DvPage, ...exclude: string[]) {
	return pg.file.etags.filter( t => !exclude.some(i => t.startsWith(i) ? true : false))
	.map(t => `\`${t}\``).join(', ') || "";
}

const show_links = (p: KindModelPlugin, icons: Record<string,string>) => (pg: DvPage) => {
	const [_,pageIcon] = get_prop(p)(pg, "icon", "svg_icon","_icon","_svg_icon");

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
 * similar to show_prop but this function returns a tuple of `[prop,value]` and 
 * is not meant to be directly put into a table output like show_prop is.
 * 
 * Note: if a `link` or array of `links` is found it will resolve these
 * to `DvPage` objects.
 */
const get_prop = (plugin: KindModelPlugin) => (
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


const show_prop = (plugin: KindModelPlugin) => (
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
				? value.file.link
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

function show_created_date(pg: DvPage, format?: string) {
	return format 
		? pg.file.cday.toFormat(format)
		: pg.file.cday
}

function show_modified_date(pg: DvPage, format?: string) {
	return format 
		? pg.file.mday.toFormat(format)
		: pg.file.mday
}

const show_subcategories_for = (plg: KindModelPlugin) => (
	pg: DvPage | undefined
) => {
	if(!pg) {
		return [];
	}

	if(get_classification(pg).isCategory) {
		// this is the intended page type
		const kindTag = get_kind_tag(plg)(pg);
		const category = get_classification(pg).category;
		const query = kindTag 
			? `#${kindTag}/subcategory/${category} OR #subcategory/${category}`
			: `#subcategory/${category}`;
		return plg.dv.pages(query).map(i => i.file.link);
	} else {
		return [];
	}
}

export type PageClassification = {
	isCategory: boolean;
	isSubcategory: boolean;
	category: string | undefined;
	subcategory: string | undefined;
}

export const dv_page = (plugin: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => {
	const current = plugin.dv.page(filePath);
	if(!current) {
		throw new Error("Attempt to initialize dv_page() with an invalid sourcePath: ${sourcePath}!")
	}
	const linkIcons = (plugin.dv.page("Link Icons") || {}) as DvPage;

	const metadata = () => {
		let meta: Record<Partial<PropertyKind>,string[]> = {};
		let fm = current.file.frontmatter;

		for (const key of Object.keys(fm)) {
			const type = get_property_type(fm[key]);
			if (meta[type]) {
				meta[type].push(key);
			} else {
				meta[type] = [key];
			}
		}
		
		return meta;
	}

	return {
		/** the current page represented as a `DvPage` */
		current,
		/**
		 * The designated page for _link icons_
		 */
		linkIcons,
		/**
		 * simply utility to ensure that a tag string has it's 
		 * leading pound symbol removed.
		 */
		removePound,
		/**
		 * **get_kind_tag**`(page)`
		 * 
		 * Determines what the "kind tag" is for the passed in page:
		 * 
		 * - on a kind definition page of `#kind/foo` it returns "foo"
		 * - on a _kinded_ page like `#foo` or `#foo/cat/subCat` it also
		 * return "foo"
		 * - on a category or subcategory page this will pickup two
		 * variants:
		 *   - **explicit** such as `#foo #category/uno`
		 *   - **implicit** such as `#foo/category/uno`
		 * - right now it does not consider the possibility of multiple
		 * _kinds_ associated to a category/subcategory
		 */
		get_kind_tag: get_kind_tag(plugin),

		/**
		 * **extractTitle**`(fileName)`
		 * 
		 * Simple utility meant to remove a leading date of the form YYYY-MM-DD from
		 * a page's name to get more of a "title".
		 */
		extractTitle,

		/**
		 * **get_classification**`(page)`
		 * 
		 * Gets a page's classification {`isCategory`,`isSubcategory`,`category`,`subcategory`}
		 */
		get_classification,
		// adds classification properties for current page
		...get_classification(current),
		
		/**
		 * **show_tags**`(page, ...exclude)`
		 * 
		 * Create a list of tags on a given `page` (with any exclusions you'd like to add).
		 */
		show_tags,


		/**
		 * **get_prop**`(page, prop, ...fallbacks) → [prop, value]` 
		 * 
		 * Returns the contents of a given page's property. If that property is
		 * a link or an array of links then the property is converted to a 
		 * `DvPage`.
		 * 
		 * ```ts
		 * const [prop, val] = get_prop(pg, "kind");
		 * ```
		 */
		get_prop: get_prop(plugin),

		/**
		 * **get_kind_prop**`(page) → [page, tag]`
		 * 
		 * Gets the `kind` property on a given page. If the property was
		 * a `Link` then it will be upgraded to a `DvPage`.
		 * 
		 * What is returned is a tuple containing the property value (if set)
		 * as the first element and the "kindTag" (aka, tag name without leading
		 * pound symbol) as the second.
		 */
		get_kind_prop: get_kind_prop(plugin),

		/**
		 * **metadata**`()`
		 * 
		 * Provides a dictionary of key/values where:
		 * - the keys are an element in the `PropertyType` union
		 * - the values -- where defined -- are an array of Frontmatter keys which
		 * are of the given type.
		 */
		metadata,

		/**
		 * **show_prop**`(page, prop, ...fallbacks)`
		 * 
		 * Show a property on the passed in page (optionally including _fallback_ properties to
		 * find a value). If nothing is found across the relevant properties an empty string is
		 * returned. 
		 */
		show_prop: show_prop(plugin),

		/**
		 * **show_links**`(page)`
		 * 
		 * Shows a horizontal row of links that the given page has in it's frontmatter.
		 */
		show_links: show_links(plugin, linkIcons as Record<string, string>),

		/**
		 * **show_created_date**`(page,[format])`
		 * 
		 * Shows the date a given page was created; optionally allowing 
		 * you to specify the 
		 * [Luxon format](https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens) as a string.
		 */
		show_created_date,

		/**
		 * **show_modified_date**`(page,[format])`
		 * 
		 * Shows the date a given page was modified; optionally allowing 
		 * you to specify the 
		 * [Luxon format](https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens) as a string.
		 */
		show_modified_date,

		/** 
		 * The current page's "kind tag"
		 */
		kind_tag: get_kind_tag(plugin)(current),

		/**
		 * **isKindedPage**(page,[category])
		 * 
		 * Tests whether a given page is a _kinded_ page and _optionally_ if
		 * the page is of a particular `category`.
		 */
		isKindedPage: isKindedPage(plugin),

		/**
		 * **isKindDefnPage**(page)
		 * 
		 * Tests whether a given page is a _kind definition_ page.
		 */
		isKindDefnPage,
		
		/**
		 * **page**`(path, [originFile])`
		 * 
		 * Map a page path to the actual data contained within that page.
		 */
		page(pg: string | Link, originFile?: string) {
			return plugin.dv.page(pg, originFile);
		},

		pages(query?: string, originFile?: string) {
			return plugin.dv.pages(query, originFile);
		},

		/**
		 * **as_array**`(v)`
		 * 
		 * Utility function which ensures that the passed in value _is_ an array
		 */
		as_array,

		/**
		 * Return an array of paths (as strings) corresponding to pages 
		 * which match the query.
		 */
		pagePaths(query?: string, originFile?: string) {
			return plugin.dv.pagePaths(query, originFile);
		},
		/**
		 * **date**`(pathLike)`
		 * 
		 * Attempt to extract a date from a string, link or date.
		 */
		date(pathLike: string | Link | DateTime) {
			return plugin.dv.date(pathLike);
		},		

		/**
		 * **duration**`(pathLike)`
		 * 
		 * Attempt to extract a duration from a string or duration.
		 */
		duration(str: string | Duration) {
			return plugin.dv.duration(str);
		},

		/**
		 * **createFileLink**`(pathLike,[embed],[display])`
		 * 
		 * A convenience method that can receive multiple inputs and 
		 * convert them into a `FileLink`.
		 */
		createFileLink(pathLike: string | Link | DvPage, embed?: boolean, display?: string) {
			if(isLink(pathLike)) {
				const pg = plugin.dv.page(pathLike.path);
				if(!pg) {
					plugin.error(`createFileLink() had issues creating a link from the passed in parameters`, {pathLike, embed, display});

					return "";
				}
				return plugin.dv.fileLink(
					pg.file.path,
					isUndefined(embed) ? false : embed,
					isUndefined(display) ? extractTitle(pg.file.name) : display
				);
			} else if (isDvPage(pathLike)) {
				return plugin.dv.fileLink(
					pathLike.file.path,
					isUndefined(embed) ? false : embed,
					isUndefined(display) ? extractTitle(pathLike.file.name) : display
				);
			} else if(isString(pathLike)) {
				const pg = plugin.dv.page(pathLike);
				if(!pg) {
					plugin.error(`createFileLink() had issues creating a link from the passed in string path`, {pathLike, embed, display});

					return "";
				}
				return plugin.dv.fileLink(
					pg.file.path,
					isUndefined(embed) ? false : embed,
					isUndefined(display) ? extractTitle(pg.file.name) : display
				);
			}
		},

		/**
		 * **fileLink**`(path, [embed],[display])`
		 * 
		 * Create a dataview file link to the given path.
		 */
		fileLink(path: string, embed?: boolean, displayAs?: string) {
			return plugin.dv.fileLink(path, embed, displayAs);
		},
		/**
		 * **sectionLink**`(path, [embed],[display])`
		 * 
		 * Create a dataview section link to the given path.
		 */
		sectionLink(path: string, embed?: boolean, display?: string) {
			return plugin.dv.sectionLink(path,embed,display);
		},
		/**
		 * **blockLink**`(path, [embed],[display])`
		 * 
		 * Create a dataview block link to the given path.
		 */
		blockLink(path: string, embed?: boolean, display?: string)	{
			return plugin.dv.blockLink(path, embed, display);
		},

		/**
		 * **table**`(headers,values,container,component,filePath)`
		 * 
		 * Render a dataview table with the given headers, and the 
		 * 2D array of values.
		 */
		async table(
			headers: string[],
			values: any[] | DataArray<any>
		) {
			return plugin.dv.table(headers,values,container,plugin,filePath)
		},

		/**
		 * **renderValue**`(value, [inline])`
		 * 
		 * Render an arbitrary value into a container.
		 */
		async renderValue(
			value: unknown,
			inline: boolean = false
		) {
			return plugin.dv.renderValue(value, container, plugin, filePath, inline);
		},

		/** 
		 * **taskList**`(tasks,groupByFile)`
		 * 
		 * Render a dataview task view with the given tasks. 
		 */
		async taskList(
			tasks: Grouping<SListItem>,
			groupByFile: boolean
		) {
			return plugin.dv.taskList(tasks, groupByFile, container, plugin, filePath);
		},

		/**
		 * **list**(values, container, component, filePath)
		 * 
		 * Render a dataview **list** of the given values by:
		 * 
		 * - adding a sub-container DIV to the passed in _container_
		 * - using the `component`'s `addChild()` method to 
		 * adding a child element which is given the sub-container
		 * for rendering purposes
		 */
		async list(
			values: unknown[] | DataArray<unknown> | undefined
		) {
			return plugin.dv.list(values, container, plugin, filePath);
		},

		async paragraph(text: string) {
			return plugin.dv.renderValue(text, container, plugin, filePath, false);
		},

		/**
		 * **show_subcategories_for**`(page)`
		 * 
		 * Intended for category pages to be passed in and in return
		 * will get a `DataArray<Link>` as response.
		 */
		show_subcategories_for: show_subcategories_for(plugin),


		async ul(...items: readonly (string | UlCallback)[]) {
			const wrap_ul = (items: string) => `<ul>${items}</ul>`
			const render_items = (items: readonly (string | UlCallback)[]) => items
				.map(i => (
					isFunction(i)
						? isFunction(i(ul_api))
							? ""
							: i(ul_api)
						: `<li>${i}</li>`
				) as unknown as string)
				.filter(i => i !== "")
				.join("\n") as string;

			const ul_api: UlApi = {
				indent: (...items: string[]) => wrap_ul(render_items(items)),
				done: createFnWithProps(() => "", { escape: true })
			};

			
			return plugin.dv.renderValue(
				wrap_ul(render_items(items)), 
				container, plugin, filePath, false
			);
		},
		fmt: fmt(plugin)(container,filePath)
	};
}
	