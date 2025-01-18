import { capitalize, ensureLeading, ensureTrailing, retainUntil, stripBefore, stripLeading } from "inferred-types";
import { MarkdownView, TFile } from "obsidian";
import { dirname, join } from "pathe";
import { update_kinded_page } from "~/commands";
import { kmBlock } from "~/handlers/fmt";
import type KindModelPlugin from "~/main";
import { isTFile } from "~/type-guards";

/**
 * event handler triggered when a new file is added to the vault
 */
export function on_file_created(plugin: KindModelPlugin) {
  plugin.registerEvent(plugin.app.vault.on("create", async (file) => {

	if(isTFile(file)) {		
		const pageName = file.name;
		let kind: string | undefined = undefined;
		let category: string | undefined = undefined;
		let subcategory: string | undefined = undefined;
	
		if(pageName.includes(`for "`)) {
			kind = retainUntil(stripBefore(pageName, `for "`), `"`);
		}
	
		if(pageName.includes(`" as Category for`)) {
			category = retainUntil(stripLeading(pageName, `"`), `"`);
		}
	
		if(pageName.includes(`" as Subcategory of the "`)) {
			subcategory = retainUntil(stripLeading(pageName, `"`), `"`);
			category = retainUntil(stripBefore(pageName, `as Subcategory of the "`), `"`)
		}
	
		let handleAs: "category" | "subcategory" | "ignore" = subcategory
			? "subcategory"
			: category
			? "category"
			: "ignore";
	
	
		if(handleAs !== "ignore") {
			let tag = handleAs === "category"
				? ensureLeading(`${kind}/category/${category}`, "#")
				: ensureLeading(`${kind}/subcategory/${category}/${subcategory}`, "#")
	
			let name = handleAs === "category"
				? `${capitalize(category as string)} ${capitalize(kind as string)}`
				: `${capitalize(subcategory as string)} ${capitalize(category as string)} ${capitalize(kind as string)}`

			const newFilepath = (name: string) => join(dirname(file.path), ensureTrailing(name, ".md"));
			
			const content = `${tag}\n# [[${newFilepath(name)}|${name}]]\n${kmBlock("PageEntry()")}\n`
			
			let basePath = dirname(file.path);
			let newPath = join(basePath, ensureTrailing(name, ".md"));
	
			
			plugin.info(
				`New Kind Page`, 
				{ kind, category, subcategory, handleAs, tag, name}
			);
			
			await file.vault.modify(file, content);
			
			const o = plugin.api.obsidian;
			const leaf = o.getMostRecentLeaf();
			const view = leaf?.view;
			
			
			plugin.info(`moving file to ${newPath}`, {leaf, view})
			if(view) {
				// await view?.requestSave();

				await update_kinded_page(plugin)(view as MarkdownView);

				const current = {...file} as TFile;
				await file.vault.rename(current, newPath);

				plugin.info("renamed", {view,leaf})
				
			}

			// await file.vault.rename(file, newPath);
	
			// await evt.vault.rename(tfile, newPath);
	
			// const activeLeaf = plugin.app.workspace.getMostRecentLeaf();
			// if (activeLeaf) {
			//   await activeLeaf.openFile(tfile);
			// }
		}
	} else {
		plugin.warn("new file not TFile!");
	}

  }));
}


