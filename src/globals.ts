import type {
  App,
  Modal as ModalType,
  PluginManifest,
  Plugin as PluginType,
  Command,
  EditorCommandName,
  Workspace,
} from "obsidian";
import type * as Electron from "electron";
import { AsyncFunction } from "inferred-types";
import { ObsidianApp, TFile, TFolder } from "./types";

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

/** a dictionary of all loaded plugins  */
export const obsidianPlugins = (globalThis as any).app.plugins
  .plugins as Record<string, PluginType>;

/** a dictionary of commands and editor commands in **Obsidian** */
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
