# KM Block Type Guardrails

This document covers the type validation and autocomplete system for `km` codeblocks in the Kind Model plugin.

## For Plugin Users

### Autocomplete

The `km` codeblock editor provides intelligent autocomplete to help you write queries faster and with fewer errors.

#### Handler Name Completion

When you start typing in a `km` block, you'll see suggestions for available handlers:

```km
Ba  <- typing this will suggest "BackLinks"
```

Press `Tab` or `Enter` to accept a suggestion.

#### Option Completion

Inside the options hash `{}`, you'll get suggestions for valid options:

```km
BackLinks({de  <- typing this will suggest "dedupe"
```

#### Boolean Value Completion

After typing an option key followed by `:`, you'll see `true` and `false` suggestions:

```km
BackLinks({dedupe:   <- will suggest true/false
```

#### Manual Trigger

Autocomplete triggers automatically as you type. You can also press `Ctrl+Space` (or `Cmd+Space` on Mac) to manually trigger suggestions.

### Understanding Errors

#### Inline Errors (While Editing)

While editing a `km` block, errors appear as red underlines:

- **Red squiggle**: Indicates a problem at that location
- **Hover**: Place your cursor over the underline to see error details
- **Quick fixes**: Some errors offer automatic fixes you can apply

Common inline errors:

| Error | Meaning | Fix |
|-------|---------|-----|
| `Unknown handler 'BackLink'` | Handler name is misspelled | Use the suggested spelling or check available handlers |
| `Unknown option 'dedup'` | Option key is misspelled | Use the suggested spelling |
| `Unclosed '('` | Missing closing parenthesis | Add the missing `)` |

#### Rendered Errors (After Exiting Editor)

When you leave the editor, the `km` block renders. If there are errors, you'll see a detailed error callout:

```
┌─────────────────────────────────────────────┐
│ ⚠️ Error in `km` handler                    │
│                                             │
│ Handler: BackLinks                          │
│ Query: BackLinks({dedup: true})             │
│                                             │
│ Unknown option: dedup                       │
│ Did you mean: dedupe                        │
│                                             │
│ Valid options for BackLinks:                │
│ • ignoreTags                                │
│ • dedupe                                    │
│ • exclude                                   │
│ • excludeCompletedTasks                     │
│                                             │
│ Examples:                                   │
│ • BackLinks()                               │
│ • BackLinks({dedupe: false})                │
└─────────────────────────────────────────────┘
```

### Handler Reference

| Handler | Description | Example |
|---------|-------------|---------|
| `BackLinks` | Shows pages that link to the current page | `BackLinks({dedupe: true})` |
| `Kind` | Displays pages matching a classification | `Kind("software", "development")` |
| `Children` | Shows child classifications | `Children()` |
| `Tasks` | Shows tasks referencing the current page | `Tasks()` |
| `VideoGallery` | Displays videos from page metadata | `VideoGallery({size: "M"})` |
| `PageEntry` | Renders page header with classification | `PageEntry()` |
| `IconPage` | Displays icons defined in frontmatter | `IconPage()` |
| `Accounts` | Shows account information | `Accounts()` |
| `Book` | Formatted book summary | `Book()` |
| `Journal` | Journal page header with navigation | `Journal()` |
| `Debug` | Debug information for development | `Debug()` |

---

## For Handler Developers

### Creating a Handler

Handlers are created using the `createHandlerV2` fluent API with ArkType schemas:

```typescript
import { type } from "arktype";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

// 1. Define the options schema
const MyHandlerOptionsSchema = type({
  "+": "reject",  // Reject unknown keys
  "optionA?": "string",
  "optionB?": "boolean",
  "tags?": "string[]",
});

// 2. Register the handler with metadata
registerHandler({
  name: "MyHandler",
  scalarSchema: null,  // or your scalar schema
  optionsSchema: MyHandlerOptionsSchema,
  description: "What this handler does",
  examples: [
    "MyHandler()",
    "MyHandler({optionA: \"value\"})",
  ],
});

// 3. Create the handler
export const MyHandler = createHandlerV2("MyHandler")
  .noScalar()  // or .scalar("name AS string", "count AS opt(number)")
  .optionsSchema(MyHandlerOptionsSchema)
  .handler(async (evt) => {
    const { plugin, page, options } = evt;

    // Your handler logic here

    return true;  // Return true on success
  });
```

