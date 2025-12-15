# KM Block Type Validation and Parsing

This document describes how `km` codeblock parameters are parsed and validated.

## Overview

When a user writes a `km` codeblock like:

```km
BackLinks({dedupe: false, exclude: "software"})
```

The plugin must:
1. Match the handler name (`BackLinks`)
2. Extract the parameters (`{dedupe: false, exclude: "software"}`)
3. Parse the parameters into structured data
4. Validate against the handler's schema
5. Pass validated data to the handler

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ codeblockParser │────▶│  createHandler   │────▶│   parseParams   │
│                 │     │  (regex match)   │     │  (JSON + valid) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Key Files

| File | Responsibility |
|------|----------------|
| `src/events/codeblockParser.ts` | Registers `km` codeblock processor, routes to handlers |
| `src/handlers/createHandler.ts` | Factory for creating handlers with schema definitions |
| `src/helpers/parseParams.ts` | Parses raw string params, validates types |

## Handler Definition

Handlers are created using the `createHandler()` fluent API:

```typescript
export const BackLinks = createHandler("BackLinks")
  .scalar()  // No required scalar params
  .options({
    ignoreTags: "array(string)",
    dedupe: "opt(bool)",
    exclude: "opt(string|array(string))",
    excludeCompletedTasks: "opt(bool)",
  })
  .handler(async (evt) => {
    // Handler implementation
  });
```

### Scalar Parameters

Scalar parameters are positional arguments that come before any options hash:

```typescript
.scalar("kind AS string", "category AS opt(string)")
```

This would accept:
- `Kind("software")` - one required param
- `Kind("software", "development")` - with optional second param

### Options Hash

The options hash is always the **last** parameter and uses object syntax:

```km
BackLinks({dedupe: false})
```

## TypeToken System

Options are defined using a TypeToken DSL:

| Token | Meaning | Example Values |
|-------|---------|----------------|
| `string` | String value | `"hello"` |
| `number` | Numeric value | `42`, `3.14` |
| `bool` | Boolean value | `true`, `false` |
| `array(T)` | Array of type T | `["a", "b"]` |
| `opt(T)` | Optional type T | `undefined`, or valid T |
| `enum(a,b,c)` | One of listed values | `"a"`, `"b"`, or `"c"` |
| `T1\|T2` | Union type | Either T1 or T2 |

### Examples

```typescript
{
  name: "string",              // Required string
  count: "opt(number)",        // Optional number
  tags: "array(string)",       // Required array of strings
  mode: "enum(fast,slow)",     // Must be "fast" or "slow"
  exclude: "opt(string|array(string))",  // Optional string OR array
}
```

## Parsing Flow

### Step 1: Handler Regex Matching

In `createHandler.ts`, each handler creates a regex to match its invocation:

```typescript
const re = new RegExp(`${handler}\\(([\\s\\S]*)\\)`);
```

This matches:
- `BackLinks()` → params = `""`
- `BackLinks({dedupe: false})` → params = `"{dedupe: false}"`
- Multiline content (via `[\s\S]*` instead of `.*`)

### Step 2: JS Object to JSON Conversion

Users write JavaScript object literal syntax, but `JSON.parse()` requires quoted keys. The `jsObjectToJson()` function converts:

```
{dedupe: false}  →  {"dedupe": false}
{foo: "bar", baz: true}  →  {"foo": "bar", "baz": true}
```

**Implementation:**
```typescript
function jsObjectToJson(input: string): string {
  return input.replace(
    /([{,]\s*)([a-z_$][\w$]*)\s*:/gi,
    '$1"$2":',
  );
}
```

**Regex breakdown:**
- `[{,]` - After `{` or `,`
- `\s*` - Optional whitespace
- `([a-z_$][\w$]*)` - Capture unquoted key (valid JS identifier)
- `\s*:` - Optional whitespace before colon

### Step 3: JSON Parsing

The converted string is wrapped and parsed:

```typescript
const parsed = JSON.parse(`[ ${jsonCompatible} ]`);
```

