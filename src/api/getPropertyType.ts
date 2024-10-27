import { 
	getYouTubePageType,  
	isArray,  
	isInlineSvg,  
	isNumber,  
	isString, 
	isBoolean,
	isUrl, 
	isYouTubeCreatorUrl, 
	isYouTubeFeedUrl, 
	isYouTubeUrl, 
	stripLeading, 
	stripTrailing,
	toKebabCase,
	isIso3166CountryCode,
	isIso3166CountryName,
	isZipCode,
	isMetric,
	isRepoUrl,
	isRetailUrl,
	isNewsUrl,
	isPhoneNumber,
	isEmail,
	isSocialMediaUrl
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
		}

		if (isPhoneNumber(value)) {
			return "phoneNumber";
		}
		
		if (isEmail(value)) {
			return "email";
		}

		if (isInlineSvg(value)) {
			return "svg::inline"
		}

		if (isMetric(value)) {
			return "metric";
		}



		if (isZipCode(value)) {
			return "geo::zip-code"
		}

		if (isIso3166CountryCode(value) || isIso3166CountryName(value)) {
			return "geo::country"
		}

		if (isUrl(value)) {
			if (isSocialMediaUrl(value)) {
				return "url::social"
			}

			if (isRepoUrl(value)) {
				return "url::repo"
			}
			if (isRetailUrl(value)) {
				return "url::retail"
			}
			if (isNewsUrl(value)) {
				return "url::news"
			}

			if (isYouTubeUrl(value)) {
				return "url::youtube"
			}

			if (isSocialMediaUrl(value)) {
				return "url::social"
			}

			return "url"
		}

		return "string"
	}
	if (isNumber(value)) {
		return "number"
	}
	if (isBoolean(value)) {
		return "boolean"
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