### Schema Design

#### TypeToken to ArkType Translation

| TypeToken | ArkType | Example |
|-----------|---------|---------|
| `"string"` | `"string"` | `name: "string"` |
| `"number"` | `"number"` | `count: "number"` |
| `"bool"` | `"boolean"` | `enabled: "boolean"` |
| `"opt(bool)"` | Key with `?` | `"enabled?": "boolean"` |
| `"array(string)"` | `"string[]"` | `tags: "string[]"` |
| `"opt(string)"` | `"string?"` | `"name?": "string"` |
| `"enum(a,b,c)"` | `"'a' \| 'b' \| 'c'"` | `size: "'S' \| 'M' \| 'L'"` |
| `"string\|array(string)"` | `"string \| string[]"` | `exclude: "string \| string[]"` |

#### Rejecting Unknown Keys

Always include `"+": "reject"` in your schema to match legacy TypeToken behavior:

```typescript
const MySchema = type({
  "+": "reject",  // Unknown keys will cause validation errors
  "validOption?": "string",
});
```

#### Type Inference

ArkType automatically infers TypeScript types from your schema:

```typescript
const OptionsSchema = type({
  "+": "reject",
  "name?": "string",
  "count?": "number",
  "tags?": "string[]",
});

// Type is automatically inferred:
type Options = typeof OptionsSchema.infer;
// { name?: string; count?: number; tags?: string[] }
```

### Handler Registration

Handlers self-register when their module is loaded. The registry is used for:

1. **Autocomplete**: Provides handler names and option suggestions
2. **Validation**: Validates options against the schema
3. **Error messages**: Shows valid options in error messages
4. **Documentation**: Examples are shown in error callouts

### Best Practices

1. **Always register your handler** - This enables autocomplete and better error messages
2. **Provide examples** - They appear in error messages to help users
3. **Write clear descriptions** - Shown in autocomplete tooltips
4. **Use strict schemas** - Include `"+": "reject"` to catch typos
5. **Test your handler** - Verify it works with valid and invalid inputs

### Handler Event Object

The handler receives an event object with:

| Property | Type | Description |
|----------|------|-------------|
| `plugin` | `KindModelPlugin` | Plugin instance |
| `page` | `PageInfoBlock` | Current page with metadata |
| `options` | `T` | Validated options (typed from schema) |
| `scalar` | `S` | Scalar parameters (if defined) |
| `createTable` | Function | Table rendering factory |
| `render` | `RenderApi` | DOM rendering utilities |
| `dv` | `DataviewAPI` | Dataview API access |
| `report` | Function | Error reporting utility |

### Error Handling

Return errors to display them in the rendered block:

```typescript
.handler(async (evt) => {
  if (!evt.page.current.requiredField) {
    return evt.report("Missing required field");
  }

  // Normal processing
  return true;
});
```

---

## Architecture

### Validation Flow

```
User types in km block
        │
        ▼
┌───────────────────┐
│ CodeMirror Linter │  ← Real-time validation (300ms debounce)
│  km-linter.ts     │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Handler Registry  │  ← Schema lookup
│  registry.ts      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ ArkType Validate  │  ← Type validation
│  schema.ts        │
└───────────────────┘
        │
        ▼
    Diagnostics shown as red underlines
```

### Files

| File | Purpose |
|------|---------|
| `src/handlers/registry.ts` | Handler registration and metadata |
| `src/handlers/schema.ts` | ArkType validation utilities |
| `src/handlers/error-display.ts` | Enhanced error formatting |
| `src/utils/language/km-parser.ts` | Parsing utilities for context detection |
| `src/utils/language/autocomplete.ts` | CodeMirror autocomplete source |
| `src/utils/language/km-linter.ts` | CodeMirror linter extension |
| `src/utils/language/km_lang.ts` | Language support combining extensions |
