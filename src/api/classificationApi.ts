import type KindModelPlugin from "~/main";
import type {
  Classification,
  DvPage,
  PageCategory,
  PageReference,
  PageSubcategory,
  PageType,
  Tag,
} from "~/types";
import type { ClassificationApi } from "~/types/ClassificationApi";
import {
  ensureLeading,
  isArray,
  isDefined,
  isEmpty,
  stripLeading,
} from "inferred-types";
import { asDisplayTag, futurePage } from "~/helpers";
import { getPage, getPagesFromTag } from "~/page";
import { getKindPageByTag } from "~/page/getPageKinds";
import { isFileLink } from "~/type-guards";
import { getPropertyType } from "./getPropertyType";

/**
 * Boolean test whether the passed in tag is a known `kind` tag
 */
export function isKindTag(p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(stripLeading(tag, "#"), "kind/");

    return p.kindTags.includes(safeTag); ;
  };
}

/**
 * indicates whether page has a tag which defines itself as a "category"
 */
export function hasCategoryTagDefn(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const hasBareCategory = !!page.file.etags.find(t =>
        t.startsWith(`#category/`),
      );
      const hasKindCategory = page.file.etags.find(
        t =>
          t.split("/")[1] === "category" && t.split("/").length === 3,
      );
      return !!(hasBareCategory || hasKindCategory);
    }

    return false;
  };
}

/**
 * indicates whether page has a tag which defines itself as a "subcategory"
 */
export function hasSubcategoryTagDefn(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const hasBareSubcategory = !!page.file.etags.find(t =>
        t.startsWith(`#subcategory/`),
      );
      const hasKindSubcategory = page.file.etags.find(
        t =>
          t.split("/")[1] === "subcategory"
          && t.split("/").length === 4,
      );
      return !!(hasBareSubcategory || hasKindSubcategory);
    }

    return false;
  };
}

/**
 * Checks whether a _kinded page_ has a **subcategory** tag defined.
 */
export function hasSubcategoryTag(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);
    const kinds = p.kindTags;

    return !!(page
      && page.file.etags.some(
        i =>
          i.split("/").length === 3
          && kinds.includes(stripLeading(i.split("/")[0], "#")),
      ));
  };
}

/**
 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
 *
 * Note:
 * - this will _never_ be true for a page which is a category page or a kinded definition
 */
export function hasCategoryTag(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const kindTags = Array.from(page.file.tags).filter((t: Tag) =>
        isKindTag(p)(stripLeading(t.split("/")[0], "#")),
      ) as string[];
      const withCategory = kindTags
        .filter(t => t.split("/").length > 1)
        .map(t => t.split("/")[1]);

      return withCategory.length > 0;
    }

    return false;
  };
}

/**
 * Boolean operator which reports on whether:
 *
 * 1. the given page has a property `category` and
 * 2. the property value is a `FileLink`
 */
export function hasCategoryProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const catType = getPropertyType(p)(
        page.file.frontmatter.category,
      );

      return !!(page.category && catType.startsWith("link"));
    }

    return false;
  };
}

/**
 * Boolean flag indicating whether the page has `subcategory` property which
 * is a `FileLink`.
 */
export function hasSubcategoryProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const catType = getPropertyType(p)(
        page.file.frontmatter.subcategory,
      );

      return !!(page.category && catType.startsWith("link"));
    }

    return false;
  };
}

/**
 * Boolean flag indicating whether the page has `subcategories` property which
 * is an array of `FileLink` references.
 */
export function hasSubcategoriesProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const catType = getPropertyType(p)(
        page.file.frontmatter.subcategory,
      );

      return !!(page.category && catType.startsWith("link"));
    }

    return false;
  };
}

/**
 * **hasAnySubcategoryProp**
 *
 * Boolean flag which indicates if _either_ the `subcategory` or `subcategories`
 * property is set.
 *
 * **Notes:**
 * - a `subcategories` property which is empty or missing any vault links is not
 * considered valid and ignored in check
 * - a `subcategory` which is not a vault link is also ignored
 */
