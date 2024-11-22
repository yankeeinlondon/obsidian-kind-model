import { Replace, YouTubePageType } from "inferred-types";

export type PageTypeUnits =
	| "string"
	| "geo"
	| "geo_country"
	| "geo_zip"
	| "geo_state"
	| "geo_city"
	| "number"
	| "metric"
	| "marker"
	| "boolean"
	| "svg"
	| "svg_inline"
	| "svg_url"
	| "link"
	| "link_image"
	| "link_md"
	| "link_drawing"
	| "link_vector"
	| "link_undefined"
	| "image"
	| "image_vault"
	| "image_href"
	| "drawing"
	| "drawing_vault"
	| "youtube"
	| `youtube_${Replace<YouTubePageType, "::", "_">}`
	| "phoneNumber"
	| "email"
	| "date"
	| "datetime"
	| "time"
	| "url_social"
	| "url_book"
	| "url_retail"
	| "url_profile"
	| `url_repo`
	| "url_news"
	| "url_youtube"
	| "url"
	| "empty"
	| `other_${string}`;

/**
 * API surface to simplify access to metadata object.
 */
export type PageMetadata = {
	hasLinks(): boolean;
	hasUrls(): boolean;
	hasGeoInfo(): boolean;
	getYouTubeVideoLinks(): string[];
	/**
	 * boolean flag indicating whether any of the frontmatter properties
	 * either _link to_ or contain _inline_ SVG content.
	 */
	hasSvg(): boolean;
};

/**
 * **PropertyType**
 *
 * When inspecting a page's frontmatter properties for their "type information"
 * using the `getPropertyType()` utility
 * the result will come back as one of the following types.
 */
export type PropertyType =
	| PageTypeUnits
	| `list_${PageTypeUnits}`
	| `list_mixed_${string}`;
