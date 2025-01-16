import type { CssDefinition, SimpleToken, SimpleType } from "inferred-types";
import {
	cssFromDefinition,
	doesExtend,
	ensureLeading,
	isEmpty,
	isNumber,
	isString,
	isToday,
	isTomorrow,
	isUndefined,
	isYesterday,
	stripTrailing,
} from "inferred-types";
import { DateTime } from "luxon";
import {
	getCategories,
	getClassification,
	getPageType,
	getSubcategories,
	getTypeTag,
	isKindTag,
} from "~/api";
import { asDisplayTag } from "~/helpers";
import type KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { getKindPageByTag } from "~/page/getPageKinds";
import {
	hasFileLink,
	isDvPage,
	isFileLink,
	isFuturePage,
	isLink,
	isPageInfo,
	isPageReference,
	isValidPath,
} from "~/type-guards";
import type { DvPage, FileLink, KindClassifiedCategory, PageInfo, PageReference, PageType, ShowApi } from "~/types";
import { createVaultLink } from "./createVaultLink";
import type { FormattingApi } from "./formattingApi";
import { formattingApi } from "./formattingApi";
import { getPath } from "./getPath";
import { isKeyOf } from "./renderApi";

const DEFAULT_LINK = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#a3a3a3" d="M134.71 189.19a4 4 0 0 1 0 5.66l-9.94 9.94a52 52 0 0 1-73.56-73.56l24.12-24.12a52 52 0 0 1 71.32-2.1a4 4 0 1 1-5.32 6A44 44 0 0 0 81 112.77l-24.13 24.12a44 44 0 0 0 62.24 62.24l9.94-9.94a4 4 0 0 1 5.66 0Zm70.08-138a52.07 52.07 0 0 0-73.56 0l-9.94 9.94a4 4 0 1 0 5.71 5.68l9.94-9.94a44 44 0 0 1 62.24 62.24L175 143.23a44 44 0 0 1-60.33 1.77a4 4 0 1 0-5.32 6a52 52 0 0 0 71.32-2.1l24.12-24.12a52.07 52.07 0 0 0 0-73.57Z"/></svg>`;

export function showCreatedDate(p: KindModelPlugin) {
  return (pg: PageReference | undefined, format?: string) => {
    const page = getPage(p)(pg);
    if (page) {
      return format ? page.file.cday.toFormat(format) : page.file.cday;
    }
    return "";
  };
}

export function showModifiedDate(p: KindModelPlugin) {
  return (pg: PageReference, format?: string) => {
    const page = getPage(p)(pg);
    if (page) {
      return format ? page.file.mday.toFormat(format) : page.file.mday;
    }

    return "";
  };
}

export function showDueDate(p: KindModelPlugin) {
  return (
    page: PageReference | undefined,
    prop: string = "due",
    format?: string,
  ) => {
    const pg = getPage(p)(page);
    if (pg && pg[prop] !== undefined) {
      return typeof pg[prop] === "number"
        ? format
          ? DateTime.fromMillis(pg[prop]).toFormat(format)
          : DateTime.fromMillis(pg[prop])
        : typeof pg[prop] === "object" && pg[prop] instanceof DateTime
          ? format
            ? pg[prop].toFormat(format)
            : pg[prop]
          : typeof pg[prop] === "string" && DateTime.fromISO(pg[prop])
            ? format
              ? DateTime.fromISO(pg[prop]).toFormat(format)
              : DateTime.fromISO(pg[prop])
            : "";
    }
    else {
      return "";
    }
  };
}

/**
 * **show_desc**`()`
 *
 * Looks for a description in all common _description_
 * properties
 */
export function showDesc(p: KindModelPlugin) {
  return (pg: PageReference) => {
    const page = getPage(p)(pg);
    if (page) {
      const desc = showProp(p)(page, "about", "desc", "description");
      if (isString(desc) && !isEmpty(desc)) {
        return `<span style="font-weight:200; font-size: 14px">${desc}</span>`;
      }
      else {
        return "";
      }
    }

    return "";
  };
}

/**
 * **when**
 *
 * A smart date field which tries to express the most
 * relevant date info for a page.
 */
