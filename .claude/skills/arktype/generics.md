# Generics

ArkType handles generics through **Type Functions**—reusable templates that accept type parameters. This is essential for common API patterns like paginated responses, result envelopes, and standardized data structures.

## Defining a Generic Type

Define a generic by passing a string with bracketed parameters (e.g., `<T>`) followed by the definition that uses those parameters:

```typescript
import { type } from "arktype"

// Generic template for paginated data
const paginated = type("<T>", {
    data: "T[]",
    total: "number",
    nextCursor: "string | null"
})

// Instantiate with a specific type
const PaginatedUsers = paginated({
    name: "string",
    id: "number"
})

// Inferred type:
// {
//   data: { name: string, id: number }[],
//   total: number,
//   nextCursor: string | null
// }
```

## Generics in Scopes

For large applications, house generics inside a **Scope** to reference templates across your entire project:

```typescript
import { scope } from "arktype"

export const api = scope({
    // Generic envelope
    ApiResponse: type("<Data>", {
        success: "boolean",
        payload: "Data",
        "errors?": "string[]"
    }),

    // Standard User type
    User: {
        id: "number",
        email: "string.email"
    },

    // Apply the generic within the same scope
    UserResponse: "ApiResponse<User>"
}).export()

// Usage
const result = api.UserResponse({
    success: true,
    payload: { id: 1, email: "dev@arktype.io" }
})

if (result.errors) {
    console.error(result.errors.summary)
}
```

## Constraints on Generics

Just like TypeScript's `T extends X`, ArkType allows you to constrain generic parameters:

```typescript
import { type } from "arktype"

// T must be an object with an 'id' property
const identifiable = type("<T extends {id: number}>", {
    item: "T",
    timestamp: "number"
})

// This works
const valid = identifiable({ id: 1, name: "Item A" })

// TypeScript and runtime error - missing 'id'
// const invalid = identifiable({ name: "Missing ID" })
```

## Multiple Type Parameters

ArkType supports multiple generic parameters for complex structures like `Result<T, E>` or `Map<K, V>`:

```typescript
import { type } from "arktype"

const result = type("<T, E>", {
    "success: true": { data: "T" },
    "success: false": { error: "E" }
})

const MyResponse = result("string", "number")

// Validates either:
// { success: true, data: "Hello" }
// OR
// { success: false, error: 404 }
```

## Common Generic Patterns

### API Envelope

```typescript
const envelope = type("<T>", {
    status: "number",
    message: "string",
    "data?": "T"
})

const UserEnvelope = envelope({
    id: "number",
    name: "string"
})
```

### List Response

```typescript
const list = type("<T>", {
    items: "T[]",
    page: "number",
    limit: "number",
    total: "number"
})

const ProductList = list({
    id: "number",
    name: "string",
    price: "number > 0"
})
```

### Nullable/Optional Wrapper

```typescript
const nullable = type("<T>", "T | null")
const optional = type("<T>", "T | undefined")

const NullableString = nullable("string")
const OptionalNumber = optional("number")
```

## Why Use ArkType Generics?

1. **DRY (Don't Repeat Yourself)** - Reuse common patterns across your API
2. **True Type Inference** - JIT compiler generates optimized validation for each instantiation
3. **TypeScript Parity** - Feels exactly like writing standard TypeScript generics
4. **Performance** - No runtime penalty for generic abstractions
5. **Encapsulation** - Generic logic lives in one place

## Best Practices

- **Use descriptive parameter names** - `<Data>` is clearer than `<T>` for APIs
- **House generics in scopes** - Makes them available project-wide
- **Add constraints when needed** - Prevent invalid instantiations early
- **Keep generics simple** - Complex generics are hard to debug

## Related

- [Scopes and Recursion](./scopes-recursion.md) - Combine generics with recursive types
- [Framework Integration](./framework-integration.md) - Use generics in API handlers
