import { 
	App, 
	Editor, 
	EditorPosition, 
	EditorSuggest, 
	EditorSuggestContext, 
	EditorSuggestTriggerInfo, 
	MarkdownView,
} from "obsidian"
import { isCategoryPage, isKindedPage, isSubcategoryPage } from "~/api/buildingBlocks";
import KindModelPlugin from "~/main"
import { getPage, getPageInfo } from "~/page";
import { PageInfo } from "~/types";
import { isValidURL } from "~/utils"

const electron = (window as any).require('electron');
const { clipboard } = electron;


export class KindSuggest extends EditorSuggest<string> {
	plugin: KindModelPlugin;

	constructor(app: App, plugin: KindModelPlugin) {
		super(app);
		this.plugin = plugin;
		plugin.debug("KindSuggest instantiated");
	}


	onTrigger(
		cursor: EditorPosition, 
		editor: Editor
	): EditorSuggestTriggerInfo | null {
		const currentLine = editor.getLine(cursor.line);
		const beforeCursor = currentLine.substring(0, cursor.ch);

		const isUrl = ["https://", "http://"].some(i => currentLine.startsWith(i));

		if(isUrl) {
			return {
				start: {
					line: cursor.line,
					ch: 0
				},
				end: cursor,
				query: currentLine
			}
		}


		console.log(`feeling triggerred(${beforeCursor})`);

		const match = beforeCursor.match(/\/([^\s]*)$/);
		if (match) {
			return {
				start: {
					line: cursor.line,
					ch: cursor.ch - match[1].length - 1,
				},
				end: cursor,
				query: match[1],
			};
		}
		
		return null;
	}

	getSuggestions(context: EditorSuggestContext): string[] {
		let suggestions: string[] = [];

		this.plugin.info("getting suggestions", { query: context.query });

		const file = this.context?.file;
		if(file) {
			const page = getPageInfo(this.plugin)(file) as PageInfo;
			let isReallyImportant = false;
	
			const clipboardText = clipboard.readText();
			const hasURLInClipboard = ["https://", "http://"].some(i => clipboardText.startsWith(i));
	
			const allCommands = [
				...(
					page.isKindedPage || page.isCategoryPage || page.isSubcategoryPage || page.isKindDefnPage
						? ['Update Kind Page 😊']
						: []
				),
			];
			const query = context.query.toLowerCase();
	
			if (file) {
				const metadata = this.app.metadataCache.getFileCache(file);
				if (metadata && metadata.frontmatter) {
					isReallyImportant = metadata.frontmatter.isReallyImportant === true;
				}
			}
	
			// Filter suggestions based on the query
			suggestions = [
				...allCommands.filter((cmd) =>
					cmd.toLowerCase().includes(query)
				),
				...(
					hasURLInClipboard 
						? [`Paste the URL "${clipboardText}" as 🚀`]
						: []
				)
			];
	
			// Adjust the ordering if isReallyImportant is true
			if (isReallyImportant) {
				const insertDateIndex = suggestions.findIndex(
					(cmd) => cmd === 'Insert Date'
				);
				if (insertDateIndex > -1) {
					const [insertDateCmd] = suggestions.splice(insertDateIndex, 1);
					suggestions.unshift(insertDateCmd);
				}
			}
		}

		return suggestions;
	}

	renderSuggestion(suggestion: string, el: HTMLElement): void {
		el.createEl('div', { text: suggestion });
	}

	selectSuggestion(
		suggestion: string, 
		evt: MouseEvent | KeyboardEvent
	): void {
		if (this.context) {
			const { editor, start, end, file } = this.context;
			const selectedText = editor.getSelection();
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const page = getPageInfo(this.plugin)(file);

			if (page && view) {
				const ctx = {
					isKindedPage: isKindedPage(this.plugin)(page),
					isCategoryPage: isCategoryPage(this.plugin)(page),
					isSubcategoryPage: isSubcategoryPage(this.plugin)(page),
				};

				switch (suggestion) {
					case "Update":
						editor.exec("update-kinded-model" as any)
						break;

					case 'Bold':
						if (selectedText) {
							editor.replaceSelection(`**${selectedText}**`);
						} else {
							editor.replaceRange('****', start, end);
							editor.setCursor({ line: start.line, ch: start.ch + 2 });
						}
						break;
					case 'Italic':
						if (selectedText) {
							editor.replaceSelection(`*${selectedText}*`);
						} else {
							editor.replaceRange('**', start, end);
							editor.setCursor({ line: start.line, ch: start.ch + 1 });
						}
						break;
					case 'Underline':
						if (selectedText) {
							editor.replaceSelection(`<u>${selectedText}</u>`);
						} else {
							editor.replaceRange('<u></u>', start, end);
							editor.setCursor({ line: start.line, ch: start.ch + 3 });
						}
						break;
					case 'Insert Date':
						editor.replaceRange(
							new Date().toLocaleDateString(),
							start,
							end
						);
						break;
					case 'Link':
						if (selectedText) {
							const url = prompt('Enter URL:');
							if (url) {
							editor.replaceSelection(`[${selectedText}](${url})`);
							}
						} else {
							const text = prompt('Enter Link Text:') || '';
							const url = prompt('Enter URL:') || '';
							editor.replaceRange(`[${text}](${url})`, start, end);
						}
						break;
					default:
						editor.replaceRange(suggestion, start, end);
						break;
				}
			} else {
				this.plugin.debug(`The selectSuggestion() method was triggered but couldn't create a PageInfo structure (or possibly a view for page)!`, file, view, page);
			}

		} else {
			this.plugin.debug(`The selectSuggestion() method was triggered but no context was provided on instantiated class!`, this)
		}
	}
}
