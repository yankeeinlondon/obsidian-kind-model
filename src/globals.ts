import type * as Electron from "electron";
import type { AsyncFunction, LuxonJs, SemanticVersion, SyncFunction, TypedFunction } from "inferred-types";
import type {
  App,
  Command,
  EditorCommandName,
  PluginManifest,
  Plugin as PluginType,
  Workspace,
} from "obsidian";
import type {
  DvPageCacheEntry,
  ObsidianApp,
  ObsidianMetadataCache,
  TFile,
  TFolder,
} from "./types";
import { isDefined } from "inferred-types";
import { isTFile, isTFolder } from "./type-guards";

/**
 * returns the **moment** library which Obsidian provides to the
 * global namespace.
 */
export const moment = globalThis.moment;

export type Moment = ReturnType<typeof moment>;

/**
 * The `App` instance of **Obsidian** exposed as a global.
 * Returns undefined when running outside Obsidian (e.g., in tests).
 */
export function app(): ObsidianApp | undefined {
  return (globalThis as any).app as ObsidianApp | undefined;
}

/** Scope for Obsidian's Suggestion Modals (lazy evaluation for test safety) */
export function getScope() {
  return app()?.scope;
}
/** @deprecated Use getScope() instead */
export const Scope = undefined as ReturnType<typeof getScope>;

/** the **Obsidian** `Plugin` class */
export const Plugin = typeof window !== "undefined"
  ? (window as any).Plugin as {
      new(app: App, manifest: PluginManifest): PluginType;
      prototype: PluginType;
    }
  : undefined;

/** a dictionary of all loaded community plugins (lazy evaluation for test safety) */
export function getCommunityPlugins() {
  return app()?.plugins?.plugins;
}

/** a dictionary of all loaded core plugins (lazy evaluation for test safety) */
export function getCorePlugins() {
  return app()?.internalPlugins?.plugins;
}

/** a dictionary of commands and editor commands in **Obsidian** (lazy evaluation) */
export function getObsidianCommands() {
  const appInstance = app();
  return appInstance
    ? {
        commands: appInstance.commands?.commands as Record<string, Command> | undefined,
        editorCommands: appInstance.commands?.editorCommands as Record<EditorCommandName, Command> | undefined,
      }
    : undefined;
}

/**
 * the **Obsidian** `fileManager` (lazy evaluation)
 */
export function getObsidianFileManager() {
  return app()?.fileManager as {
    fileParentCreatorByType: Record<string, any>;
    inProgressUpdates: any;
    updateQueue: AsyncFunction;
    linkUpdaters: any;
  } | undefined;
}

export type Path = string;

/**
 * A `fileMap` lookup provided by **Obsidian** which maps
 * both _files_ and _directories_ to a `TFile`/`TFolder` representation.
 * (lazy evaluation)
 */
export function getFileMap() {
  return app()?.vault?.fileMap as Record<Path, TFile | TFolder> | undefined;
}

/**
 * The **Obsidian** vault (lazy evaluation)
 */
export function getVault() {
  return app()?.vault;
}

/**
 * the **Obsidian** workspace (lazy evaluation):
 *
 * - spliting such as `leftSplit()`, `rightSplit()`
 * - ribbon control with `leftRibbon()`, `rightRibbon()`
 * - access to the **containerEl**
 * - readiness states such as `layoutReady`
 * - also hooks like `onLayoutReady()`
 *
 * and much more.
 */
export function getWorkspace() {
  return app()?.workspace as Workspace | undefined;
}

/**
 * The **Obsidian** hotKeyManager taken from the global
 * runtime object. (lazy evaluation)
 */
export function getHotKeyManager() {
  return app()?.hotKeyManager;
}

/**
 * The **electron** app exposed as a global
 */
export const electron = (globalThis as any).electron as {
  clipboard: Electron.Clipboard;
  ipcRenderer: Electron.IpcRenderer;
  nativeImage: Electron.NativeImage;
  contextBridge: Electron.ContextBridge;
  crashReporter: Electron.CrashReporter;
  shell: Electron.Shell;
  webFrame: Electron.WebFrame;
  webUtils: Electron.WebUtils;
  remote: {
    BaseWindow: Electron.BaseWindow;
    BrowserView: Electron.BrowserView;
    BrowserWindow: Electron.BrowserWindow;
    ImageView: any;
    Menu: Electron.Menu;
    MenuItem: Electron.MenuItem;
    MessageChannelMain: Electron.MessageChannelMain;
    Notification: Electron.Notification;
    ShareMenu: Electron.ShareMenu;
    TopLevelWindow: any;
    TouchBar: Electron.TouchBar;
    Tray: Electron.Tray;
    View: Electron.View;
    WebContentsView: Electron.WebContentsView;
    app: Electron.App;
    autoUpdater: Electron.AutoUpdater;
    clipboard: Electron.Clipboard;
    contentTracing: Electron.ContentTracing;
    crashReporting: Electron.CrashReporter;
    createFunctionWithReturnValue: any;
    desktopCapturer: Electron.DesktopCapturer;
    dialog: Electron.Dialog;
    getBuiltin: any;
    getCurrentWebContents: Electron.WebContents;
    getCurrentWindow: any;
    screen: Electron.Screen;
    session: Electron.Session;
    shell: Electron.Shell;
    systemPreferences: Electron.SystemPreferences;
  };
};

