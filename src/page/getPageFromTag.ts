import type KindModelPlugin from "~/main";
import type { DvPage, Tag } from "~/types";
import { ensureLeading, isUndefined, stripLeading } from "inferred-types";

/**
 * returns a `DvPage` representation of a page from a kind tag.
 *
 * - The kind tag can be represented in a variety of ways:
 * 		- `["#kind/foo", "kind/foo", "foo", "#foo"]`
 * 		- all the above strings will find the page defined with `#kind/foo`
 * 		- if more than one is found only the first is returned.
 */
export function getPageFromKindTag(p: KindModelPlugin) {
  return (tag: string): DvPage | undefined => {
    const stripped = stripLeading(
      stripLeading(tag, "#"),
      "kind/",
    );
    const safeTag = ensureLeading(stripped, "#kind/");
    const pages = p.dv.pages(safeTag);

    return pages.length > 0
      ? pages[0] as DvPage
      : undefined;
  };
}

export function getCategoryPageFromTags(p: KindModelPlugin) {
  return (kind: string, category: string) => {
    const strippedKind = stripLeading(
      stripLeading(kind, "#"),
      "kind/",
    );
    const strippedCategory = stripLeading(
      stripLeading(kind, "#"),
      "category/",
    );

    const query = `#${strippedKind}/category/$${strippedCategory}`;
    const pages = p.dv.pages(query);

    if (pages.length > 0) {
      return pages[0] as DvPage;
    }
    else {
      return undefined;
    }
  };
}

export function getPagesFromTag(p: KindModelPlugin) {
  return <T extends string | undefined>(tag: T): T extends string ? DvPage[] : undefined => {
    if (isUndefined(tag)) {
      return undefined as T extends string ? DvPage[] : undefined;
    }

    const safeTag = ensureLeading(tag, "#") as Tag;
    const pages = Array.from(p.dv.pages(safeTag).sort(p => p.file.name)) as DvPage[];

    return pages as T extends string ? DvPage[] : undefined;
  };
}
