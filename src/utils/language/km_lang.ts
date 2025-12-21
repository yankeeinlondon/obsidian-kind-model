import type KindModelPlugin from "~/main";
import { javascript } from "@codemirror/lang-javascript";
import { LanguageSupport } from "@codemirror/language";
import { km_autocomplete } from "~/utils/language/autocomplete";
import { km_linter } from "~/utils/language/km-linter";

/**
 * The `km` language model is built on top of the Javascript syntax
 * but includes autocompletion support for query syntax and inline validation.
 *
 * Returns a LanguageSupport instance that can be registered
 * with Obsidian's editor via `registerEditorExtension()`.
 *
 * Features:
 * - Handler name autocomplete
 * - Option key autocomplete
 * - Scalar value autocomplete (e.g., known kinds for Kind handler)
 * - Real-time syntax validation
 * - Red underlines for errors with hover tooltips
 * - Quick fix actions for common errors
 */
export function km_lang(plugin: KindModelPlugin) {
  const js = javascript({ jsx: false, typescript: true });
  return new LanguageSupport(js.language, [km_autocomplete(plugin), km_linter()]);
}
