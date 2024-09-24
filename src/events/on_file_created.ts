import KindModelPlugin from "~main";
import { Notice } from "obsidian";

/**
 * event handler triggered when a new file is added to the vault
 */
export const on_file_created = (plugin: KindModelPlugin) => {
	plugin.registerEvent(plugin.app.vault.on('create', evt => {
		const kind_folder = plugin.settings.kind_folder;
		const find = new RegExp(`^${kind_folder}$`);
		if (find.test(evt.path)) {
			new Notice('Kind file added');
		}
	}));
};
