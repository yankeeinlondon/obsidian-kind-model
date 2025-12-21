import type KindModelPlugin from "~/main";
import type { KindClassification, KindClassifiedCategory, PageInfoBlock, PageSubcategory } from "~/types";
import { type } from "arktype";
import { htmlLink } from "~/api";
import { asDisplayTag } from "~/helpers";
import { isFuturePage, isPageReference } from "~/type-guards";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

function showCategories(p: KindModelPlugin) {
  return <
    T extends KindClassification[],
  >(
    classifications: T,
  ) => {
    return classifications.map((classy) => {
      const cats = classy.category
        ? [classy.category] as KindClassifiedCategory[]
        : classy.categories
          ? classy.categories as KindClassifiedCategory[]
          : [];

      if (cats.length === 0) {
        return `no categories for ${asDisplayTag(`#${classy.kindTag}`, true)} kind`;
      }

      const kindPrefix = `#${classy.kindTag}/`;

      const output = cats.map(
        i => `${htmlLink(p)(i.page)} [${asDisplayTag(kindPrefix + i.tag, true)}]`,
      );

      return output.join("<br/>");
    }).join("\n");
  };
}

function showSubcategories(p: KindModelPlugin) {
  return (subCats: PageSubcategory[]) => {
    return subCats.map(
      i => `${htmlLink(p)(i.page)} [${asDisplayTag(i.kindedTag, true)}]`,
    ).join("<br>\n");
  };
}

/**
 * Empty schema for handlers with no options.
 * Uses strict mode to reject any unknown keys.
 */
const DebugOptionsSchema = type({
  "+": "reject",
});

// Register the handler with the registry
registerHandler({
  name: "Debug",
  scalarSchema: null,
  acceptsScalars: false,
  optionsSchema: DebugOptionsSchema,
  description: "Shows debug information about the current page",
  examples: [
    "Debug()",
  ],
});

export const Debug = createHandlerV2("Debug")
  .noScalar()
  .optionsSchema(DebugOptionsSchema)
  .handler(async (evt) => {
    const { page, render, plugin: p } = evt;

    const fmt = p.api.format;

    const pageCopy = { ...page } as Partial<PageInfoBlock>;
    delete pageCopy.categories;
    delete pageCopy.subcategories;
    delete pageCopy.classifications;
    delete pageCopy.kind;
    delete pageCopy.kinds;
    delete pageCopy.type;
    delete pageCopy.types;

    p.info(
      `Page Details (${page.pageType})`,
      { type: page.type },
      { types: page.types },
      { kind: page.kind },
      { kinds: page.kinds },
      { categories: page.categories },
      { subcategories: page.subcategories },
      { classification: page.classifications },
      pageCopy,
    );

    render.render(fmt.bold(`Debug Information<br/>`));

    const pl = page.hasMultipleKinds ? `s` : "";

    const kindOfPage = [
      "Kind of Page", //
      `${page.pageType} [multi: ${page.hasMultipleKinds}]`,
    ];
    const types
      = (
        (page.type && isPageReference(page.type))
        || (page.types && page.types.length > 0)
      )
        ? [
            fmt.bold(`Type${pl}`), //
            page.type
              ? htmlLink(p)(page.type)
              : Array.isArray(page.types)
                ? page.types.map(i => htmlLink(p)(i)).join(", ")
                : page.typeTag
                  ? `none (but has _type tag_ of ${asDisplayTag(page.typeTag)})`
                  : "none",
          ]
        : [
            `Type${pl}`,
            fmt.italics("none found"),
          ];
    const kinds = page.kindTags?.length > 0
      ? [
          fmt.bold(`Kind${pl}`),
          page.classifications.map(
            c => isFuturePage(c)
              ? `Future(${c.kind.file.name} [${asDisplayTag(c.kindTag, true)}])`
              : `${c.kind.file.name} [${asDisplayTag(c.kindTag, true)}]`,
          ).join("<br/>"),

        ]
      : undefined;

    const cats = page.categories?.length > 0
      ? [
          page.categories?.length > 1
            ? `Categories`
            : `Category`,
          showCategories(p)(page.classifications),
        ]
      : undefined;

    const subCats
      = page.subcategories?.length > 0
        ? [
            page.subcategories?.length > 1
              ? "Subcategories"
              : "Subcategory",
            showSubcategories(p)(page.subcategories),
          ]
        : undefined;

    const frontMatter
      = Object.keys(page.frontmatterTypes).length > 0
        ? [
            "Frontmatter",
            Object.keys(page.frontmatterTypes)
              .map(
                k => `${fmt.bold(k)}: [ ${page.frontmatterTypes[k as any].join(", ")} ]`,
              )
              .join("<br/>"),
          ]
        : undefined;

    const report = [kindOfPage, types, kinds, cats, subCats, frontMatter].filter(
      i => i,
    ) as [left: string, right: string][];

    const table = fmt.htmlTable(
      [() => ["Page Aspect", { width: "170px" }], () => ["Value", {}]],
      {
        table: { width: "100%" },
        headings: { "text-emphasis": "800" },
        highlightFirstColumn: true,
      },
    );

    const html = table(report);

    render.render(html);
    return true;
  });
