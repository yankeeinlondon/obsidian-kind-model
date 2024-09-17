import { YouTubePageType} from "inferred-types";

type RepoOrganization = string;
type RepoName = string;

type PageTypeUnits = 
| "svg::inline" 
| "svg::url" 
| "svg::url::broken"
| "image::vault"
| "image::url"
| "drawing::vault"
| `youtube::${YouTubePageType}`
| "metric"
| "phone-number" 
| "url::book" 
| "url::retail" 
| "url::profile" 
| `url::repo::${RepoOrganization}${"" | `::${RepoName}`}` 
| "url::news" 
| "url" 
| "other";
/**
 * **PropertyType**
 * 
 * When inspecting a page's frontmatter properties for their "type information"
 * using the `property_type()` utility provided on `dv_page`
 * the result will come back as one of the following union types.
 * 
 * - `svg::inline` - a string which appears to be inline SVG content
 * - `svg::url`
 * - `svg::url::broken`
 * - `svg::ref`
 * - `icon::ref` - an `icon::${string}` which matches with a known icon
 * - `icon::ref::broken` - an `icon::${string}` which matches with a known icon
 * - `image::ref` - a link to an image from within the vault
 * - `drawing::ref` - a link to an Excalidraw from within the vault
 * - `youtube-video` - a URL which matches a video on YouTube platform
 * - `youtube-creator` - a URL which matches a _creator_ on YouTube platform
 * - `youtube-unknown` - a URL on YouTube with unknown content
 * - `metric` - a metric value associated with the given "kind"
 * - `kind-link` - link to a known **kind** definition
 * - `category-link` - reference to a **category** of some `kind`
 * - `subcategory-link`  - a reference to a known **subcategory** of something
 * - `link` - a link to a page (which is not a `kind`,_category_ or _subcategory_)
 * - `url::book` - a URL which looks like it's related to books
 * - `url::retail` - a URL which looks like it's related to retail products
 * - `url::profile` - a URL which looks like a person/company's profile
 * - `url::repo` - a URL which looks like a person/company's profile
 * - `url::news` - a URL which looks like a person/company's profile
 * - `url` - any other URL
 * - `string::phone` - a string which _looks_ like a phone number
 */
export type PropertyType = PageTypeUnits | `list::${PageTypeUnits}`



