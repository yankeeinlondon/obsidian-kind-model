import {
	Container,
	Dictionary,
	ensureLeading,
	isArray,
	isContainer,
	isDefined,
	isIsoDate,
	isIsoDateTime,
	isIsoExplicitDate,
	isNumber,
	Iso8601Date,
	Iso8601DateTime,
	isString,
	isStringArray,
	isYouTubeVideoUrl,
	stripLeading,
} from "inferred-types";

import KindModelPlugin from "~/main";

import { isDvPage, isFileLink, isFrontmatter, isPageInfo } from "~/type-guards";
import {
	DvPage,
	Classification,
	PageBanners,
	PageIcons,
	PageSuggestion,
	Tag,
	PageReference,
	PropertyType,
	PageCategory,
	PageSubcategory,
	DecomposedTag,
	DecomposedCategoryTag,
	DecomposedSubcategoryTag,
	DecomposedKindTag,
	Frontmatter,
	PageMetadata,
	BuildingBlocksApi,
} from "~/types";
import { getPropertyType } from "./getPropertyType";
import { getPage } from "~/page";
import { lookupKindByTag, lookupKnownKindTags } from "~/cache";
import { asExplicitIso8601Date } from "~/api/dateTime";

/**
 * returns all Kind tags which have `tag` as part of them; all tags
 * are passed back if tag is _undefined_.
 */
export const getKnownKindTags =
	(p: KindModelPlugin) =>
	(tag?: string): string[] => {
		return tag
			? Array.from(p.cache?.kindDefinitionsByTag?.keys() || []).filter(
					(i) => i.includes(tag),
				)
			: Array.from(p.cache?.kindDefinitionsByTag?.keys() || []);
	};

export const isKeyOf = <TContainer, TKey>(
	container: TContainer,
	key: TKey,
): key is TContainer extends Container ? TKey & keyof TContainer : TKey => {
	return isContainer(container) &&
		(isString(key) || isNumber(key)) &&
		key in container
		? true
		: false;
};

/**
 * Boolean test whether the passed in tag is a known `kind` tag
 */
export const isKindTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(stripLeading(tag, "#"), "kind/");
		const valid = getKnownKindTags(p)();

		return valid.includes(safeTag);
	};

/**
 * indicates whether page has a tag which defines itself as a "category"
 */
export const hasCategoryTagDefn =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const hasBareCategory = page.file.etags.find((t) =>
				t.startsWith(`#category/`),
			)
				? true
				: false;
			const hasKindCategory = page.file.etags.find(
				(t) =>
					t.split("/")[1] === "category" && t.split("/").length === 3,
			);
			return hasBareCategory || hasKindCategory ? true : false;
		}

		return false;
	};

/**
 * indicates whether page has a tag which defines itself as a "subcategory"
 */
export const hasSubcategoryTagDefn =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const hasBareSubcategory = page.file.etags.find((t) =>
				t.startsWith(`#subcategory/`),
			)
				? true
				: false;
			const hasKindSubcategory = page.file.etags.find(
				(t) =>
					t.split("/")[1] === "subcategory" &&
					t.split("/").length === 4,
			);
			return hasBareSubcategory || hasKindSubcategory ? true : false;
		}

		return false;
	};

/**
 * Checks whether a _kinded page_ has a **subcategory** tag defined.
 */
export const hasSubcategoryTag =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);
		const kinds = lookupKnownKindTags(p);

		return page &&
			page.file.etags.some(
				(i) =>
					i.split("/").length === 3 &&
					kinds.includes(stripLeading(i.split("/")[0], "#")),
			)
			? true
			: false;
	};

/**
 * Indicates whether the _specified page_ has expressed it's category in the tag where it defined it's "kind".
 *
 * Note:
 * - this will _never_ be true for a page which is a category page or a kinded definition
 */
export const hasCategoryTag =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const kindTags = Array.from(page.file.tags).filter((t: Tag) =>
				isKindTag(p)(stripLeading(t.split("/")[0], "#")),
			) as string[];
			const withCategory = kindTags
				.filter((t) => t.split("/").length > 1)
				.map((t) => t.split("/")[1]);

			return withCategory.length > 0;
		}

		return false;
	};

/**
 * Boolean operator which reports on whether:
 *
 * 1. the given page has a property `category` and
 * 2. the property value is a `FileLink`
 */
