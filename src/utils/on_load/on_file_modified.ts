import { EventHandler } from "../../helpers/EventHandler";
import KindModelPlugin from "../../main";
import { Notice } from "obsidian";

/**
 * event handler triggered when an _existing_ file is _modified_.
 */
export const on_file_modified = (plugin: KindModelPlugin) => {
	EventHandler(plugin).onFileModified((evt) => {
		plugin.api.isKindedPage(evt.path);
		

		const kind_folder = plugin.settings.kind_folder;
		const find = new RegExp(`^${kind_folder}`);
		if (find.test(evt.path)) {
			new Notice('Kind file modified');
		}
	})
};

