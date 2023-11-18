
import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { getAPI } from "obsidian-dataview";
import { SettingsTab, PluginSettings} from 'settings/Settings';
import { DEFAULT_SETTINGS } from 'utils/Constants'



export default class KindModel extends Plugin {
	settings: PluginSettings;

	private dv: ReturnType<typeof getAPI>;

	async onload() {
		await this.loadSettings();
		this.dv = getAPI(this.app);
		
		// plugin.registerEvent(plugin.app.metadataCache.on("dataview:index-ready", () => {
		// 	this.registerEvent(this.app.vault.on('create', (f) => {
		// 		console.log('a new file has entered the arena', f)
		// 	}));

		// 	console.log("Kind Model ready (now that dataview is ready)");

		// });

		this.addCommand({
			id: "create-new-kinded-page",
			name: "create a new (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				const page = this.dv.page(view.file?.path);

			},
		});
		this.addCommand({
			id: "create-new-classification",
			name: "add a classification for a (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				const page = this.dv.page(view.file?.path);

			},
		});

		this.addCommand({
			id: "add-url-props-for-kinded-page",
			name: "add links to (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				const page = this.dv.page(view.file?.path);

			},
		});

		this.addCommand({
			id: "update-kinded-page",
			name: "update this (kinded) page",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const content = view.getViewData();
				const page = this.dv.page(view.file?.path);

				console.log("Kind Page (update):",  {editor, view: view.getViewType(), content,  basename: view.file?.basename, path: view.file?.path, name: view.file?.name});
				console.log(`page info (${view.file?.name}):`, page);
				
			},
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

		// this.registerEvent(this.app.vault.on('delete', (f) => {
    //   console.log('a file has been recklessly thrown to the stern', f);
		// 	new MessageModal(this.app, `a file has been recklessly thrown to the stern: ${f.name}`).open();
    // }));

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Kind Models');
		statusBarItemEl.addClass("clickable");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)', 
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

