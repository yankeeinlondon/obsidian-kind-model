import type { Editor, MarkdownView } from "obsidian";
import type KindModelPlugin from "../main";
import type { DvPage, PageView } from "~/types";
import { isEmpty, or } from "inferred-types";
import { Notice } from "obsidian";
import { createVaultLink, getPath } from "~/api";
import { getTypeDefinitionPageFromTag } from "~/page/getType";
import { getKindPageByTag } from "~/page/getPageKinds";
import { asMdLink } from "~/utils";
import { isLink, isPageReference } from "~/type-guards";
import { getPageFromKindTag } from "~/page";

async function updateType(p: KindModelPlugin, page: PageView): Promise<boolean> {
  const {
    current,
    typeTag,
    isCategoryPage,
    isKindDefnPage,
    hasMultipleKinds,
    type,
    types,
  } = page;

  p.info("checking type");

  if (
    isEmpty(current.type)
    && !hasMultipleKinds
    && (typeTag || type)
  ) {
    if (type) {
      p.info("type found", type);

      await page.setFmKey(
        "type",
        type,
      );

      return true;
    }
    else if (typeTag && (isKindDefnPage || isCategoryPage)) {
      const typePage = getTypeDefinitionPageFromTag(p)(typeTag);
      if (typePage) {
        p.info("type found", typePage);

        await page.setFmKey(
          "type",
          typePage,
        );

        return true;
      }
    }
  }

  return false;
}

async function updateKind(p: KindModelPlugin, page: PageView): Promise<boolean> {
	const {
		current,
		isKindDefnPage,
		pageType,
		kindTags
	} = page;
	let changed = false;

	switch(pageType) {
		case "multi-kinded":
			const kinds = page.kinds && Array.isArray(page.kinds)
				? page.kinds
				: kindTags.map(i => getKindPageByTag(p)(i)) as DvPage[];
			if( 
				kinds.length > 0 && (!page.fm.kinds || page.fm.kinds?.length !== kinds.length)
			) {
				await page.setFmKey("kinds", asMdLink(p)(kinds));
				new Notice(`Added "kinds" property"`)
				changed = true;
			}
			if(page.fm.kind) {
				await page.removeFmKey("kind")
				new Notice(`Removed "kind" property"`);
				changed = true;
			}
			break;
		case "kinded":
			const kind = page.kind && isPageReference(page.kind)
				? page.kind
				: kindTags.length > 0 
					? getPageFromKindTag(p)(kindTags[0])
					: undefined;
			if (
				kind && (
					!page.fm.kind || (
						isPageReference(page.fm.path) && 
						kind.file.path !== getPath(page.fm.path)
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
			}
			break;
		case "multi-kinded > category":
			if(
				page.kinds && (!page.fm.kinds || page.fm.kinds?.length !== page.kinds.length)
			) {
				await page.setFmKey("kinds", page.kinds);
				new Notice(`"kinds" property set`);
			}
			if(page.fm.kind) {
				await page.removeFmKey("kind");
				new Notice (`"kind" property removed`);
			}
	}
	return changed
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
	  changes = or(changes, await updateKind(p, page));

    //   if (
    //     page.hasKindTag
    //     && page.kindTags.length === 1
    //     && !page.hasKindProp
    //   ) {
    //     changes = true;
    //     await page.setFmKey(
    //       "kind",
    //       createVaultLink(p)(page.classifications[0]?.kind),
    //     );
    //     new Notice("Set 'kind' property", 5000);
    //     if (page.hasKindsProp) {
    //       page.removeFmKey("kinds");
    //       new Notice("Removed 'kinds' property'", 5000);
    //     }
    //   }

    //   if (
    //     page.hasKindTag
    //     && page.kindTags.length > 1
    //     && !page.hasKindsProp
    //   ) {
    //     changes = true;
    //     await page.setFmKey(
    //       "kinds",
    //       page.classifications.map(c => createVaultLink(p)(c.kind),
    //       ),
    //     );
    //     new Notice("Set 'kinds' property", 5000);
    //     if (page.hasKindProp) {
    //       page.removeFmKey("kind");
    //       new Notice("Removed 'kind' property'", 5000);
    //     }
    //   }

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
        await page.sortFmKeys();
        new Notice("Updates completed");
      }
    }
  };
}
