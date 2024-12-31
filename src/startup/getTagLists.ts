import { stripLeading } from "inferred-types";
import { obApp } from "~/globals";
import KindModelPlugin from "~/main";

export function getTagLists(p: KindModelPlugin) {
	const tags = obApp.getTags();
    p.kindTags = Object.keys(tags).filter(i => i.startsWith(`#kind/`)).map(i => stripLeading(i, "#kind/"));
    p.typeTags = Object.keys(tags).filter(i => i.startsWith(`#type/`)).map(i => stripLeading(i, "#type/"));
}

export function refreshTagLists(p: KindModelPlugin) {
	getTagLists(p);
}