export function hasAnySubcategoryProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean =>
    hasSubcategoriesProp(p)(pg) || hasSubcategoryProp(p)(pg);
}

/**
 * boolean operation which checks that page has a `categories` property, it is an array, and at least
 * on element in the array is a `FileLink`.
 */
export function hasCategoriesProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      return !!(page.categories
        && Array.isArray(page.categories)
        && page.categories.filter(isFileLink).length > 0);
    }

    return false;
  };
}

/**
 * **hasAnyCategoryProp**
 *
 * Boolean flag which indicates if _either_ the `category` or `categories`
 * property is set.
 *
 * **Notes:**
 * - a `categories` property which is empty or missing any vault links is not
 * considered valid and ignored in check
 * - a `category` which is not a vault link is also ignored
 */
export function hasAnyCategoryProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean =>
    hasCategoriesProp(p)(pg) || hasCategoryProp(p)(pg);
}

/**
 * provides all the `hasXXX` API surface for Classification API.
 */
export function hasProps(p: KindModelPlugin) {
  return (page: PageReference) => ({
    hasCategoryProp: hasCategoryProp(p)(page),
    hasCategoriesProp: hasCategoriesProp(p)(page),
    hasAnyCategoryProp: hasAnyCategoryProp(p)(page),
    hasSubcategoryProp: hasSubcategoryProp(p)(page),
    hasSubcategoriesProp: hasSubcategoriesProp(p)(page),
    hasAnySubcategoryProp: hasAnySubcategoryProp(p)(page),

    hasCategoryTag: hasCategoryTag(p)(page),
    hasSubcategoryTag: hasSubcategoryTag(p)(page),
    hasSubcategoryDefnTag: hasSubcategoryTagDefn(p)(page),

    hasKindProp: hasKindProp(p)(page),
    hasKindsProp: hasKindsProp(p)(page),
    hasAnyKindProp: hasAnyKindProp(p)(page),

    hasKindTag: hasKindTag(p)(page),
    hasKindDefinitionTag: hasKindDefinitionTag(p)(page),
    hasTypeDefinitionTag: hasTypeDefinitionTag(p)(page),
  });
}

/**
 * tests whether a page is a "category page" which is ascertained by:
 *
 * 1. is there a tag definition for the category (e.g., `#software/category/foo`)
 * 2. is there a property "role" which points to the `kind/category` definition?
 */
export function isCategoryPage(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    return !!(page
      && page.file.etags.some(
        i =>
          i.split("/").length === 3 && i.split("/")[1] === "category",
      ));
  };
}

/**
 * tests whether a page is a "subcategory page" which is ascertained by:
 *
 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
 * 2. is there a property "role" which points to the `[kind]/subcategory` definition?
 */
export function isSubcategoryPage(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      return !!page.file.etags.some(
        i =>
          i.split("/").length === 4
          && i.split("/")[1] === "subcategory",
      );
    }

    return false;
  };
}

/**
 * boolean operator which reports on whether the page has multiple "kinds" which it is _kinded_ by.
 */
export function hasMultipleKinds(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const tags = page.file.tags;
      const kindTags = tags.filter(t =>
        isKindTag(p)(stripLeading(t.split("/")[0], "#")),
      );
      return kindTags.length > 1;
    }

    return false;
  };
}

/**
 * returns all the `isXXX` properties of the classification API
 */
export function isProps(p: KindModelPlugin) {
  return (page: PageReference) => ({
    isCategoryPage: isCategoryPage(p)(page),
    isSubcategoryPage: isSubcategoryPage(p)(page),
    isKindDefnPage: isKindDefnPage(p)(page),
    isTypeDefnPage: isTypeDefnPage(p)(page),
    isKindedPage: isKindedPage(p)(page),
  });
}
/**
 * Gets the `PageType` for the given page.
 */
