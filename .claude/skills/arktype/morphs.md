# Morphs

**Morphs** allow you to transform data during the validation process. While standard validation checks if data is valid, morphs enable "data cleansing"—converting strings to Dates, trimming whitespace, normalizing input, and more.

## Key Concepts

- **Transformation during validation** - Validation and data transformation happen in one atomic step
- **Type-safe transformations** - Output types are automatically tracked by TypeScript
- **Atomicity** - If transformation fails, it returns a validation error instead of crashing
- **Encapsulation** - Validation and cleaning logic live together in the schema

## Basic Morph Usage

Define morphs using the `.morph()` method:

```typescript
import { type } from "arktype"

// String to Date conversion
const dateSchema = type("string").morph((s) => new Date(s))

const { data, errors } = dateSchema("2024-01-01")

if (!errors) {
    console.log(data.getFullYear()) // 2024
    // TypeScript knows 'data' is a Date, not a string
}

// Sanitization morph
const user = type({
    username: "string > 0",
    email: "string.email".morph((s) => s.trim().toLowerCase())
})

const result = user({
    username: "alice",
    email: "  ALICE@EXAMPLE.COM  "
})

// result.data.email === "alice@example.com"
```

## Pipes and Chaining

Chain multiple transformations together with `.pipe()`:

```typescript
import { type } from "arktype"

// Multi-step transformation pipeline
const numericId = type("string")
    .pipe((s) => parseFloat(s))     // Step 1: String to number
    .pipe((n) => Math.floor(n))     // Step 2: Ensure integer
    .pipe("number > 0")             // Step 3: Validate positive

const result = numericId("42.7")
// result.data === 42 (as a number)
```

## Handling Validation Within Morphs

Return validation problems from within a morph when transformation logic detects issues:

```typescript
const slug = type("string").morph((s, problems) => {
    if (s.includes(" ")) {
        return problems.mustBe("a URL-friendly slug (no spaces)")
    }
    return s.toLowerCase()
})

const result = slug("hello world")
if (result.errors) {
    console.log(result.errors.summary)
    // "must be a URL-friendly slug (no spaces)"
}
```

## Common Morph Patterns

### String Normalization

```typescript
const normalizedString = type("string")
    .morph(s => s.trim())
    .morph(s => s.toLowerCase())

const email = type("string.email")
    .morph(s => s.trim().toLowerCase())
```

### Type Coercion

```typescript
// String to number with validation
const coercedNumber = type("string")
    .morph(s => parseFloat(s))
    .pipe("number")  // Validate it's a valid number
```

### Date Parsing

```typescript
// ISO string to Date object
const isoDate = type("string")
    .morph(s => new Date(s))
    .morph((d, problems) => {
        if (isNaN(d.getTime())) {
            return problems.mustBe("a valid ISO date string")
        }
        return d
    })
```

### Computed Fields

```typescript
const userWithAge = type({
    name: "string",
    birthYear: "number"
}).morph(user => ({
    ...user,
    age: new Date().getFullYear() - user.birthYear
}))

const result = userWithAge({
    name: "Alice",
    birthYear: 1990
})
// result.data.age is computed automatically
```

## Outbound Morphs

Transform validated data back into a transferrable format (useful for API responses):

```typescript
const User = type({
    name: "string",
    createdAt: "string".morph((s) => new Date(s))
}).morph((user) => ({
    ...user,
    // Add virtual field for UI
    isNew: user.createdAt.getFullYear() > 2023
}))
```

## Performance Considerations

- **Morphs are JIT-compiled** - Transformation code is optimized along with validation
- **No performance penalty** - Morphs are as fast as manual transformation
- **Avoid heavy computation** - Keep morphs lightweight; delegate complex logic elsewhere

## Why Use Morphs Over Manual Transformation?

### Without Morphs

```typescript
// Separate validation and transformation
const rawUser = userSchema(input)
if (rawUser.errors) return rawUser.errors

const cleanedUser = {
    ...rawUser.data,
    email: rawUser.data.email.trim().toLowerCase(),
    createdAt: new Date(rawUser.data.createdAt)
}
```

### With Morphs

```typescript
// Atomic validation + transformation
const user = type({
    email: "string.email".morph(s => s.trim().toLowerCase()),
    createdAt: "string".morph(s => new Date(s))
})

const result = user(input)
// result.data is already cleaned and transformed
```

## Best Practices

- **Keep morphs pure** - No side effects (API calls, logging, etc.)
- **Chain with pipes** - Use `.pipe()` for multi-step transformations
- **Return problems for errors** - Use the `problems` parameter for validation issues
- **Type inference works** - Let TypeScript infer the transformed type
- **Combine with constraints** - Add validation before or after morphing

## Common Pitfalls

### Morphing Too Early

```typescript
// WRONG: Morph before validation
const age = type("string")
    .morph(s => parseInt(s))  // What if s is not numeric?
    .pipe("number >= 18")

// BETTER: Validate first, then morph
const age = type("string")
    .pipe(s => {
        const n = parseInt(s)
        return isNaN(n) ? undefined : n
    })
    .pipe("number >= 18")
```

### Ignoring Errors

```typescript
// WRONG: Assume morph always succeeds
const date = type("string").morph(s => new Date(s))
// Invalid dates still create Date objects (with NaN time)

// CORRECT: Validate after morphing
const date = type("string")
    .morph(s => new Date(s))
    .morph((d, problems) => {
        if (isNaN(d.getTime())) {
            return problems.mustBe("a valid date string")
        }
        return d
    })
```

## Related

- [Constraints and Intersections](./constraints.md) - Combine morphs with constraints
- [Custom Error Messages](./error-messages.md) - Configure error messages in morphs
