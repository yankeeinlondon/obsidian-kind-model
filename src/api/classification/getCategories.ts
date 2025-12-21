import type KindModelPlugin from "~/main";
import type { DvPage, PageCategory, PageReference } from "~/types";
import { ensureLeading, isEmpty, isNotEmpty, stripLeading } from "inferred-types";
import { getPage, getPageFromTagOrFuturePage } from "~/page";
import { getPageType } from "../classificationApi";

function getCategorySpecs(p: KindModelPlugin) {
  return (page: DvPage): PageCategory[] => {
    let kindedTags = (Array.from(page.file.tags) as string[])
      .filter(
        i => [2, 3].includes(i.split("/").length)
            && !["category", "subcategory"].includes(i.split("/")[1]),
      )
      .map(
        (i) => {
          const [kind, category] = i.split("/");
          const catDefnTag = `${ensureLeading(kind, "#")}/category/${category}`;
          return {
            kind: stripLeading(kind, "#"),
            page: getPageFromTagOrFuturePage(p)(
              catDefnTag,
              `"${category}" as Category for "${stripLeading(kind, "#")}"`,
            ),
            category,
            kindedTag: `${ensureLeading(kind, "#")}/${category}`,
            defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
          } as PageCategory;
        },
      )
      .filter(i => i) as PageCategory[];
    const kindedIds = new Set(kindedTags.map(i => `${i.kind}${i.category}`));
    // ensure unique
    kindedTags = kindedTags.filter((i) => {
      if (kindedIds.has(`${i.kind}${i.category}`)) {
        kindedIds.delete(`${i.kind}${i.category}`);
        return true;
      }
      else {
        return false;
      }
    });

    return kindedTags;
  };
}

function getCategoryDefnSpecs(p: KindModelPlugin) {
  return (page: DvPage): PageCategory[] => {
    return (Array.from(page.file.tags) as string[])
      .filter(
        i => i.split("/")[1] === "category" && !isEmpty(i.split("/")[2]),
      )
      .map(
        (i) => {
          const [kind, _, category] = i.split("/");
          const findTag = `${ensureLeading(kind, "#")}/category/${category}`;
          const futureName = `"${category}" as Category for "${stripLeading(kind, "#")}"`;
          return {
            kind: stripLeading(kind, "#"),
            page: getPageFromTagOrFuturePage(p)(
              findTag,
              futureName,
            ),
            category,
            kindedTag: `${ensureLeading(kind, "#")}/${category}`,
            defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
          } as PageCategory;
        },
      );
  };
}

function getSubcategoryDefnSpecs(p: KindModelPlugin) {
  return (
    page: DvPage,
  ): PageCategory[] => {
    return (Array.from(page.file.tags) as string[])
      .filter(
        i => i.split("/")[1] === "subcategory" && isNotEmpty(i.split("/")[3]),
      )
      .map(
        (i) => {
          const [kind, _, category] = i.split("/");
          const findTag = `${ensureLeading(kind, "#")}/category/${category}`;
          const futureName = `"${category}" as Category for "${stripLeading(kind, "#")}"`;
          return {
            kind: stripLeading(kind, "#"),
            page: getPageFromTagOrFuturePage(p)(
              findTag,
              futureName,
            ),
            category,
            kindedTag: `${ensureLeading(kind, "#")}/${category}`,
            defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
          } as PageCategory;
        },
      );
  };
}

/**
 * gets all "categories" associated with page in an array of `PageCategory`
 */
export function getCategories(p: KindModelPlugin) {
  return (pg: PageReference): PageCategory[] => {
    const page = getPage(p)(pg);
    const pageType = getPageType(p)(pg);

    if (page && pageType) {
      switch (pageType) {
        case "kind-defn":
        case "type-defn":
          return [];
        case "kinded > category":
          return getCategoryDefnSpecs(p)(page);
        case "kinded > subcategory":
          return getSubcategoryDefnSpecs(p)(page);
        case "kinded":
          const kinded = getCategorySpecs(p)(page);
          return kinded.length > 0
            ? kinded
            : [] as PageCategory[];
        case "multi-kinded > category":
          return getCategoryDefnSpecs(p)(page);
        case "multi-kinded > subcategory":
          return getSubcategoryDefnSpecs(p)(page);
        case "multi-kinded":
          return getCategorySpecs(p)(page).filter(i => i.category);
        case "none":
          return [] as PageCategory[];
      }
    }
    return [];
  };
}
