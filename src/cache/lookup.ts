import { stripLeading } from "inferred-types";
import KindModelPlugin from "~/main";
import { KindDefinition } from "~/types";

/**
 * Looks for _kind definition_ in cache based on a tag passed in
 */
export const lookupKindByTag = (p: KindModelPlugin) => (tag: string) => {
	const t = stripLeading(tag, "#");
	return p.cache.kindDefinitionsByTag.get(t) as
		| KindDefinition<["tag", "path" | never]>
		| undefined;
};

/**
 * Looks for _type definition_ in cache based on a tag passed in
 */
export const lookupTypeByTag = (p: KindModelPlugin) => (tag: string) => {
	const t = stripLeading(tag, "#");
	return p.cache.typeDefinitionsByTag.get(t) as
		| KindDefinition<["tag", "path" | never]>
		| undefined;
};

export const lookupKnownKindTags = (p: KindModelPlugin) => {
	const tags = Array.from(p.cache.kindDefinitionsByTag.keys());

	return tags;
};
