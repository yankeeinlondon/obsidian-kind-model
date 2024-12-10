import type KindModelPlugin from "~/main";
import type { KindDefinition, PageReference } from "~/types";
import { getPath } from "~/api";
import { getPage } from "~/page";
import { isKindDefinition, isPageReference, isTagKindDefinition } from "~/type-guards";
import { createKindDefinition } from "./createKindDefinition";

/**
 * By passing in either a `KindDefinition` or a Page Reference, it will
 * make sure that the cache is updated to be current.
 *
 * - if a `KindDefinition` is passed in then it will be tested to see if the
 * the hash is still fresh
 * - if a _page reference_ is received then it will just generate a new
 * `KindDefinition` and set it in cache regardless (ensuring fresh cache value)
 */
export function updateKindDefinitionInCache(p: KindModelPlugin) {
  return async (
    payload: KindDefinition<[]> | PageReference,
  ) => {
    if (isPageReference(payload)) {
      const path = getPath(payload);
      const page = getPage(p)(path);
      if (path && page) {
        const defn = createKindDefinition(p)(page) as KindDefinition<["path"]>;
        if (isTagKindDefinition(defn)) {
          p.cache.kindDefinitionsByTag.set(defn.tag, defn as KindDefinition<["path", "tag"]>);
          p.cache.kindDefinitionsByPath.set(path, defn as KindDefinition<["path", "tag"]>);
        }
        else {
          p.cache.kindDefinitionsByPath.set(path, defn as KindDefinition<["path"]>);
        }
      }
      else {
        p.warn(
          `when calling updateKindDefinitionInCache() the payload appeared to be a page reference but for some reason we couldn't bring up the page! ${JSON.stringify(payload)}`,
          { path, page },
        );
      }
    }

    if (isKindDefinition(payload)) {
      const page = getPage(p)(payload.path);
      if (page) {
        const defn = createKindDefinition(p)(payload.path) as KindDefinition<["path"]>;

        if (defn?.hash !== payload?.hash) {
          // cache is invalid
          p.cache.kindDefinitionsByPath.set(payload.path, defn);
          if (defn.tag) {
            p.cache.kindDefinitionsByTag.set(defn.tag, defn as KindDefinition<["path", "tag"]>);
          }
        }
        else {
          p.debug(`no change to kind defn`, `path: ${page.file.path}`, `hash: ${defn.hash}`);
        }
      }
      else {
        p.warn(`updateKindDefinitionInCache() got invalid payload`, "was not a page reference so kind have been a KindDefinition", { payload });
      }
    }
  };
}

/**
 * By passing in either a `KindDefinition` or a _page reference_, this function
 * makes sure that the cache is updated to be current.
 *
 * - if a `KindDefinition` is passed in then it will be tested to see if the
 * the hash is still fresh
 * - if a _page reference_ is received then it will just generate a new
 * `KindDefinition` and set it in cache regardless (ensuring fresh cache value)
 */
export function updateTypeDefinitionInCache(p: KindModelPlugin) {
  return async (
    payload: KindDefinition<["path"]> | PageReference,
  ) => {
    if (isPageReference(payload)) {
      const path = getPath(payload);
      const page = getPage(p)(path);
      if (path && page) {
        const defn = createKindDefinition(p)(page) as KindDefinition<["path"]>;
        if (isTagKindDefinition(defn)) {
          p.cache.typeDefinitionsByTag.set(defn.tag, defn as KindDefinition<["path", "tag"]>);
          p.cache.typeDefinitionsByPath.set(path, defn as KindDefinition<["path", "tag"]>);
        }
        else {
          p.cache.typeDefinitionsByPath.set(path, defn as KindDefinition<["path"]>);
        }
      }

      if (isKindDefinition(payload)) {
        const page = getPage(p)(payload.path);
        if (page) {
          const defn = createKindDefinition(p)(payload.path) as KindDefinition<["path"]>;

          if (defn?.hash !== payload?.hash) {
            // cache is invalid
            p.cache.typeDefinitionsByPath.set(payload.path, defn);
            if (defn.tag) {
              p.cache.typeDefinitionsByTag.set(defn.tag, defn as KindDefinition<["path", "tag"]>);
            }
          }
          else {
            p.warn(`updateTypeDefinitionInCache() got invalid payload`, "was not a page reference so kind should have been a KindDefinition", { payload });
          }
        }
      }
    }
    else {
      const defn = createKindDefinition(p)(payload.path) as KindDefinition<["path"]>;

      if (defn.hash !== payload.hash) {
        // cache is invalid
        p.cache.typeDefinitionsByPath.set(payload.path, defn);
        if (defn.tag) {
          p.cache.typeDefinitionsByTag.set(defn.tag, defn as KindDefinition<["path", "tag"]>);
        }
      }
    }
  };
}
