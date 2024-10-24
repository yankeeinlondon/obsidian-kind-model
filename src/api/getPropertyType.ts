import { 
	getYouTubePageType,  
	isString, 
	isUrl, 
	isYouTubeCreatorUrl, 
	isYouTubeFeedUrl, 
	isYouTubeUrl, 
	stripLeading, 
	stripTrailing 
} from "inferred-types";
import { PropertyType } from "~/types";

export const getPropertyType = (value: unknown): PropertyType => {

	if(isYouTubeUrl(value)) {
			if(isYouTubeCreatorUrl(value)) {
				return `youtube::creator::featured`
			}
			if(isYouTubeFeedUrl(value, "history")) {

				return `youtube::feed::history`
			}

} else if (isString(value)) {
		// string values
		if(value.startsWith("[[") && value.endsWith("]]")) {
			// internal vault link
			const content = stripTrailing(stripLeading(value, "[["), "]]");
			
			if(
				content.endsWith(".png") ||
				content.endsWith(".jpg") ||
				content.endsWith(".jpeg") ||
				content.endsWith(".gif") ||
				content.endsWith(".avif") ||
				content.endsWith(".webp")
			) {
				return "image::vault";
			} else if (content.endsWith(".excalidraw")) {
				return "drawing::vault";
			}
		}
	}
	// ARRAYS
	else if (Array.isArray(value)) {
		if(value.every(i => isUrl(i))) {
			return "list::url";
		}
	}

	return "other"
}
