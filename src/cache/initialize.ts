import type KindModelPlugin from "~/main";
import type { KindDefinition } from "~/types";
import { isTagKindDefinition } from "~/type-guards";
import { wait } from "~/utils";
import { updateKindDefinitionInCache, updateTypeDefinitionInCache } from "./update";

async function findStaleByTag(p: KindModelPlugin) {
  const kinds = p.dv.pages(`#kind`)
    .where(k => k.file?.etags?.some(i => i.startsWith(`#kind/`)));
  const types = p.dv.pages(`#type`)
    .where(k => k.file?.etags?.some(i => i.startsWith(`#type/`)));

  const problems: string[] = [];

  for (const pg of kinds) {
    const kp = p.dv.page(pg.file.path);
    if (kp) {
      updateKindDefinitionInCache(p)(kp);
      p.debug(`caching by file path ${kp.file.path}`);
    }
    else {
      p.warn(`Page missing kind tag`, { pg });
    }
  }

  for (const pg of types) {
    const kp = p.dv.page(pg.file.path);
    if (kp) {
      updateTypeDefinitionInCache(p)(kp);
      p.debug(`caching by file path ${kp.file.path}`);
    }
    else {
      p.warn(`Page missing kind tag`, { pg });
    }
  }

  p.settings.kinds = Array.from(
    p.cache.kindDefinitionsByTag.values(),
  );
  p.settings.types = Array.from(
    p.cache.typeDefinitionsByTag.values(),
  );

  p.saveSettings();

  if (problems.length > 0) {
    p.warn(`${problems.length} problems loading cache`, "failed to insert the following elements into cache", problems);
  }
}

export async function initializeKindCaches(p: KindModelPlugin) {
  const kinds: KindDefinition[] = Array.isArray(p.settings?.kinds)
    ? p.settings?.kinds
    : [];
  const types: KindDefinition[] = Array.isArray(p.settings?.types)
    ? p.settings?.types
    : [];
  p.info(
    `cache updated with user settings`,
    `${kinds.length} kinds defined in user settings`,
    `${types.length} types defined in user settings`,
  );

  // iterate through Kind Definitions which are found in settings file
  for (const kind of kinds) {
    if (isTagKindDefinition(kind)) {
      if (p.cache.kindDefinitionsByTag.has(kind.tag)) {
        if (p.cache.kindTagDuplicates.has(kind.tag)) {
          const current = p.cache.kindTagDuplicates.get(kind.tag) as Set<KindDefinition<["tag", "path"]>>;
          current?.add(kind);
          p.cache.kindTagDuplicates.set(kind.tag, current);
        }
        else {
          p.cache.kindTagDuplicates.set(
            kind.tag,
            new Set<KindDefinition<["tag", "path" | never]>>(
              [
                kind,
                p.cache.kindTagDuplicates.get(kind.tag),
              ] as KindDefinition<["tag", "path" | never]>[],
            ),
          );
        }
      }
      p.cache.kindDefinitionsByTag.set(kind.tag, kind);
    }
    if (kind.path) {
      p.cache.kindDefinitionsByPath.set(kind.path, kind);
    }
  }

  // iterate through Type Definitions which are found in settings file
  for (const t of types) {
    if (isTagKindDefinition(t)) {
      if (p.cache.kindDefinitionsByTag.has(t.tag)) {
        if (p.cache.kindTagDuplicates.has(t.tag)) {
          const current = p.cache.kindTagDuplicates.get(t.tag) as Set<KindDefinition<["tag", "path"]>>;
          current?.add(t);
          p.cache.kindTagDuplicates.set(t.tag, current);
        }
        else {
          p.cache.kindTagDuplicates.set(
            t.tag,
            new Set<KindDefinition<["tag", "path" | never]>>(
              [
                t,
                p.cache.kindTagDuplicates.get(t.tag),
              ] as KindDefinition<["tag", "path" | never]>[],
            ),
          );
        }
      }
      p.cache.kindDefinitionsByTag.set(t.tag, t);
    }
    if (t.path) {
      p.cache.kindDefinitionsByPath.set(t.path, t);
    }
  }

  p.info(`Kind (${kinds.length}) and Type (${types.length}) Lookups cached`);

  await wait(100);

  // remainder can be done async
  return Promise.all([
    // findStaleByPath(p),
    findStaleByTag(p).then(() => p.info("Cache refreshed")),
  ]);
}
