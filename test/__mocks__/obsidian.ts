/**
 * Mock for the obsidian module used in tests.
 *
 * The obsidian package doesn't export anything at npm resolution time -
 * it's provided by the Obsidian runtime. This mock provides stubs for
 * the classes and functions that are imported in the source code.
 */

// Mock App interface
export interface App {
  vault: any;
  workspace: any;
  metadataCache: any;
  keymap: any;
  scope: any;
  fileManager: any;
  lastEvent: any;
}

// Mock Plugin class
export class Plugin {
  app: App;
  manifest: PluginManifest;

  constructor(app: App, manifest: PluginManifest) {
    this.app = app;
    this.manifest = manifest;
  }

  loadData(): Promise<any> {
    return Promise.resolve({});
  }

  saveData(data: any): Promise<void> {
    return Promise.resolve();
  }

  addCommand(command: any): any {
    return command;
  }

  addSettingTab(tab: any): void {}

  registerMarkdownCodeBlockProcessor(
    language: string,
    handler: any,
    sortOrder?: number
  ): any {
    return {};
  }

  registerEvent(event: any): void {}

  addStatusBarItem(): HTMLElement {
    return document.createElement("div");
  }
}

// Mock PluginManifest
export interface PluginManifest {
  id: string;
  name: string;
  author: string;
  version: string;
  minAppVersion: string;
  description: string;
  dir?: string;
  authorUrl?: string;
  isDesktopOnly?: boolean;
}

// Mock Modal class
export class Modal {
  app: App;
  containerEl: HTMLElement;
  contentEl: HTMLElement;
  modalEl: HTMLElement;
  titleEl: HTMLElement;

  constructor(app: App) {
    this.app = app;
    this.containerEl = document.createElement("div");
    this.contentEl = document.createElement("div");
    this.modalEl = document.createElement("div");
    this.titleEl = document.createElement("div");
  }

  open(): void {}
  close(): void {}
  onOpen(): void {}
  onClose(): void {}
}

// Mock PluginSettingTab class
export class PluginSettingTab {
  app: App;
  plugin: Plugin;
  containerEl: HTMLElement;

  constructor(app: App, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = document.createElement("div");
  }

  display(): void {}
  hide(): void {}
}

// Mock Setting class
export class Setting {
  settingEl: HTMLElement;
  infoEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.settingEl = document.createElement("div");
    this.infoEl = document.createElement("div");
    this.nameEl = document.createElement("div");
    this.descEl = document.createElement("div");
    this.controlEl = document.createElement("div");
  }

  setName(name: string): this { return this; }
  setDesc(desc: string): this { return this; }
  setClass(cls: string): this { return this; }
  setTooltip(tooltip: string): this { return this; }
  setHeading(): this { return this; }
  setDisabled(disabled: boolean): this { return this; }
  addButton(cb: (button: any) => any): this { return this; }
  addExtraButton(cb: (button: any) => any): this { return this; }
  addToggle(cb: (toggle: any) => any): this { return this; }
  addText(cb: (text: any) => any): this { return this; }
  addTextArea(cb: (textArea: any) => any): this { return this; }
  addMomentFormat(cb: (momentFormat: any) => any): this { return this; }
  addDropdown(cb: (dropdown: any) => any): this { return this; }
  addColorPicker(cb: (colorPicker: any) => any): this { return this; }
  addSlider(cb: (slider: any) => any): this { return this; }
  addSearch(cb: (search: any) => any): this { return this; }
  then(cb: (setting: this) => any): this { return this; }
  clear(): this { return this; }
}

// Mock Notice class
export class Notice {
  noticeEl: HTMLElement;

  constructor(message: string | DocumentFragment, timeout?: number) {
    this.noticeEl = document.createElement("div");
  }

  setMessage(message: string | DocumentFragment): this { return this; }
  hide(): void {}
}

// Mock getIcon function
export function getIcon(iconId: string): SVGSVGElement | null {
  return null;
}

// Mock types (these are just type exports, not runtime values)
export type TFile = {
  path: string;
  name: string;
  basename: string;
  extension: string;
  stat: { ctime: number; mtime: number; size: number };
  vault: any;
  parent: TFolder | null;
};

export type TFolder = {
  path: string;
  name: string;
  vault: any;
  parent: TFolder | null;
  children: (TFile | TFolder)[];
  isRoot(): boolean;
};

export type TAbstractFile = TFile | TFolder;

export interface MarkdownView {
  file: TFile | null;
  editor: any;
  getViewType(): string;
  getDisplayText(): string;
}

export interface MarkdownPostProcessorContext {
  docId: string;
  sourcePath: string;
  frontmatter: any;
  addChild(child: any): void;
  getSectionInfo(el: HTMLElement): any;
}

export interface Component {
  load(): void;
  onload(): void;
  unload(): void;
  onunload(): void;
  addChild<T extends Component>(child: T): T;
  removeChild<T extends Component>(child: T): T;
  register(cb: () => any): void;
  registerEvent(eventRef: any): void;
  registerDomEvent<K extends keyof WindowEventMap>(
    el: Window,
    type: K,
    callback: (this: HTMLElement, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  registerInterval(id: number): number;
}

export interface ISuggestOwner<T> {
  renderSuggestion(value: T, el: HTMLElement): void;
  selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
}

export interface ButtonComponent {
  buttonEl: HTMLButtonElement;
  setButtonText(name: string): this;
  setIcon(icon: string): this;
  setClass(cls: string): this;
  setTooltip(tooltip: string): this;
  setDisabled(disabled: boolean): this;
  setWarning(): this;
  setCta(): this;
  removeCta(): this;
  onClick(callback: () => any): this;
}

export interface Editor {
  getDoc(): any;
  getValue(): string;
  setValue(content: string): void;
  getLine(line: number): string;
  setLine(line: number, text: string): void;
  lineCount(): number;
  lastLine(): number;
  getCursor(string?: "from" | "to" | "head" | "anchor"): { line: number; ch: number };
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  replaceSelection(replacement: string, origin?: string): void;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }, origin?: string): void;
  getRange(from: { line: number; ch: number }, to: { line: number; ch: number }): string;
}

export interface WorkspaceLeaf {
  view: any;
  getViewState(): any;
  setViewState(viewState: any, eState?: any): Promise<void>;
}

export interface Pos {
  start: { line: number; col: number; offset: number };
  end: { line: number; col: number; offset: number };
}

export interface RequestUrlParam {
  url: string;
  method?: string;
  contentType?: string;
  body?: string | ArrayBuffer;
  headers?: Record<string, string>;
  throw?: boolean;
}

export interface Tasks {
  // Mock tasks interface
}

export type Command = {
  id: string;
  name: string;
  callback?: () => any;
  checkCallback?: (checking: boolean) => boolean | void;
  editorCallback?: (editor: Editor, view: MarkdownView) => any;
  editorCheckCallback?: (checking: boolean, editor: Editor, view: MarkdownView) => boolean | void;
  hotkeys?: any[];
};

export type EditorCommandName = string;

export interface Workspace {
  getActiveFile(): TFile | null;
  getActiveViewOfType<T>(type: any): T | null;
  getMostRecentLeaf(): WorkspaceLeaf | null;
  getLeaf(newLeaf?: boolean | string): WorkspaceLeaf;
  on(name: string, callback: (...args: any[]) => any, ctx?: any): any;
  off(name: string, callback: (...args: any[]) => any): void;
  trigger(name: string, ...data: any[]): void;
  onLayoutReady(callback: () => any): void;
  iterateAllLeaves(callback: (leaf: WorkspaceLeaf) => any): void;
}

// Export empty object as default for any default imports
export default {};
