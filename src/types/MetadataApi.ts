import type { frontmatterHasGeoInfo, frontmatterHasLinks, getFirstDateFromFrontmatterProps, getFrontmatter, getFrontmatterMetadata, getLinksFromFrontmatter, getYouTubeVideoLinks } from "~/api";

export interface MetadataApi {
  /**
   * A key/value where:
   *
   * - the _keys_ are a `PropertyType`
   * - the _values_ are the list of properties which have this type
   */
  getFrontmatterTypes: ReturnType<typeof getFrontmatterMetadata>;

  /**
   * a function to get the frontmatter from a given page
   */
  getFrontmatter: ReturnType<typeof getFrontmatter>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have Links in them.
   */
  frontmatterHasLinks: ReturnType<typeof frontmatterHasLinks>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have URL's in them.
   */
  frontmatterHasUrls: ReturnType<typeof frontmatterHasLinks>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have Geo information in them.
   */
  frontmatterHasGeoInfo: ReturnType<typeof frontmatterHasGeoInfo>;

  /**
   * Provides a list of all links found across the Frontmatter
   * properties.
   */
  getLinksFromFrontmatter: ReturnType<typeof getLinksFromFrontmatter>;

  /**
   * provides the first date from a set of Frontmatter properties.
   */
  getFirstDateFromFrontmatterProps: ReturnType<typeof getFirstDateFromFrontmatterProps>;

  /**
   * returns all links found across the Frontmatter properties which
   * point to YouTube video.
   */
  getYouTubeVideoLinks: ReturnType<typeof getYouTubeVideoLinks>;

}

export interface PageMetadataApi {
  /**
   * A key/value where:
   *
   * - the _keys_ are a `PropertyType`
   * - the _values_ are the list of properties which have this type
   */
  frontmatterTypes: ReturnType<ReturnType<typeof getFrontmatterMetadata>>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have Links in them.
   */
  frontmatterHasLinks: ReturnType<ReturnType<typeof frontmatterHasLinks>>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have URL's in them.
   */
  frontmatterHasUrls: ReturnType<ReturnType<typeof frontmatterHasLinks>>;

  /**
   * Boolean check on whether any of the frontmatter properties
   * have Geo information in them.
   */
  frontmatterHasGeoInfo: ReturnType<ReturnType<typeof frontmatterHasGeoInfo>>;

  /**
   * Provides a list of all links found across the Frontmatter
   * properties.
   */
  linksFromFrontmatter: ReturnType<ReturnType<typeof getLinksFromFrontmatter>>;

  /**
   * provides the first date from a set of Frontmatter properties.
   */
  getFirstDateFromFrontmatterProps: ReturnType<ReturnType<typeof getFirstDateFromFrontmatterProps>>;

  /**
   * returns all links found across the Frontmatter properties which
   * point to YouTube video.
   */
  youTubeVideoLinks: ReturnType<ReturnType<typeof getYouTubeVideoLinks>>;

}
