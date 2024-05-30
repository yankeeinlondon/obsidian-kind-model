/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkdownView, TFile } from "obsidian";
import Markdoc from "@markdoc/markdoc";
import { splitContent } from "../splitContent";
import KindModelPlugin from "../../main";
import { getHeadingLevel } from "../getHeadingLevel";
import { BasePageContext } from "../../types/PageContext";
import { DataViewApi, DvPage, FileLink } from "../../types/dataview_types";
// import { categoryPage } from "./page_context/categoryPage";
// import { kindDefinition } from "./page_context/kindDefinition";
// import { enumDefinition } from "./page_context/enumDefinition";
// import { subcategoryPage } from "./page_context/subcategoryPage";
// import { typeDefinition } from "./page_context/typeDefinition";
import { isMarkdownView } from "../type_guards/isMarkdownView";
import { convertToPageWithArrays } from "../convertToPageWithArrays";

const looks_like_kind = (k: unknown, dv: DataViewApi): boolean => {
	try {
		return typeof k === "object" && k !== null
			? (k as Record<string,any>)?.file?.basename 
				? true 
				: (k as Record<string,any>)?.file?.path
					? true
					: false
			: typeof k === "string" && dv.page(k)?.file
				? true
				: false

	} catch {
		return false;
	}
}

/**
 * **getBasePageContext**(plugin, ref)
 * 
 * Takes a variety of references to a page and returns a `BasePageContext<THasView>`.
 */
export const getBasePageContext = (plugin: KindModelPlugin) => <
	TRef extends TFile | FileLink | string | MarkdownView | DvPage
>( 
	ref: TRef
): BasePageContext<TRef extends MarkdownView ? true : false> => {
	let context: Partial<BasePageContext<TRef extends MarkdownView ? true : false>> = {}; 
	const page = convertToPageWithArrays(plugin.api.get_dv_page(ref));
	const view = isMarkdownView(ref) ? ref : null;

	if (page) {
		const content = view ? view.getViewData() : "";
        const ast = Markdoc.parse(content || "");
		const fm = page.file.frontmatter;
		const aliases = page.file.aliases || [];
        const renderableTree = Markdoc.transform(ast);
		const withView = view
			? {
				mode: view.currentMode,
				leaf: view.leaf,
				leaf_height: (view.leaf as any)?.height,
				leaf_width: (view.leaf as any)?.width,
				leaf_id: (view.leaf as any)?.id || "",
				popover: view.hoverPopover,
				allowNoFile: view.allowNoFile,
				previewMode: view.previewMode,
				viewType: view.getViewType(),
				navigation: view.navigation,
				editor: view.editor,
				requestSave: view.requestSave,
				content,
				showBackLinks: (view as any)?.showBackLinks,
				contentStructure: {
					ast: Markdoc.parse(content),
					renderableTree,
					h2_tags: getHeadingLevel(page.file.path, content as string, 2, plugin),
					...(splitContent(content)),
				},
				dom: {
					container: view.containerEl,
					content: view.contentEl,
					icon: (view as any)?.iconEl,
					backButton: (view as any)?.backButtonEl,
					forwardButton: (view as any)?.forwardButtonEl,
					title: (view as any)?.titleEl,
					titleContainer: (view as any)?.titleContainerEl,
					titleParent: (view as any)?.titleParentEl,
					inlineTitle: (view as any)?.inlineTitleEl,
					actions: (view as any)?.actionsEl,
					modeButton: (view as any)?.modeButtonEl,
					backlinks: (view as any)?.backlinksEl,
				},
		
			}
			: {};

      try {

        // const api = KindApi(plugin)(plugin.settings.cache?.kinds);
		// const kind_definitions = api.kind_tags();

        context = {
			//   api,
			aliases,
			fm,
			inlinks: page.file.inlinks,
			outlinks: page.file.outlinks,
			etags: page.file.etags,
			tags: page.file.tags,
			starred: page.file.starred,
			lists: page.file.lists,
			tasks: page.file.tasks,
			// datetime
			cday: page.file.cday,
			ctime: page.file.ctime,
			mday: page.file.mday,
			mtime: page.file.mtime,

			file: {
				name: page.file.name,
				path: page.file.path,
				folder: page.file.folder,
				ext: page.file.ext,
				link: page.file.link,
				size: page.file.size
			},
			...withView,
        } as BasePageContext<TRef extends MarkdownView ? true : false> ;  
      } catch (e) {
        console.log({plugin});
        
        plugin.error(`Problems getting page context: ${page.file.path}`, e);
      }
  } else {
    plugin.error(`Could not build a base page context!!`, ref);
  }

  return context as BasePageContext<TRef extends MarkdownView ? true : false>as BasePageContext<TRef extends MarkdownView ? true : false>
}
