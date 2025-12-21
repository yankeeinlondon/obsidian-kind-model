# Migrating from Zod

This guide helps you migrate from **Zod** to **ArkType**. Because ArkType follows TypeScript syntax, schemas often become **~50% shorter** while remaining more readable.

## Why Migrate?

- **10x-100x performance improvement** - JIT compilation vs interpretation
- **Cleaner syntax** - TypeScript-like definitions instead of builder chains
- **Native recursion** - No `z.lazy()` wrappers needed
- **Faster TypeScript compilation** - Fewer type instantiations
- **Standard Schema compliant** - Works with existing libraries

## Syntax Comparison Cheat Sheet

| Feature | Zod (Builder Pattern) | ArkType (Syntax-First) |
|---------|----------------------|------------------------|
| **String** | `z.string()` | `"string"` |
| **Number** | `z.number()` | `"number"` |
| **Boolean** | `z.boolean()` | `"boolean"` |
| **Number Range** | `z.number().min(18)` | `"number >= 18"` |
| **Optional** | `name: z.string().optional()` | `"name?": "string"` |
| **Union** | `z.union([z.string(), z.number()])` | `"string \| number"` |
| **Array** | `z.array(z.string())` | `"string[]"` |
| **Object** | `z.object({ id: z.number() })` | `{ id: "number" }` |
| **Email** | `z.string().email()` | `"string.email"` |
| **Inference** | `type T = z.infer<typeof S>` | `type T = typeof S.infer` |

## Basic Migration Examples

### Simple Schema

```typescript
// Zod
import { z } from "zod"

const User = z.object({
    name: z.string(),
    age: z.number().min(18),
    email: z.string().email().optional()
})

type User = z.infer<typeof User>

// ArkType
import { type } from "arktype"

const User = type({
    name: "string",
    age: "number >= 18",
    "email?": "string.email"
})

type User = typeof User.infer
```

### Validation

```typescript
// Zod
const result = User.safeParse(data)

if (!result.success) {
    console.error(result.error.format())
} else {
    console.log(result.data)
}

// ArkType
const result = User(data)

if (result instanceof type.errors) {
    console.error(result.byPath)
} else {
    console.log(result.data)
}
```

## Advanced Pattern Translations

### Discriminated Unions

```typescript
// Zod - requires explicit discriminatedUnion
const Response = z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data: z.string() }),
    z.object({ status: z.literal("error"), message: z.string() })
])

// ArkType - automatically detects discriminant
const Response = type([
    { status: "'success'", data: "string" },
    "|",
    { status: "'error'", message: "string" }
])
```

### Recursive Types

```typescript
// Zod - requires z.lazy()
type Folder = {
    name: string
    subfolders?: Folder[]
}

const FolderSchema: z.ZodType<Folder> = z.object({
    name: z.string(),
    subfolders: z.lazy(() => FolderSchema).array().optional()
})

// ArkType - natural recursion with scopes
const { Folder } = scope({
    Folder: {
        name: "string",
        "subfolders?": "Folder[]"
    }
}).export()
```

### Complex Constraints

```typescript
// Zod - chained refinements
const Password = z.string()
    .min(8)
    .regex(/.*[A-Z].*/)
    .regex(/.*[0-9].*/)
    .regex(/.*[!@#$%^&*].*/)

// ArkType - intersection syntax
const Password = type(
    "string >= 8 & /.*[A-Z].*/ & /.*[0-9].*/ & /.*[!@#$%^&*].*/"
)
```

### Transformations

```typescript
// Zod - .transform()
const DateSchema = z.string().transform(s => new Date(s))

// ArkType - .morph()
const DateSchema = type("string").morph(s => new Date(s))
```

## Migration Checklist

### Step 1: Install ArkType

```bash
npm install arktype
```

### Step 2: Replace Imports

```typescript
// Before
import { z } from "zod"

// After
import { type, scope } from "arktype"
```

### Step 3: Convert Schemas

Use the syntax comparison table to convert each schema. Common patterns:

```typescript
// Zod object
z.object({ ... })
// Becomes
type({ ... })

// Zod array
z.array(z.string())
// Becomes
type("string[]")

// Zod optional
field: z.string().optional()
// Becomes
"field?": "string"

// Zod union
z.union([z.string(), z.number()])
// Becomes
type("string | number")
```

### Step 4: Update Validation Calls

```typescript
// Zod
const result = schema.safeParse(data)
if (!result.success) {
    // Handle result.error
}

// ArkType
const result = schema(data)
if (result instanceof type.errors) {
    // Handle result (same structure)
}
```

### Step 5: Update Type Inference

```typescript
// Zod
type User = z.infer<typeof UserSchema>

// ArkType
type User = typeof UserSchema.infer
```

## Common Migration Patterns

