import type KindModelPlugin from "~/main";
import type {
  DvPage,
  Link,
  ObsidianTask,
  ObsidianTaskWithLink,
  PageInfo,
  PageReference,
  PageType,
  Tag,
} from "~/types";
import {
  frontmatterApi,
  getCategories,
  getClassification,
  getKindTagsOfPage,
  getPageType,
  getSubcategories,
  getTypeTag,
  hasProps,
  isProps,
  outlinksExcludingTasks,
  pageMetadataApi,
  splitInlinksFromTaskReferences,
  tasksWithPageLink,
} from "~/api";
import { isPageInfo } from "~/type-guards";
import { getPath } from "../api/getPath";
import { getPage } from "./getPage";
import { getPageKinds } from "./getPageKinds";
import { getTypeForPage } from "./getType";

type Returns<
  T extends PageReference,
  TKindTags extends string[],
  TPageType extends PageType,
  TPagePath extends string | undefined,
> = TPagePath extends string
  ? T extends PageInfo<TKindTags, TPageType, TPagePath>
    ? PageInfo<TKindTags, TPageType, TPagePath>
    : T extends DvPage
      ? PageInfo<TKindTags, TPageType, TPagePath>
      : PageInfo<TKindTags, TPageType, TPagePath> | undefined
  : undefined;

/**
 * Converts any `PageReference` to a `PageInfo` type.
 *
 * This type contains:
 *
 * - a `current` property which is the `DvPage` for the page
 * - constains meta information such as:
 *
 * 		- pageType, typeTag, hasMultipleKinds
 * 		- isKindedPage, isKindDefnPage, ...
 *
 * - has a `classifiications` breakdown
 * - all **Frontmatter** properties around found on `fm` prop
 * - the `metadata` property provides a lookup where the keys
 * are _types_ of information and the keys are the Frontmatter
 * properties of this type.
 * - the `kind` and `kinds` properties indicate the `Kind`
 * of the current page.
 * - the `type` and `types` properties look for a **Type** for
 * the current page based on both current page and inheritance
 * characteristics.
 */
export function getPageInfo(p: KindModelPlugin) {
  return <T extends PageReference>(pg: T) => {
    if (isPageInfo(pg)) {
      return pg as unknown as Returns<T, typeof pg.kindTags, typeof pg.pageType, typeof pg.path>;
    }

    const path = getPath(pg);
    const page = getPage(p)(pg);

    if (path && page) {
      const hasApi = hasProps(p)(page);
      const isApi = isProps(p)(page);
      const typeTag = getTypeTag(p)(page);
      const kindTags = getKindTagsOfPage(p)(page);
      const fmApi = pageMetadataApi(p, page);
      const categories = getCategories(p)(page);
      const subcategories = getSubcategories(p)(page);
      const classifications = getClassification(p)(
        page,
        categories,
        subcategories,
      );
      const kind = getPageKinds(p)(page)[0] as DvPage | undefined;
      const kinds = getPageKinds(p)(page) as DvPage[] | undefined;

      const tasksWithLinks = tasksWithPageLink(p)(
        page,
      ) as ObsidianTaskWithLink[];

      const outlinks = Array.from(page.file.outlinks) as Link[];
      const inlinkRaw = Array.from(page.file.inlinks) as Link[];
      const [inlinkTasks, inlinks] = splitInlinksFromTaskReferences(p)(
        page,
        inlinkRaw,
      );

      const pageType = getPageType(p)(page, isApi, kindTags);
      const hasMultipleKinds = kindTags.length > 1;

			type TKindTags = typeof kindTags;
			type TPageType = typeof pageType;
			type TPagePath = typeof page.file.path;

			const info: Partial<PageInfo<TKindTags, TPageType, TPagePath>> = {
			  __kind: "PageInfo",
			  name: page.file.name,
			  ext: page.file.ext,
			  tags: Array.from(page.file.tags) as Tag[],
			  etags: Array.from(page.file.etags) as Tag[],
			  inlinks,
			  inlinkTasks,
			  outlinks,
			  outlinksExcludingTasks: outlinksExcludingTasks(p)(
			    outlinks,
			    tasksWithLinks
			      .map(t => t.withLinks.map(l => l?.file?.path))
			      .flat(),
			  ),
			  aliases: Array.from(page.file.aliases) as string[],

			  tasks: Array.from(page.file.tasks) as ObsidianTask[],
			  tasksWithLinks,

			  lists: Array.from(page.file.lists) as unknown[],

			  fm: page.file.frontmatter,

			  typeTag,
			  pageType,
			  kindTags,
			  current: page,
			  path,
			  kind,
			  kinds,

			  ...fmApi,

			  categories,
			  subcategories,
			  classifications,

			  ...hasApi,
			  hasMultipleKinds,
			  ...isApi,

			  ...frontmatterApi(p, path),
			  ...pageMetadataApi(p, page),
			};

			if (info.hasMultipleKinds) {
			  info.types = getTypeForPage(p)(page);
			  info.kinds = getPageKinds(p)(page);
			  delete info.kind;
			  delete info.type;
			}
			else {
			  const t = getTypeForPage(p)(page);
			  info.type = t ? t[0] : undefined;
			  info.kind = getPageKinds(p)(page)[0];
			  delete info.kinds;
			  delete info.types;
			}

			return info as unknown as Returns<T, TKindTags, TPageType, TPagePath>;
    }
    else {
      return undefined as unknown as Returns<T, [], PageType, undefined>;
    }
  };
}
