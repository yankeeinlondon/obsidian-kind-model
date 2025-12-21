# Benchmarking

ArkType includes **@ark/attest**, a dedicated benchmarking tool that tracks both **runtime performance** (execution speed) and **type-level performance** (TypeScript compiler work). This makes it unique among validation libraries.

## Why Benchmark Both?

Most libraries focus only on runtime speed, but type-level performance matters too:

- **Runtime performance** - How fast validation executes
- **Type-level performance** - How much work the TypeScript compiler does
- **IDE responsiveness** - Complex types can slow down autocomplete
- **CI build times** - "Type instantiation is excessively deep" errors

ArkType optimizes both.

## Runtime Benchmarking

### Basic Benchmark

```typescript
import { bench } from "@ark/attest"
import { type } from "arktype"

const data = { name: "Alice", age: 42 }

bench("ArkType Validation", () => {
    const User = type({ name: "string", age: "number" })
    return User(data)
}).run()

// Output:
// ArkType Validation: 0.0012ms average (1000 iterations)
```

### Comparing Libraries

```typescript
import { bench } from "@ark/attest"
import { type } from "arktype"
import { z } from "zod"

const data = { name: "Alice", age: 42 }

// ArkType
bench("ArkType", () => {
    const User = type({ name: "string", age: "number" })
    return User(data)
}).run()

// Zod (for comparison)
bench("Zod", () => {
    const zodUser = z.object({ name: z.string(), age: z.number() })
    return zodUser.parse(data)
}).run()

// Typical results:
// ArkType: ~0.001ms
// Zod: ~0.01ms (10x slower)
```

## Type-Level Benchmarking

Track how many TypeScript "instantiations" a type requires:

```typescript
import { bench } from "@ark/attest"
import { type } from "arktype"

bench("Complex Type Instantiation", () => {
    return type({
        users: {
            id: "number",
            info: {
                email: "string.email",
                tags: "string[]"
            }
        }
    })
}).types([452, "instantiations"])
// The number 452 is automatically updated via snapshots
```

### Why This Matters

Large Zod schemas can hit TypeScript's instantiation depth limit:

```
Error: Type instantiation is excessively deep and possibly infinite.
```

ArkType's JIT compilation approach uses fewer instantiations, avoiding this error.

## Performance Comparison Table

| Library | Strategy | Runtime Speed | Type-Level Cost | Best For |
|---------|----------|---------------|-----------------|----------|
| **Zod** | Interpreted | 1x (baseline) | High | Standard apps, wide ecosystem |
| **ArkType** | JIT-compiled | ~100x faster | Low | High-perf APIs, complex types |
| **Typia** | AOT-compiled | ~100x+ faster | Very Low | Maximum speed (requires build step) |
| **Joi** | Runtime-only | ~0.5x | N/A (no TS types) | Legacy JavaScript |

## Real-World Performance

### Single Object

```typescript
const User = type({
    id: "number",
    name: "string",
    email: "string.email",
    age: "number >= 18"
})

// ArkType: ~0.001ms
// Zod: ~0.01ms
```

### Array of 10k Objects

```typescript
const users = Array(10000).fill({
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 25
})

// ArkType: ~10ms
// Zod: ~1000ms (100x slower)
```

### Complex Nested Schema

```typescript
const ComplexSchema = type({
    user: {
        profile: {
            personalInfo: {
                name: "string",
                email: "string.email",
                "age?": "number >= 18"
            },
            settings: {
                theme: "'light' | 'dark'",
                notifications: "boolean"
            }
        },
        posts: {
            id: "number",
            content: "string",
            tags: "string[]"
        }[]
    }
})

// ArkType: ~0.005ms
// Zod: ~0.5ms (100x slower)
```

## When Performance Matters

### 95% of Apps Don't Need It

For typical applications with <100 req/s:

- Extra 0.01ms per request doesn't matter
- Zod's ecosystem is larger
- Bundle size difference is negligible (13kB vs 40kB)

### When ArkType Wins

1. **High-throughput APIs** - >1000 req/s with validation on every request
2. **Large batch processing** - Validating thousands of items at once
3. **Real-time systems** - WebSocket servers, game servers, streaming data
4. **Complex type models** - Avoiding "excessively deep instantiation" errors
5. **IDE performance** - Large schemas slowing down autocomplete

## Benchmarking Your Own Code

### Setup

```bash
npm install @ark/attest --save-dev
```

### Create a Benchmark

```typescript
// benchmarks/user-validation.bench.ts
import { bench } from "@ark/attest"
import { type } from "arktype"

const User = type({
    name: "string",
    email: "string.email",
    age: "number >= 18",
    tags: "string[]"
})

const testData = {
    name: "Alice",
    email: "alice@example.com",
    age: 25,
    tags: ["typescript", "arktype"]
}

bench("User Validation", () => {
    return User(testData)
}).run()
```

### Run Benchmarks

```bash
npx attest benchmarks/*.bench.ts
```

## Performance Best Practices

### 1. Schema Reuse

```typescript
// SLOW: Create schema on every call
function validateUser(data: unknown) {
    const schema = type({ name: "string" })
    return schema(data)
}

// FAST: Create schema once
const userSchema = type({ name: "string" })

function validateUser(data: unknown) {
    return userSchema(data)
}
```

### 2. Discriminated Unions

ArkType automatically optimizes discriminated unions to O(1):

```typescript
// Automatically optimized - checks 'type' field first
const event = type([
    { type: "'click'", x: "number", y: "number" },
    "|",
    { type: "'keypress'", key: "string" }
])
```

### 3. Use Built-in Validators

```typescript
// FAST: Built-in validator (JIT optimized)
const email = type("string.email")

// SLOWER: Custom regex
const emailRegex = type("string & /^[^@]+@[^@]+\\.[^@]+$/")
```

### 4. Avoid Unnecessary Morphs

```typescript
// SLOWER: Morph every time
const user = type({
    email: "string.email".morph(s => s.toLowerCase())
})

// FASTER: Transform only when needed
const user = type({
    email: "string.email"
})

function createUser(data: unknown) {
    const result = user(data)
    if (!result.errors) {
        return { ...result.data, email: result.data.email.toLowerCase() }
    }
}
```

## Continuous Performance Monitoring

### Snapshot Testing

Use `@ark/attest` to snapshot performance metrics:

```typescript
import { bench } from "@ark/attest"

bench("Critical Path", () => {
    // Your validation logic
}).types([452, "instantiations"])
  .mean([0.05, "ms"])
```

Changes that regress performance will fail tests.

### CI Integration

```json
{
    "scripts": {
        "bench": "attest benchmarks/**/*.bench.ts",
        "test": "npm run bench && vitest"
    }
}
```

## Profiling Tools

### Chrome DevTools

For browser environments:

```typescript
console.time("validation")
const result = schema(data)
console.timeEnd("validation")
```

### Node.js Profiler

```bash
node --prof app.js
node --prof-process isolate-*.log > processed.txt
```

## Related

- [Framework Integration](./framework-integration.md) - Where performance matters most
- [Constraints and Intersections](./constraints.md) - Performance of different constraint types
- [Morphs](./morphs.md) - Performance impact of transformations