export const hasCategoryProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const catType = getPropertyType(p)(
				page.file.frontmatter["category"],
			);

			return page.category && catType.startsWith("link") ? true : false;
		}

		return false;
	};

/**
 * Boolean flag indicating whether the page has `subcategory` property which
 * is a `FileLink`.
 */
export const hasSubcategoryProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const catType = getPropertyType(p)(
				page.file.frontmatter["subcategory"],
			);

			return page.category && catType.startsWith("link") ? true : false;
		}

		return false;
	};

/**
 * Boolean flag indicating whether the page has `subcategories` property which
 * is an array of `FileLink` references.
 */
export const hasSubcategoriesProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const catType = getPropertyType(p)(
				page.file.frontmatter["subcategory"],
			);

			return page.category && catType.startsWith("link") ? true : false;
		}

		return false;
	};

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
export const hasAnySubcategoryProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean =>
		hasSubcategoriesProp(p)(pg) || hasSubcategoryProp(p)(pg);

/**
 * boolean operation which checks that page has a `categories` property, it is an array, and at least
 * on element in the array is a `FileLink`.
 */
export const hasCategoriesProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			return page.categories &&
				Array.isArray(page.categories) &&
				page.categories.filter(isFileLink).length > 0
				? true
				: false;
		}

		return false;
	};

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
export const hasAnyCategoryProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean =>
		hasCategoriesProp(p)(pg) || hasCategoryProp(p)(pg);

/**
 * tests whether a page is a "category page" which is ascertained by:
 *
 * 1. is there a tag definition for the category (e.g., `#software/category/foo`)
 * 2. is there a property "role" which points to the `kind/category` definition?
 */
export const isCategoryPage =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		return page &&
			page.file.etags.some(
				(i) =>
					i.split("/").length === 3 && i.split("/")[1] === "category",
			)
			? true
			: false;
	};

/**
 * tests whether a page is a "subcategory page" which is ascertained by:
 *
 * 1. is there a tag definition for the subcategory (e.g., `#software/subcategory/foo/bar`)
 * 2. is there a property "role" which points to the `[kind]/subcategory` definition?
 */
export const isSubcategoryPage =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			return page.file.etags.some(
				(i) =>
					i.split("/").length === 4 &&
					i.split("/")[1] === "subcategory",
			)
				? true
				: false;
		}

		return false;
	};

/**
 * boolean operator which reports on whether the page has multiple "kinds" which it is _kinded_ by.
 */
export const hasMultipleKinds =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const tags = page.file.tags;
			const kindTags = tags.filter((t) =>
				isKindTag(p)(stripLeading(t.split("/")[0], "#")),
			);
			return kindTags.length > 1 ? true : false;
		}

		return false;
	};

/**
 * boolean operator which indicates whether the page has a
 * "kind tag" (not a kind definition tag).
 */
export const hasKindTag =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const tags = page.file.etags;
			const kindTags = tags.filter(
				(t) =>
					isKindTag(p)(stripLeading(t.split("/")[0], "#")) ||
					(t.split("/").length === 3 &&
						t.split("/")[1] === "category") ||
					(t.split("/").length === 4 &&
						t.split("/")[1] === "subcategory"),
			);
			return kindTags.length > 0 ? true : false;
		}

		return false;
	};

/**
 * boolean operator which indicates whether the page has a tag starting with `#kind/`.
 */
export const hasKindDefinitionTag =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const tags = page.file.tags.filter((t) => t.startsWith(`#kind/`));

			return tags.length > 0 ? true : false;
		}

		return false;
	};

/**
 * boolean operator which indicates whether the page has a tag starting with `#type/`.
 */
export const hasTypeDefinitionTag =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			const tags = page.file.tags.filter((t) => t.startsWith(`#type/`));

			return tags.length > 0 ? true : false;
		}

		return false;
	};

/**
 * a boolean operator which reports on whether the page has a `kind` property which is a `FileLink` to
 * a page in the vault.
 */
export const hasKindProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		return page && isDefined(page.kind) && isFileLink(page.kind)
			? true
			: false;
	};

/**
 * a boolean operator which reports on whether the page has a `kinds` property which is an array with at least
 * one `FileLink` in it.
 */
export const hasKindsProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			return (
				isDefined(page.kinds) &&
				isArray(page.kinds) &&
				page.kinds.some((p) => isFileLink(p))
			);
		}
		return false;
	};