/**
 * An API surface providing many of the commonly used
 * runtime API endpoints from **Obsidian**.
 *
 * Uses getters for lazy evaluation to support test environments.
 */
export const obApp = {
  get commands() {
    return getObsidianCommands();
  },
  get vault() {
    return getVault();
  },
  get hotKeyManager() {
    return getHotKeyManager();
  },
  get fileMap() {
    return getFileMap();
  },
  get workspace() {
    return getWorkspace();
  },
  get plugins() {
    return {
      /** core **Obsidian** plugins */
      core: getCorePlugins(),
      /** community plugins */
      community: getCommunityPlugins(),
    };
  },
  get views() {
    return app()?.viewRegistry;
  },

  /**
   * Opens Obsidian's Vault Chooser dialog
   */
  get openVaultChooser() {
    return app()?.openVaultChooser;
  },
  get isMobile() {
    return app()?.isMobile;
  },

  get metadataTypeManager() {
    return app()?.metadataTypeManager;
  },

  get embedByExtension() {
    return app()?.embedRegistry?.embedByExtension;
  },

  /**
   * returns a key/value store where _keys_ are the **tags** and the
   * values are a count of how many times this tag is being used.
   */
  getTags() {
    return app()?.metadataCache?.getTags();
  },

  /**
   * Returns the file for the current view if it's a FileView.
   * Otherwise, it will return the most recently active file.
   */
  getCurrentFile() {
    return app()?.workspace?.getActiveFile() as TFile | undefined;
  },

  /**
   * Returns the most recent workspace `Leaf` where
   * possible.
   */
  getMostRecentLeaf() {
    return app()?.workspace?.getMostRecentLeaf();
  },

  /**
   * Provides a list of _in-vault_ links which are "resolved" (
   * aka, the pages they point to already exist)
   */
  resolvedLinksFor(filepath: string) {
    const resolvedLinks = app()?.metadataCache?.resolvedLinks;
    if (!resolvedLinks || !(filepath in resolvedLinks)) {
      return [];
    }
    return Object.keys(resolvedLinks[filepath]);
  },

  /**
   * Provides a list of pages that link TO the given filepath (inlinks/backlinks).
   * Uses MetadataCache directly for fresh data.
   *
   * Note: This iterates through all resolved links which is O(n) but provides
   * fresh data compared to Dataview's potentially stale cache.
   */
  inlinksFor(filepath: string): Path[] {
    const resolvedLinks = app()?.metadataCache?.resolvedLinks;
    if (!resolvedLinks) {
      return [];
    }
    const inlinks: Path[] = [];

    for (const sourcePath in resolvedLinks) {
      const targets = resolvedLinks[sourcePath];
      if (filepath in targets) {
        inlinks.push(sourcePath);
      }
    }

    return inlinks;
  },

  /**
   * Provides a list of _in-vault_ links which are "unresolved" (
   * aka, the pages they point to don't yet exist)
   */
  unresolvedLinksFor(filepath: string): Path[] {
    const unresolvedLinks = app()?.metadataCache?.unresolvedLinks;
    if (!unresolvedLinks || !(filepath in unresolvedLinks)) {
      return [];
    }
    return Object.keys(unresolvedLinks[filepath]);
  },

  /**
   * Resolves a unique path for the attachment file being saved.
   * Ensures that the parent directory exists and dedupes the
   * filename if the destination filename already exists.
   *
   * @param filename Name of the attachment being saved
   * @param sourcePath The path to the note associated with this attachment, defaults to the workspace's active file.
   * @returns Full path for where the attachment should be saved, according to the user's settings
   */
  get getAvailablePathForAttachment() {
    return app()?.fileManager?.getAvailablePathForAttachment;
  },

  uniqueFileLookup(filename: string): TFile[] {
    const results = app()?.metadataCache?.uniqueFileLookup?.data?.get(filename);

    return isDefined(results)
      ? results.map(r => r.value)
      : [];
  },

  /**
   * Atomically read, modify, and save the frontmatter of a note. The
   * frontmatter is passed in as a JS object, and should be mutated
   * directly to achieve the desired result. Remember to handle errors
   * thrown by this method.
   *
   * @param file — the file to be modified. Must be a Markdown file.
   * @param fn — a callback function which mutates the frontmatter
   * object synchronously.
   * @param options — write options.
   * @throws — YAMLParseError if the YAML parsing fails
   * @throws — any errors that your callback function throws
   *
   * ```ts
   * app.fileManager.processFrontMatter(file, (frontmatter) => {
   *     frontmatter['key1'] = value;
   *     delete frontmatter['key2'];
   * });
   * ```
   */
  get processFrontmatter() {
    return app()?.fileManager?.processFrontMatter;
  },

  /**
   * A key/value lookup where the _keys_ are fully qualified file paths
   * and the values are an `ObsidianFileCache` entry which contains:
   *
   * - a modified time
   * - a size
   * - a hash code
   */
  get fileCache() {
    return app()?.metadataCache?.fileCache;
  },

  /**
   * A key/value store who's keys are the hash value found in fileCache; the
   * values are a ObsidianMetadataCache entry that includes:
   *
   * - frontmatter
   * - frontmatterLinks
   * - tags
   * - and more.
   */
  get metaData() {
    return app()?.metadataCache?.metadataCache;
  },

  /**
   * Gets an `TAbstractFile` representation of a _file_ or
   * _folder_ in the current vault.
   */
  getAbstractFileByPath(path: string) {
    return app()?.vault?.getAbstractFileByPath(path);
  },

  /**
   * Gets an `TFile` representation in the current vault.
   */
  getFileByPath(path: string) {
    const abstract = app()?.vault?.getAbstractFileByPath(path);
    return isTFile(abstract)
      ? abstract
      : null;
  },

  /**
   * Gets an `TFolder` representation in the current vault.
   */
  getFolderByPath(path: string) {
    const abstract = app()?.vault?.getAbstractFileByPath(path);
    return isTFolder(abstract)
      ? abstract
      : null;
  },

  /**
   * Provided a fully qualified file path, this function will
   * return a `ObsidianMetadataCache` entry for the file.
   */
  getFileCache(file: Path): ObsidianMetadataCache | undefined {
    const fileCache = app()?.metadataCache?.fileCache;
    const metaCache = app()?.metadataCache?.metadataCache;
    if (!fileCache || !metaCache) {
      return undefined;
    }
    if (file in fileCache) {
      const lookup = fileCache[file];
      if (lookup.hash in metaCache) {
        return metaCache[lookup.hash];
      }
    }

    return undefined;
  },
};