export function showWhen(p: KindModelPlugin) {
  return (pg: PageReference | undefined, format: string = "LLL yyyy") => {
    const page = getPage(p)(pg);

    if (page) {
      const created = page.file.cday;
      const modified = page.file.mday;
      const deltaCreated = Math.abs(created.diffNow("days").days);
      const deltaModified = Math.abs(modified.diffNow("days").days);

      // TODO: add in linking to day page if present
      if (deltaCreated < 14) {
        const desc = created.toRelative();
        return `<span style="cursor: default"><i style="font-weight: 150">created</i> ${desc}</span>`;
      }
      else if (deltaModified < 14) {
        const desc = modified.toRelative();
        return `<span style="cursor: default"><i style="font-weight: 150">modified</i> ${desc}</span>`;
      }
      else {
        return `<span style="cursor: default">${modified.toFormat(format)}</span>`;
      }
    }
    else {
      return "";
    }

    return "";
  };
}

export function showTags(_p: KindModelPlugin) {
  return (pg: DvPage, ...exclude: string[]) => {
    return (
      pg.file.etags
        .filter(t => !exclude.some(i => !!t.startsWith(i)))
        .map(t => `\`${t}\``)
        .join(", ") || ""
    );
  };
}

/**
 * **getInternalLinks**`(p) => (pg, ...props)`
 *
 * Gets any links to pages in the vault found across the various properties
 * passed in.
 */
export function getInternalLinks(p: KindModelPlugin) {
  return (pg: PageReference | undefined, ...props: string[]) => {
    let links: FileLink[] = [];
    const page = getPage(p)(pg);

    if (page) {
      for (const prop of props) {
        const pgProp = page[prop];
        if (!pgProp) {
          break;
        }
        if (hasFileLink(pgProp)) {
          links = [...links, ...pgProp.filter(i => isFileLink(i))];
        }
        else if (isFileLink(pgProp)) {
          links.push(pgProp);
        }
      }
    }

    return links;
  };
}

export function showLinks(p: KindModelPlugin) {
  return (pg: PageReference | undefined) => {
    const page = getPage(p)(pg);
    if (page) {
      const [_, pageIcon] = getProp(p)(
        pg,
        "icon",
        "svg_icon",
        "_icon",
        "_svg_icon",
      );
      const link_props = {
        website: "website",
        wikipedia: "wikipedia",
        company: "company",
        retailer: "company",
        docs: "documentation",
        retail_urls: "retail",
        retail: "retail",
        url: "link",
        repo: "repo",
        review: "review",
        reviews: "review",
        blog: "blog",
        api: "api",
        map: "map",
        place: "pin",
        home: "home",
        office: "office",
        offices: "office",
        work: "office",
        employer: "office",
        playground: "playground",
        demo: "playground",
        support: "support",
        help: "support",
      } as Record<string, string>;

      const create_lnk = (
        icon: string,
        /** the URL to the external site */
        url: string,
        /** the property in metadata which this URL was found in */
        prop: string,
      ) => {
        icon
					= prop === "website" && isString(pageIcon)
            ? pageIcon
            : /youtube.com/.test(url)
              ? "you_tube"
              : icon;
        p.debug(prop, pageIcon);
        return `<a href="${url}" data-href="${url}" alt="${prop}" style="display: flex; align-items: baseline; padding-right: 2px" data-tooltip-position="top"><span class="link-icon" style="display: flex;width: auto; max-width: 24px; max-height: 24px; height: 24px">${icon}</span></a>`;
      };
      const links: [prop: string, link: string][] = [];

      for (const prop of Object.keys(pg || {})) {
        if (prop in page && isString(page[prop])) {
          // check if property is a HTTP link or an array of them
          if (Array.isArray(page[prop])) {
            page[prop].forEach((p: unknown) => {
              if (isString(p) && p.startsWith("http")) {
                links.push([prop, p]);
              }
            });
          }
          else if (
            isString(page[prop])
            && !prop.startsWith("_")
            && page[prop].startsWith("http")
          ) {
            links.push([prop, page[prop]]);
          }
        }
      }

      const icons = p.api.linkIcons;

      const prettify = (tuple: [prop: string, url: string]) => {
        const [prop, url] = tuple;
        if (prop in link_props) {
          if (link_props[prop] in icons) {
            return create_lnk(icons[link_props[prop]], url, prop);
          }
          else {
            return create_lnk(DEFAULT_LINK, url, prop);
          }
        }
        else {
          return create_lnk(DEFAULT_LINK, url, prop);
        }
      };

      return links.length > 0
        ? `<span style='display: flex; flex-direction: row;'>${links.map(prettify).join(" ")}</span>`
        : "";
    }

    return "";
  };
}

