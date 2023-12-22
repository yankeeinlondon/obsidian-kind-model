import { Editor, MarkdownView } from "obsidian";
import KindModelPlugin from "../main";
import { getPageContext } from "../utils/getPageContext";

export const update_kinded_page = (plugin: KindModelPlugin) => async (editor: Editor, view: MarkdownView) => {
  const content = view.getViewData();
  const ctx = await getPageContext(view, plugin); 
  const {kind} = ctx;
  plugin.info("update-kinded-page", `page context: ${ctx}`);

  if (view.getViewType() !== "markdown") {
    plugin.warn(
      "non-markdown file", 
      `update-kinded-page[${view.file?.name || view.file?.basename}] was run on a non-markdown page so nothing to do`
    );
    return;
  }
  
  plugin.info(
    "context",
    "command: update-kinded-page",  
    ctx,
    {tags: kind.kind_tags(), kinds: kind.kind_names()},
    `This page has the following tags: ${ctx.meta.etags}`,
    {
      structure: ctx.contentStructure
    }
  );

  if (ctx.meta.isCategoryPage) {
    const tag = k.get_category_tag(ctx);
    const kind = k.lookup_kind_by_tag(tag);
    plugin.info(`category page [${tag}, ${kind?.file.name}]`);

    if (!ctx.meta.fm.kind) {
      
    }
  } 


}
