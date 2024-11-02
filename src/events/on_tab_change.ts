import { EventHandler } from "~/helpers/EventHandler";
import KindModelPlugin from "~/main";

export const on_tab_change = (p: KindModelPlugin) => {
	EventHandler(p).onTabChange((evt) => {
		p.info(
			evt.pageName,
			"navigation event",
			{
				file: evt.filePath,
				icon: evt.icon,
				hasSelectedText: evt.hasSelectedText,
			}
		);
	})
}
