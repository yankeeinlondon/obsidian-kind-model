import type { Editor, MarkdownView } from "obsidian";
import type KindModelPlugin from "~/main";
import { create_new_kinded_page, update_kinded_page } from "~/commands/index";

/**
 * Adds commands for this plugin; including:
 *
 * - `create-new-kinded-page`
 * - `create-new-classifier-page`
 * - `update-kinded-page`
 * - etc.
 */
export function add_commands(plugin: KindModelPlugin) {
  plugin.addCommand({
    id: "create-new-kinded-page",
    name: "create a new (kinded) page",
    editorCallback: create_new_kinded_page(plugin),
  });
  plugin.addCommand({
    id: "create-new-classification-page",
    name: "add a classification for a (kinded) page",
    editorCallback: (editor: Editor, view: MarkdownView) => {
      const content = view.getViewData();
      plugin.info("create-new-classification-page", { content });
    },
  });

  plugin.addCommand({
    id: "add-url-props-for-kinded-page",
    name: "add links to (kinded) page",
    editorCallback: (editor: Editor, view: MarkdownView) => {
      const content = view.getViewData();
      plugin.info("add-url-props-for-kinded-page", { content });
    },
  });

  plugin.addCommand({
    id: "update-kinded-page",
    name: "update this page",
    editorCallback: update_kinded_page(plugin),
    icon: "refresh",
  });
}
