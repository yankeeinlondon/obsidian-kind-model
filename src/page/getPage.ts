import { ensureLeading, ensureTrailing, isObject, isString, stripLeading } from "inferred-types";
import { getPath } from "~/api/getPath";
import KindModelPlugin from "~/main";
import { isDvPage, isPageInfo } from "~/type-guards";
import { DvPage, PageReference } from "~/types";

/**
 * returns a `DvPage` from the page cache _or_ the page info cache (when available); otherwise 
 * will run a query to get it and ensure that's placed in the page cache.
 */
export const getPage = (p: KindModelPlugin) => (
	pg: PageReference | undefined
): DvPage | undefined => {

	if (isDvPage(pg)) {
		return pg;
	}

	if (isPageInfo(pg)) {
		return pg.current;
	}


	const path = getPath(pg);
	const page = path 
		? p.dv.page(path)
		: undefined;

	return page
}
