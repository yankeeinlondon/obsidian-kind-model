import type { CssDefinition } from "inferred-types";
import type { DvPage } from "~/types";
import { type } from "arktype";
import { isArray } from "inferred-types";
import { getPropOfType } from "~/api";
import { getPage } from "~/page";
import { isPageReference } from "~/type-guards";
import { createHandlerV2 } from "./createHandler";
import { span } from "./fmt";
import { registerHandler } from "./registry";

/**
 * Empty schema for handlers with no options.
 */
const AccountsOptionsSchema = type({
  "+": "reject",
});

// Register the handler with the registry
registerHandler({
  name: "Accounts",
  scalarSchema: null,
  acceptsScalars: false,
  optionsSchema: AccountsOptionsSchema,
  description: "Displays account information from the current page's accounts property",
  examples: [
    "Accounts()",
  ],
});

export const Accounts = createHandlerV2("Accounts")
  .noScalar()
  .optionsSchema(AccountsOptionsSchema)
  .handler(async (evt) => {
    const { page, plugin, createTable } = evt;
    function sortDvPages(pages: DvPage[]): DvPage[] {
      return pages.sort((a, b) => {
        // Determine if the page should be considered "inactive" (closed, archived, or inactive)
        const isInactiveA = Boolean(a.closed || a.archived || a.inactive);
        const isInactiveB = Boolean(b.closed || b.archived || b.inactive);

        // First criteria: Inactive pages should come last
        if (isInactiveA !== isInactiveB) {
          return isInactiveA ? 1 : -1;
        }

        // Second criteria: Sort alphabetically by file.name
        const nameA = a.file?.name?.toLowerCase() || "";
        const nameB = b.file?.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
    }

    const accounts = sortDvPages(
      isArray(page.current.accounts)
        ? page.current.accounts.filter(
          i => isPageReference(i)
            ? getPage(plugin)(i)
            : undefined,
        ).filter(i => i) as DvPage[]
        : [] as DvPage[],
    );

    const table = createTable(
      "Account",
      "Acct Number",
      "Routing #",
      "Currency",
      "Debit Card",
    )(
      (r) => {
        const [disabled] = getPropOfType(plugin)(
          r.page,
          "boolean",
          "closed",
          "archived",
          "inactive",
        );
        plugin.info("disabled", { page: r.page.name, disabled });

        const disableStrike: CssDefinition = {
          // "text-decoration": "line-through",
          "opacity": "0.7",
          "font-weight": "100",
          "background-color": "red 5%",
        };

        return [
          disabled
            ? span(r.createFileLink(), { ...disableStrike, "text-decoration": "line-through" })
            : r.createFileLink(),
          disabled === true
            ? span(r.showProp("account", "account_id", "account_number"), disableStrike)
            : r.showProp("account", "account_id", "account_number"),
          disabled === true
            ? span(r.showProp("routing_number", "routing", "sort_code"), disableStrike)
            : r.showProp("routing_number", "routing", "sort_code"),
          disabled
            ? span(r.showProp("currency"), disableStrike)
            : r.showProp("currency"),
          disabled === true
            ? span(r.showProp("card", "debit", "debit_card", "debitCard"), disableStrike)
            : r.showProp("card", "debit", "debit_card", "debitCard"),
        ];
      },
      {

      },
    );

    await table(accounts);

    return true;
  });