/**
 * - higher order display prop which receives the plugin and then a page with a set of props
 * - the output is displayed in the column based on the _type_ of content found
 */
export function showProp(p: KindModelPlugin) {
  return <
    T extends [string, ...string[]],
  >(pg: PageReference | undefined,
    ...props: T
  ): string => {
    const page = getPage(p)(pg);

    if (page) {
      if (!page?.file?.name) {
        throw new Error(
          `Attempt to call showProp(page, ${props.join(", ")}) with an invalid page passed in!`,
        );
      }
      const found = props.find(
        prop => isKeyOf(page, prop) && page[prop] !== undefined,
      ) as string | undefined;

      if (!found) {
        return "";
      }
      if (isKeyOf(page, found)) {
        const value = page[found];
        try {
          return isString(value) || isNumber(value)
            ? String(value)
            : isPageReference(value)
              ? createVaultLink(p)(value)
              : "";
        }
        catch (e) {
          p.error(
            `Ran into problem displaying the "${found}" property on the page "${page.file.path}" passed in while calling show_prop().`,
            e,
          );

          return "";
        }
      }
    }

    return "";
  };
}

/**
 * Get's a property value from a `PageReference`.
 *
 * - you can pass in as many property names as you like and
 * the first one which is _not_ undefined will be returned.
 * - returns a tuple: `[value, prop]` where "prop" is the
 * property where the value was found.
 *
 * Note: if the property value is a `PageReference` itself it
 * will ensure it's upgraded to a `DvPage`
 */
export function getProp(p: KindModelPlugin) {
  return <TProps extends readonly [string, ...string[]]>(
    pg: PageReference | undefined,
    ...props: TProps
  ): [unknown | undefined, string | undefined ] => {
    const page = getPage(p)(pg);

    if (page) {
      const found = props.find(
        prop => isKeyOf(page, prop) && page[prop] !== undefined,
      ) as string | undefined;
      if (!found) {
        return [undefined, undefined];
      }
      else {
        const value = page[found];

        return [
          isLink(value)
            ? p.api.getPage(value)
            : Array.isArray(value)
              ? value.map(i => (isLink(i) ? p.dv.page(i) : i))
              : value,
			found
        ];
      }
    }

    p.error(`Call to getProp(pg) passed in an invalid DvPage`, {
      pg,
      props,
    });
    return [undefined, undefined];
  };
}

export function getPropOfType(p: KindModelPlugin) {
	return <
		TProps extends readonly [string, ...string[]],
		TType extends SimpleToken
	>(
	  pg: PageReference | undefined,
	  findType: TType,
	  ...props: TProps
	): [SimpleType<TType> | undefined, string | undefined ] => {
	  const page = getPage(p)(pg);
  
	  if (page) {
		const found = props.find(
		  prop => isKeyOf(page, prop) && doesExtend(findType)(page[prop]) ,
		) as string | undefined;
		if (!found) {
		  return [undefined, undefined];
		}
		else {
		  const value = page[found] as SimpleType<TType>;
  
		  return [
				value,
			  found
		  ];
		}
	  }
  
	  p.error(`Call to getProp(pg) passed in an invalid DvPage`, {
		pg,
		props,
	  });
	  return [undefined, undefined];
	};
  }

export function showAbout(_p: KindModelPlugin) {
  return (_pg: PageReference): FileLink[] => {
    return [] as FileLink[];
  };
}

export function showPeers(_p: KindModelPlugin) {
  return (_pg: PageReference): string => {
    return "";
  };
}
/**
 * **getKind**
 *
 * returns `{kind: DvPage; kindTag: string}` if found, otherwise undefined
 */
export function getKind(p: KindModelPlugin) {
  return (
    pg: PageReference | undefined,
  ): undefined | { kind: DvPage; kindTag: string } => {
    const page = getPage(p)(pg);
    if (page) {
      const [_, kind] = getProp(p)(page, "kind");
      if (isDvPage(kind)) {
        const kindTag = page.file.etags.find(
          i =>
            isKindTag(p)(i.split("/")[0])
            && getKindPageByTag(p)(i.split("/")[0])?.path === page.file.path,
        );

        p.info("getKind", { kind, kindTag: kindTag || "unknown" });

        return { kind, kindTag: kindTag || "unknown" };
      }
      else {
        const kindTag = page.file.etags.find(i =>
          isKindTag(p)(i.split("/")[0]),
        );
        if (kindTag) {
          const kindPath = getKindPageByTag(p)(kindTag)
            ?.path as unknown as string;
          const kind = getPage(p)(kindPath) as DvPage;

          p.info("getKind", { kind, kindTag: kindTag || "unknown" });
          return { kind, kindTag };
        }
      }
    }
    return undefined;
  };
}

