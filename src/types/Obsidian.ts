import type {
  AlphaChar,
  AlphaNumericChar,
  Dictionary,
  NonZeroNumericChar,
  SemanticVersion,
  SpecialChar,
  StringDelimiter,
  TypedFunction,
  UrlPath,
} from "inferred-types";

import type { EventRef, Stat, Vault } from "obsidian";
import type { Tag } from ".";

export interface TFile extends TAbstractFile {
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

export interface TFolder extends TAbstractFile {
  /**
   * files in the directory
   */
  children: TAbstractFile[];

  /**
   * is the root of the vault
   */
  isRoot: () => boolean;
}

/**
 * This can be either a `TFile` or a `TFolder`.
 */
export interface TAbstractFile {
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
   * the name without the file extension
   */
  basename: string;

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
  ) => void) &
  (<K extends keyof DocumentEventMap>(
    el: Document,
    type: K,
    callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) => void) &
  (<K extends keyof HTMLElementEventMap>(
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
  ) => void) &
  ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => void);
  removeEventListener: (<K extends keyof SVGSVGElementEventMap>(
    type: K,
    listener: (this: ObsidianSvgElement, ev: SVGSVGElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) => void) &
  ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) => void);
}

export type ObsidianModifier = "Mod" | "Alt" | "";
export type ObsidianKey =
  | `F${NonZeroNumericChar}`
  | "UpArrow"
  | "DownArrow"
  | "LeftArrow"
  | "RightArrow"
  | AlphaNumericChar;

export type GetIconFromObsidian = (iconId: string) => ObsidianSvgElement | null;
export interface ObsidianHotKey {
  key: ObsidianKey;
  modifiers: ObsidianModifier[];
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

export type ObsidianFrontmatterValue =
  | string
  | string[]
  | number[]
  | number
  | boolean
  | null;

export type ObsidianSectionType =
  | "yaml"
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

export interface ObsidianApp {
  appId: string;
  appMenuBarManager: any;
  commands: {
    app: any;
    commands: Record<ObsidianCommandKey, ObsidianCommandProps>;
    editorCommands: Record<ObsidianCommandKey, ObsidianCommandProps>;
    executeCommand: TypedFunction;
  };
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
    };
  };

  fileManager: {
    app: any;
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
  hotKeyManager: any;
  internalPlugins: {
    plugins: Record<string, any>;
    isMobile: boolean;
    keyMap: any;
    lastEvent: null | unknown;
    metadataCache: {
      app: any;
      blockCache: {
        cache: Dictionary;
      };
      db: any;
      didFinish: TypedFunction;
      fileCache: Record<string, ObsidianFileCache>;
      getTags: TypedFunction;
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
  keymap: any;
  lastEvent: any;
  metadataCache: {
    app: any;
    blockCache: {
      cache: Dictionary;
    };
    db: any;
    didFinish: TypedFunction;
    fileCache: Record<string, ObsidianFileCache>;
    getTags: TypedFunction;
    inProgressTaskCount: number;
    initialized: boolean;
    linkResolverQueue: any;
    /**
     * I believe this keyed off of the hash value from `fileCache`
     */
    metadataCache: Record<string, ObsidianMetadataCache>;
    onCleanCacheCallbacks: unknown[];
    resolvedLinks: any;
    uniqueFileLookup: any;
    unresolvedLinks: any;
    userIgnoreFilterCache: any;
    userIgnoreFilters: any;
    userIgnoreFiltersString: any;
    vault: any;
  };

  metadataTypeManager: any;
  mobileNavbar: null | unknown;
  mobileToolbar: null | unknown;
  nextFrameEvents: unknown[];
  nextFrameTimer: null | unknown;
  plugins: any;
  scope: any;
  setting: any;
  shareReceiver: any;
  statusBar: any;
  title: string;

  vault: {
    adaptor: ObsidianAdaptor;
    fileMap: Record<string, ObsidianMappedFile>;
    /**
     * Retrieves a file or folder in the vault by its path.
     * @param path - The path to the file or folder, relative to the vault root.
     * @returns A TAbstractFile if found, or null if not found.
     */
    getAbstractFileByPath: (path: string) => TAbstractFile | null;
  };
  viewRegistry: any;
  workspace: {
    activeEditor: any;
    activeLeaf: any;
    activeTabGroup: any;
    app: any;
    backlinkInDocument: any;
    containerEl: HTMLElement;
    editorExtensions: any[];
    editorSuggest: any;
    floatingSplit: any;
    hoverLinkSources: any;
    lastActiveFile: any;
    lastTabGroupStacked: boolean;
    layoutItemQueue: any[];
    layoutReady: boolean;
    leftRibbon: any;
    leftSidebarToggleButtonEl: HTMLElement;
    leftSplit: any;
    mobileFileInfos: any[];
    onLayoutReadCallbacks: any;
    protocolHandlers: Map<string, TypedFunction>;
    recentFileTracker: any;
    requestActiveLeafEvents: TypedFunction;
    requestResize: TypedFunction;
    requestSaveLayout: TypedFunction;
    requestUpdateLayout: TypedFunction;
    rightRibbon: any;
    rightSidebarToggleButtonEl: HTMLElement;
    rightSplit: any;
    scope: any;
    setActiveLeaf: TypedFunction;
    undoHistory: any[];
  };
}
