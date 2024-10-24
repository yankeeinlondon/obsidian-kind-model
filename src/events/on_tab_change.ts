import { EventHandler } from "~/helpers/EventHandler";
import KindModelPlugin from "~/main";

export const on_tab_change = (plugin: KindModelPlugin) => {
	EventHandler(plugin).onTabChange((evt) => {
		plugin.info(
		evt.pageName,
		{
			file: evt.filePath,
			icon: evt.icon,
			hasSelectedText: evt.hasSelectedText,
		}
		);
	})
}