export function showKind(p: KindModelPlugin) {
  return (
    pg: PageReference,
    /** show the tag name next to the link */
    withTag?: boolean,
  ): string => {
    const page = p.api.getPage(pg);
    const links: string[] = [];
    withTag = isUndefined(withTag) ? true : withTag;

    if (page) {
      const classy = getClassification(p)(page);

      for (const k of classy) {
        const fmt = p.api.format;

        links.push(
          withTag
            ? `${links}${createMarkdownLink(p)(k.kind, { post: fmt.as_tag(k.kindTag) })}`
            : `${links}${createMarkdownLink(p)(k.kind)}`,
        );
      }
    }

    return links.join(", ");
  };
}

interface InternalLinkOpt {
  css?: CssDefinition;
  hoverCss?: CssDefinition;
  klass?: string | string[];
}

/**
 * Creates a link to another page in the vault and ensures
 * that the expected Obsidian classes are included.
 */
function internalLink(
  name: string,
  path: string,
  display: string,
  opt: InternalLinkOpt = {},
) {
  return isEmpty(display)
    ? ""
    : [
        // we need a wrapper because Obsidian may overwrite the "style" prop
        // placed on the `<a>` node
        `<span class="link-wrapper" style="${cssFromDefinition(opt.css || {}, "", true)}">`,
        `<a data-href="${name}" href="${path}" `,
        `class="internal-link data-link-icon data-link-icon-after data-link-text" `,
        `target="_blank" rel="noopener">`,
        display,
        `</a>`,
        `<\span>`,
      ].join("");
}

export interface HtmlLinkOpt {
  /**
   * change the display text of the link to whatever you like
   * rather than just the name of the page
   */
  display?: string;
  /**
   * Add any text/html that you want _before_ the link
   */
  pre?: string;
  /**
   * Add any text/html that you want _after_ the link
   */
  post?: string;

  asCodeBlock?: boolean;

  createPageWhereMissing?: boolean;

  /** define any additional CSS you want to be placed on the link */
  css?: CssDefinition;
}

/**
 * Allows you to configure aspects of an `htmlLink` as a template which
 * can then be reused on multiple places.
 */
export function linkTemplate(p: KindModelPlugin) {
  return (opt: HtmlLinkOpt) => {
    return (
      ref: PageReference | undefined,
      override?: HtmlLinkOpt,
    ) => htmlLink(p)(ref, { ...opt, ...(override || {}) });
  };
}

/**
 * Creates a link to another page in the vault using HTML.
 * 
 * - allows pre and post text
 * - leverages `internalLink()`
 * - can also create a "future link"
 */
export function htmlLink(p: KindModelPlugin) {
  return (
    ref: PageReference | undefined,
    opt?: HtmlLinkOpt,
  ): string => {
    const page = getPage(p)(ref);

    const block = (show: string) => opt?.asCodeBlock
      ? `<code>${show}</code>`
      : show;

    if (page) {
      const name = page.file.name;
      const path = stripTrailing(page.file.path, ".md");
      const display = opt?.display || page.file.name || page.file.path;

      return `<span>${opt?.pre || ""}${internalLink(name, path, block(display))}${opt?.post || ""}</span>`;
    }
    else {
      if (isFuturePage(ref)) {
        const display = opt?.display || ref.file.name;


        return internalLink(ref.file.name, ref.file.name, block(display));
      }
      else {
        console.log(`invalid: ${ref}`);
      }
    }

    if (opt?.createPageWhereMissing && isValidPath(ref)) {
      const parts = ref.split("/");
      const display = opt.display || parts.pop() || "";

      return internalLink(
        stripTrailing(ref, ".md"),
        ref,
        isToday(display) 
          ? "today"
          : isYesterday(display)
            ? "yesterday"
            : isTomorrow(display)
              ? "tomorrow"
              : display,
      );
    }

    return isValidPath(ref)
      ? `<!-- no link [${String(ref)}] -->`
      : `<!-- no link [invalid path: ${String(ref)}] -->`;
  };
}

