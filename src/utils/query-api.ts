import type { KindModelSettings } from "types/settings_types";

function strip_leading_spaces(query: string) {
  return query.split("\n").map(line => line.trim()).join("\n");
}

/**
 * Provides an API surface for generating useful and reusable
 * [Dataview](https://blacksmithgu.github.io/obsidian-dataview/) queries.
 */
export function QueryApi(ctx: KindModelSettings) {
  return {
  /**
   * **kind_classification**(kind)
   *
   * Given a specified _kind_ it produces a Dataview query which is tailed to that
   * model's configuration.
   */
    kind_classification: (kind: string) => {
      const model = ctx.kinds[kind];

      let query: string;

      switch (model._classification_type) {
        case "categories":
          query = ``;
          break;
        case "category":
          query = ``;
          break;
        case "category and subcategory":
          query = ``;
          break;
        case "grouped categories":
          query = ``;
          break;
      }

      return strip_leading_spaces(query);
    },
  };
}
