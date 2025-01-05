import type KindModelPlugin from "~/main";
import type { DvPage, FuturePage, PageReference } from "~/types";
import { getPath } from "~/api/getPath";
import { isDvPage, isFuturePage, isPageInfo, isPageReference } from "~/type-guards";

/**
 * returns a `DvPage` representation of a page.
 */
export function getPage(p: KindModelPlugin) {
  return <T extends PageReference | undefined>(
    pg: T,
  ): T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage => {
	if(isFuturePage(pg)) {
		return undefined as unknown as T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage ;
	}

    if (isDvPage(pg)) {
      return pg as unknown as T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage 
    }

    if (isPageInfo(pg)) {
      return pg.current as unknown as T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage 
    }

    const path = getPath(pg);
    const page = path ? p.dv.page(path) : undefined;

    return page as unknown as T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage 
  };
}

/**
 * Takes an array of items and returns those elements inside which were a PageReference
 * into a `DvPage`.
 */
export function getPages(p: KindModelPlugin) {
	return <T extends unknown[]>(arr: T) => arr.map(i => isPageReference(i) ? getPage(p)(i) : undefined).filter(i => i) as DvPage[]
}
