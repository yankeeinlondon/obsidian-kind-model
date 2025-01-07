import type { PageType, Tag } from "~/types";
import { createKindError } from "@yankeeinlondon/kind-error";
import { isString } from "inferred-types";
import { getPageType } from "~/api";
import { asDisplayTag, asTag } from "~/helpers";
import { createHandler } from "./createHandler";

export const Children = createHandler("Children")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { page, plugin: p, createTable, dv } = evt;
    const { typeTag } = page;
    const kind = asTag(page?.kindTags[0]);
    const cat = page.categories[0]?.category;

    p.info("Children hanlder");

    const tbl = (k: Tag) => page.isCategoryPage
    // Category Page
      ? createTable("Subcategories", "Description")(
          r => [
            r.createFileLink(),
            r.showDesc(),
          ],
          { predicate: `sub-categories of ${asDisplayTag(`${k}/${cat}`)}` },
        )
    // Kind Defn Page
      : page.isKindDefnPage
        ? createTable("Categories", "Subcategories")(
            (r) => {
              const cat = r.page.categories
                .find(i => asTag(i.kind) === kind)
                ?.category || "none";

              if (!isString(cat)) {
                p.warn(`category wasn't string`, cat);
              }

              return [
                r.createFileLink({ after: ` ${asDisplayTag(cat)}` }),
                r.createLinksFromTag(`${kind}/subcategory/${cat}`, {
                  noResult: f => f.italics(`none; use ${asDisplayTag(`${kind}/subcategory/${cat}/[name]`)}`),
                }),
              ];
            },
            { predicate: `categories of ${asDisplayTag(kind)}` },
          )
        : page.isTypeDefnPage
          ? createTable(`Classifications for ${page.name}`, "Description")(
              r => [
                r.page.pageType === "kind-defn"
                  ? r.createFileLink({ before: "Kind [ ", after: " ]" })
                  : r.createFileLink({ before: `Category [ ${r.page?.kind?.file.name} / `, after: " ]" }),
                r.showDesc(),
              ],
            )
          : null as never;

    if (page.isCategoryPage) {
      // - Category pages CAN have multiple Kind's
      // - Goal is to list out the subcategories defined for the given
      //   category/categories.
      // - If this page is a category page for multiple kinds we will:
      //   - sort by the kind so they are grouped
      //   - there will be a "kind" column

      const cat = page.categories.find(c => asTag(c.kind) === asTag(kind))?.category;
      const subs = p.dv.pages(`${asTag(kind)}/subcategory/${cat}`).sort(
        p => p.file.name,
      );

      try {
        await tbl(kind)(subs);
        return true;
      }
      catch (e) {
        return e;
      }
    }
    else if (page.isKindDefnPage) {
      // Kind Defn pages are always a singular Kind
      const cats = p.dv.pages(`${kind}/category`).sort(c => c.file.name);
      p.info(`Children on KindDefn page`, cats, kind);

      try {
        await tbl(kind)(cats);
        return true;
      }
      catch (e) {
        return e;
      }
    }
    else if (page.isTypeDefnPage) {
      const pages = dv.pages(`#type/${typeTag}`).filter((pg) => {
        const pt = getPageType(p)(pg);
        const allowed = ["kind-defn", "kinded > category", "multi-kinded > category"] as PageType[];
        return allowed.includes(pt);
      });

      try {
        await tbl(kind)(pages);
        return true;
      }
      catch (e) {
        return e;
      }
    }
    else {
      const err = createKindError("children");
      return err(`invalid page type passed to Children handler`);
    }
  });