interface LuxonDateTime {
  new(): LuxonJs["DateTime"];
  prototype: LuxonJs["DateTime"];
}

/**
 * The **Dataview** API surface exposed to the runtime's global object
 */
export const dvApi = (globalThis as any).DataviewAPI as {
  evaluationContext: any;
  func: Record<string, TypedFunction> & {
    any: TypedFunction;
    all: TypedFunction;
    array: TypedFunction;
    average: TypedFunction;
  };
  index: {
    csv: any;
    etags: any;
    importer: any;
    indexVersion: SemanticVersion;
    initialized: boolean;
    links: {
      invMap: Map<string, Set<string>>;
      map: Map<string, string>;
    };
    onChange: SyncFunction<[]>;
    pages: Map<string, DvPageCacheEntry>;
    /** local storage cache */
    persister: any;
    prefix: any;
    starred: {
      onUpdate: SyncFunction<[]>;
      _loaded: boolean;
      stars: Set<string>;
    };
    tags: {
      delegate: {
        map: Map<string, string>;
        invMap: Map<string, Set<string>>;
      };
    };
  };
  luxon: {
    VERSION: SemanticVersion;
    DateTime: LuxonDateTime;
    Duration: any;
    FixedOffsetZone: any;
    IANAZone: any;
    Info: any;
    Interval: any;
    InvalidZone: any;
    Settings: any;
    SystemZone: any;
    Zone: any;
  };
  settings: {
    allowHtml: boolean;
    /** @default "dataviewjs" */
    dataviewJsKeyword: string;
    /** @default "MMMM dd, yyyy" */
    defaultDateFormat: string;
    defaultDateTimeFormat: string;
    enableDataviewJs: boolean;
    enableInlineDataview: boolean;
    enableInlineDataviewJs: boolean;
    /** @default "$=" */
    inlineJsQueryPrefix: string;
    inlineQueriesInCodeblocks: boolean;
    /** @default "=" */
    inlineQueryPrefix: string;
    maxRecursiveRenderDepth: number;
    prettyRenderInlineFields: boolean;
    recursiveSubTaskCompletion: boolean;
    refreshEnabled: boolean;
    refreshInterval: number;
    renderNullAs: string;
    showResultCount: true;
    tableGroupColumnName: string;
    tableIdColumnName: string;
    taskCompletionText: string;
    taskCompletionTracking: boolean;
    taskCompletionUseEmojiSHorthand: boolean;
    warnOnEmptyResult: boolean;
  };
  value: {
    compareValues: SyncFunction;
    deepCopy: SyncFunction;
    isArray: SyncFunction<[test: unknown], boolean>;
    isBoolean: SyncFunction<[test: unknown], boolean>;
    isDate: SyncFunction<[test: unknown], boolean>;
    isDuration: SyncFunction<[test: unknown], boolean>;
    isFunction: SyncFunction<[test: unknown], boolean>;
    isHtml: SyncFunction<[test: unknown], boolean>;
    isLink: SyncFunction<[test: unknown], boolean>;
    [key: string]: SyncFunction;
  };
  widget: {
    externalLink: SyncFunction<[url: string, display: string]>;
    isBuiltin: SyncFunction<[test: unknown], boolean>;
    isExternalLink: SyncFunction<[test: unknown], boolean>;
    listPair: SyncFunction<[key: string, value: unknown]>;
  };

};

export const obsidianCssStyle = (variable: string) => {
  if (typeof document === "undefined") {
    return "";
  }
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
};
