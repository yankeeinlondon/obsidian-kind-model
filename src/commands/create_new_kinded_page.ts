import { Editor, MarkdownView } from "obsidian";
import { FileSuggest, TextInputModal } from "~/helpers";
import KindModelPlugin from "~/main";


export const create_new_kinded_page = (p: KindModelPlugin) => async (
	editor: Editor, 
	view: MarkdownView
) => {

	let value;
	// return new Promise((resolve) => {
		const modal = new TextInputModal(p.app, "Filename", "", v => { value = v });
		const fileName = await modal.open()

		console.log("value", value, fileName)
	// })



}
