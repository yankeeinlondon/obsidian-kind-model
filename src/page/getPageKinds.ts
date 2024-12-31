import { isString, stripLeading } from "inferred-types";
import {  getPageType, isKindTag, isProps } from "~/api";
import KindModelPlugin from "~/main";
import { isPageReference } from "~/type-guards";
import { DvPage } from "~/types";
import { getPage } from "./getPage";

/**
 * **getPageKindTags**`(plugin) -> (pg) -> string[]`
 * 
 * Returns an array of _kind_ tags (without `#`) which represent
 * the kind of the page.
 * 
 * **Related:** `getPageKinds()`
 */
export function getPageKindTags(p: KindModelPlugin) {
	return (pg: DvPage): string[] | [string] | [undefined] => {
		const isApi = isProps(p)(pg);
		const pgType = getPageType(p)(pg, isApi);
		
		switch(pgType) {
			case "kind-defn": 
				return [
					stripLeading(pg.file.etags.find(i => i.startsWith("#kind/")), "#kind/")
				] as [string] | [undefined];
			case "type-defn":
				return [undefined];
			case "kinded":
			case "kinded > category":
			case "kinded > subcategory":
				return [
					stripLeading(pg.file.tags.find(i => isKindTag(p)(i)), "#"),
				] as [string] | [undefined];
			case "multi-kinded":
			case "multi-kinded > category":
			case "multi-kinded > subcategory":
				const tags = new Set();
				return (
					(Array.from(pg.file.tags) as string[])
						.filter((i: string) => isKindTag(p)(i))
						.map(i => stripLeading(i, "#"))
				) as string[]

			default: 
				return [undefined];
		}		 
	}
}

export function getKindPageByTag(p: KindModelPlugin) {
	return (tag: string): DvPage | undefined => {
		const safeTag = stripLeading(
			stripLeading(tag, "#"),
			"kind"
		);
		const pages = p.dv.pages(`#kind/${safeTag}`);
		return pages.length > 0
			? pages[0] as DvPage
			: undefined
	}
}

/**
 * **getPageKinds**`(plugin) -> (pg) -> DvPage[]`
 * 
 * Returns an an array of `DvPage` pages representing the **Kind**(s) of
 * the given page.
 * 
 * **Related:** `getPageKindTags()`
 */
export function getPageKinds(p: KindModelPlugin) {
	return (pg: DvPage): DvPage[] => {
		const isApi = isProps(p)(pg);
		const pgType = getPageType(p)(pg, isApi);

		switch(pgType) {
			case "kinded":
			case "kinded > category":
			case "kinded > subcategory":
				if(
					pg.kind && isPageReference(pg.kind)
				) {
					return [ getPage(p)(pg.kind) as DvPage ]
				} else {
					const kindTag = getPageKindTags(p)(pg).pop();
					if(kindTag) {
						const kindPage = getKindPageByTag(p)(kindTag);
						return kindPage ? [ kindPage ] : [];
					} else {
						return [  ];
					}
				}
			case "kind-defn":
				return p?.kindDefn ? [ p.kindDefn]  : [  ];
			case "type-defn":
				return p?.typeDefn ? [ p.typeDefn]  : [  ];
			case "multi-kinded":
			case "multi-kinded > category":
			case "multi-kinded > subcategory":
				const kinds = pg.file.frontmatter.kinds;
				if(
					Array.isArray(kinds) && kinds.some(i => isPageReference(i))
				) {
					return kinds.map(i => isPageReference(i) ? getPage(p)(i) : undefined).filter(i => i) as [DvPage, ...DvPage[]]
				} else {
					const kindTags = getPageKindTags(p)(pg);
					const kindPages = kindTags.map(
						t => isString(t) ? getKindPageByTag(p)(t) : undefined
					).filter(i => i);
					return kindPages.length > 0 
						? kindPages as [DvPage, ...DvPage[]]
						: []
				}
			case "none":
				return [  ]
		}
	}
}
