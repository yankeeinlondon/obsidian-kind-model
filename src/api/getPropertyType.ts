import {
	isArray,
	isBoolean,
	isCreditCard,
	isEmail,
	isEmpty,
	isInlineSvg,
	isIso3166CountryCode,
	isIso3166CountryName,
	isIsoExplicitDate,
	isIsoTime,
	isMetric,
	isNewsUrl,
	isNumber,
	isNumberLike,
	isPhoneNumber,
	isRepoUrl,
	isRetailUrl,
	isSocialMediaUrl,
	isString,
	isUrl,
	isYouTubeCreatorUrl,
	isYouTubeFeedUrl,
	isYouTubeUrl,
	isZipCode,
	stripSurround,
	toPascalCase,
} from "inferred-types";
import type KindModelPlugin from "~/main";
import { isAliasedMdLink, isDateTime, isLink, isMdLink } from "~/type-guards";
import type { PropertyType } from "~/types";

export function getPropertyType(p: KindModelPlugin) {
  return (value: unknown): PropertyType => {
    if (isMdLink(value)) {
      if (isAliasedMdLink(value)) {
        const [path, _link] = stripSurround("[", "]")(value).split("|");
        if (path.endsWith(".md")) {
          return "link_md";
        }
        else if (path.endsWith(".excalidraw")) {
          return "link_drawing";
        }
        else if (["webp", "jpg", "jpeg", "png", "heif", "gif"].some(i => path.endsWith(i))) {
          return "link_image";
        }
        else if (path.endsWith(".svg")) {
          return "link_vector";
        }
        else if (path.endsWith(".canvas")) {
          return "link_canvas";
        }
        else {
          return "link";
        }
      }
      else {
        return "link_noAlias";
      }
    }
    if (isLink(value)) {
      if (value.path.endsWith(".md")) {
        return "link_md";
      }
      if (value.path.endsWith(".excalidraw")) {
        return "link_drawing";
      }
      if (value.path.endsWith(".svg")) {
        return "link_vector";
      }
      if (value.path.endsWith(".canvas")) {
        return "link_canvas";
      }

      return value.display ? "link" : "link_noAlias";
    }

    if (isYouTubeUrl(value)) {
      if (isYouTubeCreatorUrl(value)) {
        return `youtube_creator_featured`;
      }
      if (isYouTubeFeedUrl(value, "history")) {
        return `youtube_feed_history`;
      }
    }

    // string values
    if (isString(value)) {
      if (isPhoneNumber(value)) {
        return "phoneNumber";
      }

      if (isEmail(value)) {
        return "email";
      }

      if (isInlineSvg(value)) {
        return "svg_inline";
      }

      if (isMetric(value)) {
        return "metric";
      }

      if (isDateTime(value) && value.split("-")[0].length === 4) {
        return "datetime";
      }

      if (isIsoExplicitDate(value) && value.split("-")[0].length === 4) {
        return "date";
      }

      if (isIsoTime(value)) {
        return "time";
      }

      if (isZipCode(value)) {
        return "geo_zip";
      }

      if (isIso3166CountryCode(value) || isIso3166CountryName(value)) {
        return "geo_country";
      }

      if (isUrl(value, "http", "https")) {
        if (isSocialMediaUrl(value)) {
          return "url_social";
        }

        if (isRepoUrl(value)) {
          return "url_repo";
        }
        if (isRetailUrl(value)) {
          return "url_retail";
        }
        if (isNewsUrl(value)) {
          return "url_news";
        }

        if (isYouTubeUrl(value)) {
          return "url_youtube";
        }

        if (isSocialMediaUrl(value)) {
          return "url_social";
        }

        return "url";
      }

      if (isCreditCard(value)) {
        return "string_creditCard";
      }

      return isNumberLike(value) ? "string_numeric" : "string";
    }
    if (isNumber(value)) {
      return "number";
    }
    if (isBoolean(value)) {
      return "boolean";
    }

    if (isEmpty(value)) {
      return "empty";
    }

    // ARRAYS
    else if (isArray(value) && value.length > 0) {
      const variants = new Set<PropertyType>(
        value.map(getPropertyType(p)),
      );
      if (variants.size === 1) {
        return `list_${Array.from(variants)[0]}` as PropertyType;
      }
      else {
        return `list_mixed_${Array.from(variants).join(",")}`;
      }
    }

    return `other_${toPascalCase(String(typeof value))}`;
  };
}
