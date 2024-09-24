import KindModelPlugin from "~main";
import { Notice } from "obsidian";

export const on_file_deleted = (plugin: KindModelPlugin) => {
	plugin.registerEvent(plugin.app.vault.on('delete', evt => {
		const kind_folder = plugin.settings.kind_folder;
		const find = new RegExp(`^${kind_folder}$`);
		if (find.test(evt.path)) {
			new Notice('Kind file deleted');
		}
	}));
}
