import type { MarkdownView } from "obsidian";
import type KindModelPlugin from "../main";
import type { DvPage, PageView } from "~/types";
import { or } from "inferred-types";
import { Notice } from "obsidian";
import { getPath } from "~/api";
import { getPageFromKindTag } from "~/page";
import { getKindPageByTag } from "~/page/getPageKinds";
import { getTypeDefinitionPageFromTag } from "~/page/getType";
import { isLink, isPageReference } from "~/type-guards";
import { asMdLink } from "~/utils";

async function updateType(p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    current,
    typeTag,
    isCategoryPage,
    isKindDefnPage,
    type,
    pageType,
  } = page;
  let changes = false;

  switch (pageType) {
    case "type-defn":
      if (p.typeDefn) {
        await page.setFmKey("type", p.typeDefn);
        changes = true;
      }
      break;
    case "kind-defn":
    case "kinded > category":
    case "kinded > subcategory":
    case "kinded":
      if (
        !current.type
        && type
      ) {
        p.info("Page type found", type);
        await page.setFmKey(
          "type",
          type,
        );

        changes = true;
      }
      else if (typeTag && (isKindDefnPage || isCategoryPage)) {
        const typePage = getTypeDefinitionPageFromTag(p)(typeTag);
        if (typePage) {
          p.info("type found", typePage);

          await page.setFmKey(
            "type",
            typePage,
          );

          changes = true;
        }
      }
    case "multi-kinded > category":
    case "multi-kinded > subcategory":
    case "multi-kinded":
      if (page.types) {
        const links = page.types.map(
          i => isPageReference(i)
            ? asMdLink(p)(i)
            : undefined,
        ).filter(i => i);

        await page.setFmKey(
          "types",
          asMdLink(p)(links),
        );
        changes = true;
        if (page.fm.type) {
          await page.removeFmKey("type");
        }
      }
  }

  return changes;
}

async function updateKind(p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    pageType,
    kindTags,
  } = page;
  let changed = false;

  switch (pageType) {
    case "multi-kinded":
      const kinds = page.kinds && Array.isArray(page.kinds)
        ? page.kinds
        : kindTags.map(i => getKindPageByTag(p)(i)) as DvPage[];
      if (
        kinds.length > 0 && (!page.fm.kinds || page.fm.kinds?.length !== kinds.length)
      ) {
        await page.setFmKey("kinds", asMdLink(p)(kinds));
        new Notice(`Added "kinds" property"`);
        changed = true;
      }
      if (page.fm.kind) {
        await page.removeFmKey("kind");
        new Notice(`Removed "kind" property"`);
        changed = true;
      }
      break;
    case "kinded":
    case "kinded > category":
    case "kinded > subcategory":
      const kind = page.kind && isPageReference(page.kind)
        ? page.kind
        : kindTags.length > 0
          ? getPageFromKindTag(p)(kindTags[0])
          : undefined;
      if (
        kind && (
          !page.fm.kind || (
            isPageReference(page.fm.path)
            && kind.file.path !== getPath(page.fm.path)
          )
        )
      ) {
        await page.setFmKey("kind", kind);
        new Notice(`"kind" property set`);
        changed = true;
      }
      break;
    case "kind-defn":
      if (
        p.kindDefn && page.kind && (!page.fm.kind || (
          isLink(page.fm.kind) && page.fm.kind.path !== p.kindDefn.file.path
        ))
      ) {
        await page.setFmKey("kind", p.kindDefn);
        new Notice(`"kind" property set`);
        changed = true;
      }
      break;
    case "multi-kinded > category":
      if (
        page.kinds && (!page.fm.kinds || page.fm.kinds?.length !== page.kinds.length)
      ) {
        await page.setFmKey("kinds", page.kinds);
        new Notice(`"kinds" property set`);
        changed = true;
      }
      if (page.fm.kind) {
        await page.removeFmKey("kind");
        new Notice(`"kind" property removed`);
      }
  }
  return changed;
}

async function updateCategory(p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    pageType,
  } = page;
  let changed = false;

  switch (pageType) {
    case "kinded":
    case "kinded > subcategory":
    case "multi-kinded":
    case "multi-kinded > subcategory":
      if (
        page.categories.length > 1
      ) {
        await page.setFmKey("categories", page.categories.map(
          i => asMdLink(p)(i.page),
        ));
        if (page.fm.category) {
          await page.removeFmKey("category");
        }
        changed = true;
      }
      else if (page.categories.length === 1) {
        await page.setFmKey("category", page.categories[0].page);

        if (page.fm.categories) {
          await page.removeFmKey("categories");
        }

        changed = true;
      }
      break;
  }

  return changed;
}

async function updateSubcategory(_p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    pageType,
  } = page;
  let changed = false;

  switch (pageType) {
    case "kinded":
    case "kinded > subcategory":
    case "multi-kinded":
      if (
        page.subcategories.length === 1
      ) {
        await page.setFmKey("subcategory", page.subcategories[0].page);
        changed = true;

        if (page.fm.subcategories) {
          await page.removeFmKey("subcategories");
          changed = true;
        }
      }
      else if (page.subcategories.length > 1) {
        await page.setFmKey("subcategories", page.subcategories.map(i => i.page));
        changed = true;

        if (page.fm.subcategories) {
          await page.removeFmKey("subcategory");
          changed = true;
        }
      }
      break;
  }

  return changed;
}

export function update_kinded_page(p: KindModelPlugin) {
  return async (
    view: MarkdownView,
  ) => {
    const page = p.api.createPageView(view);
    if (page && page.pageType !== "none") {
      p.info("update-kinded-page", page);
      let changes = false;
      // types
      changes = or(changes, await updateType(p, page));
      // kinds
      changes = or(changes, await updateKind(p, page));
      // categories
      changes = or(changes, await updateCategory(p, page));
      // subcategories
      changes = or(changes, await updateSubcategory(p, page));

      if (!changes) {
        new Notice("No changes necessary for Update command", 4000);
      }
      else {
        await page.sortFmKeys();
        new Notice("Updates completed");
      }
    }
  };
}
