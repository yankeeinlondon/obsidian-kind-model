import type KindModelPlugin from "~/main";
import { isString } from "inferred-types";
import { Notice } from "obsidian";
import { isKindedPage } from "~/api";
import { EventHandler } from "~/helpers/EventHandler";

/**
 * event handler triggered when an _existing_ file is _modified_.
 */
export function on_file_modified(plugin: KindModelPlugin) {
  EventHandler(plugin).onFileModified((evt) => {
    if (isString(evt?.path || null) && isKindedPage(plugin)(evt?.path)) {
      const kind_folder = plugin.settings.kind_folder;
      const find = new RegExp(`^${kind_folder}`);
      if (find.test(evt.path)) {
        new Notice("Kind file modified");
      }
    }
  });
}
