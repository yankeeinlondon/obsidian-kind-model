import type KindModelPlugin from "~/main";
import { toKeyValue } from "inferred-types";
import { TFile } from "obsidian";
import { isPageReference } from "~/type-guards";
import { asMdLink } from "~/utils";

/**
 * higher order function which interacts with **Obsidian** to remove
 * a property from a page's frontmatter.
 */
export function removeFmKey(p: KindModelPlugin) {
  return (path: string) =>
  /**
		 *  Removes the specified `key` from the current page.
		 */
    async (key: string) => {
      const abstractFile = p.app.vault.getAbstractFileByPath(path);

      if (abstractFile instanceof TFile) {
        const file = abstractFile as TFile;
        try {
          await p.app.fileManager.processFrontMatter(file, (frontmatter) => {
            delete frontmatter[key];
          });

          p.debug(
            `Frontmatter key '${key}' removed successfully from file: ${path}`,
          );
        }
        catch (error) {
          p.error("Error removing frontmatter key:", error);
        }
      }
      else {
        p.error(`File "${path}" not found or is a folder.`);
      }
    };
}
/**
 * Sorts the keys of page's Frontmatter to make more consistent
 */
export function sortFmKeys(p: KindModelPlugin) {
  return (path: string) => {
    // TODO: add options for sorting
    return async () => {
      const abstractFile = p.app.vault.getAbstractFileByPath(path);
      if (abstractFile instanceof TFile) {
        const file = abstractFile as TFile;
        await p.app.fileManager.processFrontMatter(file, (fm) => {
          const top = [
            "type",
            "kind",
            "kinds",
            "category",
            "categories",
            "subcategory",
            "subcategories",
          ].filter(i => Object.keys(fm).includes(i));
          const bottom = [
            "desc",
            "description",
          ].filter(i => Object.keys(fm).includes(i));
          const kvs = toKeyValue(
            fm,
            o => o.toTop(
              ...top,
            ).toBottom(...bottom),
          );
          for (const key of Object.keys(fm)) {
            delete fm[key];
          }

          for (const kv of kvs) {
            fm[kv.key] = kv.value;
          }
          p.debug("sorted frontmatter", kvs);

          return fm;
        });
      }
      else {
        p.debug(`Unable to get file from path [${path}] in sortFmKeys().`);
      }
    };
  };
}

/**
 * A higher order function which interacts with **Obsidian** to set the
 * value of one of the Frontmatter's properties.
 *
 * **Note:** if a `PageReference` or array of `PageReference`s are passed in
 * as the _value_ then they will be converted to the markdown equivalent of
 * a Link.
 */
export function setFmKey(p: KindModelPlugin) {
  return (path: string) =>
  /**
		 * Sets the value of the specified **key** in the _frontmatter_ properties.
		 */
    async (key: string, value: any) => {
      const abstractFile = p.app.vault.getAbstractFileByPath(path);

      if (abstractFile instanceof TFile) {
        const file = abstractFile as TFile;

        try {
          const payload = isPageReference(value)
            ? asMdLink(p)(value)
            : Array.isArray(value) && value.every(i => isPageReference(i))
              ? value.map(i => asMdLink(p)(i))
              : value;
          await p.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[key] = payload;
          });

          p.debug(`Frontmatter updated successfully for file: ${path}`);
        }
        catch (error) {
          p.error(
            `Error updating frontmatter [${key}] for file "${path}":`,
            error,
          );
        }
      }
      else {
        console.error(`File "${path}" not found or is a folder.`);
      }
    };
}

export type FrontmatterApi<T extends string | undefined> = T extends string
  ? {
      setFmKey: ReturnType<ReturnType<typeof setFmKey>>;
      removeFmKey: ReturnType<ReturnType<typeof removeFmKey>>;
      sortFmKeys: ReturnType<ReturnType<typeof sortFmKeys>>;
    }
  : {
      setFmKey: ReturnType<typeof setFmKey>;
      removeFmKey: ReturnType<typeof removeFmKey>;
      sortFmKeys: ReturnType<typeof sortFmKeys>;
    };

/**
 * Provides an API surface to modify Frontmatter properties
 * on a page.
 */
export function frontmatterApi<TPath extends string | undefined>(
  p: KindModelPlugin,
  path?: TPath,
): FrontmatterApi<TPath> {
  return (
    path
      ? {
          /** set **key** on current page's _frontmatter_. */
          setFmKey: setFmKey(p)(path),
          /** remove **key** from current page's _frontmatter_. */
          removeFmKey: removeFmKey(p)(path),
          /** sort the frontmatter keys on the current page. */
          sortFmKeys: sortFmKeys(p)(path),
        }
      : {
          setFmKey: setFmKey(p),
          removeFmKey: removeFmKey(p),

          sortFmKeys: sortFmKeys(p),
        }
  ) as FrontmatterApi<TPath>;
}
