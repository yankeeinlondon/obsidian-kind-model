import type { Node, RenderableTreeNode } from "@markdoc/markdoc";
import type { TypedFunction } from "inferred-types";
import type { DateTime } from "luxon";
import type { Component, MarkdownView } from "obsidian";
import type { Classification } from "./Classification";
import type { DvPage, Link } from "./dataview_types";
import type { Frontmatter, HeadingTag } from "./frontmatter";

import type { ObsidianComponent, TAbstractFile, TFile } from "./Obsidian";
import type { removeFmKey, RenderApi, setFmKey } from "~/api";
import type { PageBlock, PropertyType, Tag } from "~/types";

export type PageType =
  | "kinded"
  | "kinded > category"
  | "kinded > subcategory"
  | "kind-defn"
  | "type-defn"
  | "none";

export interface PageInfo {
  /**
   * whether page is _kinded_, a _kind definition_, a _type definition_, or none of the above.
   */
  type: PageType;

  /**
   * The obsidian hash value for this file/page
   */
  _hash?: string;

  /** the full path to the page */
  path: string;

  /** the file's name */
  name: string;
  /** the file extension */
  ext: string;

  /**
   * the frontmatter dictionary on the current page
   *
   * **Note:** this is just an alias to `.page.file.frontmatter` property.
   */
  fm: Frontmatter;

  /**
   * _set_ a key/value pair in the frontmatter of the current page
   */
  setFmKey: ReturnType<ReturnType<typeof setFmKey>>;
  /**
   * _remove_ a key/value pair in the frontmatter of the current page
   */
  removeFmKey: ReturnType<ReturnType<typeof removeFmKey>>;

  /**
   * All of the categories which the current page belongs to.
   *
   * - this is drawn from both `category` and `categories` props as well
   * - as any category tags found on the page
   * - the `PageCategory` return type organizes the categories by the "kind" property
   * which the category is a part of.
   */
  categories: PageCategory[];

  /**
   * All of the subcategories which the current page belongs to.
   */
  subcategories: PageSubcategory[];

  /** boolean flag indicating whether page is a **category** page for a `kind` */
  isCategoryPage: boolean;

  isKindDefnPage: boolean;
  isTypeDefnPage: boolean;
  isKindedPage: boolean;

  hasCategoryTag: boolean;
  hasCategoryProp: boolean;
  hasCategoriesProp: boolean;

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
  hasAnyCategoryProp: boolean;

  /** Checks whether a _kinded page_ has a **subcategory** tag defined. */
  hasSubcategoryTag: boolean;

  hasSubcategoryProp: boolean;

  /** boolean flag indicating whether page is a **subcategory** page for a `kind` */
  isSubcategoryPage: boolean;
  /**
   * whether a kinded page has _multiple_ kinds in claims membership to
   */
  hasMultipleKinds: boolean;

  /**
   * whether the page has a tag which indicates the page's "kind"
   * but is _not_ a Kind Definition tag.
   */
  hasKindTag: boolean;

  hasKindDefinitionTag: boolean;
  hasTypeDefinitionTag: boolean;

  /**
   * whether the page has a "kind" property which indicates the page's "kind";
   * this is **any** "kind" property which links to another page inside
   * the vault (aka, it should be a kind definition but for this flag it doesn't
   * have to be).
   *
   * The one exception, is when the kind property points directly to the `kind` Kind definition
   * as this indicates it is a
   */
  hasKindProp: boolean;

  /**
   * the Classifications of the page
   */
  classifications: Classification[];

  /**
   * whether the page has a "kinds" property which indicates the page's "kind"
   * (or multiple kinds); this looks for a list where at least one item in the
   * list is a link to another page in the vault.
   */
  hasKindsProp: boolean;

  /**
   * whether the page has either a `kind` _or_ `kinds` property of the appropriate
   * type
   */
  hasAnyKindProp: boolean;

  /**
   * The `DvPage` API surface for the given page
   */
  current: DvPage;

  /**
   * The _kind_ tag or tags associated with the current page:
   *
   * - `#kind/foobar` resolves to `[ "foobar" ]`
   * - `#foobar/foo/bar` resolves to `[ "foobar" ]`
   * - `#foobar/foo #product` resolves to `[ "foobar", "product" ]`
   */
  kindTags: string[];

