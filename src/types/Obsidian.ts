import type {
  AlphaChar,
  AlphaNumericChar,
  Callback,
  Dictionary,
  HtmlElement,
  NonZeroNumericChar,
  SemanticVersion,
  SpecialChar,
  StringDelimiter,
  Suggest,
  SyncFunction,
  TypedFunction,
  UrlPath,
} from "inferred-types";

import type {
  App,
  EventRef,
  TAbstractFile as OAbstractedFile,
  TFile as OFile,
  TFolder as OFolder,
  Plugin,
  PluginManifest,
  Stat,
  Vault,
  Workspace,
} from "obsidian";
import type { Tag } from ".";
import type { Path } from "~/globals";

export interface TFile extends TAbstractFile, OFile {
  /**
   * the name without the file extension
   */
  basename: string;

  /** file `Stat` metadata */
  stat: Stat;

  /** the file extension */
  extension: string;

  /** whether file is being saved  */
  saving: boolean;

  /**
   * whether the file was deleted or not
   */
  deleted: boolean;
}

export interface TFolder extends TAbstractFile, OFolder {
  /**
   * files in the directory
   */
  children: TAbstractFile[];

  /**
   * is the root of the vault
   */
  isRoot: () => boolean;
}

export interface TFileForMarkdown {
  name: string;
  path: string;
  basename: string;
  extension: string;
}

/**
 * This can be either a `TFile` or a `TFolder`.
 */
export interface TAbstractFile extends OAbstractedFile {
  /**
   * The name including file extension
   */
  name: string;

  /**
   * @public
   */
  vault: Vault;
  /**
   * the full path to the file
   */
  path: string;

  /**
   * the parent folder
   */
  parent: TFolder | null;

}

