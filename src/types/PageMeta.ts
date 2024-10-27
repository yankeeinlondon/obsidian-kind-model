import { YouTubePageType} from "inferred-types";


export type PageTypeUnits = 
| "string"
| "geo"
| "geo::country"
| "geo::zip-code"
| "geo::state"
| "number"
| "metric"
| "boolean"
| "svg"
| "svg::inline" 
| "svg::url" 
| "image"
| "image::vault"
| "image::href"
| "drawing"
| "drawing::vault"
| "youtube"
| `youtube::${YouTubePageType}`
| "phoneNumber"
| "email"
| "url::social"
| "url::book" 
| "url::retail" 
| "url::profile" 
| `url::repo`
| "url::news" 
| "url::youtube"
| "url" 
| `other::${string}`;

/**
 * **PropertyType**
 * 
 * When inspecting a page's frontmatter properties for their "type information"
 * using the `getPropertyType()` utility 
 * the result will come back as one of the following types.
 */
export type PropertyType = PageTypeUnits | `list::${PageTypeUnits}` | `list::mixed::${string}`



