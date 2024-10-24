import { 
	getYouTubePageType,  
	isArray,  
	isInlineSvg,  
	isString, 
	isUrl, 
	isYouTubeCreatorUrl, 
	isYouTubeFeedUrl, 
	isYouTubeUrl, 
	stripLeading, 
	stripTrailing,
	toKebabCase
} from "inferred-types";
import { PropertyType } from "~/types";

export const getPropertyType = (value: unknown): PropertyType => {

	if(isYouTubeUrl(value)) {
		const yt = getYouTubePageType(value);

		if(isYouTubeCreatorUrl(value)) {
			return `youtube::creator::featured`
		}
		if(isYouTubeFeedUrl(value, "history")) {
			return `youtube::feed::history`
		}
	} 
	
	if (isString(value)) {
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

			return "link"
		}

	}
	if (isInlineSvg(value)) {
		return "svg::inline"
	}
	// ARRAYS
	else if (isArray(value) && value.length > 0) {
		const variants = new Set<PropertyType>(value.map(getPropertyType));
		if(variants.size === 1) {
			return `list::${Array.from(variants)[0]}` as PropertyType
		} else {
			return `list::mixed::${Array.from(variants).join(",")}`
		}
		
	}

	return `other::${toKebabCase(String(typeof value))}`
}
