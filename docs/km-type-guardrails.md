# KM Parsing and Validation

This guide explains how a `km` query is parsed, what feedback the editor provides, and how handler developers define valid arguments. It is useful when a query is rejected or when adding a handler.

## Query syntax

Write one handler call in each fenced `km` block. The handler name is case-sensitive. Positional arguments come first; an options object, when present, must be the final argument. Strings use double quotes, and values follow JSON syntax. Option keys may be unquoted because the parser converts them to JSON keys.

````markdown
```km
Kind("software", "development", { hide: ["Links"] })
```
````

This call asks `Kind` for the `software/development` classification and hides its Links column. `Kind` requires its first positional argument; its category and subcategory are optional.

```km
BackLinks({ dedupe: false, exclude: ["software", "hardware/automation"] })
```

This is a valid `BackLinks` call. Each `km` block must contain one handler call, so try invalid cases in separate blocks. The first uses an unknown key; the second supplies a string where `dedupe` requires a boolean.

```km
BackLinks({ dedup: true })
```

```km
BackLinks({ dedupe: "false" })
```

The argument text is parsed as JSON after unquoted option keys are converted. It is not evaluated as JavaScript: use double-quoted strings, and do not use comments, expressions, or trailing commas.

## Feedback while editing

The plugin adds CodeMirror autocomplete and a linter to the editor. They operate inside `km` code fences.

Autocomplete can suggest:

- Registered handler names, with a description and example usages.
- Option keys declared by the handler's ArkType options schema, including their types and whether the key is optional.
- `true` and `false` after an option colon. These value suggestions are generic; they appear even when the option expects a string or array.
- Kind names for the first positional argument of `Kind`, from the cached `#kind/...` tags. Category and subcategory completions are also implemented, but they read that same cache; ordinary entity tags such as `#software/development` are not included in it, so those suggestions are usually empty.

Suggestions appear as you type. Use the editor's completion keybinding (usually `Ctrl-Space`, or `Cmd-Space` on macOS) to request them manually. Accept a selected suggestion with the editor's completion keys, commonly `Tab` or `Enter`.

The linter runs after a short delay and can underline unbalanced brackets, unrecognized handler names, unknown option keys, and positional arguments passed to a handler that declares it accepts none. Close misspellings of handler names and option keys can include a quick fix.

The linter is an editing aid, not the runtime validator. It does not currently check option value types, required positional arguments, or all query syntax. For example, `Kind()` may have no inline diagnostic even though rendering reports the missing required kind. A wrong option value such as `BackLinks({ dedupe: "false" })` is also checked when the block renders.

## Validation when the block renders

At render time, the plugin parses the argument text, separates positional values from the final options object, and validates those values using the handler's configured parser and schemas. A validation failure is shown in an error callout in place of the handler output.

For schema-backed handlers, errors can identify the invalid property, expected type, and received value. An unknown option may include a spelling suggestion; callouts can also show examples registered for the handler. An unknown handler gets a list of available handlers and, for close spellings, a suggestion.

The current `Kind` and `BackLinks` handlers demonstrate the schema-backed behavior. Each example goes in its own `km` block:

```km
Kind("software", { hide: ["Links"] })
```

```km
BackLinks({ dedupe: false })
```

`Kind` uses ArkType schemas for positional arguments and options. `BackLinks` uses ArkType for options and accepts no positional arguments. See [KM Query Handlers](km-handlers.md) for the handlers' current options and examples.

## Schema conventions for handler developers

New handlers should use ArkType schemas. One schema defines both runtime validation and the TypeScript type available to the handler implementation. In an object schema, a key without `?` is required; a key with `?` is optional. ArkType accepts undeclared object keys by default, so add `"+": "reject"` when unknown options should be errors. Current handlers use this strict form.

For example, this schema requires `kind`, allows an optional `category`, and rejects undeclared option keys:

