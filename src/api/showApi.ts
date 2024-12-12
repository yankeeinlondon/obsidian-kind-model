import type { OptionalSpace, StripLeading } from "inferred-types";
import type KindModelPlugin from "~/main";
import type { DvPage, FileLink, PageReference, ShowApi } from "~/types";
import {
  isArray,
  isString,
  isToday,
  isTomorrow,
  isUndefined,
  isYesterday,
  stripTrailing,
} from "inferred-types";
import { DateTime } from "luxon";
import { lookupKindByTag } from "~/cache";
import { getPage } from "~/page";
import {
  hasFileLink,
  isDvPage,
  isFileLink,
  isLink,
  isValidPath,
} from "~/type-guards";
import {
  getCategories,
  getClassification,
  getSubcategories,
  isKindTag,
} from "./classificationApi";
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
      if (typeof desc == "string") {
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

      return `<span style='display: flex; flex-direction: row;'>${links.map(prettify).join(" ")}</span>`;
    }

    return "";
  };
}

/**
 * - higher order display prop which receives the plugin and then a page with a set of props
 * - the output is displayed in the column based on the _type_ of content found
 */
export function showProp(p: KindModelPlugin) {
  return (pg: PageReference | undefined, ...props: [string, ...string[]]) => {
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
          return isString(value)
            ? value
            : isLink(value)
              ? value
              : isDvPage(value)
                ? value?.file.link
                : isArray(value)
                  ? value
                      .map(v =>
                        isLink(v) ? v : isDvPage(v) ? v.file.link : "",
                      )
                      .filter(i => i)
                      .join(", ")
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
 *
 * Note: if the property value is a `PageReference` itself it
 * will ensure it's upgraded to a `DvPage`
 */
export function getProp(p: KindModelPlugin) {
  return <TProps extends readonly [string, ...string[]]>(
    pg: PageReference | undefined,
    ...props: TProps
  ) => {
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
          found,
          isLink(value)
            ? p.api.getPage(value)
            : Array.isArray(value)
              ? value.map(i => (isLink(i) ? p.dv.page(i) : i))
              : value,
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
            && lookupKindByTag(p)(i.split("/")[0])?.path === page.file.path,
        );

        p.info("getKind", { kind, kindTag: kindTag || "unknown" });

        return { kind, kindTag: kindTag || "unknown" };
      }
      else {
        const kindTag = page.file.etags.find(i =>
          isKindTag(p)(i.split("/")[0]),
        );
        if (kindTag) {
          const kindPath = lookupKindByTag(p)(kindTag)
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

// <a data-tooltip-position="top" aria-label="Aggregation Switch" data-href="Aggregation Switch" href="Aggregation Switch" class="internal-link data-link-icon data-link-icon-after data-link-text" target="_blank" rel="noopener nofollow" data-link-tags="#hardware/network/switch" data-link-path="hardware/networking/Aggregation Switch.md" style="--data-link-tags: #hardware/network/switch; --data-link-path: hardware/networking/Aggregation Switch.md;">Aggregation Switch</a>

function link(name: string, path: string, display: string) {
  return [
    `<a data-href="${name}" href="${path}" `,
    `class="internal-link data-link-icon data-link-icon-after data-link-text" `,
    `target="_blank" rel="noopener">`,
    display,
    `</a>`,
  ].join("");
}

export function htmlLink(p: KindModelPlugin) {
  return (ref: PageReference | undefined, opt?: MarkdownLinkOpt): string => {
    const page = getPage(p)(ref);

    if (page) {
      const name = page.file.name;
      const path = stripTrailing(page.file.path, ".md");
      const display = opt?.display || page.file.name || page.file.path;

      return link(name, path, display);
    }
    else {
      console.log(`invalid: ${ref}`);
    }

    if (opt?.createPageWhereMissing && isValidPath(ref)) {
      const parts = ref.split("/");
      const display = opt.display || parts.pop() || "";

      return link(
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
        // const fmt = p.api.format;
        // let opt: MarkdownLinkOpt = {
        // 	pre: isMultiKind ? p.api.format.light(cat.kind + "/") : "",
        // };

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

export function showClassifications(p: KindModelPlugin) {
  return (pg: PageReference): string => {
    const classy = getClassification(p)(pg);
    // const link = internalLink(p);

    const opt = (pg: PageReference | undefined) => {
      const page = p.api.getPage(pg);
      if (page) {
        return {
          display: page.name,
        } as MarkdownLinkOpt;
      }
      return {} as MarkdownLinkOpt;
    };

    const classification = classy.map(i =>
      [
        // KIND
        htmlLink(p)(i.kind),
        // CATEGORY
        i.categories.length === 0
          ? ""
          : i.categories && i.categories.length === 1
            ? htmlLink(p)(
                i.categories[0].category,
                opt(p.api.format.as_tag(i.categories[0].category)),
              )
            : `<span style="opacity: 0.8">[ </span>${i.categories
              .map(ii =>
                htmlLink(p)(
                  ii.category,
                  opt(p.api.format.as_tag(ii.category)),
                ),
              )
              .join(",&nbsp;")}<span style="opacity: 0.8"> ]</span>`,
        // SUBCATEGORY
        i.subcategory ? htmlLink(p)(i?.subcategory?.subcategory) : "",
      ]
        .filter(i => i && i !== "")
        .join(`<span style="opacity: 0.8"> &gt; </span>`),
    );

    return classification.join("<br>");
  };
}

function extractTitle<T extends unknown | undefined>(s: T) {
  return (
    s && typeof s === "string" ? s.replace(/\d{0,4}-\d{2}-\d{2}\s*/, "") : s
  ) as T extends string
    ? StripLeading<T, `${number}-${number}-${number}${OptionalSpace}`>
    : T;
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
    embed?: boolean,
    _display?: string,
  ) => {
    const page = p.api.getPage(pathLike);

    if (page) {
      return p.dv.fileLink(
        page.file.name,
        isUndefined(embed) ? false : embed,
        extractTitle(page.file.name),
      );
    }

    return "";
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
  } as const;
}
