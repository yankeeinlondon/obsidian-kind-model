import { Notice } from "obsidian";
import KindModelPlugin from "~/main";
import { DvPage } from "~/types";

export function getDefnPages(k: KindModelPlugin): Promise<void> {

	return k.deferQueryUntilReady(
		() => {
			if (!k.kindDefn || !k.typeDefn) {
				const kindDefn = Array.from(k.dv.pages(`#kind/kind`)) as DvPage[];
				const typeDefn = Array.from(k.dv.pages(`#type/type`)) as DvPage[];
			
				if(kindDefn.length > 1) {
					new Notice(`Duplicate Kind Definition pages found!`);
				}
				if(typeDefn.length > 1) {
					new Notice(`Duplicate Type Definition pages found!`);
				}
			
				if (kindDefn.length > 0) {
					k.kindDefn = kindDefn[0];
					k.info(`Kind Defn set on KM Plugin: ${kindDefn[0].file.path}`)
				}
				if (typeDefn.length > 0) {
					k.typeDefn = typeDefn[0];
					k.info(`Type Defn set on KM Plugin: ${typeDefn[0].file.path}`)
				}
			}
		}
	)

}

