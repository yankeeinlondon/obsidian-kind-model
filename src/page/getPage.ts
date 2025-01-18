import { isString, stripSurround } from "inferred-types";
import { getPath } from "~/api/getPath";
import type KindModelPlugin from "~/main";
import { isDvPage, isFuturePage, isMdLink, isPageInfo, isPageReference } from "~/type-guards";
import type { DvPage, FuturePage, PageReference } from "~/types";

type Returns<T extends PageReference | undefined> = T extends undefined ? undefined : T extends FuturePage ? undefined : DvPage;

/**
 * returns a `DvPage` representation of a page.
 */
export function getPage(p: KindModelPlugin) {
  return <T extends PageReference | undefined>(
    pg: T,
  ): Returns<T> => {
    if (isFuturePage(pg)) {
      return undefined as unknown as Returns<T>;
    }

    if (isDvPage(pg)) {
      return pg as unknown as Returns<T>;
    }

    if (isPageInfo(pg)) {
      return pg.current as unknown as Returns<T>;
    }

	if(isString(pg) && isMdLink(pg.trim())) {
		const [path, alias] = stripSurround("[[","]]")(pg.trim()).split("|");
		return getPage(p)(path) as unknown as Returns<T>;
	}

    const path = getPath(pg);
    const page = path ? p.dv.page(path) : undefined;

    return page as unknown as Returns<T>;
  };
}

/**
 * Takes an array of items and returns those elements inside which were a PageReference
 * into a `DvPage`.
 */
export function getPages(p: KindModelPlugin) {
  return <T extends unknown[]>(arr: T) => arr.map(i => isPageReference(i) ? getPage(p)(i) : undefined).filter(i => i) as DvPage[];
}
