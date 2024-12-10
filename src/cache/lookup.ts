import type KindModelPlugin from "~/main";
import type { KindDefinition } from "~/types";
import { stripLeading } from "inferred-types";

/**
 * Looks for _kind definition_ in cache based on a tag passed in
 */
export function lookupKindByTag(p: KindModelPlugin) {
  return (tag: string) => {
    const t = stripLeading(tag, "#");
    return p.cache.kindDefinitionsByTag.get(t) as
      | KindDefinition<["tag", "path" | never]>
      | undefined;
  };
}

/**
 * Looks for _type definition_ in cache based on a tag passed in
 */
export function lookupTypeByTag(p: KindModelPlugin) {
  return (tag: string) => {
    const t = stripLeading(tag, "#");
    return p.cache.typeDefinitionsByTag.get(t) as
      | KindDefinition<["tag", "path" | never]>
      | undefined;
  };
}

export function lookupKnownKindTags(p: KindModelPlugin) {
  const tags = Array.from(p.cache.kindDefinitionsByTag.keys());

  return tags;
}