Wrapping in array allows parsing both:
- `"value1", "value2", {options}` → `["value1", "value2", {options}]`
- `{options}` → `[{options}]`

### Step 4: Parameter Extraction

The parsed array is split into:
- **Scalar params**: All elements before the options hash (if any)
- **Options hash**: The last element if it's an object

```typescript
const optionsPosition = parsed.findIndex(i => isObject(i));
const scalarParams = optionsPosition === -1 ? parsed : parsed.slice(0, optionsPosition);
const optionsHash = optionsPosition !== -1 ? parsed[optionsPosition] : {};
```

### Step 5: Option Key Validation

All keys in the options hash are checked against the schema:

```typescript
const validKeys = Object.keys(options);
const providedKeys = Object.keys(optionsHash);
const invalidKeys = providedKeys.filter(key => !validKeys.includes(key));

if (invalidKeys.length > 0) {
  return error(`Unknown option(s): ${invalidKeys.join(", ")}`);
}
```

### Step 6: Type Validation

Each provided option value is validated against its TypeToken:

```typescript
function validateOptionType(key: string, value: unknown, typeToken: string): string | null {
  const isOptional = typeToken.startsWith("opt(");
  const innerType = isOptional ? typeToken.slice(4, -1) : typeToken;

  // Handle undefined/null for optional types
  if ((value === undefined || value === null) && isOptional) {
    return null;
  }

  // Handle union types (e.g., "string|array(string)")
  const unionTypes = innerType.split("|").map(t => t.trim());
  const matchesAny = unionTypes.some(type => matchesSingleType(value, type));

  if (!matchesAny) {
    return `Option "${key}" expects ${unionTypes.join(" or ")}, got ${typeof value}`;
  }

  return null; // Valid
}
```

## Error Handling

Errors are displayed in the Obsidian document as callouts:

```
⚡ Error in `km` handler

Handler: BackLinks
Query: BackLinks({foo: true})
Error: The "BackLinks" handler received unknown option(s): "foo". Valid options are: "ignoreTags", "dedupe", "exclude", "excludeCompletedTasks"
```

Error types:
- **Unknown options**: Key not in schema
- **Type mismatch**: Value doesn't match expected type
- **Missing required**: Required scalar param not provided
- **Parse error**: Invalid JSON/syntax

## Known Limitations

### 1. Shallow Array Validation

`array(string)` only checks if value is an array, not if elements are strings:

```typescript
// This passes validation (incorrectly)
{tags: [1, 2, 3]}  // Should fail: elements aren't strings
```

### 2. Nested Parentheses Edge Case

The `opt()` unwrapping uses simple string slicing which can fail with deeply nested types:

```typescript
typeToken.slice(4, -1)  // Removes "opt(" and ")"
```

For `opt(string|array(string))`, this produces `string|array(string` (missing closing paren).

**Current workaround:** Union types with `array()` work because the `|` split happens before the truncated string is used for `array()` matching.

### 3. JS-to-JSON Regex Edge Cases

The regex may incorrectly convert strings containing object-like patterns:

```typescript
{message: "Use {key: value} syntax"}
// Becomes: {"message": "Use {"key": value} syntax"}  // Invalid!
```

### 4. No IDE Support

Users writing `km` blocks get no autocomplete or inline validation. They only see errors after the block is rendered.

## Testing

Tests are in `test/parseParams.test.ts`:

```bash
pnpm test test/parseParams.test.ts
```

Test coverage includes:
- JS to JSON conversion
- Option key validation
- Type validation (primitives, arrays, optionals, unions)

## Future Improvements

Potential enhancements to consider:

1. **Schema library**: Replace TypeToken with Zod/Valibot for robust validation
2. **Deep array validation**: Validate array element types
3. **Better parser**: Use proper tokenizer instead of regex for JS-to-JSON
4. **LSP integration**: Provide autocomplete for km blocks in editor
5. **Codemirror extension**: Inline validation while typing
