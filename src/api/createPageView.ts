import { MarkdownView } from "obsidian";
import Markdoc, { Node } from "@markdoc/markdoc";
import { createPageInfo } from "./createPageInfo";
import { MarkdownViewMeta, PageInfo, PageView } from "../types";
import KindModelPlugin from "../main";
import { getHeadingLevel } from "../utils/getHeadingLevel";
import { splitContent } from "../utils/splitContent";


export const getViewMeta = (p: KindModelPlugin) => (
	view: MarkdownView, 
	info: PageInfo
): MarkdownViewMeta => {
	const content = view.getViewData();
	const ast = Markdoc.parse(content) as Node;
	const renderableTree = Markdoc.transform(ast);

	return {
		iconAssigned: view.icon,

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
		load: view.load,

		onLoadFile: view.onLoadFile,
		onUnloadFile: view.onUnloadFile,
		onResize: view.onResize,
		onRename: view.onRename,
		onPaneMenu: view.onPaneMenu,

		register: view.register,
		registerDomEvent: view.registerDomEvent,
		registerEvent: view.registerEvent,
		registerInterval: view.registerInterval,

		getEphemeralState: view.getEphemeralState,
		getState: view.getState,
		getViewData: view.getViewData,
		getViewType: view.getViewType,

		content,
		showBackLinks: (view as any)?.showBackLinks,
		contentStructure: {
			ast,
			renderableTree,
			h2_tags: getHeadingLevel(info.path, content, 2, p),
			...(splitContent(content)),
		}
	}
}

const getDomMeta = (view: MarkdownView, info: PageInfo) => ({
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
})

/**
 * Converts a `MarkdownView` to a `PageView`
 */
export const createPageView = (p: KindModelPlugin) => (view: MarkdownView) => {
	if (view?.file?.path) {
		const info = createPageInfo(p)(view.file.path);
		if (info) {


			const viewMeta = {
				view: getViewMeta(p)(view, info),
				dom: getDomMeta(view, info)
			}
	
			return {
				...info,
				...viewMeta
			} as PageView;
		}
	}


}
