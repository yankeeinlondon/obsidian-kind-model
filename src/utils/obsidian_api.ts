import {
  addIcon,
  apiVersion,
  arrayBufferToHex,
  base64ToArrayBuffer,
  debounce,
  finishRenderMath,
  getAllTags,
  getBlobArrayBuffer,
  getFrontMatterInfo,
  getIcon,
  getIconIds,
  getLinkpath,
  hexToArrayBuffer,
  htmlToMarkdown,
  iterateRefs,
  loadMathJax,
  loadMermaid,
  loadPdfJs,
  loadPrism,
  normalizePath,
  parseFrontMatterAliases,
  parseFrontMatterEntry,
  parseFrontMatterStringArray,
  parseFrontMatterTags,
  parseLinktext,
  parseYaml,
  prepareFuzzySearch,
  prepareSimpleSearch,
  removeIcon,
  renderMatches,
  renderMath,
  renderResults,
  request,
  requestUrl,
  requireApiVersion,
  resolveSubpath,
  sanitizeHTMLToDom,
  setIcon,
  setTooltip,
  sortSearchResults,
  stringifyYaml,
  stripHeading,
  stripHeadingForLink,

} from "obsidian";

export const obsidian_api = {
  /**
   * This is the API version of the app, which follows the release
   * cycle of the desktop app. Example: "0.13.21"
   */
  apiVersion,
  /**
   * Adds an icon to the library.
   *
   * @param iconId — the icon ID
   * @param svgContent — the content of the SVG.
   */
  addIcon,
  arrayBufferToHex,
  base64ToArrayBuffer,
  debounce,
  /**
   * Flush the MathJax stylesheet.
   */
  finishRenderMath,
  getAllTags,
  getBlobArrayBuffer,
  /**
   * **getFrontMatterInfo**(content)
   *
   * Given the contents of a file, get information about the frontmatter
   * of the file, including whether there is a frontmatter block, the offsets
   * of where it starts and ends, and the frontmatter text.
   */
  getFrontMatterInfo,
  /**
   * Create an SVG from an iconId. Returns null if no icon associated with the iconId.
   */
  getIcon,
  /**
   * Get the list of registered icons.
   */
  getIconIds,
  getLinkpath,
  hexToArrayBuffer,
  /**
   * Converts HTML to Markdown using Turndown Service.
   */
  htmlToMarkdown,
  /**
   * **iterateRefs**(refs, cb)
   *
   * @returns — true if callback ever returns true, false otherwise.
   */
  iterateRefs,
  /**
   * Load MathJax.
   *
   * @see — [Official MathJax documentation](https://www.mathjax.org/)
   */
  loadMathJax,
  /**
   * Load Mermaid and return a promise to the global mermaid object. Can also use mermaid after this promise resolves to get the same reference.
   *
   * @see — [Official Mermaid documentation](https://mermaid.js.org/)
   */
  loadMermaid,
  /**
   * Load PDF.js and return a promise to the global pdfjsLib object.
   * Can also use window.pdfjsLib after this promise resolves to get the same reference.
   *
   * @see — [Official PDF.js documentation](https://mozilla.github.io/pdf.js/)
   */
  loadPdfJs,
  /**
   * Load **Prism.js** and return a promise to the global Prism object. Can
   * also use Prism after this promise resolves to get the same reference.
   *
   * @see — [Official Prism documentation](https://prismjs.com/)
   */
  loadPrism,
  normalizePath,
  parseFrontMatterAliases,
  parseFrontMatterEntry,
  parseFrontMatterStringArray,
  parseFrontMatterTags,
  parseLinktext,
  parseYaml,
  parseFloat: Number.parseFloat,
  parseInt: Number.parseInt,
  /**
   * Construct a fuzzy search callback that runs on a target string.
   * Performance may be an issue if you are running the search for more
   * than a few thousand times. If performance is a problem, consider
   * using prepareSimpleSearch instead.
   *
   * @param query — the fuzzy query.
   * @return — fn - the callback function to apply the search on.
   */
  prepareFuzzySearch,
  /**
   * Construct a simple search callback that runs on a target string.
   *
   * @param query — the space-separated words
   * @return — fn - the callback function to apply the search on
   */
  prepareSimpleSearch,
  stringifyYaml,
  /**
   * Normalizes headings for link matching by stripping out special characters
   * and shrinking consecutive spaces.
   */
  stripHeading,
  /**
   * Prepares headings for linking. It strips out some bad combinations
   * of special characters that could break links.
   */
  stripHeadingForLink,
  sortSearchResults,
  /**
   * **SetTooltip**(el, tooltip, options)
   *
   * @param el — The element to show the tooltip on
   * @param tooltip — The tooltip text to show
   * @param options
   */
  setTooltip,
  /**
   * Insert an SVG into the element from an iconId. Does nothing if no icon associated with the iconId.
   *
   * @param parent — the HTML element to insert the icon
   * @param iconId — the icon ID
   * @see — The Obsidian icon library includes the Lucide icon library, any icon name from their site will work here.
   */
  setIcon,

  sanitizeHTMLToDom,

  resolveSubpath,

  /**
   * Returns true if the API version is equal or higher than the requested version.
   * Use this to limit functionality that require specific API versions to avoid
   * crashing on older Obsidian builds.
   */
  requireApiVersion,

  /**
   * Similar to fetch(), request a URL using HTTP/HTTPS, without any CORS restrictions.
   * Returns the text value of the response.
   */
  request,
  /**
   * Similar to fetch(), request a URL using HTTP/HTTPS, without any CORS restrictions.
   */
  requestUrl,
  renderResults,
  /**
   * Render some LaTeX math using the MathJax engine. Returns an HTMLElement.
   * Requires calling finishRenderMath when rendering is all done to flush
   * the MathJax stylesheet.
   */
  renderMath,
  renderMatches,
  /**
   * Remove a custom icon from the library.
   *
   * @param iconId — the icon ID
   */
  removeIcon,
};
