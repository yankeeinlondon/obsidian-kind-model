import type KindModelPlugin from "~/main";
import type {
  Classification,
  DvPage,
  PageCategory,
  PageReference,
  PageSubcategory,
  Tag,
} from "~/types";
import type { ClassificationApi } from "~/types/ClassificationApi";
import {
  ensureLeading,
  isArray,
  isDefined,
  stripLeading,
} from "inferred-types";
import { lookupKindByTag, lookupKnownKindTags } from "~/cache";
import { getPage } from "~/page";
import { isFileLink } from "~/type-guards";
import { getPropertyType } from "./getPropertyType";

/**
 * returns all Kind tags which have `tag` as part of them; all tags
 * are passed back if tag is _undefined_.
 */
export function getKnownKindTags(p: KindModelPlugin) {
  return (tag?: string): string[] => {
    return tag
      ? Array.from(p.cache?.kindDefinitionsByTag?.keys() || []).filter(
          i => i.includes(tag),
        )
      : Array.from(p.cache?.kindDefinitionsByTag?.keys() || []);
  };
}

/**
 * Boolean test whether the passed in tag is a known `kind` tag
 */
export function isKindTag(p: KindModelPlugin) {
  return (tag: string): boolean => {
    const safeTag = stripLeading(stripLeading(tag, "#"), "kind/");
    const valid = getKnownKindTags(p)();

    return valid.includes(safeTag);
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
    const kinds = lookupKnownKindTags(p);

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

function catTag(kind: string, cat: string) {
  return `${ensureLeading(kind, "#")}/${cat}`;
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
    const categories: PageCategory[] = [];

    if (page) {
      const kindedCat = page.file.etags
        .filter(
          t =>
            t.split("/").length === 3
            && t.split("/")[1] === "category",
        )
        .map(i => catTag(i.split("/")[0], i.split("/")[2]));
      const kindedSubcat = page.file.etags
        .filter(
          t =>
            t.split("/").length === 4
            && t.split("/")[1] === "subcategory",
        )
        .map(i => catTag(i.split("/")[0], i.split("/")[2]));
      const kinded = page.file.etags
        .filter(
          t =>
            t.split("/").length > 1
            && !["category", "subcategory"].includes(
              t.split("/")[1],
            )
            && isKindTag(p)(t.split("/")[0]),
        )
        .map(i => catTag(i.split("/")[0], i.split("/")[1]));

      /** unique set of tags in format of `#kind/cat` */
      const tags = new Set<string>([
        ...kinded,
        ...kindedCat,
        ...kindedSubcat,
      ]);
      const missing: string[] = [];
      const pages = Array.from<string>(tags)
        .map((t) => {
          const [kind, cat] = t.split("/");
          const pgs = p.dv.pages(`${kind}/category/${cat}`);
          if (pgs.length > 0) {
            return [t, pgs[0] as DvPage] as [string, DvPage];
          }
          else {
            missing.push(`${t} on page "${page.file.path}"`);
            return undefined;
          }
        })
        .filter(i => i) as [string, DvPage][];

      if (missing.length > 0) {
        p.warn("Some category tags didn't not map to a page", missing);
      }

      return pages.map(([t, pg]) => {
        return {
          kind: stripLeading(t.split("/")[0], "#"),
          page: pg,
          category: t.split("/")[1],
          kindedTag: ensureLeading(t, "#"),
          defnTag: `${ensureLeading(t.split("/")[0], "#")}/category/${t.split("/")[1]}`,
        } as PageCategory;
      });

      // /** tags with category info */
      // const tags = getCategoryTags(p)(page);
      // p.info("cat tags", tags)

      // return tags.map(t => {
      // 		return {
      // 			...t,
      // 			category: getPage(p)(t.defnTag)
      // 		} as PageCategory
      // });
    }

    return categories;
  };
}

function subCatTag(kind: string, cat: string, sub: string) {
  return `${ensureLeading(kind, "#")}/${cat}/${sub}`;
}

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export function getSubcategories(p: KindModelPlugin) {
  return (pg: PageReference): PageSubcategory[] => {
    const page = getPage(p)(pg);
    if (page) {
      const kindedSubcat = page.file.etags
        .filter(
          t =>
            t.split("/").length === 4
            && t.split("/")[1] === "subcategory",
        )
        .map(i =>
          subCatTag(
            i.split("/")[0],
            i.split("/")[2],
            i.split("/")[3],
          ),
        );
      const kinded = page.file.etags
        .filter(
          t =>
            t.split("/").length === 3
            && !["category", "subcategory"].includes(
              t.split("/")[1],
            )
            && isKindTag(p)(t.split("/")[0]),
        )
        .map(i =>
          subCatTag(
            i.split("/")[0],
            i.split("/")[1],
            i.split("/")[2],
          ),
        );

      /** unique set of tags in format of `#kind/cat` */
      const tags = new Set<string>([...kinded, ...kindedSubcat]);
      const missing: string[] = [];
      const pages = Array.from<string>(tags)
        .map((t) => {
          const [kind, cat, subcat] = t.split("/");
          const pgs = p.dv.pages(
            `${kind}/subcategory/${cat}/${subcat}`,
          );
          if (pgs.length > 0) {
            return [t, pgs[0]] as [string, DvPage | undefined];
          }
          else {
            missing.push(`${t} on page "${page.file.path}"`);
            return undefined;
          }
        })
        .filter(i => i) as [string, DvPage][];

      if (missing.length > 0) {
        p.warn(
          "Some subcategory tags didn't not map to a page",
          missing,
        );
      }

      return pages.map(([t, pg]) => {
        const parts = t.split("/");

        return {
          kind: stripLeading(parts[0], "#"),
          page: pg,
          category: parts[1],
          subcategory: parts[2],
          kindedTag: ensureLeading(t, "#"),
          defnTag: `${ensureLeading(parts[0], "#")}/subcategories/${parts[1]}/${parts[2]}`,
        } as PageSubcategory;
      });
    }

    return [];
  };
}

/**
 * looks at the passed in page's "kind" property as well as the tag reference if available to and returns the _kinds_
 * this page is identified as.
 */
export function getKindDefinitions(p: KindModelPlugin) {
  return (pg: PageReference | undefined): DvPage[] => {
    const page = getPage(p)(pg);
    if (page) {
      if (page.kind && isFileLink(page.kind)) {
        return [getPage(p)(page.kind.path)] as DvPage[];
      }
      else if (
        page.kinds
        && Array.isArray(page.kinds)
        && page.kinds.some(i => isFileLink(i))
      ) {
        return page.kinds
          .filter(i => isFileLink(i))
          .map(i => getPage(p)(i.path))
          .filter(i => i) as DvPage[];
      }
      // const tags = getKindTagsOfPage(p)(page);
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

    return !!(page && page.file.etags.some(i => i.startsWith("#type/")));
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
      const kindDefn = page.file.etags
        .filter(t => t.startsWith("#kind/"))
        .map(i => i.split("/")[1]);

      const tags = new Set<string>([
        ...kinded,
        ...kindedCat,
        ...kindedSubcat,
        ...kindDefn,
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
        .map(i => lookupKindByTag(p)(i))
        .map(i => (i ? getPage(p)(i.path) : undefined))
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

      for (let tag of kindTags) {
        tag = stripLeading(tag, "#");
        p.debug(`tag ${tag}`);

        const kd = lookupKindByTag(p)(tag);
        const kp = kd ? getPage(p)(kd.path) : undefined;

        if (kd && kp) {
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
              kd,
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
    getClassification: getClassification(plugin),
    getKnownKindTags: getKnownKindTags(plugin),
    getKindPages: getKindPages(plugin),

    getKindTagsOfPage: getKindTagsOfPage(plugin),
    isKindTag: isKindTag(plugin),
  };
}
