import type { DataViewApi, DvPage } from "./types/dataview_types";
import type { KindModelSettings } from "./types/settings_types";
import type { Logger } from "./utils/logging";
import { Plugin } from "obsidian";
import { getAPI } from "obsidian-dataview";
import { add_commands } from "~/commands/index";
// import App from "./App.vue";
import { api } from "./api/api";
import { SettingsTab } from "./config-ui/SettingsTab";

import {
  codeblockParser,
  on_file_created,
  on_file_deleted,
  on_file_modified,
  on_layout_change,
  on_tab_change,
} from "./events";
import { on_editor_change } from "./events/on_editor_change";
import { csv } from "./events/on_load/csv";
import { DEFAULT_SETTINGS } from "./utils/Constants";
import { logger } from "./utils/logging";
import { getDefnPages, getTagLists } from "./startup";
import { runAfterDataviewReady } from "./startup/runAfterDataviewReady";

export default class KindModelPlugin extends Plugin {
  public settings: KindModelSettings;
  /** the Dataview API surface */
  public dv: DataViewApi = (globalThis as any).DataviewAPI as DataViewApi;
  public api: ReturnType<typeof api>;

  public log: Logger;
  public debug: Logger["debug"];
  public info: Logger["info"];
  public warn: Logger["warn"];
  public error: Logger["error"];

  /** the master Kind definition (aka, `#kind/kind`) */
  public kindDefn: DvPage | undefined;
  /** the master Type definition (aka, `#type/type`) */
  public typeDefn: DvPage | undefined;

  /**
   * The status of the Dataview plugin's index/readiness
   */
  public dvStatus: "initializing" | "ready" = "initializing"

  /** all the valid kind tags known in the vault */
  public kindTags: string[];

  /** all the valid type tags known in the vault */
  public typeTags: string[];

  /**
   * allows a Task to be run with a guarentee that the Dataview
   * index is ready for the query.
   */
  public deferQueryUntilReady: ReturnType<typeof runAfterDataviewReady>;

  /**
   * Setup this plugin on the "onload" event from Obsidian
   */
  async onload() {
    await this.loadSettings();

    const log = logger(this.settings.log_level);
    log.info("starting plugin");
    const { debug, info, warn, error } = log;
    this.log = log;
    this.debug = debug;
    this.info = info;
    this.warn = warn;
    this.error = error;

	this.deferQueryUntilReady = runAfterDataviewReady(this);
	getTagLists(this);
	getDefnPages(this);

    // this.registerEditorSuggest(new KindSuggest(this.app, this));


    // expose the Dataview API
    this.dv = getAPI(this.app);
    // expose Kind Model API
    this.api = api(this);

    csv(this);
    on_editor_change(this);
    add_commands(this);
    // file events
    on_file_deleted(this);
    on_file_created(this);
    on_file_modified(this);
    on_layout_change(this);
    on_tab_change(this);

    // `km` code blocks
    codeblockParser(this);

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const kindEl = this.addStatusBarItem();
    kindEl.setText(`${this.kindTags.length} Kinds`);
    kindEl.addClass("clickable");

	const typeEl = this.addStatusBarItem();
    typeEl.setText(`${this.typeTags.length} Types`);
    typeEl.addClass("clickable");


    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingsTab(this.app, this));

    log.info(`loaded plugin, dataview is ${this.dvStatus}`);

    this.mount();
	if(this.dvStatus !== "ready") {
		this.deferQueryUntilReady(() => log.info("Dataview completed indexing"))
	}
  }

  mount() {
    // Vue.createApp(App, {
    // app: this.app
    // }).mount(document.body.createDiv())
  }

  onunload() {
    //
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    const { info, error } = logger(this.settings.log_level);
    if (typeof this.saveData !== "function") {
      error(
        "the 'this' context appear to have been lost when trying to call saveSettings()",
        this,
      );
      return;
    }

    await this.saveData(this.settings);
    info("saved user settings", this.settings);
  }
}
