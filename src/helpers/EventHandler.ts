import KindModelPlugin from "~main";
import {  WorkspaceLeaf } from "obsidian";
import { TAbstractFile } from "types";


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
	onFileModified(cb: ((evt: OnFileModified) => void)) {
		plugin.registerEvent(
			plugin.app.vault.on("modify", (file: TAbstractFile) => {

				cb({
					...file
				});

			})
		);
		plugin.info("registered event", cb)
	}

})
