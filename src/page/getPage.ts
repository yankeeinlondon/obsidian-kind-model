import type KindModelPlugin from "~/main";
import type { DvPage, PageReference } from "~/types";
import { getPath } from "~/api/getPath";
import { isDvPage, isPageInfo } from "~/type-guards";

/**
 * returns a `DvPage` from the page cache _or_ the page info cache (when available); otherwise
 * will run a query to get it and ensure that's placed in the page cache.
 */
export function getPage(p: KindModelPlugin) {
  return (pg: PageReference | undefined): DvPage | undefined => {
    if (isDvPage(pg)) {
      return pg;
    }

    if (isPageInfo(pg)) {
      return pg.current;
    }

    const path = getPath(pg);
    const page = path ? p.dv.page(path) : undefined;

    return page;
  };
}