export const hasAnyKindProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean =>
		hasKindProp(p)(pg) || hasKindsProp(p)(pg);

/**
 * a boolean operator which reports on whether the page has a `type` property which is a `FileLink` to
 * a page in the vault.
 */
export const hasTypeProp =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		const page = getPage(p)(pg);

		if (page) {
			return isDefined(page.type) && isFileLink(page.type);
		}
		return false;
	};

/**
 * a boolean operator which reports on whether the page has a `type` tag indicating that
 * the page is a Type definition page.
 */
export const hasTypeTag =
	(p: KindModelPlugin) =>
	(pg: PageReference | undefined): boolean => {
		const page = getPage(p)(pg);
		if (page) {
			const found = page.file.etags.find((i) => i.startsWith("type/"));
			return found ? true : false;
		}
		return false;
	};

export const isCategoryDefnTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(tag, "#");
		const parts = safeTag.split("/");
		return parts.length === 3 && parts[1] === "category" ? true : false;
	};

export const isSubcategoryDefnTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(tag, "#");
		const parts = safeTag.split("/");
		return parts.length === 4 && parts[1] === "subcategory" ? true : false;
	};

export const isKindedWithCategoryTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(tag, "#");
		const parts = safeTag.split("/");
		return parts.length === 2 && isKindTag(p)(parts[0]);
	};

export const isKindedWithSubcategoryTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(tag, "#");
		const parts = safeTag.split("/");
		return parts.length === 3 &&
			!["category", "subcategory"].includes(parts[1]) &&
			isKindTag(p)(parts[0])
			? true
			: false;
	};

export const isTypeDefnTag =
	(p: KindModelPlugin) =>
	(tag: string): boolean => {
		const safeTag = stripLeading(tag, "#");
		return safeTag.startsWith("type/");
	};

