/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AsArray,
  Container,
  EscapeFunction,
  TypedFunction,
} from "inferred-types";
import type { DateTime, Duration } from "luxon";
import type KindModelPlugin from "~/main";
import type {
  BlockQuoteOptions,
  DataArray,
  DvPage,
  Grouping,
  Link,
  ListItemsCallback,
  ObsidianCalloutColors,
  SListItem,
} from "~/types";
import {
  createFnWithProps,
  isArray,
  isContainer,
  isFunction,
  isNumber,
  isString,
} from "inferred-types";

import { getPage } from "~/page";
import { isDvPage, isLink } from "~/type-guards";
import { getClassification } from "./classificationApi";
import { blockquote } from "./formatting/blockquote";
import { renderListItems, wrap_ol } from "./formattingApi";

export function isKeyOf<TContainer, TKey>(container: TContainer,	key: TKey): key is TContainer extends Container ? TKey & keyof TContainer : TKey {
  return !!(isContainer(container)
    && (isString(key) || isNumber(key))
    && key in container);
}

interface UlApi {
  /** indent the unordered list a level */
  indent: (...items: string[]) => string;
  done: EscapeFunction;
}

type UlCallback = <T extends UlApi>(api: T) => unknown;

function removePound(tag: string | undefined) {
  return typeof tag === "string" && tag?.startsWith("#") ? tag.slice(1) : tag;
}

/**
 * **get_internal_links**`(p) => (pg, ...props)`
 *
 * Gets any links to pages in the vault found across the various properties
 * passed in.
 */
function get_internal_links(_p: KindModelPlugin) {
  return (pg: DvPage, ...props: string[]) => {
    let links: Link[] = [];
    for (const prop of props) {
      const pgProp = pg[prop];
      if (!pgProp) {
        break;
      }
      if (Array.isArray(pgProp)) {
        links = [...links, ...pgProp.filter(i => isLink(i))];
      }
      else if (isLink(pgProp)) {
        links.push(pgProp);
      }
      else if (isDvPage(pgProp)) {
        links.push(pgProp.file.link);
      }
    }
    return links;
  };
}

/**
 * **renderApi**`(p) => (el, filePath) => API`
 *
 * The render API provides a means to directly render to the DOM. It expects a DOM node and
 * file path along with the plugin to instantiate and will probably be most useful in
 * scenarios where you're rendering a codeblock as these interrupts conveniently provide
 * both the parent element as well the file path.
 */
