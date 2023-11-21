import { KindApi } from "helpers/KindApi";
import KindModelPlugin from "main";
import { Editor, MarkdownView } from "obsidian";
import { getPageContext } from "utils/getPageContext";

export const update_kinded_page = (plugin: KindModelPlugin) => async (editor: Editor, view: MarkdownView) => {
  const content = view.getViewData();
  const ctx = getPageContext(view, plugin); 
  const k = KindApi(plugin)(await plugin.kinds());

  if (view.getViewType() !== "markdown") {
    plugin.warn(
      "non-markdown file", 
      `update-kinded-page[${view.file?.name || view.file?.basename}] was run on a non-markdown page so nothing to do`
    );
    return;
  }
  
  plugin.debug(
    "context",
    "command: update-kinded-page",  
    ctx,
    {tags: k.kind_tags(), kinds: k.kind_names()},
    `This page has the following tags: ${ctx.meta.etags}`,
    {
      structure: ctx.contentStructure
    }
  );

  if (ctx.meta.isCategoryPage) {
    const tag = k.get_category_tag(ctx);
    const kind = k.lookup_kind_by_tag(tag);
    plugin.debug(`category page [${tag}, ${kind?.file.name}]`);

    if (!ctx.meta.fm.kind) {
      
    }
  } 


}
