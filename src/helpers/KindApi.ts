import KindModelPlugin from "main";
import { PageContext } from "types/PageContent";
import { DataArray, PageRef } from "types/dataview-types";
import { Tag } from "types/general";


export interface KindApi {
  pages: DataArray<PageRef>;
  exists: (kind: string) => boolean;
  /**
   * A list of all the **kind** names
   */
  kind_names: () => string[];

  /**
   * A list of all the **tags** which identify a _kinded type_.
   * 
   * **Note:** this intentionally _excludes_ the `#kind` tag that 
   * all kind definitions have.
   */
  kind_tags: () => string[];

  /**
   * Given the `PageContext`, this function will determine the **kind**
   * of category page this is. If it is _not_ a category page it will
   * throw an error.
   */
  get_category_tag: (ctx: PageContext) => Tag;

  lookup_kind_by_tag: (tag: string) => PageRef | null;
}

export const KindApi = (plugin: KindModelPlugin) => (pages: DataArray<PageRef>): KindApi => ({
  pages,
  exists: (kind) => {
    const found = pages.find(i => i?.kind?.file?.name === kind);

    console.log("kind is", typeof kind)
    console.log("pages is", typeof pages, Array.isArray(pages))

    return found ? true : false;
  },

  kind_names: () => {
    return pages.map(p => p.file.name).values;
  },

  kind_tags: () => {
    const pg: string[] = pages.values
      .map(p => {
        return p.file.etags.values as string[];
      })
      .flat()
      .filter(i => !["#kind", "#category", "#sub-category"].includes(i));

    return pg;
  },

  get_category_tag: (ctx) => {
    if (!ctx.meta.isCategoryPage) {
      throw new Error(`get_category_tag() called on non-category page!`);
    }
    const remaining = ctx.meta.tags.filter(i => !i.includes("category"));
    if(remaining.length === 0) {
      plugin.error(`category can not be determined from page context passed in!`, ctx);
      throw new Error(`category can not be determined from page context passed in!`)
    }

    return remaining[0] as Tag;
  },

  lookup_kind_by_tag(tag: string) {
    if (!tag.startsWith("#")) {
      tag = `#${tag}`
    }
    const found = pages.where(p => p.file.etags.includes(tag));
    if (found.length > 1) {
      plugin.warn(`Looking for a kind tag of "${tag}" and ${found.length} were found! It should only ever find 1! The first value will be used.`);
      return found.values[0];
    } else if (found.length === 1) {
      return found.values[0];
    } else {
      return null;
    }
  }
      
    

});
