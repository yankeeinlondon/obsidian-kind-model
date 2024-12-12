import type { Dictionary, Iso8601Date, Iso8601DateTime } from "inferred-types";
import type KindModelPlugin from "~/main";
import type {
  Frontmatter,
  PageMetadata,
  PageReference,
  PropertyType,
} from "~/types";
import type { MetadataApi } from "~/types/MetadataApi";
import {
  isIsoDate,
  isIsoExplicitDate,
  isStringArray,
  isYouTubeVideoUrl,
} from "inferred-types";
import { getPage } from "~/page";
import { isDvPage, isFrontmatter, isPageInfo } from "~/type-guards";
import { getPropertyType } from "./getPropertyType";

/**
 * higher order function which after passed the plugin, will take a
 * _page reference_ or an object representing a frontmatter key/value
 * object.
 *
 * This function utility is to ensure regardless of the input type that
 * a valid Frontmatter type is returned.
 */
export function getFrontmatter(p: KindModelPlugin) {
  return (from: PageReference | Frontmatter): Frontmatter => {
    if (isDvPage(from)) {
      return from.file.frontmatter;
    }

    if (isPageInfo(from)) {
      return from.fm;
    }

    if (isFrontmatter(from)) {
      return from;
    }

    const page = getPage(p)(from);

    if (page) {
      return page.file.frontmatter;
    }
    else {
      p.debug(
        `call to getFrontmatter() was unable to load a valid page so returned an empty object.`,
        { from },
      );
      return {} as Frontmatter;
    }
  };
}

/**
 * Gets the metadata from a page reference categorized by type of content.
 */
export function getMetadata(p: KindModelPlugin) {
  return (
    pg: PageReference | undefined | Frontmatter,
  ): Record<Partial<PropertyType>, string[]> => {
    const fm = pg ? getFrontmatter(p)(pg) : undefined;
    const kv: Dictionary = {};

    if (fm) {
      const meta: Dictionary<string, any> = {};

      for (const key of Object.keys(fm)) {
        const type = getPropertyType(p)(fm[key]);
        if (type && !type.startsWith("other")) {
          meta[type] = meta[type] ? [...meta[type], key] : [key];
          kv[key] = [fm[key], type];
        }
        else {
          meta.other = meta.other ? [...meta.other, key] : [key];
          kv[key] = [fm[key], type];
        }
      }

      meta.hasLinks = () => {
        return (
          Object.keys(meta).includes("link")
          || Object.keys(meta).includes("link_image")
          || Object.keys(meta).includes("link_md")
          || Object.keys(meta).includes("link_drawing")
          || Object.keys(meta).includes("link_vector")
          || Object.keys(meta).includes("link_unknown")
        );
      };
      meta.hasUrls = () => {
        return (
          Object.keys(meta).includes("url")
          || Object.keys(meta).includes("url_social")
          || Object.keys(meta).includes("url_book")
          || Object.keys(meta).includes("url_retail")
          || Object.keys(meta).includes("url_profile")
          || Object.keys(meta).includes("url_repo")
          || Object.keys(meta).includes("url_news")
          || Object.keys(meta).includes("url_youtube")
        );
      };
      /**
       * gets the first date found in the given properites;
       * always returns a date (no time) but can source from
       * both a date and datetime property
       */
      meta.getFirstDateFrom = (
        ...props: string[]
      ): Iso8601Date<"explicit"> | undefined => {
        const sources = [
          ...(meta.date || []),
          ...(meta.list_date || []),
          ...(meta.datetime || []),
          ...(meta.list_datetime || []),
        ] as (string | string[])[];
        const targets = props.filter(i => sources.includes(i));
        let found: Iso8601Date<"explicit"> | undefined;
        let idx = 0;

        while (idx <= targets.length || isIsoExplicitDate(found)) {
          const prop = targets[idx];
          if (isStringArray(prop)) {
            // property is an array of elements, take first
            const candidate = prop.find(
              i => isIsoDate(i) || isIsoDateTime(i),
            ) as Iso8601Date | Iso8601DateTime | undefined;
            if (candidate) {
              found = asExplicitIso8601Date(candidate);
            }
          }

          idx++;
        }

        return found;
      };
      meta.hasGeoInfo = () => {
        return (
          Object.keys(meta).includes("geo")
          || Object.keys(meta).includes("geo_country")
          || Object.keys(meta).includes("geo_zip")
          || Object.keys(meta).includes("geo_state")
          || Object.keys(meta).includes("geo_city")
        );
      };
      meta.getYouTubeVideoLinks = () => {
        if (
          !(
            Object.keys(meta).includes("url_youtube")
            || Object.keys(meta).includes("list_url_youtube")
          )
        ) {
          return [];
        }

        const unitLinks = (meta.url_youtube || []).map(
          (i: string & keyof typeof meta) => meta[i],
        );
        const listLinks = (meta.list_url_youtube || []).flatMap(
          (i: string & keyof typeof meta) => meta[i],
        );

        const links = [...unitLinks, ...listLinks].filter(i =>
          isYouTubeVideoUrl(i),
        );

        return links as string[];
      };

      return meta as Record<Partial<PropertyType>, string[]> & PageMetadata;
    }
    else {
      p.debug(`no metadata found on page ${pg || "unknown"}`);
    }

    return {} as Record<Partial<PropertyType>, string[]>;
  };
}

export function metadataApi(plugin: KindModelPlugin): MetadataApi {
  return {
    getFrontmatter: getFrontmatter(plugin),
    getMetadata: getMetadata(plugin),
  };
}