  /**
   * The _type_ tag or tags associated with the current page. A _type_
   * is inherited by the _kind(s)_ which the page associated with.
   */
  typeTags: string[];

  /**
   * Reports on the current page's frontmatter property organized by
   * `PropertyType` (aka, "link", "list::link", "inline-svg")
   */
  metadata: Record<Partial<PropertyType>, string[]>;
}

export type PageInfoBlock = PageInfo &
  RenderApi & {
    /** the content of the code block */
    content: string;
    /** the Obsidian Component instance */
    component: ObsidianComponent;

    /** the HTML Element of the code block */
    container: HTMLElement;
  };

/**
 * references to DOM elements found on a Markdown View derived page
 */
export interface PageDomElements {
  container: HTMLElement;
  content: HTMLElement;
  icon?: HTMLElement;
  backButton?: HTMLElement;
  forwardButton?: HTMLElement;
  title?: HTMLElement;
  titleContainer?: HTMLElement;
  titleParent?: HTMLElement;
  inlineTitle?: HTMLElement;
  actions?: HTMLElement;
  modeButton?: HTMLElement;
  backlinks?: HTMLElement;
}

export interface MarkdownViewMeta {
  /**
   * **titleTimestamp**
   *
   * Only available if the file has a date inside its file name
   * (of form yyyy-mm-dd or yyyymmdd), or has a Date field/inline field.
   */
  title_timestamp?: DateTime;

  /**
   * The **icon** assigned to the page by Obsidian. This is an **iconId**
   * and will be available when a "view" is provided to **getPageContext()**.
   */
  iconAssigned: string;

  /**
   * The **mode** that the current page is operating under
   */
  mode: MarkdownView["currentMode"];

  leaf: MarkdownView["leaf"];

  /**
   * The height of the window which is hosting the current file
   */
  leaf_height?: number;
  /**
   * The width of the window which is hosting the current file
   */
  leaf_width?: number;
  leaf_id?: string;
  popover: MarkdownView["hoverPopover"];
  allowNoFile: MarkdownView["allowNoFile"];
  previewMode: MarkdownView["previewMode"];
  /**
   * A textual representation of the type of view you have.
   *
   * - if you're editing a markdown file it should be `markdown`
   */
  viewType: ReturnType<MarkdownView["getViewType"]>;
  showBackLinks?: boolean;

  /**
   * Whether or not the view is intended for navigation. If your view is a static view that
   * is not intended to be navigated away, set this to false. (For example: File explorer,
   * calendar, etc.) If your view opens a file or can be otherwise navigated, set this to
   * true. (For example: Markdown editor view, Kanban view, PDF view, etc.) File views can
   * be navigated by default.
   */
  navigation: MarkdownView["navigation"];

  editor: MarkdownView["editor"];

  /**
   * A debounced request to save the page (2 secs from now)
   */
  requestSave: MarkdownView["requestSave"];

  /** Load this component and its children */
  load: MarkdownView["load"];

  onLoadFile: MarkdownView["onLoadFile"];
  onUnloadFile: MarkdownView["onUnloadFile"];
  /** Called when the size of this view is changed. */
  onResize: MarkdownView["onResize"];
  onRename: MarkdownView["onRename"];
  /**
   * Populates the pane menu.
   *
   * (Replaces the previously removed onHeaderMenu and onMoreOptionsMenu)
   */
  onPaneMenu: MarkdownView["onPaneMenu"];

  /** Registers a callback to be called when unloading */
  register: MarkdownView["register"];
  /** Registers an DOM event to be detached when unloading */
  registerDomEvent: MarkdownView["registerDomEvent"];
  /** Registers an event to be detached when unloading */
  registerEvent: MarkdownView["registerEvent"];
  /**
   * Registers an interval (from setInterval) to be cancelled when unloading
   * Use window.setInterval instead of setInterval to avoid TypeScript confusing
   * between NodeJS vs Browser API
   */
  registerInterval: MarkdownView["registerInterval"];

