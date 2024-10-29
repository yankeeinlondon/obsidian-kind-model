import { isObject } from "inferred-types";
import { getPath } from "~/api/getPath";
import KindModelPlugin from "~/main";
import { DvPage, PageReference } from "~/types";

/**
 * returns a `DvPage` from the page cache _or_ the page info cache (when available); otherwise 
 * will run a query to get it and ensure that's placed in the page cache.
 */
export const getPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined,
	force?: boolean
): DvPage | undefined => {
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
