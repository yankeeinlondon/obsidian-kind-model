import type KindModelPlugin from "~/main";
import { Notice } from "obsidian";
import { EventHandler } from "~/helpers/EventHandler";

export function on_file_deleted(plugin: KindModelPlugin) {
  EventHandler(plugin).onFileDeleted((evt) => {
    const kind_folder = plugin.settings.kind_folder;
    const find = new RegExp(`^${kind_folder}$`);
    if (find.test(evt?.path)) {
      new Notice("Kind file deleted");
    }
    else {
      plugin.info(`file ${evt?.path} was deleted but has no effect on Kind Model (and it's caching)`);
    }
  });
}
