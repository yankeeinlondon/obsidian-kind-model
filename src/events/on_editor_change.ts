import KindModelPlugin from "main";

/**
 * Does some simple find and replace on an editor which has changed.
 * Features include: `::quote()`, `::warn()`, and emoji's with `((name))`
 */
export const on_editor_change = (plugin: KindModelPlugin) => {
	plugin.registerEvent(
		plugin.app.workspace.on(
			'editor-change', 
			(editor, _info) => {
				// this.warn(`editor change:`, {editor, info});
				let content = editor.getValue();
				
				const attributed = /\n::\s*quote\s*\(\s*"(.+?)"\s{0,1},\s{0,1}"(.+?)"\s*\)/sg;
				const quote = /\n::\s{0,1}quote\s{0,1}\("(.+?)"\s*\)/sg;
				const warn = /\n::\s{0,1}warn\s{0,1}\("(.+?)"\s*\)/sg;
				const warnWithCode = /\n::\s*warn\s*\(\s*"(.+?)"\s{0,1},\s{0,1}(.+?)\s*\)/sg;
				const err = /\n::\s{0,1}err(or){0,1}\s{0,1}\("(.+?)"\s*\)/sg;
				const errWithCode = /\n::\s*err(or){0,1}\s*\(\s*"(.+?)"\s{0,1},\s{0,1}(.+?)\s*\)/sg;

				const cur = editor.getCursor()
				if(attributed.test(content)) {
					const text = content.replaceAll(attributed, `\n> [!quote] ${"$1".trim()}\n> - $2\n\n`);
					editor.setValue(text);
					editor.setCursor({ch: 0, line: cur.line+2});
					content = editor.getValue();
				}
				if(quote.test(content)) {
					const text = content.replaceAll(quote, `\n> [!quote] ${"$1".trim()}\n`);
					editor.setValue(text);
					editor.setCursor(cur);
					editor.setCursor({ch: 0, line: cur.line+1});
					content = editor.getValue();
				}
				// Warnings
				if(warnWithCode.test(content)) {
					const text = content.replaceAll(warnWithCode, `\n> [!warning] Warning [ ${"$3".trim()} ]\n> - $1\n\n`);
					editor.setValue(text);
					editor.setCursor({ch: 0, line: cur.line+2});
					content = editor.getValue();
				}
				if(warn.test(content)) {
					const text = content.replaceAll(warn, `\n> [!warning] ${"$1".trim()}\n`);
					editor.setValue(text);
					editor.setCursor({ch: 0, line: cur.line+1});
					content = editor.getValue();
				}

				// Errors
				if(errWithCode.test(content)) {
					const text = content.replaceAll(errWithCode, `\n> [!error] Error [ ${"$3".trim()} ]\n> <li style="color: #F38BA8">$2</li>\n\n`);
					editor.setValue(text);
					editor.setCursor({ch: 0, line: cur.line+2});
					content = editor.getValue();
				}
				if(err.test(content)) {
					const text = content.replaceAll(err, `\n> [!error] ${"$2".trim()}\n`);
					editor.setValue(text);
					editor.setCursor({ch: 0, line: cur.line+1});
					content = editor.getValue();
				}

				// Emoji's
				const emoji_lookup = {
					"thumbs-up": "👍",
					"thumbs-down": "👎",
					"sunglasses": "😎",
					"smile": "😄",
					"rocket": "🚀"
				};
				const emoji_pattern = /\(\(\s*(smile|thumbs-up|sunglasses){1}\s*\)\)/s;

				if(emoji_pattern.test(content)) {
					plugin.warn("emoji detected", emoji_pattern.test(content))
					while (emoji_pattern.test(content)) {
						const match = content.match(emoji_pattern);
						plugin.warn("match:", match)
						if(match) {
							const [all, first, next] = match;
							plugin.debug("emoji pattern", { all, first, next, match})
							const replacement = `<span class="emoji">${emoji_lookup[first as keyof typeof emoji_lookup]}</span>`;
							content = content.replace(emoji_pattern, replacement)
						}
					}
					
					editor.setValue(content);
					editor.setCursor({ch: 0, line: cur.line+1});
				}
				
			}
		)
	);
}