export function renderApi(p: KindModelPlugin) {
  return (el: HTMLElement, filePath: string) => {
    const current = getPage(p)(filePath);

    if (!current) {
      throw new Error(
        `Attempt to initialize dv_page() with an invalid sourcePath: ${filePath}!`,
      );
    }

    return {
      /**
       * Uses the underlying `renderValue()` functionality exposed by
       * dataview to render data to the page.
       */
      async render(data: unknown): Promise<void> {
        await p.dv.renderValue(data, el, p, filePath, false);
      },

      /** the current page represented as a `DvPage` */
      current,

      /**
       * simply utility to ensure that a tag string has it's
       * leading pound symbol removed.
       */
      removePound,

      /**
       * **get_classification**`(page)`
       *
       * Gets a page's classification {`isCategory`,`isSubcategory`,`category`,`subcategory`}
       */
      getClassification: getClassification(p),

      /**
       * **get_internal_links**
       *
       * Gets any links to pages in the vault found across the various
       * properties passed in.
       */
      get_internal_links: get_internal_links(p),

      /**
       * **callout**`(kind, title, opts)`
       *
       * Renders a callout to the current block.
       *
       * **Note:** use `blockquote` for same functionality but
       * with HTML returned rather than _rendered_.
       */
      callout: (
        kind: ObsidianCalloutColors,
        title: string,
        opts?: BlockQuoteOptions,
      ) =>
        p.dv.renderValue(
          blockquote(kind, title, opts),
          el,
          p,
          filePath,
          false,
        ),

      /**
       * **page**`(path, [originFile])`
       *
       * Map a page path to the actual data contained within that page.
       */
      page(pg: string | Link, originFile?: string) {
        return p.dv.page(pg, originFile);
      },

      pages(query?: string, originFile?: string) {
        return p.dv.pages(query, originFile);
      },

      /**
       * **as_array**`(v)`
       *
       * Utility function which ensures that the passed in value _is_ an array,
       * and that any DvArray[] proxy is converted to a normal JS array
       */
      as_array: <T>(v: T) => {
        return (
          p.dv.isDataArray(v)
            ? Array.from(v.values)
            : isArray(v)
              ? v.map(i => (p.dv.isDataArray(i) ? i.values : i))
              : [v]
        ) as T extends DataArray<infer D> ? D[] : AsArray<T>;
      },

      /**
       * Return an array of paths (as strings) corresponding to pages
       * which match the query.
       */
      pagePaths(query?: string, originFile?: string) {
        return p.dv.pagePaths(query, originFile);
      },
      /**
       * **date**`(pathLike)`
       *
       * Attempt to extract a date from a string, link or date.
       */
      date(pathLike: string | Link | DateTime) {
        return p.dv.date(pathLike);
      },

      /**
       * **duration**`(pathLike)`
       *
       * Attempt to extract a duration from a string or duration.
       */
      duration(str: string | Duration) {
        return p.dv.duration(str);
      },

      /**
       * **fileLink**`(path, [embed],[display])`
       *
       * Create a dataview file link to the given path.
       */
      fileLink(path: string, embed?: boolean, displayAs?: string) {
        return p.dv.fileLink(path, embed, displayAs);
      },
      /**
       * **sectionLink**`(path, [embed],[display])`
       *
       * Create a dataview section link to the given path.
       */
      sectionLink(path: string, embed?: boolean, display?: string) {
        return p.dv.sectionLink(path, embed, display);
      },
      /**
       * **blockLink**`(path, [embed],[display])`
       *
       * Create a dataview block link to the given path.
       */
      blockLink(path: string, embed?: boolean, display?: string) {
        return p.dv.blockLink(path, embed, display);
      },

      /**
       * **table**`(headers,values,container,component,filePath)`
       *
       * Render a dataview table with the given headers, and the
       * 2D array of values.
       */
      async table(headers: string[], values: any[] | DataArray<any>) {
        return p.dv.table(headers, values, el, p, filePath);
      },

      /**
       * **renderValue**`(value, [inline])`
       *
       * Render an arbitrary value into a container.
       */
      async renderValue(value: unknown, inline: boolean = false) {
        return p.dv.renderValue(value, el, p, filePath, inline);
      },

      /**
       * **taskList**`(tasks,groupByFile)`
       *
       * Render a dataview task view with the given tasks.
       */
      async taskList(tasks: Grouping<SListItem>, groupByFile: boolean) {
        return p.dv.taskList(tasks, groupByFile, el, p, filePath);
      },

      /**
       * **list**(values, container, component, filePath)
       *
       * Render a dataview **list** of the given values by:
       *
       * - adding a sub-container DIV to the passed in _container_
       * - using the `component`'s `addChild()` method to
       * adding a child element which is given the sub-container
       * for rendering purposes
       */
      async list(values: unknown[] | DataArray<unknown> | undefined) {
        return p.dv.list(values, el, p, filePath);
      },

      async paragraph(text: string) {
        return p.dv.renderValue(text, el, p, filePath, false);
      },

      async ul(...items: readonly (string | UlCallback)[]) {
        const wrap_ul = (items: string) => `<ul>${items}</ul>`;
        const render_items = (
          items: readonly (string | UlCallback)[],
        ) =>
          items
            .map(
              i =>
                (isFunction(i)
                  ? isFunction((i as TypedFunction)(ul_api))
                    ? ""
                    : (i as TypedFunction)(ul_api)
                  : `<li>${i}</li>`) as unknown as string,
            )
            .filter(i => i !== "")
            .join("\n") as string;

        const ul_api: UlApi = {
          indent: (...items: string[]) =>
            wrap_ul(render_items(items)),
          done: createFnWithProps(() => "", { escape: true }),
        };

        return p.dv.renderValue(
          wrap_ul(render_items(items)),
          el,
          p,
          filePath,
          false,
        );
      },

      async ol(...items: readonly (string | ListItemsCallback)[]) {
        return p.dv.renderValue(
          renderListItems(wrap_ol, items),
          el,
          p,
          filePath,
          false,
        );
      },

      code: (code: string) =>
        p.dv.renderValue(`<code>${code}</code>`, el, p, filePath, true),
    };
  };
}

export type RenderApi = ReturnType<ReturnType<typeof renderApi>>;
