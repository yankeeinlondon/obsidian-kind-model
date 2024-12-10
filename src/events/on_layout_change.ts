import type KindModelPlugin from "~/main";
import { EventHandler } from "~/helpers/EventHandler";

export function on_layout_change(plugin: KindModelPlugin) {
  EventHandler(plugin).onLayoutChange(() => {
    plugin.info("layout change detected");
  });
}
