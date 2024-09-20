import KindModelPlugin from "../../main";
import { getKindTagsFromCache, initializeKindedTagCache, isTagCacheReady } from "./cache";

/**
 * returns all Kind tags which have `tag` as part of them; all tags 
 * are passed back if tag is _undefined_.
 */
export const getKindTags = (p: KindModelPlugin) => (
	tag?: string
) => {
	if (!isTagCacheReady()) {
		initializeKindedTagCache(p);
	}
	
	return getKindTagsFromCache(tag);
}
