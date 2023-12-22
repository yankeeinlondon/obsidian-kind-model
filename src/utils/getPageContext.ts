/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkdownView } from "obsidian";
import Markdoc from "@markdoc/markdoc";
import { splitContent } from "./splitContent";
import KindModelPlugin from "../main";
import { getHeadingLevel } from "./getHeadingLevel";
import { PageContext } from "../types/PageContent";
import { isTFile } from "./isTFile";
import { KindApi } from "../helpers/KindApi";

export const  getPageContext = async (view: MarkdownView, plugin: KindModelPlugin): Promise<PageContext> => {
  const file = view.file;
  let context: Partial<PageContext> = {};

  if (isTFile(file)) {
      try {
        const page = plugin.dv.page(file.path);
        const content = view.getViewData();
        const {yaml, body, blocks, h1, preH1, postH1} = splitContent(content);
        const ast = Markdoc.parse(content || "");
        const renderableTree = Markdoc.transform(ast);
        const kind = KindApi(plugin)(await plugin.kinds());

        context = {
          kind,
          meta: {
            dv: {
              ...page.file.tags.settings
            },
            aliases: page.aliases || [],
            fm: page.file.frontmatter,

            inlinks: page.file.inlinks.values,
            outlinks: page.file.outlinks.values,

            etags: page.file.etags.values,
            tags: page.file.tags.values,

            isCategoryPage: page.file.tags.includes("#category"),
            isSubcategoryPage: page.file.tags.includes("#sub-category"),
            isKindDefinitionPage: page.file.tags.includes("#kind") && !page.file.tags.includes("#category") && page.file.tags.includes("#sub-category"),

            starred: page.file.starred,
            
            lists: page.file.lists.values,
            tasks: page.file.tasks.values,

            icon: view.icon,
            mode: view.currentMode,
            keys: Object.keys(view),

            datetime: {
              cday: page.file.cday,
              ctime: page.file.ctime,
              mday: page.file.mday,
              mtime: page.file.mtime
            },

            leaf: view.leaf,
            leaf_height: (view.leaf as any)?.height,
            leaf_width: (view.leaf as any)?.width,
            leaf_id: (view.leaf as any)?.id || "",
            popover: view.hoverPopover,
            allowNoFile: view.allowNoFile,
            previewMode: view.previewMode,
            view: view.getViewType(),
            showBackLinks: (view as any)?.showBackLinks,
            navigation: view.navigation,
          },
          editor: view.editor,
          requestSave: view.requestSave,
          content,
          contentStructure: {
            ast: Markdoc.parse(content),
            renderableTree,
            h2_tags: getHeadingLevel(file.path, content, 2, plugin),
            postH1,
            yaml,
            body,
            blocks,
            h1,
            preH1,
          },
          file: {
            path: file.path,
            folder: page.file.folder,
            ext: page.file.ext,
            name: page.file.name,
            link: page.file.link,
            basename: file.basename,
            size: page.file.size
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

        };  
      } catch (e) {
        console.log({plugin});
        
        plugin.error(`Problems getting page context: ${file.path}`, e);
      }
  } else {
    plugin.error(`No path found on view's file dictionary!`, file);
  }

  return context as PageContext;
};