export function getPageType(p: KindModelPlugin) {
  return (
    page: PageReference,
    isApi?: ReturnType<ReturnType<typeof isProps>>,
  ): PageType => {
    const api = isApi || isProps(p)(page);
    const multi = hasMultipleKinds(p)(page);

    return api.isKindDefnPage
      ? "kind-defn"
      : api.isKindedPage && api.isCategoryPage && multi
        ? "multi-kinded > category"
        : api.isKindedPage && api.isCategoryPage && multi
          ? "kinded > category"
          : api.isKindedPage && api.isSubcategoryPage && multi
            ? "multi-kinded > subcategory"
            : api.isKindedPage && api.isSubcategoryPage && multi
              ? "kinded > subcategory"
              : api.isKindedPage
                ? multi ? "multi-kinded" : "kinded"
                : api.isTypeDefnPage
                  ? "type-defn"
                  : "none";
  };
}

/**
 * Get's the type tag on the page if it exists:
 *
 * - `#type/ai` found on page, returns `ai`
 * - no tags starting in `#type/` returns _undefined_
 */
export function getTypeTag(p: KindModelPlugin) {
  return (pg: PageReference): string | undefined => {
    const page = getPage(p)(pg);
    if (page) {
      const typeTags = page.file.tags.filter(t => t.startsWith(`#type/`));
      if (typeTags.length > 1) {
        p.warn(
          `Too many Type tags!`,
          `The page "${page.file.name}" has ${typeTags.length} tags which start with ${asDisplayTag("type/")}`,
        );
      }
      const typeTag = typeTags.length > 0
        ? stripLeading(typeTags[0] as string, "#type/")
        : undefined;
      return typeTag;
    }

    return undefined;
  };
}

/**
 * boolean operator which indicates whether the page has a
 * "kind tag" (not a kind definition tag).
 */
export function hasKindTag(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const tags = page.file.etags;
      const kindTags = tags.filter(
        t =>
          isKindTag(p)(stripLeading(t.split("/")[0], "#"))
          || (t.split("/").length === 3
            && t.split("/")[1] === "category")
          || (t.split("/").length === 4
            && t.split("/")[1] === "subcategory"),
      );
      return kindTags.length > 0;
    }

    return false;
  };
}

/**
 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
 */
export function hasKindDefinitionTag(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const tags = page.file.tags.filter(t => t.startsWith(`#kind/`));

      return tags.length > 0;
    }

    return false;
  };
}

/**
 * boolean operator which indicates whether the page has a tag starting with `#type/`.
 */
export function hasTypeDefinitionTag(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      const tags = page.file.tags.filter(t => t.startsWith(`#type/`));

      return tags.length > 0;
    }

    return false;
  };
}

/**
 * a boolean operator which reports on whether the page has a `kind` property which is a `FileLink` to
 * a page in the vault.
 */
export function hasKindProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    return !!(page && isDefined(page.kind) && isFileLink(page.kind));
  };
}

/**
 * a boolean operator which reports on whether the page has a `kinds` property which is an array with at least
 * one `FileLink` in it.
 */
export function hasKindsProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      return (
        isDefined(page.kinds)
        && isArray(page.kinds)
        && page.kinds.some(p => isFileLink(p))
      );
    }
    return false;
  };
}

export function hasAnyKindProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean =>
    hasKindProp(p)(pg) || hasKindsProp(p)(pg);
}

/**
 * a boolean operator which reports on whether the page has a `type` property which is a `FileLink` to
 * a page in the vault.
 */
export function hasTypeProp(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    const page = getPage(p)(pg);

    if (page) {
      return isDefined(page.type) && isFileLink(page.type);
    }
    return false;
  };
}

/**
 * a boolean operator which reports on whether the page has a `type` tag indicating that
 * the page is a Type definition page.
 */
export function hasTypeTag(p: KindModelPlugin) {
  return (pg: PageReference | undefined): boolean => {
    const page = getPage(p)(pg);
    if (page) {
      const found = page.file.etags.find(i => i.startsWith("type/"));
      return !!found;
    }
    return false;
  };
}

export function isCategoryDefnTag(_p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(tag, "#");
    const parts = safeTag.split("/");
    return !!(parts.length === 3 && parts[1] === "category");
  };
}

export function isSubcategoryDefnTag(_p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(tag, "#");
    const parts = safeTag.split("/");
    return !!(parts.length === 4 && parts[1] === "subcategory");
  };
}