### Form Validation

```typescript
// Zod
const SignupSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// ArkType
const SignupSchema = type({
    username: "string >= 3 & <= 20",
    email: "string.email",
    password: "string >= 8",
    confirmPassword: "string"
}).narrow((data, problems) => {
    if (data.password !== data.confirmPassword) {
        return problems.mustBe("matching passwords")
    }
    return true
})
```

### API Response Envelope

```typescript
// Zod
const ApiResponse = <T extends z.ZodType>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: dataSchema,
        errors: z.array(z.string()).optional()
    })

const UserResponse = ApiResponse(z.object({
    id: z.number(),
    name: z.string()
}))

// ArkType
const ApiResponse = type("<Data>", {
    success: "boolean",
    data: "Data",
    "errors?": "string[]"
})

const UserResponse = ApiResponse({
    id: "number",
    name: "string"
})
```

### Default Values

```typescript
// Zod
const Config = z.object({
    port: z.number().default(3000),
    host: z.string().default("localhost")
})

// ArkType (handle defaults after validation)
const Config = type({
    "port?": "number",
    "host?": "string"
})

function getConfig(input: unknown) {
    const result = Config(input)
    if (result.errors) return result

    return {
        port: result.data.port ?? 3000,
        host: result.data.host ?? "localhost"
    }
}
```

## Breaking Changes to Note

### 1. Validation Return Type

```typescript
// Zod returns success/error objects
const result = schema.safeParse(data)
if (result.success) {
    result.data // typed data
} else {
    result.error // error object
}

// ArkType returns data or error instance
const result = schema(data)
if (result instanceof type.errors) {
    result.byPath // errors by field
} else {
    result.data // typed data
}
```

### 2. Error Structure

```typescript
// Zod errors
result.error.format() // { _errors: [], fieldName: { _errors: [...] } }

// ArkType errors
result.byPath // { fieldName: [{ message, expected, actual, path }] }
result.summary // "field must be X (was Y)"
```

### 3. Default Values

Zod supports `.default()` natively; ArkType requires manual handling after validation.

### 4. Preprocessing

```typescript
// Zod
z.preprocess((val) => String(val), z.string())

// ArkType - use .morph() instead
type("unknown").morph(val => String(val)).pipe("string")
```

## Performance Gains

After migration, expect:

- **10x-100x faster validation** - Especially for large arrays
- **Faster TypeScript compilation** - Fewer type instantiations
- **Better IDE performance** - Simpler types = faster autocomplete
- **Smaller code footprint** - ~50% less schema code

## Compatibility Matrix

| Library | Zod Support | ArkType Support | Notes |
|---------|-------------|-----------------|-------|
| **React Hook Form** | ✅ Native | ✅ Via Standard Schema | Use `standardSchemaResolver` |
| **tRPC** | ✅ Native | ✅ Via input wrapper | Wrap in `.input()` |
| **Hono** | ✅ Via plugin | ✅ Native (`@hono/arktype-validator`) | First-class support |
| **TanStack Query** | ✅ Via Standard Schema | ✅ Via Standard Schema | Both work the same |
| **Fastify** | ⚠️ Via JSON Schema | ⚠️ Manual integration | Neither is native |

## Migration Strategy

### Incremental Migration

You can run Zod and ArkType side-by-side:

```typescript
// Keep using Zod for some schemas
import { z } from "zod"
export const LegacySchema = z.object({ ... })

// Migrate new schemas to ArkType
import { type } from "arktype"
export const NewSchema = type({ ... })
```

### Full Migration

1. **Start with leaf schemas** - Simple, standalone types
2. **Move to composite schemas** - Objects that use leaf types
3. **Update tests** - Ensure validation behavior matches
4. **Update error handling** - Adapt to new error structure
5. **Remove Zod** - Once all schemas are migrated

## When NOT to Migrate

- **Small projects** - Migration overhead may not be worth it
- **Heavy Zod ecosystem use** - Some plugins are Zod-specific
- **Team unfamiliar with TypeScript** - Zod's builder pattern is more explicit
- **Need `.default()` everywhere** - Manual default handling is verbose

## Summary

Migration from Zod to ArkType typically involves:

1. **Syntax changes** - Builder chains → TypeScript syntax
2. **Validation calls** - `.safeParse()` → Direct call with error checking
3. **Type inference** - `z.infer<typeof X>` → `typeof X.infer`
4. **Error handling** - Adapt to new error structure

The result: Shorter, faster, more maintainable validation code.

## Related

- [SKILL.md](./SKILL.md) - ArkType core concepts
- [Constraints and Intersections](./constraints.md) - Advanced constraint syntax
- [Framework Integration](./framework-integration.md) - Using ArkType with web frameworks
- [Benchmarking](./benchmarking.md) - Measure performance gains
