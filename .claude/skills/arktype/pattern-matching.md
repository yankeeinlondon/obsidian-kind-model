# Pattern Matching

ArkType provides a `match` function that acts like a type-safe `switch` statement, optimized by set theory. It allows you to handle different data shapes with full type inference.

## Basic Pattern Matching

```typescript
import { match } from "arktype"

const sizeOf = match({
    "string | any[]": (data) => data.length,
    "number | bigint": (data) => data,
    "default": () => 0
})

console.log(sizeOf("hello"))     // 5
console.log(sizeOf([1, 2, 3]))   // 3
console.log(sizeOf(42))          // 42
console.log(sizeOf(true))        // 0 (default)
```

## How It Works

The `match` function:

1. **Tests input against patterns** in order
2. **Invokes the first matching handler**
3. **Provides full type inference** to the handler
4. **Optimizes with set theory** for performance

## Advanced Patterns

### Object Shape Matching

```typescript
import { match } from "arktype"

const handleResponse = match({
    "{ success: true, data: string }": (r) => {
        console.log("Success:", r.data)
        return r.data.toUpperCase()
    },
    "{ success: false, error: string }": (r) => {
        console.error("Error:", r.error)
        throw new Error(r.error)
    },
    "default": () => {
        throw new Error("Unknown response format")
    }
})

handleResponse({ success: true, data: "hello" })  // "HELLO"
handleResponse({ success: false, error: "failed" }) // Throws
```

### Discriminated Union Handling

```typescript
import { match } from "arktype"

type Event =
    | { type: "click", x: number, y: number }
    | { type: "keypress", key: string }
    | { type: "scroll", delta: number }

const handleEvent = match({
    "{ type: 'click' }": (e) => {
        console.log(`Clicked at ${e.x}, ${e.y}`)
    },
    "{ type: 'keypress' }": (e) => {
        console.log(`Key pressed: ${e.key}`)
    },
    "{ type: 'scroll' }": (e) => {
        console.log(`Scrolled by ${e.delta}`)
    }
})
```

## Match vs Switch

### Traditional Switch

```typescript
function handleValue(val: unknown) {
    if (typeof val === "string") {
        return val.length
    } else if (typeof val === "number") {
        return val
    } else if (Array.isArray(val)) {
        return val.length
    } else {
        return 0
    }
}
```

### Pattern Match

```typescript
const handleValue = match({
    "string | any[]": (val) => val.length,
    "number": (val) => val,
    "default": () => 0
})
```

Benefits:

- **More concise** - No manual type guards
- **Type-safe** - Handlers know exact types
- **Optimized** - Set theory optimization
- **Exhaustive checking** - TypeScript warns on missing cases

## Complex Patterns

### Nested Structures

```typescript
const processData = match({
    "{ user: { role: 'admin' } }": (data) => {
        return `Admin: ${data.user.name}`
    },
    "{ user: { role: 'user' } }": (data) => {
        return `User: ${data.user.name}`
    },
    "{ user: object }": (data) => {
        return `Unknown role: ${data.user.name}`
    }
})
```

### Array Patterns

```typescript
const handleArray = match({
    "string[]": (arr) => arr.join(", "),
    "number[]": (arr) => arr.reduce((a, b) => a + b, 0),
    "any[]": (arr) => arr.length,
    "default": () => "Not an array"
})
```

## Performance

ArkType's `match` uses **set theory optimization**:

- **Automatic discriminant detection** - Identifies the fastest property to check
- **JIT compilation** - Compiles to optimized JavaScript
- **No repeated checks** - Each pattern tested at most once

This makes it significantly faster than manual `if-else` chains for complex unions.

## Best Practices

- **Order patterns from specific to general** - More specific patterns should come first
- **Always include a default** - Handle unexpected cases gracefully
- **Use literal types** - `"'success'"` for string literals in patterns
- **Keep handlers pure** - Avoid side effects when possible
- **Leverage type inference** - Let TypeScript infer handler parameter types

## Common Pitfalls

### Pattern Order Matters

```typescript
// WRONG: Generic pattern catches everything
const bad = match({
    "string": (s) => s.length,
    "string.email": (s) => s.includes("@") // Never reached!
})

// CORRECT: Specific patterns first
const good = match({
    "string.email": (s) => s.includes("@"),
    "string": (s) => s.length
})
```

### Missing Default Case

```typescript
// RISKY: No default handler
const risky = match({
    "number": (n) => n * 2,
    "string": (s) => s.length
})

// SAFE: Always have a default
const safe = match({
    "number": (n) => n * 2,
    "string": (s) => s.length,
    "default": () => 0
})
```

## Related

- [Scopes and Recursion](./scopes-recursion.md) - Use scoped types in patterns
- [Constraints and Intersections](./constraints.md) - Complex patterns with constraints
