import type { Dictionary, Iso8601Date, Iso8601DateTime } from "inferred-types";
import type KindModelPlugin from "~/main";
import type {
  DvPage,
  Frontmatter,
  PageReference,
  PropertyType,
} from "~/types";
import type { MetadataApi, PageMetadataApi } from "~/types/MetadataApi";
import {
  asIsoDate,
  isIsoDate,
  isIsoDateTime,
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

export function frontmatterHasLinks(p: KindModelPlugin) {
  return (pg: PageReference | undefined) => {
    const meta = getPage(p)(pg);
    if (meta) {
      return Object.keys(meta).includes("link")
        || Object.keys(meta).includes("link_image")
        || Object.keys(meta).includes("link_md")
        || Object.keys(meta).includes("link_drawing")
        || Object.keys(meta).includes("link_vector")
        || Object.keys(meta).includes("link_unknown");
    }
  };
}

export function frontmatterHasUrls(p: KindModelPlugin) {
  return (pg: PageReference | undefined) => {
    const meta = getPage(p)(pg);
    if (meta) {
      return Object.keys(meta).includes("url")
        || Object.keys(meta).includes("url_social")
        || Object.keys(meta).includes("url_book")
        || Object.keys(meta).includes("url_retail")
        || Object.keys(meta).includes("url_profile")
        || Object.keys(meta).includes("url_repo")
        || Object.keys(meta).includes("url_news")
        || Object.keys(meta).includes("url_youtube");
    }
  };
}
export function frontmatterHasGeoInfo(p: KindModelPlugin) {
  return (pg: PageReference | undefined) => {
    const meta = getPage(p)(pg);
    if (meta) {
      return Object.keys(meta).includes("geo")
        || Object.keys(meta).includes("geo_country")
        || Object.keys(meta).includes("geo_zip")
        || Object.keys(meta).includes("geo_state")
        || Object.keys(meta).includes("geo_city");
    }
  };
}

export function getLinksFromFrontmatter(p: KindModelPlugin) {
  return (pg: PageReference | undefined) => {
    const page = getPage(p)(pg);
    const meta = getFrontmatterMetadata(p)(pg);
    if (meta) {
      return [
        ...(meta.link ? meta.link : []),
        ...(meta.link_md ? meta.link_md : []),
        ...(meta.link_drawing ? meta.link_drawing : []),
        ...(meta.link_vector ? meta.link_vector : []),
      ];
    }
  };
}

/**
 * gets the first date found in the given properites;
 * always returns a date (no time) but can source from
 * both a date and datetime property
 */
export function getFirstDateFromFrontmatterProps(p: KindModelPlugin) {
  return (pg: PageReference) => (
    ...props: string[]
  ): Iso8601Date<"explicit"> | undefined => {
    const meta = getFrontmatterMetadata(p)(pg);

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
          found = asIsoDate(candidate);
        }
      }

      idx++;
    }

    return found;
  };
}

export function getYouTubeVideoLinks(p: KindModelPlugin) {
  return (pg: PageReference) => () => {
    const meta = getFrontmatterMetadata(p)(pg);

    if (meta) {
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
    }

    return [];
  };
}

/**
 * Given a particular page, this function returns a dictionary of key/values
 * which represent the _type_ of data found in Frontmatter properties.
 *
 * - The _keys_ are the **type** of data
 * - the _values_ are the properties which have that type of data
 *
 * In addition some callbacks are provided to probe further metadata
 * information:
 *
 * - `hasLinks()`, `getLinks()`
 * - `hasUrls()`, `getUrls()`
 */
export function getFrontmatterMetadata(p: KindModelPlugin) {
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

      return meta as Record<Partial<PropertyType>, string[]>;
    };

    return {} as Record<Partial<PropertyType>, string[]>;
  };
}

/**
 * An API surface for interrogating Frontmatter data
 */
export function metadataApi(plugin: KindModelPlugin): MetadataApi {
  return {
    getFrontmatter: getFrontmatter(plugin),
    getFrontmatterTypes: getFrontmatterMetadata(plugin),
    frontmatterHasLinks: frontmatterHasLinks(plugin),
    frontmatterHasUrls: frontmatterHasUrls(plugin),
    frontmatterHasGeoInfo: frontmatterHasGeoInfo(plugin),
    getLinksFromFrontmatter: getLinksFromFrontmatter(plugin),
    getFirstDateFromFrontmatterProps: getFirstDateFromFrontmatterProps(plugin),
    getYouTubeVideoLinks: getYouTubeVideoLinks(plugin),
  };
}

export function pageMetadataApi(plugin: KindModelPlugin, page: DvPage): PageMetadataApi {
  return {
    frontmatterTypes: getFrontmatterMetadata(plugin)(page),
    frontmatterHasLinks: frontmatterHasLinks(plugin)(page),
    frontmatterHasUrls: frontmatterHasUrls(plugin)(page),
    frontmatterHasGeoInfo: frontmatterHasGeoInfo(plugin)(page),
    linksFromFrontmatter: getLinksFromFrontmatter(plugin)(page),
    getFirstDateFromFrontmatterProps: getFirstDateFromFrontmatterProps(plugin)(page),
    youTubeVideoLinks: getYouTubeVideoLinks(plugin)(page),
  };
}
