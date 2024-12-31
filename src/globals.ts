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
import type { DataViewApi, DvPageCacheEntry, ObsidianApp, ObsidianMetadataCache, TFile, TFolder } from "./types";
import { isDefined } from "inferred-types";

/**
 * returns the **moment** library which Obsidian provides to the
 * global namespace.
 */
export const moment = globalThis.moment;

export type Moment = ReturnType<typeof moment>;

/**
 * The `App` instance of **Obsidian** exposed as a global
 */
export const app = () => (globalThis as any).app as ObsidianApp;

/** Scope for Obsidian's Suggestion Modals */
export const Scope = app().scope;

/** the **Obsidian** `Plugin` class */
export const Plugin = (window as any).Plugin as {
  new (app: App, manifest: PluginManifest): PluginType;
  prototype: PluginType;
};

/** a dictionary of all loaded community plugins  */
export const communityPlugins = app().plugins.plugins;

export const corePlugins = app().internalPlugins.plugins;

/** a dictionary of commands and editor commands in **Obsidian */
export const obsidianCommands = {
  commands: (globalThis as any).app.commands.commands as Record<
    string,
    Command
  >,
  editorCommands: (globalThis as any).app.commands.editorCommands as Record<
    EditorCommandName,
    Command
  >,
};

/**
 * the **Obsidian** `fileManager`
 */
export const obsdianFileManager = (globalThis as any).app.fileManager as {
  fileParentCreatorByType: Record<string, any>;
  inProgressUpdates: any;
  updateQueue: AsyncFunction;
  linkUpdaters: any;
};

export type Path = string;

/**
 * A `fileMap` lookup provided by **Obsidian** which maps
 * both _files_ and _directories_ to a `TFile`/`TFolder` representation.
 */
export const fileMap = (globalThis as any).app.vault.fileMap as Record<
  Path,
  TFile | TFolder
>;

/**
 * The **Obsidian** vault
 */
export const vault = app().vault;

/**
 * the **Obsidian** workspace:
 *
 * - spliting such as `leftSplit()`, `rightSplit()`
 * - ribbon control with `leftRibbon()`, `rightRibbon()`
 * - access to the **containerEl**
 * - readiness states such as `layoutReady`
 * - also hooks like `onLayoutReady()`
 *
 * and much more.
 */
export const workspace = app().workspace as Workspace;

/**
 * The **Obsidian** hotKeyManager taken from the global
 * runtime object.
 */
export const hotKeyManager = app().hotKeyManager;

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
 */
export const obApp = {
  commands: obsidianCommands,
  vault,
  hotKeyManager,
  fileMap,
  workspace,
  plugins: {
    /** core **Obsidian** plugins */
    core: corePlugins,
    /** community plugins */
    community: communityPlugins,
  },
  views: app().viewRegistry,

  openVaultChooser: app().openVaultChooser,
  isMobile: app().isMobile,

  metadataTypeManager: app().metadataTypeManager,

  embedByExtension: app().embedRegistry.embedByExtension,

  /**
   * returns a key/value store where _keys_ are the **tags** and the
   * values are a count of how many times this tag is being used.
   */
  getTags() {
    return app().metadataCache.getTags();
  },

  /**
   * Provides a list of _in-vault_ links which are "resolved" (
   * aka, the pages they point to already exist)
   */
  resolvedLinksFor(filepath: string) {
    return filepath in app().metadataCache.resolvedLinks
      ? Object.keys(app().metadataCache.resolvedLinks[filepath])
      : [];
  },

  /**
   * Provides a list of _in-vault_ links which are "unresolved" (
   * aka, the pages they point to don't yet exist)
   */
  unresolvedLinksFor(filepath: string): Path[] {
    return filepath in app().metadataCache.unresolvedLinks
      ? Object.keys(app().metadataCache.unresolvedLinks[filepath])
      : [];
  },

  uniqueFileLookup(filename: string): TFile[] {
    const results = app().metadataCache.uniqueFileLookup.data.get(filename);

    return isDefined(results)
      ? results.map(r => r.value)
      : [];
  },

  /**
   * A key/value lookup where the _keys_ are fully qualified file paths
   * and the values are an `ObsidianFileCache` entry which contains:
   *
   * - a modified time
   * - a size
   * - a hash code
   */
  fileCache: app().metadataCache.fileCache,

  /**
   * Provided a fully qualified file path, this function will
   * return a `ObsidianMetadataCache` entry for the file.
   */
  getFileCache(file: Path): ObsidianMetadataCache | undefined {
    const fileCache = app().metadataCache.fileCache;
    const metaCache = app().metadataCache.metadataCache;
    if (file in fileCache) {
      const lookup = fileCache[file];
      if (lookup.hash in metaCache) {
        return metaCache[lookup.hash];
      }
    }

    return undefined;
  },

};

type LuxonDateTime =  {
	new (): LuxonJs["DateTime"];
	prototype: LuxonJs["DateTime"];
  };

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
			map: Map<string,string>;
		},
		onChange: SyncFunction<[]>;
		pages: Map<string, DvPageCacheEntry>;
		/** local storage cache */
		persister: any;
		prefix: any;
		starred: {
			onUpdate: SyncFunction<[]>;
			_loaded: boolean;
			stars: Set<string>;
		}
		tags: {
			delegate: {
				map: Map<string,string>;
				invMap: Map<string, Set<string>>;
			}
		}
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
	}
	value: {
		compareValues: SyncFunction;
		deepCopy: SyncFunction;
		isArray: SyncFunction<[test:unknown], boolean>;
		isBoolean: SyncFunction<[test:unknown], boolean>;
		isDate: SyncFunction<[test:unknown], boolean>;
		isDuration: SyncFunction<[test:unknown], boolean>;
		isFunction: SyncFunction<[test:unknown], boolean>;
		isHtml: SyncFunction<[test:unknown], boolean>;
		isLink: SyncFunction<[test:unknown], boolean>;
		[key: string]: SyncFunction;
	};
	widget: {
		externalLink: SyncFunction<[url: string, display: string]>;
		isBuiltin: SyncFunction<[test: unknown], boolean>;
		isExternalLink: SyncFunction<[test: unknown], boolean>;
		listPair: SyncFunction<[key: string, value: unknown]>;
	}


};


