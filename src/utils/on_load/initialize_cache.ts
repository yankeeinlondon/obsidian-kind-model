import { DvPage, DvPageWithArray } from "../../types/dataview_types";
import KindModelPlugin from "../../main";
import { getDataviewPageCache } from "../getDataviewPageCache";
import {  KindPage, KindDefinition } from "../../types/PageContext";
import { Tag } from "../../types/general";
import { convertToPageWithArrays } from "../../utils/convertToPageWithArrays";

const unwrap = (pgs: DvPage[]) => {
	const pages = pgs.map(i => convertToPageWithArrays(i)) as unknown as DvPageWithArray[];

	return pages;
}

const tags = (tags: Set<Tag>) => {
	const output = new Set<Tag>(tags);
	for (const t of tags) {
		const parts = t.split("/");
		while (parts.length > 1) {
			output.add(parts.slice(0,-1).join("/") as Tag);
			parts.pop();
		}
	}

	return output;
}


const build_cache = (plugin: KindModelPlugin) => {
	const dv_api = getDataviewPageCache(plugin);
	const cache: KindCache = {
		kinds: new Map<string, KindDefinition>(),
		kind_tags: new Set<Tag>,
		pages: new Map<string, KindPage>(),
		tag_lookup: new Map<string, Set<string>>(),
		kind_lookup: new Map<string, Set<string>>(),
		name_lookup: new Map<string, Set<string>>(),
	}

	if (dv_api) {
		plugin.info("pages", dv_api.pages);
		// for (const [path, entry] of dv_api.pages) {
		// 	// Add page when relevant
		// 	if(Array.from(entry.tags).some(t => tags(entry.tags).has(t))) {
		// 		const kind = plugin.api.get_kinded_page(entry.path);
		// 		if (kind) {
		// 			cache.pages.set(path, kind);
		// 		} else {
		// 			plugin.warn(`problems caching "${path}" with ...`, entry)
		// 		}
		// 	}


		// 	// Lookups 
		// }
	} else {
		plugin.error(`The Dataview Root API was not available and therefore was not able to build the cache for Kind Models.`)
	}

	return cache;
}


/**
 * Initialize the cache (if needed)
*/
export const initialize_cache = async (plugin: KindModelPlugin) => {
	const cache = plugin.get_cache() || build_cache(plugin);

	if (!cache) {
		plugin.error(`Error creating cache!`)
	}

	return cache;
}

