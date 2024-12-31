import type KindModelPlugin from "~/main";
import type { FuturePage, PageType } from "~/types";

export function futurePage(p: KindModelPlugin) {
  return (
    pageType: PageType,
    tag: string,
  ) => {
    return ({
      kind: "FuturePage",
      pageType,
      tag,
    }) as FuturePage;
  };
}
