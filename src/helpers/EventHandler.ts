import KindModelPlugin from "~/main";
import {  Editor, MarkdownFileInfo, MarkdownView, Tasks, WorkspaceLeaf } from "obsidian";
import { TAbstractFile, TFile } from "~/types";


export type CursorPosition = {
	line: number;
	ch: number;
}

export type OnTabChange = {
	pageName: string;
	filePath: string;
	icon: string;
	backlinks?: unknown;
	/**
	 * The cursor position on the page
	 */
	cursor: {
		from: CursorPosition;
		to: CursorPosition;
	}
	/**
	 * Whether the page which was just selected has text actively
	 * selected on it.
	 */
	hasSelectedText: boolean;
	leaf: WorkspaceLeaf;
}

export type OnFileModified = TAbstractFile;
export type OnFileCreated = TAbstractFile;
export type OnFileDeleted = TAbstractFile;
export type OnQuickPreview = (file: TFile, data: string) => any;


/**
 * Provides better _event_ types for Obsidian hooks
 */
export const EventHandler = (plugin: KindModelPlugin) => ({
	/** a new active tab has been selected */
	onTabChange(cb: ((event: OnTabChange) => void)) {
		plugin.registerEvent(
			plugin.app.workspace.on("active-leaf-change", (leaf) => {
				if (leaf) {
					let pageName = leaf.view.getDisplayText();
					let icon = leaf.view.getIcon();
					let state = leaf.view.getState() as { file: string; mode: string; backlinks: undefined | unknown; source: boolean};
					let ephemeral = leaf.getEphemeralState().cursor as OnTabChange["cursor"];
		
					// call the callback with typed event
					cb({
						pageName,
						filePath: state.file,
						icon: icon,
						cursor: ephemeral,
						hasSelectedText: !(
							ephemeral?.from?.ch === ephemeral?.to?.ch &&
							ephemeral?.from?.line === ephemeral?.to?.line
						),
						leaf
					})
				} 
			})
		);
	},

	/**
	 * Provide a callback to whenever a _layout change_ is detected.
	 */
	onLayoutChange: (cb: (() => void)) => {
		plugin.app.workspace.on("layout-change", () => {
			cb();
		})
	},

	/**
	 * Provide a callback to whenever a _resize_ is detected.
	 */
	onResize: (cb: (() => void)) => {
		plugin.app.workspace.on("resize", () => {
			cb();
		})
	},
	/**
	 * Provide a callback to whenever a _window open_ event is detected.
	 */
	onWindowOpen: (cb: (() => void)) => {
		plugin.app.workspace.on("window-open", () => {
			cb();
		})
	},

	/**
	 * Provide a callback to whenever a _window close_ event is detected.
	 */
	onWindowClose: (cb: (() => void)) => {
		plugin.app.workspace.on("window-close", () => {
			cb();
		})
	},


	/**
	 * Provide a callback whenever a **quick preview** event is fired.
	 */
	onQuickPreview: (cb: ((file: TFile, data: string) => any)) => {
		plugin.app.workspace.on("quick-preview", (f, d) => {
			return cb(f as any, d);
		})
	},

	/**
	 * Provide a callback whenever a **quick preview** event is fired.
	 */
	onQuit: (cb: ((tasks: Tasks) => any)) => {
		plugin.app.workspace.on("quit", (tasks: Tasks) => {
			return cb(tasks);
		})
	},	

	/**
	 * Provide a callback to handle each time a new file is **modified**.
	 */
	onFileModified(cb: ((evt: OnFileModified) => void)) {
		plugin.registerEvent(
			plugin.app.vault.on("modify", (file: TAbstractFile) => {
				cb({...file});
			})
		);
		plugin.info("registered event", cb)
	},
	/**
	 * Provide a callback to handle each time a new file is **created**.
	 */
	onFileCreated(cb: ((evt: OnFileCreated) => void)) {
		plugin.app.vault.on("create", (file: OnFileCreated) => {
			cb({...file})
		});
	},
	/**
	 * Provide a callback to handle each time a file is **deleted**.
	 */
	onFileDeleted(cb: ((evt: OnFileDeleted) => void)) {
		plugin.app.vault.on("delete", (file: OnFileCreated) => {
			cb({...file})
		});
	},

});
