import type { Editor, MarkdownView } from "obsidian";
import type KindModelPlugin from "../main";
import type { PageView } from "~/types";
import { isEmpty, or } from "inferred-types";
import { Notice } from "obsidian";
import { createVaultLink } from "~/api";

async function updateType(p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    current,
    typeTag,
    isCategoryPage,
    isKindDefnPage,
    hasMultipleKinds,
  } = page;

  if (
    isEmpty(current.type)
    && !hasMultipleKinds
    && typeTag
    && (isKindDefnPage || isCategoryPage)
  ) {
    // await page.setFmKey(
    // 	"type",
    // 	createVaultLink(p)(page.type),
    // );

    return true;
  }

  return false;
}

export function update_kinded_page(p: KindModelPlugin) {
  return async (
    editor: Editor,
    view: MarkdownView,
  ) => {
    const page = p.api.createPageView(view);
    if (page && page.pageType !== "none") {
      p.info("update-kinded-page", page);
      let changes = false;
      // types
      changes = or(changes, await updateType(p, page));
      // kinds

      if (
        page.hasKindTag
        && page.kindTags.length === 1
        && !page.hasKindProp
      ) {
        changes = true;
        await page.setFmKey(
          "kind",
          createVaultLink(p)(page.classifications[0]?.kind),
        );
        new Notice("Set 'kind' property", 5000);
        if (page.hasKindsProp) {
          page.removeFmKey("kinds");
          new Notice("Removed 'kinds' property'", 5000);
        }
      }

      if (
        page.hasKindTag
        && page.kindTags.length > 1
        && !page.hasKindsProp
      ) {
        changes = true;
        await page.setFmKey(
          "kinds",
          page.classifications.map(c => createVaultLink(p)(c.kind),
          ),
        );
        new Notice("Set 'kinds' property", 5000);
        if (page.hasKindProp) {
          page.removeFmKey("kind");
          new Notice("Removed 'kind' property'", 5000);
        }
      }

      if (
        page.hasCategoryTag
        && !page.isCategoryPage
        && page.categories.length === 1
        && !page.hasCategoryProp
      ) {
        new Notice("'category' property added", 5000);
        await page.setFmKey(
          "category",
          createVaultLink(p)(page.categories[0].page),
        );
        if (page.hasCategoriesProp) {
          new Notice("'categories' property removed", 5000);
          page.removeFmKey("categories");
        }
        changes = true;
      }

      if (
        page.hasCategoryProp
        && page.categories.length > 1
        && !page.hasCategoriesProp
      ) {
        await page.setFmKey(
          "categories",
          page.categories.map(i => createVaultLink(p)(i.page)).filter(i => i),
        );
        if (page.hasCategoryProp) {
          new Notice("'category' property removed");
          page.removeFmKey("category");
        }
      }

      if (page.hasSubcategoryTag && !page.hasSubcategoryProp) {
        changes = true;
        await page.setFmKey(
          "subcategories",
          page.subcategories.map(i => createVaultLink(p)(i.page)).filter(i => i),
        );
      }

      if (!changes) {
        new Notice("No changes necessary for Update command", 4000);
      }
      else {
        new Notice("Updates completed");
      }
    }
  };
}
