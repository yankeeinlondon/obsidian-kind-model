
import {  Editor, MarkdownView,  Notice, Plugin } from 'obsidian';
import { getAPI } from "obsidian-dataview";
import { SettingsTab} from './config-ui/SettingsTab';
import {  DataViewQueryApi } from './types/dataview_types';
import {  KindModelSettings } from './types/settings_types';
import { DEFAULT_SETTINGS } from './utils/Constants'
import { Logger, logger } from './utils/logging';
import { update_kinded_page } from './commands/update_kinded_page';
import App from "./App.vue";
import {createApp} from "vue"
import { api } from './utils/base_api/api';
import { KindDefinition, KindPage } from './types/PageContext';
import { initialize_cache } from './utils/on_load/initialize_cache';
import { Tag } from "./types/general";

export interface KindCache {
	/**
	 * Kind definitions
	 */
	kinds: Map<string, KindDefinition>,
	/** 
	 * **pages**
	 * 
	 * A dictionary of `KindedPage` types for each relevant page which
	 * Kind Model is aware of. The dictionaries keys represent the
	 * fully qualified path to the page.
	 */
	pages: Map<string, KindPage>,
	/**
	 * **tag_lookup**
	 * 
	 * A dictionary where any tag being used in **Kind Model** can be
	 * looked up and an array of _paths_ to pages will be returned.
	 * 
	 * **Note:** the tag's name is the index for the lookup and _should not_ contain
	 * a leading `#` symbol.
	 */
	tag_lookup: Map<string, Set<string>>,

	kind_lookup: Map<string, Set<string>>,

	/**
	 *  **name_lookup**
	 * 
	 * Provides the ability to provide just the "name" of a page and
	 * a Set of fully qualified paths will be returned (note: typically 
	 * this should just be one).
	 */
	name_lookup: Map<string, Set<string>>,

	kind_tags: Set<Tag>
}


export default class KindModelPlugin extends Plugin {
	settings: KindModelSettings;
	/** the Dataview API surface */
	public dv: DataViewQueryApi;
	public api: ReturnType<typeof api>;

	public debug: Logger["debug"];
	public info: Logger["info"];
	public warn: Logger["warn"];
	public error: Logger["error"];

	public get_cache(): KindCache | null {
		return this.settings.cache?.pages
			? this.settings.cache
			: null;
	}

	/**
	 * provides a boolean flag which indicates whether this plugin's 
	 * cache is complete and therefore other operations which depend
	 * on this can proceed.
	 */
	public get ready() {
		return this.settings.cache && this.settings.cache?.pages !== null
	}

	/**
	 * Setup this plugin on the "onload" event from Obsidian
	 */
	async onload() {
		await this.loadSettings();
		const log = logger(this.settings.log_level);
		const { debug, info, warn, error } = log;
		this.debug = debug;
		this.info = info;
		this.warn = warn;
		this.error = error;

		// expose the Dataview API
		this.dv = getAPI(this.app);
		// expose Kind Model API
		this.api = api(this);

		initialize_cache(this);

		this.addCommand({
			id: "create-new-kinded-page",
			name: "create a new (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				info("create-new-kinded-page", {content})
			},
		});
		this.addCommand({
			id: "create-new-classification-page",
			name: "add a classification for a (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				info("create-new-classification-page", {content});
			},
		});

		this.addCommand({
			id: "add-url-props-for-kinded-page",
			name: "add links to (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				info("add-url-props-for-kinded-page", {content})
			},
		});

		this.addCommand({
			id: "update-kinded-page",
			name: "update this (kinded) page",
			editorCallback: update_kinded_page(this)
		});

		this.registerEvent(this.app.vault.on('delete', evt => {
			const kind_folder = this.settings.kind_folder;
			const find = new RegExp(`^${kind_folder}$`);
			if (find.test(evt.path)) {
				new Notice('Kind file deleted');
			}
		}));
		this.registerEvent(this.app.vault.on('modify', evt => {
			const kind_folder = this.settings.kind_folder;
			const find = new RegExp(`^${kind_folder}`);
			if (find.test(evt.path)) {
				new Notice('Kind file modified');
			}
		}));
		this.registerEvent(this.app.vault.on('create', evt => {
			const kind_folder = this.settings.kind_folder;
			const find = new RegExp(`^${kind_folder}$`);
			if (find.test(evt.path)) {
				new Notice('Kind file added');
			}
		}));

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Kind Models');
		statusBarItemEl.addClass("clickable");

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		this.info(`Kind Model has reloaded`);
		
		this.mount();
	}

	mount() {
    createApp(App, {
      app: this.app
    }).mount(document.body.createDiv())
  }

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		const { debug,  error } = logger(this.settings.log_level);
		if(typeof this.saveData !== "function") {
			error("the 'this' context appear to have been lost when trying to call saveSettings()", this)
			return
		} else {
			debug("saving settings", this.settings);
		}
		await this.saveData(this.settings);
	}
}

