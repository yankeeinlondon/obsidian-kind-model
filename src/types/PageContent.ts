import { MarkdownView } from "obsidian";
import { DateTime, Link } from "obsidian-dataview";
import { DataviewSettings } from "./dataview-types";
import { Node, RenderableTreeNode } from "@markdoc/markdoc";
import { Frontmatter, HeadingTag } from "./frontmatter";
import { KindApi } from "helpers/KindApi";

export interface PageContext {
  kind: KindApi,
  /**
   * meta data _about_ the page
   */
  meta: {
    /**
     * Settings for [Dataview plugin](https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/).
     */
    dv: DataviewSettings;
    /** the list of page name aliases; empty array if none */
    aliases: string[];
    /**
     * The frontmatter properties found on the page.
     * 
     * Note: _this includes the `tags` and `aliases` if present_
     */
    fm: Frontmatter;
    datetime: {
      /** The date that the file was created. */
      cday: DateTime;
      /** The date _and time_ that the file was created. */
      ctime: DateTime;
      /** The date that the file last modified. */
      mday: DateTime;
      /** The date _and time_ that the file was last modified. */
      mtime: DateTime;
    };
    /** 
     * Whether or not the file has been starred/bookmarked in 
     * core Obsidian plugin "Bookmarks".
     */
    starred: boolean;

    /**
     * A list of all incoming links to this file, meaning all files
     * that contain a link to this file.
     */
    inlinks: any[];
    /** 
     * A list of all outgoing links from this file, meaning all 
     * links the file contains. 
     */
    outlinks: any[];

    /**
     * **etags**
     * 
     * A list of all explicit tags in the note; unlike `tags`, 
     * does not break sub-tags down, i.e. [#Tag/1/A]
     */
    etags: string[];
    /**
     * **tags**
     * 
     * A list of all unique tags in the note. Sub-tags are broken down by each level, 
     * so `#Tag/1/A` will be stored in the list as [#Tag, #Tag/1, #Tag/1/A].
     */
    tags: string[];

    isCategoryPage: boolean;
    isSubcategoryPage: boolean;
    isKindDefinitionPage: boolean;

    /** A list of all tasks (I.e., | [ ] some task) in this file. */
    tasks: string[];

    /**
     * A list of all list elements in the file (including tasks); these 
     * elements are effectively tasks and can be rendered in task views.
     */
    lists: any[];

    /**
     * **day**
     * 
     * Only available if the file has a date inside its file name 
     * (of form yyyy-mm-dd or yyyymmdd), or has a Date field/inline field.
     */
    day?: DateTime;

    /**
     * The **icon** associated with the page (provided by passed in view)
     */
    icon: string;

    /**
     * The current mode that the page is operating under
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
    view: ReturnType<MarkdownView["getViewType"]>
    /** temp */
    keys: string[];
    showBackLinks?: boolean;

    /**
     * Whether or not the view is intended for navigation. If your view is a static view that 
     * is not intended to be navigated away, set this to false. (For example: File explorer, 
     * calendar, etc.) If your view opens a file or can be otherwise navigated, set this to 
     * true. (For example: Markdown editor view, Kanban view, PDF view, etc.) File views can 
     * be navigated by default.
     */
    navigation: MarkdownView["navigation"]
  }

  editor: MarkdownView["editor"];

  /**
   * A debounced request to save the page (2 secs from now)
   */
  requestSave: MarkdownView["requestSave"];

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
      blocks: {name: string; content: string;}[];
  }

  /** information on the **file** (path, folder, ext) */
  file: {
    /** 
     * **basename**
     * 
     * Provided via the Obsidian view, it represents the page's name without 
     * file path or extension and therefore should be equivalent to the `name`
     * property on **meta**.
     */
    basename: string;
    /** 
     * The path to the file from Vault's root. This includes the filename
     * and extension.
     */
    path: string;

    /** 
     * **Page Link**
     * 
     * A [Dataview](https://blacksmithgu.github.io/obsidian-dataview) link to the page 
     */
    link: Link;
    /** the folder that the page is on */
    folder: string;
    /** the file extension (no period in string) */
    ext: string;
    /** the filename without extension or path */
    name: string;
    /** the file size (in bytes) */
    size: number;
    
  }

  /**
   * references to DOM elements related to page
   */
  dom: {
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

}
