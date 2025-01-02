import type KindModelPlugin from "~/main";
import { isString } from "inferred-types";
import { Notice } from "obsidian";
import { EventHandler } from "~/helpers/EventHandler";
import { getPageInfo } from "~/page";
import { refreshTagLists } from "~/startup/getTagLists";
import { asMdLink } from "~/utils";

/**
 * event handler triggered when an _existing_ file is _modified_.
 */
export function on_file_modified(plugin: KindModelPlugin) {
  EventHandler(plugin).onFileModified(async (evt) => {

    if (isString(evt?.path)) {
		const page = getPageInfo(plugin)(evt.path);
		if(page) {
			switch(page.pageType) {
				case "kind-defn":
					if(
						page.hasKindDefinitionTag && page.kindTags[0] &&
						!plugin.kindTags.includes(page.kindTags[0])
					) {
						refreshTagLists(plugin);
						new Notice(`"${page.name}" added as Kind Definition`);
					}

					if(!page.fm.kind && plugin.kindDefn) {
						await page.setFmKey("kind", asMdLink(plugin)(plugin.kindDefn));
						new Notice(`added kind prop to "${page.name}" `)
					}
					break;
				case "type-defn":
					new Notice(`type definition page modified`);
					break;
				case "kinded > category":
				case "multi-kinded > category":
					new Notice(`category page modified`);
					break;
				case "kinded > subcategory":
				case "multi-kinded > subcategory":
					new Notice(`subcategory page modified`);
					break;
				case "kinded":
				case "multi-kinded":
					new Notice(`kinded page modified`)
					break;
			}

		}
    }
  });
}
