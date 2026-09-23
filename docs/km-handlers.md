# KM Query Handlers

Kind Model query handlers add rendered results and page summaries to Obsidian notes. You use them inside fenced code blocks whose language is `km`. A handler reads the note that contains the block, queries the Dataview index or page metadata, and renders output into the block.

## Use a handler

Put one handler call in each `km` block. Handler names are case-sensitive and use PascalCase.

````markdown
```km
BackLinks({ dedupe: false, exclude: ["software", "hardware/automation"] })
```
````

The text inside the parentheses follows a small call syntax:

- Positional values come first. `Kind` uses them for the kind, category, and optional subcategory, in that order.
- An options object may follow the positional values and must be the final argument.
- Use JSON-style values: quoted strings, numbers, booleans, arrays, and objects. Option keys may be unquoted, as in `{ dedupe: false }`.
- Options are checked against the handler's schema. Unknown keys and values of the wrong type produce an error in the note.

For example, this asks for pages tagged with the `software` kind and `development` category, then hides the Links column:

````markdown
```km
Kind("software", "development", { hide: ["Links"] })
```
````

`Kind` uses the tag path `#software/development`; omit the leading `#` in the call. Add a third string to query a subcategory, such as `Kind("software", "development", "ide")`.

Each block accepts exactly one handler call. The plugin tries its registered handlers against that call, waits for Dataview to be ready before querying, and displays a callout when the handler name or its parameters are invalid. KM blocks are also refreshed when their host note's metadata changes; see [the render flow](km-render-flow.md).

## Available handlers

These are the handlers currently loaded by the plugin.

| Handler | What it renders | Arguments and requirements |
| --- | --- | --- |
| `Accounts` | A table of account pages referenced by the current page's `accounts` property. | No arguments. |
| `BackLinks` | Pages linking to the current page, with classification, description, and link details. | Optional options object; see [BackLinks options](#backlinks). |
| `Book` | A formatted book summary from metadata on the current page. | No arguments. It reads fields such as title, author, ISBN, ASIN, and cover URL from frontmatter (including `kindle-sync` metadata when present). |
| `Children` | Child classifications for a Type, Kind, or Category definition page. | No arguments. The output depends on the current page's definition type. |
| `Debug` | Page classification and diagnostic details. | No arguments. |
| `IconPage` | SVG icon metadata from the current page. | No arguments. |
| `Journal` | A dated journal header with previous/next navigation and matching events and meetings. | Optional options object; the current page needs an explicit ISO date in `when` or `date` frontmatter, or a `YYYY-MM` / `YYYY-MM-DD` prefix in its title. |
| `Kind` | Pages matching a kind, category, or subcategory tag path. | Required kind string, then optional category and subcategory strings, then an optional options object; see [Kind options](#kind). |
| `PageEntry` | A page summary with classification, description, and related links when available. | Optional options object; see [PageEntry options](#pageentry). |
| `Tasks` | Tasks on other pages that link to the current page. | No arguments. |
| `VideoGallery` | YouTube videos linked from pages that link to the current page. | Optional options object; see [VideoGallery options](#videogallery). |

Examples for no-argument handlers:

````markdown
```km
Children()
```
````

````markdown
```km
PageEntry()
```
````

## Handler options

### BackLinks

All options are optional:

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `dedupe` | boolean | `true` | Omits backlinks already shown in the current page body. |
| `exclude` | string or array of strings | — | Omits pages matching a kind, category, or subcategory, such as `"software"` or `"hardware/automation"`. A leading `#` is optional. |
| `excludeCompletedTasks` | boolean | `true` | Omits links that occur only in completed tasks. |
| `ignoreTags` | array of strings | — | Omits backlink pages carrying any listed tag. |

For example, to keep repeated links and include references found only in completed tasks:

````markdown
```km
BackLinks({ dedupe: false, excludeCompletedTasks: false })
```
````

### Kind

`Kind` requires a kind name. Category and subcategory are positional strings; they cannot be supplied by name. Its options are:

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `noClassificationResults` | boolean | `true` | When true, limits results to pages the plugin identifies as kinded or multi-kinded. Set false to include other pages with the matching tag. |
| `hide` | array of strings | — | Removes named table columns, such as `"Links"` or `"Description"`. |
| `show` | array of strings | — | Accepted by validation, but the current handler does not use it to change the output. |

This query returns the pages with the `#software/development/ide` tag path and hides the Links column:

````markdown
```km
Kind("software", "development", "ide", { hide: ["Links"] })
```
````

### PageEntry

The handler accepts an optional `verbose` boolean:

````markdown
```km
PageEntry({ verbose: true })
```
````

The current renderer does not use `verbose`, so it does not change the output.

### VideoGallery

The `size` option controls the number of gallery columns:

| Value | Columns |
| --- | ---: |
| `"S"` | 4 |
| `"M"` | 3 (default) |
| `"L"` | 2 |

````markdown
```km
VideoGallery({ size: "L" })
```
````

See the [VideoGallery reference](handlers/VideoGallery.md) for its player behavior and controls.

### Journal

`Journal` accepts `fileFormat`, `thisYearFormat`, and `otherYearFormat` as optional strings. The current handler uses `fileFormat` to build the previous- and next-day note paths; its default is `journal/YYYY/YYYY-MM-DD`. The other two keys are accepted by validation but currently do not affect the rendered heading.

````markdown
```km
Journal({ fileFormat: "journal/YYYY/YYYY-MM-DD" })
```
````

## Add a handler (plugin development)

Handlers are created with `createHandlerV2`. A schema defines runtime validation and the TypeScript type of the options passed to the handler. This example defines an option, renders content, and reports that the block was handled:

```ts
import { type } from "arktype";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

const ExampleOptions = type({
  "+": "reject",
  "includeArchived?": "boolean",
});

registerHandler({
  name: "Example",
  scalarSchema: null,
  acceptsScalars: false,
  optionsSchema: ExampleOptions,
  description: "Renders an example block",
  examples: ["Example()", "Example({ includeArchived: true })"],
});

export const Example = createHandlerV2("Example")
  .noScalar()
  .optionsSchema(ExampleOptions)
  .handler(async ({ options, render }) => {
    render.render(options.includeArchived ? "Including archived pages" : "Active pages only");
    return true;
  });
```

The registry entry supplies descriptions and examples to handler suggestions and error messages. To make a new handler run, import it and add it to the handler list in [`src/handlers/index.ts`](../src/handlers/index.ts). See the existing handler modules in [`src/handlers`](../src/handlers/) for complete implementations.

## Related documentation

- [KM type validation and parsing](km-type-guardrails.md)
- [KM block render flow](km-render-flow.md)
- [Handler reference: VideoGallery](handlers/VideoGallery.md)
