import { EventHandler } from "~/helpers/EventHandler";
import KindModelPlugin from "~/main";

export const on_layout_change = (plugin: KindModelPlugin) => {

	EventHandler(plugin).onLayoutChange(() => {
		plugin.info("layout change detected");
	})

}