export const decomposeTag =
	(p: KindModelPlugin) =>
	(tag: string): DecomposedTag => {
		const safeTag = stripLeading(tag, "#");
		const parts = safeTag.split("/");
		if (!isKindTag(p)(parts[0])) {
			return {
				type: "unknown",
				tag,
				safeTag,
			};
		}

		const partial: Partial<DecomposedTag> = {
			tag,
			safeTag,
			kindTag: parts[0],
			kindDefnTag: `kind/${parts[0]}`,
		};

		if (isCategoryDefnTag(p)(safeTag)) {
			return {
				type: "category",
				...partial,
				categoryTag: parts[2],
				categoryDefnTag: safeTag,
				isCategoryDefn: true,
				isSubcategoryDefn: false,
				isKindDefn: false,
			} as DecomposedCategoryTag;
		} else if (isKindedWithCategoryTag(p)(safeTag)) {
			return {
				type: "category",
				...partial,
				categoryTag: parts[1],
				categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
				isCategoryDefn: false,
				isSubcategoryDefn: false,
				isKindDefn: false,
			} as DecomposedCategoryTag;
		} else if (isKindedWithSubcategoryTag(p)(safeTag)) {
			return {
				type: "subcategory",
				...partial,
				categoryTag: parts[1],
				categoryDefnTag: `${parts[0]}/category/${parts[1]}`,
				subcategoryTag: parts[2],
				subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}`,
				isCategoryDefn: false,
				isSubcategoryDefn: false,
				isKindDefn: false,
			} as DecomposedSubcategoryTag;
		} else if (isSubcategoryDefnTag(p)(safeTag)) {
			return {
				type: "subcategory",
				...partial,
				categoryTag: parts[2],
				categoryDefnTag: `${parts[0]}/category/${parts[2]}`,
				subcategoryTag: parts[3],
				subcategoryDefnTag: `${parts[0]}/subcategory/${parts[2]}/${parts[3]}`,
				isCategoryDefn: false,
				isSubcategoryDefn: true,
				isKindDefn: false,
			} as DecomposedSubcategoryTag;
		} else if (isTypeDefnPage(p)(safeTag)) {
			return {
				type: "type",
				typeDefnTag: `type/${parts[1]}`,
				typeTag: parts[1],
				tag,
				safeTag,
				isCategoryDefn: false,
				isSubcategoryDefn: false,
				isKindDefn: false,
			};
		}

		return {
			type: "kind",
			...partial,
			isCategoryDefn: false,
			isSubcategoryDefn: false,
			isKindDefn: safeTag.includes("kind/"),
		} as DecomposedKindTag;
	};
/**
 * higher order function which after passed the plugin, will take a
 * _page reference_ or an object representing a frontmatter key/value
 * object.
 *
 * This function utility is to ensure regardless of the input type that
 * a valid Frontmatter type is returned.
 */
export const getFrontmatter =
	(p: KindModelPlugin) =>
	(from: PageReference | Frontmatter): Frontmatter => {
		if (isDvPage(from)) {
			return from.file.frontmatter;
		}

		if (isPageInfo(from)) {
			return from.fm;
		}

		if (isFrontmatter(from)) {
			return from;
		}

		const page = getPage(p)(from);

		if (page) {
			return page.file.frontmatter;
		} else {
			p.debug(
				`call to getFrontmatter() was unable to load a valid page so returned an empty object.`,
				{ from },
			);
			return {} as Frontmatter;
		}
	};

const catTag = (kind: string, cat: string) => {
	return `${ensureLeading(kind, "#")}/${cat}`;
};

/**
 * gets all "categories" associated with page:
 *
 * - takes from `category` and `categories` props
 * - spans _all_ kinds which were defined
 */
export const getCategories =
	(p: KindModelPlugin) =>
	(pg: PageReference): PageCategory[] => {
		const page = getPage(p)(pg);
		const categories: PageCategory[] = [];

		if (page) {
			const kindedCat = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 3 &&
						t.split("/")[1] === "category",
				)
				.map((i) => catTag(i.split("/")[0], i.split("/")[2]));
			const kindedSubcat = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 4 &&
						t.split("/")[1] === "subcategory",
				)
				.map((i) => catTag(i.split("/")[0], i.split("/")[2]));
			const kinded = page.file.etags
				.filter(
					(t) =>
						t.split("/").length > 1 &&
						!["category", "subcategory"].includes(
							t.split("/")[1],
						) &&
						isKindTag(p)(t.split("/")[0]),
				)
				.map((i) => catTag(i.split("/")[0], i.split("/")[1]));

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
					} else {
						missing.push(`${t} on page "${page.file.path}"`);
						return undefined;
					}
				})
				.filter((i) => i) as [string, DvPage][];

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

const subCatTag = (kind: string, cat: string, sub: string) => {
	return `${ensureLeading(kind, "#")}/${cat}/${sub}`;
};

/**
 * gets all subcategories on a page whether defined via tag or prop
 */
export const getSubcategories =
	(p: KindModelPlugin) =>
	(pg: PageReference): PageSubcategory[] => {
		const page = getPage(p)(pg);
		if (page) {
			const kindedSubcat = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 4 &&
						t.split("/")[1] === "subcategory",
				)
				.map((i) =>
					subCatTag(
						i.split("/")[0],
						i.split("/")[2],
						i.split("/")[3],
					),
				);
			const kinded = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 3 &&
						!["category", "subcategory"].includes(
							t.split("/")[1],
						) &&
						isKindTag(p)(t.split("/")[0]),
				)
				.map((i) =>
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
					} else {
						missing.push(`${t} on page "${page.file.path}"`);
						return undefined;
					}
				})
				.filter((i) => i) as [string, DvPage][];

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

export const getPageIcons =
	(p: KindModelPlugin) =>
	(pg: PageReference): PageIcons => {
		return {
			hasIcon: false,
		};
	};

export const getPageBanners =
	(p: KindModelPlugin) =>
	(pg: PageReference): PageBanners => {
		return {
			hasBanner: false,
		};
	};

export const getSuggestedActions =
	(p: KindModelPlugin) =>
	(pg: PageReference): PageSuggestion[] => {
		return [];
	};

/**
 * looks at the passed in page's "kind" property as well as the tag reference if available to and returns the _kinds_
 * this page is identified as.
 */
export const getKindDefinitions =
	(p: KindModelPlugin) =>
	(pg: PageReference | undefined): DvPage[] => {
		const page = getPage(p)(pg);
		if (page) {
			if (page.kind && isFileLink(page.kind)) {
				return [getPage(p)(page.kind.path)] as DvPage[];
			} else if (
				page.kinds &&
				Array.isArray(page.kinds) &&
				page.kinds.some((i) => isFileLink(i))
			) {
				return page.kinds
					.filter((i) => isFileLink(i))
					.map((i) => getPage(p)(i.path))
					.filter((i) => i) as DvPage[];
			}
			const tags = getKindTagsOfPage(p)(page);
		}

		return [];
	};

/**
 * A page is a kinded page if:
 *
 * 1. it has a `kind` property pointing to another page in the vault
 * 2. it has a tag which is known to be for a kind definition
 *
 * Note: we don't require that the `kind` property point to a Kind Definition but
 * this will show up on calling `kindErrors`
 */
export const isKindedPage =
	(p: KindModelPlugin) =>
	(pg: PageReference): boolean => {
		// get DvPage (from cache or into)
		const page = getPage(p)(pg);

		if (page) {
			return hasKindProp(p)(page) && !hasKindDefinitionTag(p)(page)
				? true
				: hasKindTag(p)(page)
					? true
					: false;
		}

		return false;
	};

export const isKindDefnPage =
	(p: KindModelPlugin) =>
	(ref: PageReference): boolean => {
		const page = getPage(p)(ref);

		return page && page.file.etags.some((i) => i.startsWith("#kind/"))
			? true
			: false;
	};

export const isTypeDefnPage = (p: KindModelPlugin) => (ref: PageReference) => {
	const page = getPage(p)(ref);

	return page && page.file.etags.some((i) => i.startsWith("#type/"))
		? true
		: false;
};

/**
 * For a given page, it will return the "kind tags" of that page.
 *
 * For instance:
 *
 * - a page with the tag `#software/category/ai` would return `["software"]`.
 * - a page with the tag `#kind/software` would also return `["software"]`
 */
export const getKindTagsOfPage =
	(p: KindModelPlugin) =>
	(pg: PageReference | undefined): string[] => {
		const page = getPage(p)(pg);
		if (page) {
			const kindedCat = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 3 &&
						t.split("/")[1] === "category",
				)
				.map((i) => i.split("/")[0]);
			const kindedSubcat = page.file.etags
				.filter(
					(t) =>
						t.split("/").length === 4 &&
						t.split("/")[1] === "subcategory",
				)
				.map((i) => i.split("/")[0]);
			const kinded = page.file.etags
				.filter(
					(t) =>
						isKindTag(p)(t.split("/")[0]) &&
						!["category", "subcategory"].includes(t.split("/")[1]),
				)
				.map((i) => i.split("/")[0]);
			const kindDefn = page.file.etags
				.filter((t) => t.startsWith("#kind/"))
				.map((i) => i.split("/")[1]);

			const tags = new Set<string>([
				...kinded,
				...kindedCat,
				...kindedSubcat,
				...kindDefn,
			]);

			return Array.from<string>(tags).map((i) => stripLeading(i, "#"));
		}
		return [];
	};

/**
 * get's a `DvPage` object for every kind definition that this page
 * is a part of.
 */
export const getKindPages =
	(p: KindModelPlugin) =>
	(pg: PageReference | undefined): DvPage[] => {
		const page = getPage(p)(pg);
		if (page) {
			const pages = getKindTagsOfPage(p)(page)
				.map((i) => lookupKindByTag(p)(i))
				.map((i) => (i ? getPage(p)(i.path) : undefined))
				.filter((i) => i) as DvPage[];

			return pages;
		}

		return [];
	};

/**
 * Gets the metadata from a page reference categorized by type of content.
 */
export const getMetadata =
	(p: KindModelPlugin) =>
	(
		pg: PageReference | undefined | Frontmatter,
	): Record<Partial<PropertyType>, string[]> => {
		const fm = pg ? getFrontmatter(p)(pg) : undefined;
		const kv: Dictionary = {};

		if (fm) {
			let meta: Dictionary<string, any> = {};

			for (const key of Object.keys(fm)) {
				const type = getPropertyType(p)(fm[key]);
				if (type && !type.startsWith("other")) {
					meta[type] = meta[type] ? [...meta[type], key] : [key];
					kv[key] = [fm[key], type];
				} else {
					meta["other"] = meta.other ? [...meta.other, key] : [key];
					kv[key] = [fm[key], type];
				}
			}

			meta.hasLinks = () => {
				return (
					Object.keys(meta).includes("link") ||
					Object.keys(meta).includes("link_image") ||
					Object.keys(meta).includes("link_md") ||
					Object.keys(meta).includes("link_drawing") ||
					Object.keys(meta).includes("link_vector") ||
					Object.keys(meta).includes("link_unknown")
				);
			};
			meta.hasUrls = () => {
				return (
					Object.keys(meta).includes("url") ||
					Object.keys(meta).includes("url_social") ||
					Object.keys(meta).includes("url_book") ||
					Object.keys(meta).includes("url_retail") ||
					Object.keys(meta).includes("url_profile") ||
					Object.keys(meta).includes("url_repo") ||
					Object.keys(meta).includes("url_news") ||
					Object.keys(meta).includes("url_youtube")
				);
			};
			/**
			 * gets the first date found in the given properites;
			 * always returns a date (no time) but can source from
			 * both a date and datetime property
			 */
			meta.getFirstDateFrom = (
				...props: string[]
			): Iso8601Date<"explicit"> | undefined => {
				const sources = [
					...(meta["date"] || []),
					...(meta["list_date"] || []),
					...(meta["datetime"] || []),
					...(meta["list_datetime"] || []),
				] as (string | string[])[];
				const targets = props.filter((i) => sources.includes(i));
				let found: Iso8601Date<"explicit"> | undefined = undefined;
				let idx = 0;

				while (idx <= targets.length || isIsoExplicitDate(found)) {
					const prop = targets[idx];
					if (isStringArray(prop)) {
						// property is an array of elements, take first
						const candidate = prop.find(
							(i) => isIsoDate(i) || isIsoDateTime(i),
						) as Iso8601Date | Iso8601DateTime | undefined;
						if (candidate) {
							found = asExplicitIso8601Date(candidate);
						}
					}

					idx++;
				}

				return found;
			};
			meta.hasGeoInfo = () => {
				return (
					Object.keys(meta).includes("geo") ||
					Object.keys(meta).includes("geo_country") ||
					Object.keys(meta).includes("geo_zip") ||
					Object.keys(meta).includes("geo_state") ||
					Object.keys(meta).includes("geo_city")
				);
			};
			meta.getYouTubeVideoLinks = () => {
				if (
					!(
						Object.keys(meta).includes("url_youtube") ||
						Object.keys(meta).includes("list_url_youtube")
					)
				) {
					return [];
				}

				const unitLinks = (meta["url_youtube"] || []).map(
					(i: string & keyof typeof meta) => meta[i],
				);
				const listLinks = (meta["list_url_youtube"] || []).flatMap(
					(i: string & keyof typeof meta) => meta[i],
				);

				const links = [...unitLinks, ...listLinks].filter((i) =>
					isYouTubeVideoUrl(i),
				);

				return links as string[];
			};

			return meta as Record<Partial<PropertyType>, string[]> &
				PageMetadata;
		} else {
			p.debug(`no metadata found on page ${pg ? pg : "unknown"}`);
		}

		return {} as Record<Partial<PropertyType>, string[]>;
	};

export const getClassification =
	(p: KindModelPlugin) =>
	(
		pg: PageReference | undefined,
		cats?: PageCategory[] | undefined,
		subCats?: PageSubcategory[] | undefined,
	): Classification[] => {
		const page = pg ? getPage(p)(pg) : undefined;
		const classification: Classification[] = [];

		if (page) {
			const pgCats = cats ? cats : getCategories(p)(page);
			const pgSubCats = subCats ? subCats : getSubcategories(p)(page);

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
							(c) => c.kind === stripLeading(tag, "#"),
						),
						subcategory: pgSubCats.find(
							(c) => c.kind === stripLeading(tag, "#"),
						),
					});
				} else {
					const defn = p.dv.pages(`#kind/${tag}`);
					if (defn.length > 0) {
						p.debug(
							`tag lookup of ${tag} failed but found kind definition with dataview query`,
						);
						const kindPage = Array.from(defn)[0] as DvPage;
						if (
							kindPage &&
							kindPage.file.etags.some((i) =>
								i.startsWith("#kind/"),
							)
						) {
							classification.push({
								kind: kindPage,
								kindTag: tag,
								categories: pgCats.filter(
									(c) => c.kind === stripLeading(tag, "#"),
								),
								subcategory: pgSubCats.find(
									(c) => c.kind === stripLeading(tag, "#"),
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

/**
 * API surface with build block functions
 */
export const buildingBlocks = (plugin: KindModelPlugin): BuildingBlocksApi => ({
	isKeyOf: isKeyOf,

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

	getMetadata: getMetadata(plugin),

	getKindTagsOfPage: getKindTagsOfPage(plugin),
	isKindTag: isKindTag(plugin),
});
