import type KindModelPlugin from "~/main";
import type { ObsidianCodeblockEvent, PageInfoBlock } from "~/types";
import { renderApi } from "~/api/renderApi";
import { getPageInfo } from "./getPageInfo";

/**
 * Creates a `PageInfoBlock` type which builds on the `PageInfo` type
 * but with the benefit of having the following core types of information:
 *
 * 1. the `source` of the code block
 * 2. the code block's HTML container element
 * 3. Obsidian's `Component` (which we're probably not taking full advantage of yet)
 */
export function getPageInfoBlock(p: KindModelPlugin) {
  return (evt: ObsidianCodeblockEvent): PageInfoBlock | undefined => {
    const { source, el, ctx } = evt;
    const filePath = ctx.sourcePath;
    const page = getPageInfo(p)(filePath);

    if (page) {
      const sectionInfo = ctx.getSectionInfo(el);

      return {
        ...page,
        content: source,
        container: el,
        component: ctx,
        sectionInfo,
        render: renderApi(p)(el, filePath),
      } as PageInfoBlock;
    }
  };
}
