import type KindModelPlugin from "~/main";
import type { PageInfoBlock } from "~/types";

export function showQueryError(_p: KindModelPlugin) {
  return (handler: string, page: PageInfoBlock, content: string) => {
    page.render.callout("error", `Query error in ${handler}`, {
      content,
    });
  };
}
