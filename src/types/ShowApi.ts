import type {
  createFileLink,
  createLinksFromTag,
  createMarkdownLink,
  getProp,
  showAbout,
  showCategories,
  showClassifications,
  showCreatedDate,
  showDesc,
  showDueDate,
  showKind,
  showLinks,
  showMetrics,
  showModifiedDate,
  showPeers,
  showProp,
  showSlider,
  showSubcategories,
  showTags,
  showWhen,
} from "~/api";

export interface ShowApi {
  showCreatedDate: typeof showCreatedDate;
  showModifiedDate: typeof showModifiedDate;
  showDueDate: ReturnType<typeof showDueDate>;
  showDesc: ReturnType<typeof showDesc>;
  showWhen: ReturnType<typeof showWhen>;

  /**
   * Provides a string output which is a comma separated list of categories
   * for the passed in page.
   */
  showCategories: ReturnType<typeof showCategories>;
  /**
   * Provides a string output which is a comma separated list of subcategories
   * for the passed in page.
   */
  showSubcategories: ReturnType<typeof showSubcategories>;
  /**
   * show a hierarchical view of the given page's classification
   */
  showClassifications: ReturnType<typeof showClassifications>;
  /**
   * Show all tags on a given page _except_ for those tags included in
   * the "exclude" list.
   */
  showTags: ReturnType<typeof showTags>;
  /**
   * Show all Frontmatter links which around found on a given page.
   *
   * - uses certain _property naming conventions_ along with _URL patterns_
   * to provide the best icon for these external pages
   */
  showLinks: ReturnType<typeof showLinks>;
  showProp: ReturnType<typeof showProp>;
  getProp: ReturnType<typeof getProp>;
  showAbout: ReturnType<typeof showAbout>;
  showPeers: ReturnType<typeof showPeers>;
  /**
   * Shows the given page's `kind` as a FileLink
   */
  showKind: ReturnType<typeof showKind>;
  showMetrics: ReturnType<typeof showMetrics>;
  showSlider: ReturnType<typeof showSlider>;

  /**
   * creates a `FileLink` object which can be rendered by
   * renderValue() provided by Dataview library.
   */
  createFileLink: ReturnType<typeof createFileLink>;
  /**
   * Creates a link to another page in the vault using Markdown syntax.
   *
   * - this has similar results as creating a `FileLink` with the `createFileLink` utility
   * function but has some additional benefits as allows for overriding not only the link text
   * but also adding HTML pre and post containers to the output.
   * - **note:** if you use this text output _inside_ an HTML block this will fail to
   * render properly because the markdown-to-html conversion will no longer take place.
   */
  createMarkdownLink: ReturnType<typeof createMarkdownLink>;

  /**
   * return an array of links from a specified tag
   */
  createLinksFromTag: ReturnType<typeof createLinksFromTag>;
}
