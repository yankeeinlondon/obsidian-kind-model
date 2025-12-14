import type KindModelPlugin from "~/main";
import type { KindFrontmatter, KindLookup, TFile } from "~/types";
import { getKindPageByTag } from "~/page/getPageKinds";

export async function refreshKindLookups(p: KindModelPlugin) {
  p.info(`refreshing Kind lookups`, {
    kindTags: p.kindTags.length,
    kindPaths: p.settings.kindPaths.length,
  });
  let changed = false;

  for (const tag of p.kindTags) {
    if (!p.kindTagLookup.has(tag)) {
      const page = getKindPageByTag(p)(tag);
      if (page) {
        changed = true;
        p.settings.kindPaths = [...p.settings.kindPaths, page.file.path];
      }
      else {
        p.warn(`the tag "${tag}" was listed in kindTags but page wasn't found!`);
      }
    }
  }

  if (p.kindTags.length !== p.settings.kindPaths.length) {
    p.info(
      `kindTags [${p.kindTags.length}] and kindPaths [${p.settings.kindPaths.length}] are unequal in length`,
    );
  }

  if (changed) {
    p.settings.kindPaths = Array.from(new Set(p.settings.kindPaths));
    p.debug(`kind lookups detected changes`);
    await p.saveSettings();
    setKindLookups(p);
  }
}

function setKindLookups(p: KindModelPlugin) {
  const o = p.api.obsidian;
  const kindPaths = p.settings.kindPaths;

  const kindFiles = kindPaths.map(
    k => o.getAbstractFileByPath(k),
  ).filter(i => i) as TFile[];

  const kindLookups = kindFiles.map(
    (k) => {
      const cache = o.getFileCache(k.path);
      const tags = cache?.tags || [];
      const defnTag = tags.find(t => t.tag.startsWith(`#kind/`))?.tag as Tag;

      return {
        path: k.path,
        name: k.basename,
        fm: cache?.frontmatter as KindFrontmatter,
        defnTag,
        tag: defnTag.split("/")[1],
      } as KindLookup;
    },
  );

  for (const l of kindLookups) {
    p.kindTagLookup.set(l.tag, l);
    p.kindPathLookup.set(l.path, l);
  }
}

/**
 * Responsible for setting the protected properties
 * of `kindTagLookup` and `kindPathLookup` to enable API
 * services which rely on quick lookups of characteristics
 * of a `Kind` definition.
 *
 * - initially loads the state from the "settings" where
 * the plugin keeps a record of paths to Kind Defn pages.
 * - once the **Dataview** plugin is available, we will
 * ensure we are in a fresh state
 */
export async function initializeKindLookups(p: KindModelPlugin) {
  setKindLookups(p);

  p.info(`kind lookups initialized [${p.settings.kindPaths.length}]`);
  await refreshKindLookups(p);
}