export function showCategories(p: KindModelPlugin) {
  return (pg: PageReference, opt?: CategoryOptions): string => {
    const page = p.api.getPage(pg);
    const links: string[] = [];
    // const withTag = isUndefined(opt?.withTag) ? true : opt.withTag;
    const currentPage = opt?.currentPage ? getPage(p)(opt.currentPage) : {};

    if (page) {
      const cats = getCategories(p)(page);
      // const isMultiKind =
      // 	new Set<string>(cats.map((i) => i.kind)).size > 1;

      for (const cat of cats) {
        links.push(
          getPath(page) === getPath(currentPage)
            ? "(this)"
            : htmlLink(p)(page, { display: cat.category }),
        );
      }
    }

    return links.join(", ");
  };
}

export interface CategoryOptions {
  currentPage?: PageReference;
  category?: string;
  kind?: string;
  /** display the tag for the subcategory next to the link */
  withTag?: boolean;
}

export function showSubcategories(p: KindModelPlugin) {
  return (pg: PageReference | undefined, _opt?: CategoryOptions): string => {
    const page = p.api.getPage(pg);
    const links: string[] = [];
    // const withTag = isUndefined(opt?.withTag) ? true : opt.withTag;

    if (page) {
      const cats = getSubcategories(p)(page);
      // const isMultiKind =
      // 	new Set<string>(cats.map((i) => i.kind)).size > 1;

      for (const cat of cats) {
        // const fmt = p.api.format;
        // let opt: MarkdownLinkOpt = {
        // 	pre: isMultiKind ? p.api.format.light(cat.kind + "/") : "",
        // };

        links.push(htmlLink(p)(page, { display: cat.subcategory }));
      }
    }

    return links.join(", ");
  };
}

export function showMetrics(_p: KindModelPlugin) {
  return (_pg: PageReference): string => {
    return "";
  };
}

export function showSlider(_p: KindModelPlugin) {
  return (_pg: PageReference): string => {
    return "";
  };
}

interface ShowClassificationOptions {
  /**
   * Show the elements of the classification as
   * the tag name. This is set to `true` by default
   * to conserve space but you can change to `false`
   * to get the page name.
   *
   * @default true
   */
  asTag?: boolean;

  /**
   * When this is set to `true` the full hierarchy is
   * shown for each call regardless if a `source` page
   * was included. Of course, if there is no source page
   * then fully qualified is always shown
   *
   * @default false
   */
  fullyQualified?: boolean;

  /**
   * the _source page_ which is running the page, when this is
   * provided the classification chain starts there rather than
   * being fully qualified.
   */
  source?: DvPage | PageInfo;
}

/**
 * provide a hierarchical view as HTML links of the page's
 * classification(s)
 */
export function showClassifications(p: KindModelPlugin) {
  return (
    pg: PageReference,
    opt?: ShowClassificationOptions | undefined,
  ): string => {
    /** classifications */
    const classifications = isPageInfo(pg)
      ? pg.classifications
      : getClassification(p)(pg);

    /** path to source page */
    const _sourcePath = isDvPage(opt?.source)
      ? opt.source.file.path
      : isPageInfo(opt?.source) ? opt.source.path : "";
    /** page type of source, "none" if no source */
    const _sourceType: PageType = isDvPage(opt?.source)
      ? getPageType(p)(opt.source)
      : isPageInfo(opt?.source)
        ? opt.source.pageType
        : "none";

    const sep = ` <span style="opacity: 0.8"> &gt; </span>`;

    const show = classifications.map((i) => {
      const link = linkTemplate(p)({ css: { "white-space": "nowrap" } });
      const typeTag = isDvPage(i.type)
        ? asDisplayTag(getTypeTag(p)(i.type) as string, true)
        : "";

      const showType = i.type ? `[ ${link(i.type, { display: typeTag })} ] ` : "";

      const showKind = link(
        i.kind,
        {
          display: `${i.kindTag}`,
        },
      );

      const startOfLine = [
        `<div style="display:flex; whitespace: nowrap">`,
        `<div style="whitespace: nowrap">${showType}${showKind}</div>`,
      ];

      const categories = (
        i.categories ? i.categories : i.category ? [i.category] : []
      ) as KindClassifiedCategory[];

      const showCategories = `<div class="categories" style="whitespace: nowrap">${categories.map(
        (c) => {
          const catLink = link(c.page, { display: c.tag });
          const subcategories = c?.subcategories
            ? c.subcategories
            : c?.subcategory
              ? [c.subcategory]
              : [];

          const subTag = subcategories.length > 0
            ? subcategories[0].tag
            : "";

          return isPageReference(c.page)
            ? subcategories.length > 1
              ? `${sep}${catLink}${sep}[...]`
              : subcategories.length === 1
                ? `${sep}${catLink}${sep}${link(subcategories[0].page, { display: subTag })}`
                : `${sep}${catLink}`
            : undefined;
        },
      ).filter(i => i).join(`\n`)}</div>`;

      return [
        ...startOfLine,
        showCategories,
        "</div>",
      ].join("\n");
    }).join("\n");

    p.debug("show classification", show);

    return show;
  };
}

