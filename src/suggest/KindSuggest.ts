/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	MarkdownView,
} from "obsidian";

import KindModelPlugin from "~/main";
import { getPageInfo } from "~/page";
import { PageInfo } from "~/types";
import { isValidURL } from "~/utils";

const electron = (window as any).require("electron");
const { clipboard } = electron;

const commands = [
	"PageEntry()",
	"Page()",
	"BackLinks()",
	'Kind("kind","opt:category","opt:subcategory")',
];

export class KindSuggest extends EditorSuggest<string> {
	plugin: KindModelPlugin;

	constructor(app: App, plugin: KindModelPlugin) {
		super(app);
		this.plugin = plugin;
		plugin.debug("KindSuggest instantiated");
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
	): EditorSuggestTriggerInfo | null {
		const currentLine = editor.getLine(cursor.line);
		const priorLine = editor.getLine(Math.max(cursor.line - 1, 0));
		const beforeCursor = currentLine.substring(0, cursor.ch);
		const words = currentLine.split(/\s+/);
		const lastWord = words.pop() || "";
		const lastWordLoc = currentLine.indexOf(lastWord);
		this.plugin.info(`lastWord: ${lastWord}`, isValidURL(lastWord));

		// const isUrl = ["https://", "http://"].some((i) =>
		// 	lastWord.startsWith(i),
		// );

		if (isValidURL(lastWord)) {
			return {
				start: {
					line: cursor.line,
					ch: lastWordLoc,
				},
				end: cursor,
				query: currentLine,
			};
		}

		const completeKindQuery =
			priorLine.includes("km") &&
			currentLine.length > 0 &&
			commands.some((c) => c.startsWith(currentLine));

		if (completeKindQuery) {
			return {
				start: {
					line: cursor.line,
					ch: 0,
				},
				end: cursor,
				query: currentLine,
			};
		}

		// console.log(`feeling triggerred(${beforeCursor}): ${priorLine}`);

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

	getSuggestions(ctx: EditorSuggestContext): string[] {
		let suggestions: string[] = [];

		this.plugin.info("getting suggestions", {
			query: ctx.query,
			isUrl: isValidURL(ctx.query.trim()),
		});

		if (
			ctx.query.length > 0 &&
			commands.some((i) => i.startsWith(ctx.query))
		) {
			const suggestions = commands.filter((c) => c.startsWith(ctx.query));

			return suggestions;
		}

		if (isValidURL(ctx.query.trim())) {
			this.plugin.info("is URL");
			const suggestions = [
				`Add the URL "${ctx.query.trim()}" as frontmatter property 🤘`,
				`Convert to a markdown link 🔗`,
				`Leave raw URL "as is"`,
			];

			return suggestions;
		} else {
			this.plugin.info("not URL", ctx.query.trim());
		}

		const file = this.context?.file;
		if (file) {
			const page = getPageInfo(this.plugin)(file) as PageInfo;
			let isReallyImportant = false;

			const clipboardText = clipboard.readText();
			const hasURLInClipboard = ["https://", "http://"].some((i) =>
				clipboardText.startsWith(i),
			);

			const allCommands = [
				...(page.isKindedPage ||
				page.isCategoryPage ||
				page.isSubcategoryPage ||
				page.isKindDefnPage
					? ["Update Kind Page 😊"]
					: []),
			];
			const query = ctx.query.toLowerCase();

			if (file) {
				const metadata = this.app.metadataCache.getFileCache(file);
				if (metadata && metadata.frontmatter) {
					isReallyImportant =
						metadata.frontmatter.isReallyImportant === true;
				}
			}

			// Filter suggestions based on the query
			suggestions = [
				...allCommands.filter((cmd) =>
					cmd.toLowerCase().includes(query),
				),
				...(hasURLInClipboard
					? [`Paste the URL "${clipboardText}" as 🚀`]
					: []),
			];

			// Adjust the ordering if isReallyImportant is true
			if (isReallyImportant) {
				const insertDateIndex = suggestions.findIndex(
					(cmd) => cmd === "Insert Date",
				);
				if (insertDateIndex > -1) {
					const [insertDateCmd] = suggestions.splice(
						insertDateIndex,
						1,
					);
					suggestions.unshift(insertDateCmd);
				}
			}
		}

		return suggestions;
	}

	renderSuggestion(suggestion: string, el: HTMLElement): void {
		el.createEl("div", { text: suggestion });
	}

	selectSuggestion(
		suggestion: string,
		_evt: MouseEvent | KeyboardEvent,
	): void {
		if (this.context) {
			const { editor, start, end, file, query } = this.context;
			const selectedText = editor.getSelection();
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const page = getPageInfo(this.plugin)(file);

			if (page && view) {
				// const ctx = {
				// 	isKindedPage: isKindedPage(this.plugin)(page),
				// 	isCategoryPage: isCategoryPage(this.plugin)(page),
				// 	isSubcategoryPage: isSubcategoryPage(this.plugin)(page),
				// };

				this.plugin.info("Suggestion", suggestion);

				switch (suggestion) {
					case "Update":
						editor.exec("update-kinded-model" as any);
						break;

					case "Bold":
						if (selectedText) {
							editor.replaceSelection(`**${selectedText}**`);
						} else {
							editor.replaceRange("****", start, end);
							editor.setCursor({
								line: start.line,
								ch: start.ch + 2,
							});
						}
						break;
					case "Italic":
						if (selectedText) {
							editor.replaceSelection(`*${selectedText}*`);
						} else {
							editor.replaceRange("**", start, end);
							editor.setCursor({
								line: start.line,
								ch: start.ch + 1,
							});
						}
						break;
					case "Underline":
						if (selectedText) {
							editor.replaceSelection(`<u>${selectedText}</u>`);
						} else {
							editor.replaceRange("<u></u>", start, end);
							editor.setCursor({
								line: start.line,
								ch: start.ch + 3,
							});
						}
						break;
					case "Insert Date":
						editor.replaceRange(
							new Date().toLocaleDateString(),
							start,
							end,
						);
						break;
					case "Link":
						if (selectedText) {
							const url = prompt("Enter URL:");
							if (url) {
								editor.replaceSelection(
									`[${selectedText}](${url})`,
								);
							}
						} else {
							const text = prompt("Enter Link Text:") || "";
							const url = prompt("Enter URL:") || "";
							editor.replaceRange(
								`[${text}](${url})`,
								start,
								end,
							);
						}
						break;
					case "Convert to a markdown link 🔗":
						editor.replaceRange(`[${query}](${query})`, start, end);
						break;

					default:
						if (commands.includes(selectedText.trim())) {
							//
						} else {
							editor.replaceRange(suggestion, start, end);
						}

						break;
				}
			} else {
				this.plugin.debug(
					`The selectSuggestion() method was triggered but couldn't create a PageInfo structure (or possibly a view for page)!`,
					file,
					view,
					page,
				);
			}
		} else {
			this.plugin.debug(
				`The selectSuggestion() method was triggered but no context was provided on instantiated class!`,
				this,
			);
		}
	}
}