export interface ObsidianComponent {
  /**
   * Load this component and its children
   */
  load: () => void;
  /**
   * Override this to load your component
   */
  onload: () => void;
  /**
   * Unload this component and its children
   */
  unload: () => void;
  /**
   * Override this to unload your component
   */
  onunload: () => void;
  /**
   * Adds a child component, loading it if this component is loaded
   */
  addChild: <T extends ObsidianComponent>(component: T) => T;
  /**
   * Removes a child component, unloading it
   */
  removeChild: <T extends ObsidianComponent>(component: T) => T;
  /**
   * Registers a callback to be called when unloading
   */
  register: (cb: () => any) => void;
  /**
   * Registers an event to be detached when unloading
   */
  registerEvent: (eventRef: EventRef) => void;
  /**
   * Registers an DOM event to be detached when unloading
   */
  registerDomEvent: (<K extends keyof WindowEventMap>(
    el: Window,
    type: K,
    callback: (this: HTMLElement, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void)
  & (<K extends keyof DocumentEventMap>(
    el: Document,
    type: K,
    callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void)
  & (<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void);

  /**
   * Registers an interval (from setInterval) to be cancelled when unloading
   * Use {@link window.setInterval} instead of {@link setInterval} to
   * avoid TypeScript confusing between NodeJS vs Browser API
   */
  registerInterval: (id: number) => number;
}

export interface ObsidianSvgElement
  extends SVGGraphicsElement,
  SVGFitToViewBox,
  WindowEventHandlers {
  currentScale: number;
  readonly currentTranslate: DOMPointReadOnly;
  readonly height: SVGAnimatedLength;
  readonly width: SVGAnimatedLength;
  readonly x: SVGAnimatedLength;
  readonly y: SVGAnimatedLength;
  animationsPaused: () => boolean;
  checkEnclosure: (element: SVGElement, rect: DOMRectReadOnly) => boolean;
  checkIntersection: (element: SVGElement, rect: DOMRectReadOnly) => boolean;
  createSVGAngle: () => SVGAngle;
  createSVGLength: () => SVGLength;
  createSVGMatrix: () => DOMMatrix;
  createSVGNumber: () => SVGNumber;
  createSVGPoint: () => DOMPoint;
  createSVGRect: () => DOMRect;
  createSVGTransform: () => SVGTransform;
  createSVGTransformFromMatrix: (matrix?: DOMMatrix2DInit) => SVGTransform;
  deselectAll: () => void;
  /** @deprecated */
  forceRedraw: () => void;
  getCurrentTime: () => number;
  getElementById: (elementId: string) => Element;
  getEnclosureList: (
    rect: DOMRectReadOnly,
    referenceElement: SVGElement | null,
  ) => NodeListOf<
      | SVGCircleElement
      | SVGEllipseElement
      | SVGImageElement
      | SVGLineElement
      | SVGPathElement
      | SVGPolygonElement
      | SVGPolylineElement
      | SVGRectElement
      | SVGTextElement
      | SVGUseElement
  >;
  getIntersectionList: (
    rect: DOMRectReadOnly,
    referenceElement: SVGElement | null,
  ) => NodeListOf<
      | SVGCircleElement
      | SVGEllipseElement
      | SVGImageElement
      | SVGLineElement
      | SVGPathElement
      | SVGPolygonElement
      | SVGPolylineElement
      | SVGRectElement
      | SVGTextElement
      | SVGUseElement
  >;
  pauseAnimations: () => void;
  setCurrentTime: (seconds: number) => void;
  /** @deprecated */
  suspendRedraw: (maxWaitMilliseconds: number) => number;
  unpauseAnimations: () => void;
  /** @deprecated */
  unsuspendRedraw: (suspendHandleID: number) => void;
  /** @deprecated */
  unsuspendRedrawAll: () => void;
  addEventListener: (<K extends keyof SVGSVGElementEventMap>(
    type: K,
    listener: (this: ObsidianSvgElement, ev: SVGSVGElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void)
  & ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => void);
  removeEventListener: (<K extends keyof SVGSVGElementEventMap>(
    type: K,
    listener: (this: ObsidianSvgElement, ev: SVGSVGElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) => void)
  & ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) => void);
}

export type ObsidianModifier = "Mod" | "Alt" | "";
export type ObsidianKey
  = | `F${NonZeroNumericChar}`
      | "UpArrow"
      | "DownArrow"
      | "LeftArrow"
      | "RightArrow"
      | AlphaNumericChar;

export type GetIconFromObsidian = (iconId: string) => ObsidianSvgElement | null;

/**
 * A `key` and `modifiers` properties which together represent
 * a fully configured "hot key"
 */
export interface ObsidianHotKey {
  key: ObsidianKey;
  modifiers: ObsidianModifier[];
}

/**
 * The **Obsidian** `HotKeyManager` is found directly off the `App`
 * exposed in globals.
 */
export interface ObsidianHotKeyManager {
  baked: boolean;
  /** the array of hot keys (note: always same number of `bakedIds`) */
  bakedHotKeys: ObsidianHotKey[];
  /**
   * the array of **commands** which are associated to the `bakedHotKeys`
   * array found in the manager.
   */
  bakedIds: string[];
}

/**
 * The keys which makeup the dictionary of commands.
 *
 * - to the left of the color is the plugin name
 * - to the right is the command name
 */
export type ObsidianCommandKey = `${string}:${string}`;

export interface ObsidianFile {
  type: "file" | `${string}`;
  ctime: number;
  mtime: number;
  realpath: string;
  size: number;
}

export interface ObsidianMappedFile {
  /** the name of the file without the extension */
  basename: string;

  deleted: boolean;
  /** the file extension */
  extension: string;
  /** the file's name _with_ the file extension (but no path) */
  name: string;

  /** the file's full name, path, and extension */
  path: string;

  saving: boolean;
  stat: {
    ctime: number;
    mtime: number;
    size: number;
  };
  vault: any;
}

export interface ObsidianWatcher {
  watcher: any;
  resolvedPath: string;
}

export interface ObsidianAdaptor {
  basePath: string;
  btime: { btime: TypedFunction };
  files: Record<string, ObsidianFile>;
  fs: any;
  fsPromises: any;
  handler: TypedFunction;
  insensitive: boolean;
  ipcRenderer: any;
  killLastAction: null | unknown;
  path: {
    basename: (path: string, suffix: string) => string;
    delimiter: AlphaChar | SpecialChar | StringDelimiter | ":";
    dirname: (path: string) => string;
    extname: (path: string) => string;
    format: TypedFunction;
    isAbsolute: (path: string) => boolean;
    join: (...args: string[]) => string;
    normalize: (path: string) => string;
    parse: (path: string) => unknown;
    relative: (from: string, to: string) => string;
    resolve: (...args: string[]) => unknown;
    sep: AlphaChar | SpecialChar | StringDelimiter | ":";
    toNamespacedPath: (path: string) => unknown;
  };
  url: {
    /** URL class */
    URL: any;
    Url: TypedFunction;
    domainToASCII: (domain: unknown) => unknown;
    domainToUnicode: (domain: unknown) => unknown;
    fileURLToPath: (path: `file:${string}`) => string;
    format: TypedFunction;
    parse: TypedFunction;
    pathToFileURL: TypedFunction;
    resolve: TypedFunction;
    resolveObject: TypedFunction;
    urlToHttpOptions: TypedFunction;
  };
  watcher: null | unknown;
  watchers: Record<`/${string}`, ObsidianWatcher>;
}

export interface ObsidianFileCache {
  mtime: number;
  size: number;
  hash: string;
}

export interface ObsidianCommandProps {
  checkCallback: TypedFunction;
  icon: string;
  id: string;
  name: string;
  hotkeys?: ObsidianHotKey[];
}

export interface ObsidianTheme {
  name: string;
  version: SemanticVersion;
  minAppVersion: SemanticVersion;
  author: string;
  authorUrl: UrlPath;
}

export interface ObsidianPosition {
  line: number;
  col: number;
  offset: number;
}

export interface ObsidianMetaLink {
  link: string;
  original: string;
  displayText: string;
  position: {
    end: ObsidianPosition;
    start: ObsidianPosition;
  };
}

export type ObsidianFrontmatterValue
  = | string
      | string[]
      | number[]
      | number
      | boolean
      | null;

export type ObsidianSectionType
  = | "yaml"
      | "paragraph"
      | "blockquote"
      | "heading"
      | "list";

export interface ObsidianTagMeta {
  tag: Tag;
  position: {
    start: ObsidianPosition;
    end: ObsidianPosition;
  };
}

export interface ObsidianSection {
  type: ObsidianSectionType;
  position: {
    start: ObsidianPosition;
    end: ObsidianPosition;
  };
}

export interface ObsidianFrontmatterLink {
  key: string;
  link: string;
  original: `[[${string}]]`;
  displayText: string;
}

export interface ObsidianListItem {
  parent: number;
  position: {
    start: ObsidianPosition;
    end: ObsidianPosition;
  };
}

export interface ObsidianHeading {
  heading: string;
  level: number;
  position: {
    start: ObsidianPosition;
    end: ObsidianPosition;
  };
}

export interface ObsidianMetadataCache {
  frontmatter: Record<string, ObsidianFrontmatterValue>;
  frontmatterLinks: ObsidianFrontmatterLink[];
  frontmatterPosition: {
    start: ObsidianPosition;
    end: ObsidianPosition;
  };
  headings: ObsidianHeading[];
  links: ObsidianMetaLink[];
  listItems: ObsidianListItem[];
  sections: ObsidianSection[];
  tags: ObsidianTagMeta[];
}

export interface ObsidianCommandRepresentation {
  id: string;
  icon: string;
  name: string;
  checkCallback: SyncFunction;
}

export interface ObsidianPluginInstance {
  description: string;
  extension: string;
  id: string;
  name: string;
  plugin: Plugin;
  [key: string]: unknown;
}

export type ObsidianInternalPlugins = "audio-recorder"
    | "backlink"
    | "bookmarks"
    | "canvas"
    | "command-pallette"
    | "daily-notes"
    | "editor-status"
    | "file-explorer"
    | "file-recovery"
    | "global-search"
    | "graph"
    | "markdown-importer"
    | "note-composer"
    | "outgoing-link"
    | "outline"
    | "page-preview"
    | "properties"
    | "publish"
    | "random-note"
    | "slash-command"
    | "slides"
    | "switcher"
    | "sync"
    | "tag-pane"
    | "templates"
    | "word-count"
    | "workspaces"
    | "zk-prefixer";

export type SuggestedCommunityPlugins = Suggest<"calendar"
    | "canvas-mindmap"
    | "cmdr"
    | "excalibrain"
    | "hot-reload"
    | "image-converter"
    | "obsidian-advanced-uri"
    | "obsidian-kanban"
    | "obsidian-kind-model"
    | "dataview"
    | "quickadd"
>;

/**
 * A representation of a **Obsidian** `plugin` which is exposed
 * by the runtime on the `App` global.
 */
export interface ObsidianPluginRepresentation {
  commands: ObsidianCommandRepresentation[];
  addedButtonEls: HtmlElement[];
  enabled: boolean;
  hasStatusBarItem: boolean;
  ribbonItems: any[];
  statusBarEl: HtmlElement | null;
  views: Dictionary;
  instance: ObsidianPluginInstance;
}

export interface ObsidianPlugins {
  enabledPlugins: Set<string>;
  loadingPluginId: null | string;
  manifests: Record<SuggestedCommunityPlugins, PluginManifest>;
  plugins: Record<SuggestedCommunityPlugins, ObsidianPluginRepresentation>;
  requestSaveConfig: SyncFunction<[], void>;
  updates: Dictionary;
}

export type ObsidianVault = {
  reloadConfig: () => Promise<void>;
  requestSaveConfig: () => Promise<void>;
  config: Record<string, any>;
  adapter: {
    /** the fully qualified path to the root of the Vault */
    basePath: string;
    btime: {
      btime: SyncFunction<[path: string, btime: unknown]>;
    };
    files: Record<string, TFile>;
    fs: {
      access: SyncFunction<[path: string, mode: unknown, callback: Callback]>;
      accessSync: SyncFunction<[path: string, mode: unknown]>;
      chmod: SyncFunction;
      chmodSync: SyncFunction;
      close: SyncFunction;
      closeSync: SyncFunction;
      copyFile: SyncFunction;
      copyFileSync: SyncFunction;
      watch: SyncFunction<[
				filename: string,
options: Dictionary,
listener: Callback,
      ]>;
      watchFile: SyncFunction<[
				path: string,
data: unknown,
options: Dictionary,
      ]>;
      write: SyncFunction;
      writeFile: SyncFunction;
      writeFileSync: SyncFunction;
      [key: string]: unknown;
    };
    fsPromises: any;
    handler: any;
    insensitive: boolean;
    path: Record<string, any>;
    url: Record<string, any>;
  };
  /**
   * Retrieves a file or folder in the vault by its path.
   * @param path - The path to the file or folder, relative to the vault root.
   * @returns A TAbstractFile if found, or null if not found.
   */
  getAbstractFileByPath: (path: string) => TAbstractFile | null;
} & Vault;

export interface ObsidianScope {
  keys: ObsidianCommandKey[];
  parent?: unknown;
  tabFocusContainer?: HtmlElement;
}

export type TypeWidget = "aliases" | "checkbox" | "date" | "datetime" | "multitext" | "number" | "tags" | "text";

export type SuggestedTypeWidgets = Suggest<
  TypeWidget
>;

/**
 * appears to be the types for Frontmatter properties
 */
export interface ObsidianTypeWidget<TCore extends boolean = true> {
  default: SyncFunction;
  icon: string;
  /** Proxy function */
  name: TCore extends true
    ? SyncFunction<[n: unknown, r: unknown], string>
    : string;
  render: TCore extends true
    ? SyncFunction<[e: unknown, t: unknown, n: unknown]>
    : never;
  reservedKeys: TCore extends true
    ? string[]
    : never;
  type: SuggestedTypeWidgets;
  validate: TCore extends true
    ? SyncFunction
    : never;
}

export type SuggestedExtension = Suggest<
    "3gp" | "avif" | "bmp" | "canvas" | "excalidraw" | "flac" | "gif" | "jpeg"
    | "jpg" | "m4a" | "md" | "mkv" | "mov" | "mp3" | "mp4" | "oga" | "ogg" | "ogv"
    | "opus" | "pdf" | "png" | "svg" | "wav" | "webm" | "webp"
>;

export type SuggestedFileType = Suggest<
	"audio" | "video" | "markdown" | "pdf" | "excalidraw"
>;

export type ExampleObsidianViews = Suggest<
    | "audio"
    | "advanced-tables-toolbar"
    | "backlink"
    | "bookmarks"
    | "calendar"
    | "canvas"
    | "cm-changelog-view"
    | "copilot-chat-view"
    | "excalidraw"
    | "file-explorer"
    | "markdown"
    | "graph"
    | "image"
    | "kanban"
    | "localgraph"
    | "map"
    | "mindmapview"
    | "playground-view"
    | "pdf"
    | "search"
    | "tag"
    | "tool-view"
    | "video"
>;

export interface ObsidianViewRegistry {
  /**
   * A lookup which helps map a file extension to a content type
   */
  typeByExtension: Record<SuggestedExtension, SuggestedFileType>;
  /**
   * A lookup which has view types as the keys, and a construtor
   * as a value.
   */
  viewByType: Record<ExampleObsidianViews, TypedFunction>;
}

export interface ObsidianPropertyCount {
  /** name of the frontmatter property */
  name: string;
  /** the number of times this property is used in the vault */
  count: number;
  type: SuggestedTypeWidgets;
}

export interface ObsidianMetadataTypeManager {
  onConfigFileChange: SyncFunction;
  /**
   * A dictionary lookup:
   *
   * - the _keys_ are the properties which have been used
   * in the vault as **frontmatter** properties
   * - the _values_ are `ObsidianPropertyCount` (aka, name, count, and type)
   */
  properties: Record<string, ObsidianPropertyCount>;
  /**
   * The core registered types which Obsidian gives to frontmatter properties
   */
  registeredTypeWidgets: Record<SuggestedTypeWidgets, ObsidianTypeWidget>;
  /**
   * the _learned_ types which a vault has established from the user's
   * guidance on the type of a given frontmatter property.
   */
  types: Record<string, ObsidianTypeWidget<false>>;

}

/**
 * A _richer_ representation of the **Obsidian** `App` type which
 * is exposed at runtime on the global object.
 */
export type ObsidianApp = {
  /** a unique identifier */
  appId: string;
  appMenuBarManager: any;
  commands: {
    app: any;
    commands: Record<ObsidianCommandKey, ObsidianCommandProps>;
    editorCommands: Record<ObsidianCommandKey, ObsidianCommandProps>;
    executeCommand: TypedFunction;
  };

  changeTheme: SyncFunction;

  customCss: {
    boundRaw: () => unknown;
    /**
     * - the key is the file path to the css file
     * - the value is the CSS file's content
     */
    csscache: Map<string, string>;

    enabledSnippets: Set<string>;
    extraStyleEls: HTMLStyleElement[];
    theme: string;
    themes: ObsidianTheme[];
    oldThemes: ObsidianTheme[];
    queue: Record<string, Promise<any>>;
    requestLoadSnippets: () => void;
    requestLoadTheme: () => void;
    requestReadThemes: () => void;
    snippets: string[];
    styleEl: HTMLStyleElement;
    updates: Dictionary;
  };

  dom: {
    appContainerEl: HTMLElement;
    horizontalMainContainerEl: HTMLElement;
    statusBarEl: HTMLElement;
    workspaceEl: HTMLElement;
  };
  dragManager: {
    actionEl: HTMLElement | null;
    dragStart: unknown | null;
    draggable: boolean | null;
    ghostEl: HTMLElement | null;
    hoverClass: string;
    hoverEl: HTMLElement | null;
    onTouchEnd: TypedFunction;
    overlayEl: HTMLElement;
    isDragOverHandled: boolean;
    shouldHideOverlay: boolean;
    sourceClass: string;
    sourceEls: null | HTMLElement[];
  };
  embedRegistry: {
    embedByExtension: {
      "3gp": TypedFunction;
      "avif": TypedFunction;
      "bmp": TypedFunction;
      "canvas": TypedFunction;
      "flac": TypedFunction;
      "gif": TypedFunction;
      "jpg": TypedFunction;
      "jpeg": TypedFunction;
      "m4a": TypedFunction;
      "md": TypedFunction;
      "mkv": TypedFunction;
      "mov": TypedFunction;
      "mp3": TypedFunction;
      "mp4": TypedFunction;
      "oga": TypedFunction;
      "ogv": TypedFunction;
      "opus": TypedFunction;
      "pdf": TypedFunction;
      "png": TypedFunction;
      "svg": TypedFunction;
      "wav": TypedFunction;
      "webm": TypedFunction;
      "webp": TypedFunction;
      [key: string]: TypedFunction;
    };
  };

  /** appears to restart **Obsidian** ... I guess in "debug mode"? */
  debugMode: SyncFunction;

  fileManager: {
    fileParentCreatorByType: {
      canvas: TypedFunction;
      md: TypedFunction;
    };
    inProgressUpdates: null | unknown;
    linkUpdaters: {
      canvas: any;
    };
    updateQueue: any;
    vault: {
      adapter: ObsidianAdaptor;
      cacheLimit: number;
      config: any;
      /** the configuration directory; typically ".obsidian" */
      configDir: string;
      configTs: number;
      /**
       * A dictionary where:
       * - keys are the file path
       * - values are `ObsidianMappedFile`'s
       */
      fileMap: Record<string, ObsidianMappedFile>;
      reloadConfig: () => void;
      requestSaveConfig: () => void;
      root: any;
    };
  };
  foldManager: any;
  hotKeyManager: ObsidianHotKeyManager;
  internalPlugins: {
    plugins: Record<Suggest<ObsidianInternalPlugins>, ObsidianPluginRepresentation>;
    isMobile: boolean;
    keyMap: {
      modifiers: string;
      prevScopes: any;
      rootScope: any;
      scope: any;
    };
    lastEvent: null | unknown;
    metadataCache: {
      app: any;
      blockCache: {
        cache: Dictionary;
      };
      /** Proxy to the IndexDB database */
      db: any;
      didFinish: TypedFunction;
      fileCache: Record<string, ObsidianFileCache>;
      /**
       * returns a key/value store where _keys_ are the **tags** and the
       * values are a count of how many times this tag is being used.
       */
      getTags: SyncFunction<[], Record<string, number>>;
      inProgressTaskCount: number;
      initialized: boolean;
      linkResolverQueue: any;
      /**
       * I believe this keyed off of the hash value from `fileCache`
       */
      metadataCache: Record<string, ObsidianMetadataCache>;
    };
  };
  isMobile: boolean;
  keymap: {
    modifiers: string;
    prevScopes: ObsidianScope[];
    rootScope: ObsidianScope;
    scope: ObsidianScope;
  };
  lastEvent: any;
  metadataCache: {
    app: any;
    blockCache: {
      cache: Dictionary;
    };
    db: any;
    didFinish: TypedFunction;
    /**
     * A key/value where the _keys_ are fully qualified file paths
     * and the values are an `ObsidianFileCache` entry which contains:
     *
     * - a modified time
     * - a size
     * - a hash code
     */
    fileCache: Record<string, ObsidianFileCache>;
    /**
     * returns a key/value store where _keys_ are the **tags** and the
     * values are a count of how many times this tag is being used.
     */
    getTags: SyncFunction<[], Record<string, number>>;
    inProgressTaskCount: number;
    initialized: boolean;
    linkResolverQueue: any;
    /**
     * A key/value store who's _keys_ are the hash value found in
     * `fileCache`; the values are a `ObsidianMetadataCache` entry
     * that includes:
     *
     * - frontmatter
     * - frontmatterLinks
     * - tags
     *
     * and more.
     */
    metadataCache: Record<string, ObsidianMetadataCache>;
    onCleanCacheCallbacks: unknown[];
    /**
     * A dictionary who's _keys_ are a path to a file in the vault.
     * The value is another key/value store:
     *
     * -
     */
    resolvedLinks: Record<Path, Record<Path, number>>;
    /**
     * provides a means to lookup a filename like `foobar.md` and
     * get back the file paths which resolve to that filename.
     */
    uniqueFileLookup: {
      data: Map<string, { key: string; value: TFile }[]>;
    };
    unresolvedLinks: any;
    userIgnoreFilterCache: any;
    userIgnoreFilters: any;
    userIgnoreFiltersString: any;
    vault: any;
  };

  metadataTypeManager: ObsidianMetadataTypeManager;
  mobileNavbar: null | unknown;
  mobileToolbar: null | unknown;
  nextFrameEvents: unknown[];
  nextFrameTimer: null | unknown;
  plugins: ObsidianPlugins;

  registerQuitHook: SyncFunction;

  scope: ObsidianScope;
  /**
   * appears to be settings largely for the Modal dialog
   */
  setting: {
    activeTab: null | unknown;
    activeTabCloseable: null | unknown;
    dimBackground: boolean;
    /** modal background */
    bgEl: HTMLDivElement;
    bgOpacity: `${number}`;
    communityPluginTabContainer: HTMLDivElement;
    communityPluginTabHeaderGroup: HTMLDivElement;
    /** the tabs container */
    containerEl: HTMLDivElement;
    /**  the Modal header element */
    headerEl: HTMLDivElement;

    lastTabId: string;
    modalEl: HTMLDivElement;

    shouldAnimate: boolean;
    shouldRestoreSelection: boolean;

    /** the Modal title element */
    titleEl: HTMLDivElement;

    scope: ObsidianScope;
  };
  shareReceiver: any;
  statusBar: {
    containerEl: HtmlElement;
    [key: string]: unknown;
  };
  /** Opens **Obsidian**'s Vault Chooser dialog */
  openVaultChooser: SyncFunction<[], void>;

  /** the title of Obsidian, something like `obsidian - Obsidian v1.x.y` */
  title: string;

  vault: ObsidianVault;
  viewRegistry: ObsidianViewRegistry;
  workspace: Workspace;
} & App;