```ts
import { type } from "arktype";

const ExampleScalarSchema = type({
  kind: "string",
  "category?": "string",
});

const ExampleOptionsSchema = type({
  "+": "reject",
  "includeArchived?": "boolean",
  "tags?": "string[]",
});
```

Use the scalar key list to map positional arguments to the object keys in the scalar schema. Register the handler metadata for autocomplete and diagnostics, and make the handler available through `src/handlers/index.ts` so the runtime can dispatch to it.

```ts
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

registerHandler({
  name: "Example",
  scalarSchema: ExampleScalarSchema,
  optionsSchema: ExampleOptionsSchema,
  acceptsScalars: true,
  description: "Shows an example query with typed arguments",
  examples: [
    'Example("software")',
    'Example("software", { includeArchived: true })',
  ],
});

export const Example = createHandlerV2("Example")
  .scalarSchema(["kind", "category"], ExampleScalarSchema)
  .optionsSchema(ExampleOptionsSchema)
  .handler(async ({ scalar, options }) => {
    // scalar.kind is a string; scalar.category and options.includeArchived are optional.
    console.log(scalar.kind, scalar.category, options.includeArchived, options.tags);
    return true;
  });
```

If a handler takes no positional arguments, use `.noScalar()` and register `scalarSchema: null` with `acceptsScalars: false`. The registry metadata is consumed by editor tooling; creating the handler alone does not add it to that registry.

### ArkType equivalents for TypeToken definitions

Some older handlers use TypeToken strings. These are the common type mappings when converting a value definition to ArkType:

| TypeToken value | ArkType value schema | Example |
| --- | --- | --- |
| `string` | `string` | `name: "string"` |
| `number` | `number` | `count: "number"` |
| `bool` or `boolean` | `boolean` | `"enabled?": "boolean"` |
| `opt(string)` | `string` on an optional key | `"name?": "string"` |
| `array(string)` | `string[]` | `"tags?": "string[]"` |
| `enum(S,M,L)` | `'S' | 'M' | 'L'` | `"size?": "'S' | 'M' | 'L'"` |

For example, the optional TypeToken option `dedupe: "opt(bool)"` becomes `"dedupe?": "boolean"` in an ArkType object schema. The optional marker moves to the key. A union can be expressed directly in ArkType, such as `"exclude?": "string | string[]"`.

## TypeToken compatibility and limits

`createHandlerV2` still supports the TypeToken API for compatibility:

```ts
createHandlerV2("LegacyExample")
  .scalar("kind AS string")
  .options({ dedupe: "opt(bool)" })
  .handler(async ({ scalar, options }) => {
    console.log(scalar.kind, options.dedupe);
    return true;
  });
```

The deprecated `createHandler` API also uses this parser. A hybrid handler can keep TypeToken positional parameters and validate its options with ArkType by combining `.scalar(...)` with `.optionsSchema(...)`.

The legacy parser accepts basic types, optional wrappers, arrays, enums, and simple `|` unions for option values at runtime. Its TypeScript `TypeToken` definition does not admit union strings, however, so callers may need a cast to use those unions. The parser also checks scalar count, requires the options object to be last, rejects undeclared option keys, and validates option values. Its scalar value checking is limited: it checks plain `string` scalar tokens, but does not type-check `opt(string)`, numbers, booleans, or enums. Missing legacy option keys are allowed even when their TypeToken is not wrapped in `opt(...)`. Prefer ArkType when adding or tightening validation.

`TypeToken` has compile-time forms for some additional values, including `column(...)` and `columns(...)`, but the legacy runtime option validator does not validate those forms. It treats unrecognized token types permissively. Do not rely on a TypeToken declaration alone to enforce a value unless the runtime parser explicitly supports that token.

## Related documentation

- [KM Query Handlers](km-handlers.md) describes handler arguments and current user-facing options.
- [Handler reference: VideoGallery](handlers/VideoGallery.md) documents that handler's player behavior and controls.
