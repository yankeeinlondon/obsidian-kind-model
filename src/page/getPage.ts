import { ensureLeading, ensureTrailing, isObject, isString, stripLeading } from "inferred-types";
import { getPath } from "~/api/getPath";
import KindModelPlugin from "~/main";
import { DvPage, PageReference } from "~/types";

/**
 * returns a `DvPage` from the page cache _or_ the page info cache (when available); otherwise 
 * will run a query to get it and ensure that's placed in the page cache.
 */
export const getPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): DvPage | undefined => {
	if (
		isString(pg) && (
			pg.includes("/category/") || 
			pg.includes("/subcategory/") ||
			pg.includes("kind/") ||
			pg.includes("type/") ||
			Array.from(p.cache?.kindDefinitionsByTag?.keys() || []).some(
				i => i.startsWith(stripLeading(pg, "#"))
			)
		)
	) {
		return p.dv.page(ensureLeading(pg, "#"));
	}

	const path = getPath(pg);
	const fc = p?.api?.fileCache;
	const file = isObject(fc) && path && path in fc
		? fc[path]
		: undefined;
	const page = path 
		? p.dv.page(path)
		: undefined;

	return page
}