export function isKindedWithCategoryTag(p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(tag, "#");
    const parts = safeTag.split("/");
    return parts.length === 2 && isKindTag(p)(parts[0]);
  };
}

export function isKindedWithSubcategoryTag(p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(tag, "#");
    const parts = safeTag.split("/");
    return !!(parts.length === 3
      && !["category", "subcategory"].includes(parts[1])
      && isKindTag(p)(parts[0]));
  };
}

export function isTypeDefnTag(_p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(tag, "#");
    return safeTag.startsWith("type/");
  };
}

/**
 * gets all "categories" associated with page:
 *
 * - takes from `category` and `categories` props
 * - spans _all_ kinds which were defined
 */
export function getCategories(p: KindModelPlugin) {
  return (pg: PageReference): PageCategory[] => {
    const page = getPage(p)(pg);
    const pageType = getPageType(p)(pg);

    if (page && pageType) {
      const catTags = (Array.from(page.file.tags) as string[])
        .filter(
          i => i.split("/")[1] === "category" && !isEmpty(i.split("/")[2]),
        )
        .map(
          (i) => {
            const [kind, _, category] = i.split("/");
            return {
              kind: stripLeading(kind, "#"),
              page,
              category,
              kindedTag: `${ensureLeading(kind, "#")}/${category}`,
              defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
            } as PageCategory;
          },
        );
      const subcatTags = (Array.from(page.file.tags) as string[])
        .filter(
          i => i.split("/")[1] === "subcategory",
        )
        .map(
          (i) => {
            const [kind, _, category] = i.split("/");
            return {
              kind: stripLeading(kind, "#"),
              page,
              category,
              kindedTag: `${ensureLeading(kind, "#")}/${category}`,
              defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
            } as PageCategory;
          },
        );
      const kindedTags = (Array.from(page.file.tags) as string[])
        .filter(
          i => [2, 3].includes(i.split("/").length) && !["category", "subcategory"].includes(i.split("/")[1]),
        )
        .map(
          (i) => {
            const [kind, category] = i.split("/");
            const catPage = getPagesFromTag(p)(`${ensureLeading(kind, "#")}/category/${category}`);
            if (catPage.length > 0) {
              const cat = catPage[0];

              return {
                kind: stripLeading(kind, "#"),
                page: cat,
                category,
                kindedTag: `${ensureLeading(kind, "#")}/${category}`,
                defnTag: `${ensureLeading(kind, "#")}/category/${category}`,
              } as PageCategory;
            }
          },
        )
        .filter(i => i) as PageCategory[];

      switch (pageType) {
        case "kind-defn":
        case "type-defn":
          return [];
        case "kinded > category":
          return catTags.length > 0
            ? [catTags[0]] as PageCategory[]
            : [] as PageCategory[];
        case "kinded > subcategory":
          return subcatTags.length > 0
            ? [subcatTags[0]] as PageCategory[]
            : [] as PageCategory[];
        case "kinded":
          return kindedTags.length > 0
            ? [kindedTags[0]]
            : [] as PageCategory[];
        case "multi-kinded > category":
          return catTags.length > 0
            ? catTags as PageCategory[]
            : [] as PageCategory[];
        case "multi-kinded > subcategory":
          return subcatTags.length > 0
            ? subcatTags as PageCategory[]
            : [] as PageCategory[];
        case "multi-kinded":
          return kindedTags.length > 0
            ? kindedTags as PageCategory[]
            : [] as PageCategory[];
        case "none":
          return [] as PageCategory[];
      }
    }
    return [];
  };
}

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export function getSubcategories(p: KindModelPlugin) {
  return (pg: PageReference): PageSubcategory[] => {
    const page = getPage(p)(pg);
    const pageType = getPageType(p)(pg);

    if (page && pageType) {
      const possibleKinded = (Array.from(page.file.tags) as string[]).filter(
        i => i.split("/").length === 3
          && !["category", "subcategory"].includes(i.split("/")[1])
          && isKindTag(p)(i.split("/")[0]),
      ).map((i) => {
        const [kind, category, subcategory] = i.split("/");
        const subcat = getPagesFromTag(p)(`${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`);
        return {
          kind: stripLeading(kind, "#"),
          page: subcat.length > 0
            ? subcat[0]
            : futurePage(p)(
                "kinded > subcategory",
                `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,
              ),
          category,
          subcategory,
          kindedTag: `${ensureLeading(kind, "#")}/${category}/${subcategory}`,
          defnTag: `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,

        } as PageSubcategory;
      });

      switch (pageType) {
        case "kind-defn":
        case "type-defn":
        case "kinded > category":
          return [];
        case "kinded > subcategory":
          const tag = page.file.tags.find(i => i.split("/")[1] === "subcategory") as string;
          const [kind, _, category, subcategory] = tag.split("/");
          return [{
            kind: stripLeading(kind, "#"),
            page,
            category,
            subcategory,
            kindedTag: `${ensureLeading(kind, "#")}/${category}/${subcategory}`,
            defnTag: `${ensureLeading(kind, "#")}/subcategory/${category}/${subcategory}`,
          } as PageSubcategory];
        case "kinded":
          return possibleKinded.length > 0
            ? [possibleKinded[0]]
            : [] as PageSubcategory[];
        case "multi-kinded > category":
        case "multi-kinded > subcategory":
          return [];
        case "multi-kinded":
          return possibleKinded;
        case "none":
          return [];
      }
    }

    return [];
  };
}

/**
 * A page is a kinded page if:
 *
 * 1. it has a `kind` property pointing to another page in the vault
 * 2. it has a tag which is known to be for a kind definition
 *
 * Note: we don't require that the `kind` property point to a Kind Definition but
 * this will show up on calling `kindErrors`
 */
export function isKindedPage(p: KindModelPlugin) {
  return (pg: PageReference): boolean => {
    // get DvPage (from cache or into)
    const page = getPage(p)(pg);

    if (page) {
      return hasKindProp(p)(page) && !hasKindDefinitionTag(p)(page)
        ? true
        : !!hasKindTag(p)(page);
    }

    return false;
  };
}

export function isKindDefnPage(p: KindModelPlugin) {
  return (ref: PageReference): boolean => {
    const page = getPage(p)(ref);

    return !!(page && page.file.etags.some(i => i.startsWith("#kind/")));
  };
}

export function isTypeDefnPage(p: KindModelPlugin) {
  return (ref: PageReference) => {
    const page = getPage(p)(ref);

    return !!(
      page
      && page.file.tags.some(i => i.startsWith("#type/"))
      && !page.file.tags.some(i => i.startsWith("#kind/"))
      && !page.file.tags.some(
        i => [2, 3].includes(i.split("/").length)
          && isKindTag(p)(i.split("/")[0]),
      )
    );
  };
}

/**
 * For a given page, it will return the "kind tags" of that page.
 *
 * For instance:
 *
 * - a page with the tag `#software/category/ai` would return `["software"]`.
 * - a page with the tag `#kind/software` would also return `["software"]`
 */
export function getKindTagsOfPage(p: KindModelPlugin) {
  return (pg: PageReference | undefined): string[] => {
    const page = getPage(p)(pg);
    if (page) {
      if (isKindDefnPage(p)(page)) {
        const kind = page.file.tags.find(i => i.startsWith(`#kind/`));
        return kind
          ? [kind.split("/")[1]]
          : [];
      }

      const kindedCat = page.file.etags
        .filter(
          t =>
            t.split("/").length === 3
            && t.split("/")[1] === "category",
        )
        .map(i => i.split("/")[0]);
      const kindedSubcat = page.file.etags
        .filter(
          t =>
            t.split("/").length === 4
            && t.split("/")[1] === "subcategory",
        )
        .map(i => i.split("/")[0]);
      const kinded = page.file.etags
        .filter(
          t =>
            isKindTag(p)(t.split("/")[0])
            && !["category", "subcategory"].includes(t.split("/")[1]),
        )
        .map(i => i.split("/")[0]);

      const tags = new Set<string>([
        ...kinded,
        ...kindedCat,
        ...kindedSubcat,
      ]);

      return Array.from<string>(tags).map(i => stripLeading(i, "#"));
    }
    return [];
  };
}

/**
 * get's a `DvPage` object for every kind definition that this page
 * is a part of.
 */
export function getKindPages(p: KindModelPlugin) {
  return (pg: PageReference | undefined): DvPage[] => {
    const page = getPage(p)(pg);
    if (page) {
      const pages = getKindTagsOfPage(p)(page)
        .map(i => getKindPageByTag(p)(i))
        .filter(i => i) as DvPage[];

      return pages;
    }

    return [];
  };
}

export function getClassification(p: KindModelPlugin) {
  return (
    pg: PageReference | undefined,
    cats?: PageCategory[] | undefined,
    subCats?: PageSubcategory[] | undefined,
  ): Classification[] => {
    const page = pg ? getPage(p)(pg) : undefined;
    const classification: Classification[] = [];

    if (page) {
      const pgCats = cats || getCategories(p)(page);
      const pgSubCats = subCats || getSubcategories(p)(page);

      const kindTags: string[] = getKindTagsOfPage(p)(page);

      for (const tag of kindTags) {
        const kp = getKindPageByTag(p)(tag);

        if (kp) {
          classification.push({
            kind: kp,
            kindTag: tag,
            categories: pgCats.filter(
              c => c.kind === stripLeading(tag, "#"),
            ),
            subcategory: pgSubCats.find(
              c => c.kind === stripLeading(tag, "#"),
            ),
          });
        }
        else {
          const defn = p.dv.pages(`#kind/${tag}`);
          if (defn.length > 0) {
            p.debug(
              `tag lookup of ${tag} failed but found kind definition with dataview query`,
            );
            const kindPage = Array.from(defn)[0] as DvPage;
            if (
              kindPage
              && kindPage.file.etags.some(i =>
                i.startsWith("#kind/"),
              )
            ) {
              classification.push({
                kind: kindPage,
                kindTag: tag,
                categories: pgCats.filter(
                  c => c.kind === stripLeading(tag, "#"),
                ),
                subcategory: pgSubCats.find(
                  c => c.kind === stripLeading(tag, "#"),
                ),
              });

              return classification;
            }
          }

          p.warn(
            `no 'kind' could be identified for the page ${page.file.path}`,
            {
              categories: pgCats,
              subcategories: pgSubCats,
              etags: Array.from(page.file.etags),
              kindTags,
              tag,
              kp,
            },
          );
        }
      }
    }

    p.debug("classification", classification);

    return classification;
  };
}

/**
 * API surface for classification functionality
 */
export function classificationApi(plugin: KindModelPlugin): ClassificationApi {
  return {
    hasCategoryProp: hasCategoryProp(plugin),
    hasCategoriesProp: hasCategoriesProp(plugin),
    hasTypeDefinitionTag: hasTypeDefinitionTag(plugin),
    hasKindDefinitionTag: hasKindDefinitionTag(plugin),
    hasKindProp: hasKindProp(plugin),
    hasKindsProp: hasKindsProp(plugin),
    hasTypeProp: hasTypeProp(plugin),
    hasMultipleKinds: hasMultipleKinds(plugin),
    hasCategoryTagDefn: hasCategoryTagDefn(plugin),
    hasCategoryTag: hasCategoryTag(plugin),
    hasAnyCategoryProp: hasAnyCategoryProp(plugin),
    hasAnySubcategoryProp: hasAnySubcategoryProp(plugin),
    getCategories: getCategories(plugin),
    hasSubcategoryTagDefn: hasSubcategoryTagDefn(plugin),
    isCategoryPage: isCategoryPage(plugin),
    isSubcategoryPage: isSubcategoryPage(plugin),
    isKindedPage: isKindedPage(plugin),
    isKindDefnPage: isKindDefnPage(plugin),
    isTypeDefnPage: isTypeDefnPage(plugin),
    getClassification: getClassification(plugin),
    getKindPages: getKindPages(plugin),

    getKindTagsOfPage: getKindTagsOfPage(plugin),
    isKindTag: isKindTag(plugin),
  } as ClassificationApi;
}
