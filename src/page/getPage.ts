import type KindModelPlugin from "~/main";
import type { DvPage, PageReference } from "~/types";
import { getPath } from "~/api/getPath";
import { isDvPage, isPageInfo } from "~/type-guards";

/**
 * returns a `DvPage` representation of a page.
 */
export function getPage(p: KindModelPlugin) {
  return <T extends PageReference | undefined>(
    pg: T,
  ): T extends undefined ? undefined : DvPage => {
    if (isDvPage(pg)) {
      return pg as unknown as T extends undefined ? undefined : DvPage;
    }

    if (isPageInfo(pg)) {
      return pg.current as unknown as T extends undefined ? undefined : DvPage;
    }

    const path = getPath(pg);
    const page = path ? p.dv.page(path) : undefined;

    return page as unknown as T extends undefined ? undefined : DvPage;
  };
}
