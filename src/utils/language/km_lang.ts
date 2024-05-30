import {javascript} from "@codemirror/lang-javascript";
import {LanguageSupport, syntaxTree} from "@codemirror/language";
import { km_autocomplete } from "utils/language/autocomplete";

/**
 * The `km` language model is built on top of the Javascript syntax
 * but includes autocompletion support for query syntax.
 */
export function km_lang() {
	const js = javascript({jsx:false, typescript: true});
	return new LanguageSupport(js.language, [km_autocomplete()]);
}
