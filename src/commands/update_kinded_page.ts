import { Editor, MarkdownView } from "obsidian";
import KindModelPlugin from "../main";
import { getBasePageContext } from "../utils/page/getBasePageContext";
import { isCategoryPage } from "../utils/type_guards/isCategoryPage";
import { categoryPage } from "../utils/page/page_context/categoryPage";

export const update_kinded_page = (plugin: KindModelPlugin) => async (editor: Editor, view: MarkdownView) => {
  const p = await getBasePageContext(plugin, view); 
  plugin.info("update-kinded-page", p);

  if (view.getViewType() !== "markdown") {
    plugin.warn(
      "non-markdown file", 
      `update-kinded-page[${view.file?.name || view.file?.basename}] was run on a non-markdown page so nothing to do`
    );
  } else {

  
    if (isCategoryPage(p)) {
		const cp = categoryPage(plugin, p);
		plugin.info(`Category Page [${cp.ref_tag}, ${p?.file?.name}]`);
	
      if (!p.meta.fm.kind) {
        // 
      }
    } 
  }
  
}
