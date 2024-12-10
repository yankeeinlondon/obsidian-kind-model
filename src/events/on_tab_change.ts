import type KindModelPlugin from "~/main";
import { EventHandler } from "~/helpers/EventHandler";

export function on_tab_change(p: KindModelPlugin) {
  EventHandler(p).onTabChange((evt) => {
    p.info(
      evt.pageName,
      "navigation event",
      {
        file: evt.filePath,
        icon: evt.icon,
        hasSelectedText: evt.hasSelectedText,
      },
    );
  });
}
