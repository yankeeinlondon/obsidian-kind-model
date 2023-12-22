
import {  Editor, MarkdownView,  Notice, Plugin } from 'obsidian';
import { getAPI } from "obsidian-dataview";
import { SettingsTab} from './settings/SettingsTab';
import { DataArray, DataViewApi, PageRef } from './types/dataview-types';
import { KindModelSettings } from 'types/settings-types';
import { DEFAULT_SETTINGS } from './utils/Constants'
import { Logger, logger } from './utils/logging';
import { update_kinded_page } from './commands/update_kinded_page';
import App from "./App.vue";
import {createApp} from "vue"

export default class KindModelPlugin extends Plugin {
	settings: KindModelSettings;
	/** the Dataview API surface */
	public dv: DataViewApi;

  public debug: Logger["debug"];
  public info: Logger["info"];
  public warn: Logger["warn"];
  public error: Logger["error"];
	
	async kinds(): Promise<DataArray<PageRef>> {
		if(!this.dv) {
			this.warn("Call to dataview API before it was ready!", "Will wait 100ms and try again");
			await sleep(100);
			if (this.dv) {
				this.info(`Dataview API is now available after wait.`);
			} else {
				this.error(`Problem using Dataview API while getting kinds!`)
				throw new Error(`Problem using Dataview API while getting kinds!`)
			}
		}

		const pages = this.dv.pages(`#kind AND !#category AND !#sub-category AND "${this.settings.kind_folder}"`)
			.sort(p => p.file.name );
			
			return pages;
	}

	async onload() {
		await this.loadSettings();
		const log = logger(this.settings.log_level);
		const { debug, info, warn, error } = log;
		this.debug = debug;
		this.info = info;
		this.warn = warn;
		this.error = error;

		this.dv = getAPI(this.app);

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
			const find = new RegExp(`^${kind_folder}\$`);
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
			const find = new RegExp(`^${kind_folder}\$`);
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

