import { stripLeading } from "inferred-types";
import { obApp } from "~/globals";
import type KindModelPlugin from "~/main";

/**
 * Creates a list of **kind** and **type** tags.
 * 
 * - these tags are the tag name without the leading `#`
 * - the results are stored on the KindModelPlugin at
 * `kindTags` and `typeTags`
 * - use `refreshTagLists()` to refresh these lists.
 * - this is done immediately at startup and does _not_
 * require `Dataview` plugin to be initialized.
 */
export function getTagLists(p: KindModelPlugin) {
	const tags = obApp.getTags();

	p.kindTags = Object
		.keys(tags)
		.filter(
			i => i.startsWith(`#kind/`)).map(i => stripLeading(i, "#kind/")
			);
	p.typeTags = Object
		.keys(tags)
		.filter(
			i => i.startsWith(`#type/`)).map(i => stripLeading(i, "#type/")
		);
	p.info(
		`kindTags [${p.kindTags.length}] and typeTags [${p.typeTags.length}] initialized`
	);
}

/**
 * Refreshes the `kindTags` and `typeTags` properties on the 
 * `KindModelPlugin`.
 */
export function refreshTagLists(p: KindModelPlugin) {
	getTagLists(p);
}
