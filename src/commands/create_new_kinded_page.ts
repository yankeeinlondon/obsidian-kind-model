import type { Editor, MarkdownView } from "obsidian";
import type KindModelPlugin from "~/main";
import { TextInputModal } from "~/helpers";

export function create_new_kinded_page(p: KindModelPlugin) {
  return async (
    editor: Editor,
    view: MarkdownView,
  ) => {
    let value;
    // return new Promise((resolve) => {
    const modal = new TextInputModal(p.app, "Filename", "", (v) => { value = v; });
    const fileName = await modal.open();

    console.log("value", value, fileName);
    // })
  };
}
