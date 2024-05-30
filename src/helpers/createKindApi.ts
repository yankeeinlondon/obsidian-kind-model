import KindModelPlugin from "main";
import { TFile } from "obsidian";
import { DataArray, DvPage } from "types/dataview_types";
import { Tag } from "types/general";

/**
 * **KindApi**`<TKind>`
 * 
 * The API surface provided on the plugin which provides useful
 * utility functions and data properties that are more general in nature 
 * than the API provided as part of the `KindPage` type (which is quite 
 * specific to the page being worked on).
 */
export interface KindApi {
	/**
	 * **kind_definitions**
	 * 
	 * A `DataArray` of pages which are **kind definitions**.
	 */
	kind_definitions: DataArray<DvPage>;

	/**
	 * **untagged_kind_definitions**
	 * 
	 * In the case where a kind definition simply has the `#kind` tagging
	 * without giving a reference name such as `#kind/foobar`.
	 */
	untagged_kind_definitions: DataArray<DvPage>;

	/**
	 * **kind_definitions_missing_kind_prop**
	 * 
	 * a `DataArray` of kind definitions which _do_ self identify with
	 * the `#kind` tag but the property `kind` should be set (typically
	 * to the **Kind** _kind definition_)
	 */
	kind_definitions_missing_kind_prop: DataArray<DvPage>;

	/**
	 * **kind_pages**
	 * 
	 * A `DataArray` of pages which _are not_ **kind definitions** but rather
	 * are pages expressing their _membership_ to a known **kind definition**.
	 */
	kind_pages: DataArray<DvPage>;
	/**
	 * **type_pages**
	 * 
	 * A `DataArray` of pages which are **type** pages
	 */
	type_pages: DataArray<DvPage>;

	/**
	 * Provides a lookup function which accepts a `kind` (matches
	 * on both the "name" and the tag reference) and returns all
	 * the pages which identify as this kind.
	 */
	kind_lookup: <T extends string>(kind: T) => DvPage[];

	/**
	 * **classification_pages**
	 * 
	 * a set of `DataArray`'s for each kind of classification page.
	 */
	classification_pages: {
		category: DataArray<DvPage>;
		categories: DataArray<DvPage>;
		subcategories: DataArray<DvPage>;
	}

	/**
	 * **known_page**(file)
	 * 
	 * Checks whether the request file is a "kinded page" (aka,
	 * any page which points to a "kind definition" or the definition
	 * itself).
	 */
	known_page: (file: string | TFile) => boolean;

	/**
	 * A list of all the **kind** _names_ / _references_.
	 * 
	 * For example:
	 * - a kind definition with the tag `#kind/software` would have a reference
	 * name of "software"
	 */
	kind_names: () => string[];

	/**
	 * A list of all the **tags** which identify a _kinded type_.
	 * 
	 * **Note:** 
	 * - in cases where a kind definition does not explicitly 
	 */
	kind_tags: () => string[];

	/**
	 * **subcategories_of**(cat)
	 * 
	 * Provides a list of subcategories for a given category.
	 */
	subcategories_of: (cat: string) => string[];

	/**
	 * **addPage**(page)
	 * 
	 * Evaluates the page and then updates the lists and lookup properties
	 * managed by this plugin.
	 */
	addPage: (page: DvPage) => void;
	/**
	 * **removePage**(page)
	 * 
	 * Evaluates the page and then updates the lists and lookup properties
	 * managed by this plugin.
	 */
	removePage: (page: DvPage) => void;
	/**
	 * **modifyPage**(page)
	 * 
	 * Evaluates the page and then updates the lists and lookup properties
	 * managed by this plugin.
	 */
	modifyPage: (page: DvPage) => void;
}

/**
 * Produces a fully formed `KindApi` when passed in the plugin.
 */
export const createKindApi = (plugin: KindModelPlugin): KindApi => {
	let kind_definitions = plugin.dv.pages("#kind AND !#summary");
	const kind_tags = () => {
		kind_definitions.values
		.map(p => {
			return p.file.etags.values as string[];
		})
		.flat()
		.filter(i => !["#kind", "#category", "#sub-category"].includes(i));

		return pg;
	};
	let kind_pages = plugin.dv.pages(``);

	return {
		kind_definitions,
		kind_pages: plugin.dv.pages(),
		classification_pages: {
			category: plugin.dv.pages(""),
			subcategories:  plugin.dv.pages(""),
			categories:  plugin.dv.pages(""),
		},

		kind_names: () => {
			const names: string[] = [];
			for (const k of createKindApi(plugin).kind_definitions) {
				names.push(k.file.name);
			}

			return names
		},

		kind_tags,
	}
};
