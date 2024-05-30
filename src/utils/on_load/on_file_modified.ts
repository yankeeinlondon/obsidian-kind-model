import KindModelPlugin from "main";
import { Notice } from "obsidian";

/**
 * event handler triggered when an _existing_ file is _modified_.
 */
export const on_file_modified = (plugin: KindModelPlugin) => {
	plugin.registerEvent(plugin.app.vault.on('modify', evt => {
		const kind_folder = plugin.settings.kind_folder;
		const find = new RegExp(`^${kind_folder}`);
		if (find.test(evt.path)) {
			new Notice('Kind file modified');
		}
	}));
};