/**
 * **createFileLink**`(pathLike,[embed],[display])`
 *
 * A convenience method that can receive multiple inputs and
 * convert them into a `FileLink`.
 *
 * Note: the `FileLink` is nicely converted to the appropriate output
 * by the `render()` and `renderValue()` methods in Dataview but is
 * not easily combined into a surrounding HTML block.
 */
export function createFileLink(p: KindModelPlugin) {
  return (
    pathLike: PageReference | undefined,
    opt?: {
      display?: string;
      after?: string;
      before?: string;
    },
  ) => {
    const page = getPage(p)(pathLike);

    if (page) {
      //   return createVaultLink(p)(page, opt);
      return htmlLink(p)(page, opt);
    }

    return "";
  };
}

export function createLinksFromTag(p: KindModelPlugin) {
  return <T extends string>(
    tag: T,
    opt?: {
      /** filter the links returned */
      filter?: <P extends DvPage>(page: P) => boolean;
      /** override the output when there is no result */
      noResult?: (cb: FormattingApi) => string;
    },
  ) => {
    if (tag === "") {
      p.warn(`invalid-tag`, `A call to createLinksFromTag() passed an empty string which would result in an invalid search!`);

      return "";
    }

    const t = ensureLeading(tag, "#");
    const pages = Array.from(p.dv.pages(`${t}`).sort(p => p.file.name)) as DvPage[];

    return pages.length > 0
      ? pages.map(i => createVaultLink(p)(i)).join(", ")
      : opt?.noResult
        ? opt.noResult(formattingApi(p))
        : p.api.format.italics("none");
  };
}

export interface MarkdownLinkOpt {
  /**
   * change the display text of the link to whatever you like
   * rather than just the name of the page
   */
  display?: string;
  /**
   * Add any text/html that you want _before_ the link
   */
  pre?: string;
  /**
   * Add any text/html that you want _after_ the link
   */
  post?: string;

  createPageWhereMissing?: boolean;
}

/**
 * Creates a link to another page in the vault using Markdown syntax.
 *
 * - this has similar results as creating a `FileLink` with the `createFileLink` utility
 * function but has some additional benefits as allows for overriding not only the link text
 * but also adding HTML pre and post containers to the output.
 * - **note:** if you use this text output _inside_ an HTML block this will fail to
 * render properly because the markdown-to-html conversion will no longer take place.
 */
export function createMarkdownLink(p: KindModelPlugin) {
  return (
    pathLike: PageReference | undefined,
    opt?: MarkdownLinkOpt,
  ): string => {
    const page = p.api.getPage(pathLike);

    if (page) {
      return opt?.display
        ? `${opt?.pre || ""}[[${page.file.path}|${opt.display}]]${opt?.post || ""}`
        : `${opt?.pre || ""}[[${page.file.path}|${page.file.name}]]${opt?.post || ""}`;
    }

    return "";
  };
}

/**
 * The Show API surface is for presenting a column in a tabular report.
 */
export function showApi(p: KindModelPlugin): ShowApi {
  return {
    /** show the creation date */
    showCreatedDate,
    /** show last modified date */
    showModifiedDate,
    /** show _due_ date */
    showDueDate: showDueDate(p),
    showWhen: showWhen(p),

    showDesc: showDesc(p),

    showTags: showTags(p),
    showLinks: showLinks(p),

    showProp: showProp(p),
    getProp: getProp(p),

    showAbout: showAbout(p),
    showPeers: showPeers(p),
    showKind: showKind(p),
    showCategories: showCategories(p),
    showSubcategories: showSubcategories(p),
    showClassifications: showClassifications(p),
    showMetrics: showMetrics(p),
    showSlider: showSlider(p),

    createFileLink: createFileLink(p),
    createMarkdownLink: createMarkdownLink(p),
    createLinksFromTag: createLinksFromTag(p),
  } as const;
}
