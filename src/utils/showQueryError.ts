import type KindModelPlugin from "~/main";
import type { PageInfoBlock } from "~/types";

export function showQueryError(p: KindModelPlugin) {
  return (
    handler: string,
    page: PageInfoBlock,
    content: string,
  ) => {
    page.callout("error", `Query error in ${handler}`, {
      content,
    });
  };
}
