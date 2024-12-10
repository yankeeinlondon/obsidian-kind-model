import type KindModelPlugin from "~/main";
import type { PropertyType } from "~/types";
import {
  isArray,
  isBoolean,
  isEmail,
  isInlineSvg,
  isIso3166CountryCode,
  isIso3166CountryName,
  isIsoDate,
  isIsoTime,
  isMetric,
  isNewsUrl,
  isNumber,
  isPhoneNumber,
  isRepoUrl,
  isRetailUrl,
  isSocialMediaUrl,
  isString,
  isUndefined,
  isUrl,
  isYouTubeCreatorUrl,
  isYouTubeFeedUrl,
  isYouTubeUrl,
  isZipCode,
  stripLeading,
  stripTrailing,
  toPascalCase,
} from "inferred-types";
import { getPage } from "~/page";
import { isDateTime } from "~/type-guards";

export function getPropertyType(p: KindModelPlugin) {
  return (value: unknown): PropertyType => {
    if (isYouTubeUrl(value)) {
      if (isYouTubeCreatorUrl(value)) {
        return `youtube_creator_featured`;
      }
      if (isYouTubeFeedUrl(value, "history")) {
        return `youtube_feed_history`;
      }
    }

    if (isString(value)) {
      // string values
      if (value.startsWith("[[") && value.endsWith("]]")) {
        // internal vault link
        const content = stripTrailing(stripLeading(value, "[["), "]]");
        const page = getPage(p)(content);

        if (page) {
          if (
            page.file.ext === "png"
            || page.file.ext === "jpg"
            || page.file.ext === "jpeg"
            || page.file.ext === "gif"
            || page.file.ext === "avif"
            || page.file.ext === "wep"
          ) {
            return "image_vault";
          }
          else if (page.file.ext === "excalidraw") {
            return "link_drawing";
          }
          else if (
            page.file.ext === "md"
            || content.includes(".md|")
          ) {
            return "link_md";
          }
        }

        p.info("undefined link", content, value);

        return "link_undefined";
      }

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

      if (isDateTime(value)) {
        return "datetime";
      }

      if (isIsoDate(value)) {
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

      if (isUrl(value)) {
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

      return "string";
    }
    if (isNumber(value)) {
      return "number";
    }
    if (isBoolean(value)) {
      return "boolean";
    }

    if (isUndefined(value)) {
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