  getEphemeralState: MarkdownView["getEphemeralState"];
  getState: MarkdownView["getState"];
  getViewData: MarkdownView["getViewData"];
  getViewType: MarkdownView["getViewType"];

  /**
   * The raw/text content of the page (including frontmatter)
   */
  content: string;

  /**
   * Properties derived from the `content` property based on both a
   * **regex** decomposition as well as using [Markdoc](https://markdoc.dev/)'s
   * AST parsing as well as the further refined
   * [renderable tree node](https://markdoc.dev/docs/render#transform).
   */
  contentStructure: {
    /**
     * **ast**
     *
     * MarkDoc AST tree from root of Document.
     *
     * References: [docs](markdoc.dev), [sandbox](https://markdoc.dev/sandbox)
     */
    ast: Node;

    /**
     * **renderableTree**
     *
     * MarkDoc's `RenderableTreeNode` representation of the page. This
     * is a higher level representation of the AST and often a better tool
     * for extraction of structural content on the page
     * (like a table of contents, etc.).
     *
     * References: [docs](markdoc.dev/docs/render#transform), [sandbox](https://markdoc.dev/sandbox)
     */
    renderableTree: RenderableTreeNode | RenderableTreeNode[];

    /** the raw YAML content/frontmatter at top of page  */
    yaml: string | undefined;

    /** the raw `content` with frontmatter removed  */
    body: string;

    h1: string | undefined;

    h2_tags: HeadingTag<2>[];

    preH1: string | undefined;
    postH1: string | undefined;

    /**
     * The page broken down by H2 headings
     */
    blocks: { name: string; content: string }[];
  };
}

/**
 * **PageView**
 *
 * Is provided by the createPageView() utility when a `MarkdownView` is available.
 * It provides all the properties of the `PageInfo` data structure along with additional
 * endpoints which can only be provided when a "view" is underlying the
 */
export type PageView = PageInfo & {
  dom: PageDomElements;
  component: Component & {
    getSectionInfo: TypedFunction;
    sourcePath: string;
  };
  /**
   * Metadata derived from the `MarkdownView` provided to create the `PageView`
   */
  view: MarkdownViewMeta;
};

export interface PageIcons {
  hasIcon?: boolean;
  typeIcon?: string;
  kindIcon?: string;
  categoryIcon?: string;
  subcategoryIcon?: string;
  pageIcon?: string;
}
export interface PageBanners {
  hasBanner?: boolean;
  typeBanner?: string;
  kindBanner?: string;
  categoryBanner?: string;
  subcategoryBanner?: string;
  pageBanner?: string;
}

export type PageSuggestion =
  | "add-kind-prop"
  | "add-kind-tag"
  | "add-kinded-prop"
  | "add-kinded-tag"
  | "add-category-tag"
  | "add-category-prop"
  | "add-subcategory-tag"
  | "add-subcategory-prop";

export type PageReference =
  | PageInfo
  | PageBlock
  | DvPage
  | TFile
  | TAbstractFile
  | Link
  | string;

/**
 * represents a static "kind" and the categories that a given page has of this
 * particular kind.
 */
export interface PageCategory {
  /** the kind name of the category */
  kind: string;
  /** the `DvPage` for the category page */
  page: DvPage;
  /** the **tag** to identify the category */
  category: string;
  /** the **tag**: `#[kind]/[cat]` */
  kindedTag: `${Tag}/${string}`;
  /**
   * a _full qualified_ tag path to the category definition:
   * `#[kind]/category/[cat]`
   */
  defnTag: `${Tag}/category/${string}`;
}

/**
 * represents a static "kind" and "category" and a set of subcategories which
 * a given page has.
 */
export interface PageSubcategory {
  /** the kind name of the subcategory */
  kind: string;
  /** the `DvPage` for the category page */
  page: DvPage;
  /** the category name */
  category: string;
  /** the subcategory name */
  subcategory: string;
  /** the **tag**: `#[kind]/[cat]` */
  kindedTag: `${Tag}/${string}/${string}`;
  /**
   * a _full qualified_ tag path to the subcategory definition:
   * `#[kind]/category/[cat]/[subcat]`
   */
  defnTag: `${Tag}/subcategory/${string}/${string}`;
}
