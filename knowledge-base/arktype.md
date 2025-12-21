---
name: arktype
description: Comprehensive guide to ArkType - TypeScript's 1:1 runtime validator with syntax-first validation, JIT compilation, and zero-dependency performance
created: 2025-12-20
last_updated: 2025-12-20T00:00:00Z
hash: 8d51f3316594ed5b
tags:
  - typescript
  - validation
  - runtime-types
  - performance
  - type-safety
---

# ArkType

**ArkType** is a runtime validation library for TypeScript that aims to close the gap between static types and runtime data. Unlike popular libraries like Zod or Yup that use a "builder" pattern (chaining methods like `.string().min(5)`), ArkType uses a **syntax-first approach** that looks and feels exactly like TypeScript code.

It is often described as "TypeScript's 1:1 validator," optimized to provide an incredible developer experience (DX) with zero-dependency performance.

## Table of Contents

- [What is ArkType?](#what-is-arktype)
- [Core Concepts and Syntax](#core-concepts-and-syntax)
  - [Basic Definitions](#basic-definitions)
  - [Constraints and Intersections](#constraints-and-intersections)
  - [Type Inference](#type-inference)
- [Advanced Features](#advanced-features)
  - [Scopes and Recursion](#scopes-and-recursion)
  - [Generic Types](#generic-types)
  - [Morphs (Transformations)](#morphs-transformations)
  - [Pattern Matching](#pattern-matching)
- [Error Handling and Customization](#error-handling-and-customization)
  - [Basic Error Handling](#basic-error-handling)
  - [Custom Error Messages](#custom-error-messages)
- [Performance and Benchmarking](#performance-and-benchmarking)
  - [Runtime Performance](#runtime-performance)
  - [Type-Level Performance](#type-level-performance)
  - [Performance Comparison](#performance-comparison)
- [Framework Integration](#framework-integration)
  - [Hono Integration](#hono-integration)
  - [Fastify Integration](#fastify-integration)
  - [Standard Schema Compatibility](#standard-schema-compatibility)
- [Migrating from Zod](#migrating-from-zod)
  - [Syntax Comparison](#syntax-comparison)
  - [Common Pattern Translations](#common-pattern-translations)
  - [Migration Checklist](#migration-checklist)
- [Use Cases](#use-cases)
- [Quick Reference](#quick-reference)
- [Resources](#resources)

## What is ArkType?

ArkType is designed to handle everything from simple form validation to complex, high-performance API boundary checks. Its scope includes:

- **Runtime Type System:** A full-featured type system that runs in JavaScript but maintains the logic of TypeScript.
- **Static Type Inference:** Automatically generates TypeScript types from your definitions—no need to write a separate `interface`.
- **Advanced Constraints:** Built-in support for ranges (`number > 0`), regex, and even custom "narrow" functions.
- **Cyclic & Recursive Types:** Natively handles circular references (e.g., a `User` having a `Friend` who is also a `User`) without extra boilerplate.
- **Performance:** JIT-compiles definitions into highly optimized JavaScript functions, making it significantly faster than Zod (often 10x–100x).
- **Pattern Matching:** A powerful `.match()` API for handling different data shapes with type-safety.

## Core Concepts and Syntax

ArkType's most distinctive feature is its **string-based definitions**. This allows you to write schemas that look like the types you already know.

### Basic Definitions

```typescript
import { type } from "arktype"

// Define a simple user schema
const user = type({
    name: "string",
    age: "number >= 18", // Range constraint built-in
    "email?": "string.email", // Optional field and built-in email keyword
    tags: "string[]" // Array syntax matches TS
})

// Validation
const { data, errors } = user({
    name: "Alice",
    age: 25,
    tags: ["typescript", "arktype"]
})

if (errors) {
    console.error(errors.summary)
} else {
    console.log(data.name) // Type is inferred as string
}
```

### Constraints and Intersections

You can combine types using standard TypeScript operators like `|` (Union) and `&` (Intersection).

```typescript
// Define a type that must be a string, look like an email, AND be from a specific domain
const staffEmail = type("string.email & /.*@company.com/")

// Numeric ranges and divisors
const evenNumberUnder100 = type("number % 2 & < 100")
```

### Type Inference

ArkType automatically infers TypeScript types from your definitions:

```typescript
const User = type({
    name: "string",
    age: "number >= 18"
})

// Get the inferred TypeScript type
type UserType = typeof User.infer
// Equivalent to: { name: string; age: number }
```

## Advanced Features

### Scopes and Recursion

A "Scope" is a collection of types that can reference each other. This is the primary way to handle complex or circular data structures.

```typescript
import { scope } from "arktype"

// Define a recursive relationship (e.g., a folder structure)
export const types = scope({
    Folder: {
        name: "string",
        "subfolders?": "Folder[]", // Reference self by name
        "files?": "File[]"
    },
    File: {
        name: "string",
        size: "number"
    }
}).export()

const myFolder = types.Folder({
    name: "Documents",
    subfolders: [{ name: "Work", files: [{ name: "resume.pdf", size: 1024 }] }]
})
```

### Generic Types

ArkType handles generics by allowing you to define "Type Functions." These are incredibly useful for common API patterns like paginated responses or standardized API envelopes.

#### Defining a Generic Type

You define a generic by passing a string with a bracketed parameter (e.g., `<T>`) to the `type` function.

```typescript
import { type } from "arktype"

// Define the generic "template"
const paginated = type("<T>", {
    data: "T[]",
    total: "number",
    nextCursor: "string | null"
})

// Use the template to create a specific type
const PaginatedUsers = paginated({
    name: "string",
    id: "number"
})

// The inferred type is:
// { data: { name: string, id: number }[], total: number, nextCursor: string | null }
```

#### Reusable Scopes with Generics

If you are building a large application, it is best to house your generics inside a **Scope**. This allows you to reference your generic templates across your entire project.

```typescript
import { scope } from "arktype"

export const api = scope({
    // Generic envelope
    ApiResponse: type("<Data>", {
        success: "boolean",
        payload: "Data",
        errors: "string[]?"
    }),
    // Standard User type
    User: {
        id: "number",
        email: "string.email"
    },
    // Applying the generic within the same scope
    UserResponse: "ApiResponse<User>"
}).export()

// Usage
const result = api.UserResponse({
    success: true,
    payload: { id: 1, email: "dev@arktype.io" }
})
```

#### Constraints on Generics

Just like TypeScript's `T extends string`, ArkType allows you to constrain your generic parameters.

```typescript
import { type } from "arktype"

// T must be an object with an 'id' property
const identifiable = type("<T extends {id: number}>", {
    item: "T",
    timestamp: "number"
})

// This works:
const valid = identifiable({ id: 1, name: "Item A" })

// This would throw a TypeScript error (and runtime error):
// const invalid = identifiable({ name: "Missing ID" })
```

#### Multiple Generic Parameters

ArkType supports multiple generic parameters, which is perfect for complex structures like `Result<T, E>` or `Map<K, V>`.

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

**Why use ArkType Generics?**

1. **DRY (Don't Repeat Yourself):** You don't have to redefine `total`, `page`, and `limit` for every single list endpoint in your API.
2. **True Inference:** Unlike some libraries where generics lose their "strictness" at runtime, ArkType's JIT compiler generates optimized validation logic specifically for the instantiated version of the generic.
3. **TypeScript Parity:** It feels exactly like writing standard TypeScript, reducing the mental context switch.

### Morphs (Transformations)

**Morphs** are one of ArkType's most powerful features. While standard validation simply checks if data is valid, **Morphs** allow you to transform that data into a new format during the validation process.

This is essential for "cleansing" input, such as converting a string to a `Date` object or trimming whitespace from a username.

#### Basic Morph Usage

A Morph is defined using the `=>` operator within a definition or by using the `.morph()` method.

```typescript
import { type } from "arktype"

// 1. String to Date Morph
const dateSchema = type("string").morph((s) => new Date(s))

const { data, errors } = dateSchema("2024-01-01")
// data is now a native JS Date object
if (!errors) console.log(data.getFullYear()) // 2024

// 2. Formatting Morph
const user = type({
    username: "string > 0",
    // Automatically trim whitespace and lowercase the email
    email: "string.email".morph((s) => s.trim().toLowerCase())
})
```

#### Pipes and Chaining

You can "pipe" data through multiple transformations. This is incredibly useful for sanitizing data before it hits your database.

```typescript
import { type } from "arktype"

const numericId = type("string")
    .pipe((s) => parseFloat(s)) // Step 1: Convert to number
    .pipe((n) => Math.floor(n)) // Step 2: Ensure it's an integer
    .pipe("number > 0")         // Step 3: Validate the final result
```

#### Inverting Morphs (Outbound)

ArkType also supports **Outbound Morphs**. This is useful when you want to transform a validated object back into a "transferrable" format (like JSON) when sending a response.

```typescript
const User = type({
    name: "string",
    createdAt: "string".morph((s) => new Date(s))
}).morph((user) => ({
    ...user,
    // Add a virtual field for the UI
    isNew: user.createdAt.getFullYear() > 2023
}))
```

#### Why use Morphs over manual transformation?

1. **Type Safety:** The output type of the Morph is automatically tracked. If your morph returns a `Date`, ArkType updates the inferred TypeScript type from `string` to `Date`.
2. **Atomicity:** Validation and transformation happen in one step. If the transformation fails (e.g., an invalid date string), it returns a validation error instead of crashing your app.
3. **Encapsulation:** Your validation logic and your "data cleaning" logic live in the same schema definition, preventing "leaky abstractions" where different parts of your app clean data differently.

#### Handling Validation within Morphs

If your transformation logic finds a problem that isn't caught by the basic type check, you can return a "problem" from within the morph.

```typescript
const slug = type("string").morph((s, problems) => {
    if (s.includes(" ")) {
        return problems.mustBe("a URL-friendly slug (no spaces)")
    }
    return s.toLowerCase()
})
```

### Pattern Matching

ArkType provides a `match` function that acts like a type-safe `switch` statement, optimized by set theory.

```typescript
import { match } from "arktype"

const sizeOf = match({
    "string | any[]": (data) => data.length,
    "number | bigint": (data) => data,
    "default": () => 0
})

console.log(sizeOf("hello")) // 5
console.log(sizeOf(42))      // 42
```

## Error Handling and Customization

### Basic Error Handling

ArkType returns a result object with `data` and `errors` properties:

```typescript
const { data, errors } = user({
    name: "Alice",
    age: 25,
    tags: ["typescript", "arktype"]
})

if (errors) {
    console.error(errors.summary) // Human-readable summary
} else {
    console.log(data.name) // Type-safe access
}
```

### Custom Error Messages

ArkType allows you to override default error messages at multiple levels: **global**, **scope**, or **individual type**.

#### Using `.describe()` and `.configure()`

The simplest way to change a message is to describe the expected state. ArkType will use this description to fill in the "must be..." part of the error.

```typescript
import { type } from "arktype"

const password = type("string >= 8")
    .describe("at least 8 characters long")
    .configure({
        // Hide the actual input (sensitive) from the error message
        actual: () => "[REDACTED]"
    })

const result = password("123")
if (result instanceof type.errors) {
    // Output: "must be at least 8 characters long (was [REDACTED])"
    console.log(result.summary)
}
```

#### Advanced Error Context

For more control, you can access the `ctx` (context) to dynamically generate messages based on the rule or the path.

```typescript
const username = type("string").configure({
    message: (ctx) => `${ctx.path} is invalid: Expected ${ctx.expected}, but got ${ctx.actual}`
})
```

#### Configuration Levels

| Level | Scope | Best For... |
| --- | --- | --- |
| **Individual** | `type(...).configure()` | Specific field requirements (e.g., "Password must contain a symbol"). |
| **Scope** | `scope({...}, { codes: {...} })` | Application-wide consistency (e.g., all "email" errors should look the same). |
| **Global** | `import "arktype/config"` | Formatting preferences (e.g., removing the `(was ...)` suffix globally). |

## Performance and Benchmarking

ArkType includes a dedicated sub-package called **`@ark/attest`** (often referred to as ArkAttest) specifically for benchmarking and type-level testing.

While most libraries focus only on **runtime speed**, ArkType's benchmarking tool also tracks **type-level performance** (how much work the TypeScript compiler does), which is often the real reason your IDE or CI gets slow.

### Runtime Performance

You can use the `bench` function to measure how fast your schemas execute. ArkType is famous for its JIT (Just-In-Time) optimization, which often puts it at 10x–100x the speed of Zod.

```typescript
import { bench } from "@ark/attest"
import { type } from "arktype"
import { z } from "zod"

const data = { name: "Alpha", age: 42 }

// ArkType Benchmark
bench("ArkType Validation", () => {
    const User = type({ name: "string", age: "number" })
    return User(data)
}).run()

// Zod Benchmark (for comparison)
const zodUser = z.object({ name: z.string(), age: z.number() })
bench("Zod Validation", () => {
    return zodUser.parse(data)
}).run()
```

### Type-Level Performance

One of ArkType's unique features is the ability to benchmark the **TypeScript compiler itself**. Large Zod schemas can sometimes hit "Type instantiation is excessively deep" errors. ArkType allows you to snapshot exactly how "expensive" a type is for the compiler.

```typescript
import { bench } from "@ark/attest"
import { type } from "arktype"

// This tracks how many internal "instantiations" TS uses to resolve this type
bench("Complex Type Instantiation", () => {
    return type({
        users: {
            "id": "number",
            "info": {
                "email": "string.email",
                "tags": "string[]"
            }
        }
    })
}).types([452, "instantiations"]) // This number is automatically updated via snapshots
```

### Performance Comparison

If you're curious about where ArkType stands in the broader ecosystem, it typically competes at the top of the "JIT-compiled" category alongside libraries like **Typia**.

| Library | Strategy | Performance | Best For... |
| --- | --- | --- | --- |
| **Zod** | Interpreted | 1x (Baseline) | Standard apps, wide ecosystem |
| **ArkType** | JIT-compiled | ~100x faster | High-perf APIs, complex types |
| **Typia** | AOT-compiled | ~100x+ faster | Maximum speed (requires build step) |

#### Why Benchmarking Matters for ArkType

The author of ArkType notes that while 95% of apps don't *need* the extra 0.001ms of speed, the performance architecture of ArkType allows for:

1. **Lower Latency:** Important for "Hot Paths" in your backend.
2. **Scalability:** Validating 100k objects in a single request without blocking the event loop.
3. **Better DX:** Because the types are optimized, your VS Code autocomplete remains snappy even with massive schemas.

## Framework Integration

ArkType is a "Standard Schema" compliant library, meaning it works out-of-the-box with many modern tools.

### Hono Integration

Hono has first-class support via the `@hono/arktype-validator` package. It provides full type safety for your request body, queries, and parameters.

```typescript
import { Hono } from "hono"
import { arktypeValidator } from "@hono/arktype-validator"
import { type } from "arktype"

const app = new Hono()

const UserSchema = type({
    name: "string",
    age: "number > 0"
})

app.post("/user", arktypeValidator("json", UserSchema), (c) => {
    // 'data' is automatically inferred as { name: string, age: number }
    const data = c.req.valid("json")
    return c.json({ message: `Created user ${data.name}` })
})
```

### Fastify Integration

While Fastify usually uses JSON Schema, you can use ArkType within route handlers or by creating a custom Type Provider. Because ArkType is so fast (JIT-compiled), it matches Fastify's performance philosophy perfectly.

```typescript
import Fastify from "fastify"
import { type } from "arktype"

const server = Fastify()
const Product = type({ id: "number", price: "number > 0" })

server.post("/product", async (request, reply) => {
    const { data, errors } = Product(request.body)

    if (errors) {
        return reply.status(400).send(errors.summary)
    }

    // data is now typed
    return { success: true, price: data.price }
})
```

### Standard Schema Compatibility

If you use libraries like **React Hook Form**, **TanStack Query**, or **tRPC**, you might be worried about switching.

ArkType supports the **Standard Schema** specification. This means most modern libraries can accept an ArkType schema anywhere they previously accepted a Zod schema without any extra configuration.

```typescript
// Example: Using ArkType with a generic Standard Schema consumer
import { type } from "arktype"

const schema = type({ name: "string" })

// This is compliant with any library expecting a Standard Schema
const result = schema("invalid data")
```

## Migrating from Zod

Because ArkType follows TypeScript's syntax so closely, your code often becomes about **50% shorter** while remaining more readable.

### Syntax Comparison

If you know how to write a type in TypeScript, you already know ArkType.

| Feature | **Zod** (Builder Pattern) | **ArkType** (Syntax-First) |
| --- | --- | --- |
| **String** | `z.string()` | `"string"` |
| **Number Range** | `z.number().min(18)` | `"number >= 18"` |
| **Optional** | `name: z.string().optional()` | `"name?": "string"` |
| **Union** | `z.union([z.string(), z.number()])` | `"string \| number"` |
| **Array** | `z.array(z.string())` | `"string[]"` |
| **Object** | `z.object({ id: z.number() })` | `{ id: "number" }` |
| **Email** | `z.string().email()` | `"string.email"` |
| **Inference** | `type T = z.infer<typeof S>` | `type T = typeof S.infer` |

### Common Pattern Translations

#### Discriminated Unions

ArkType handles discriminated unions **implicitly**. You don't need to use a special `.discriminatedUnion()` method; the JIT compiler automatically detects the discriminant property (like `type` or `kind`) and optimizes for it.

```typescript
// ArkType: Just write the types, it handles the logic automatically
const response = type([
    { status: "'success'", data: "string" },
    "|",
    { status: "'error'", message: "string" }
])
```

#### Complex Constraints (RegEx & Intersection)

In Zod, intersections can sometimes be clunky. In ArkType, you use the `&` operator just like in TS.

```typescript
// ArkType
const Password = type("string >= 8 & /.*[!@#$%^&*].*/")
```

### Migration Checklist

If you're deciding whether to make the jump, consider these three final points:

1. **Speed:** Use ArkType if you have high-throughput APIs or large data arrays (10k+ items).
2. **Readability:** Use ArkType if you hate "chain hell" and want your schemas to look like your TypeScript interfaces.
3. **Complexity:** Use ArkType if you have recursive data structures (like folder trees) which are notoriously difficult to type in Zod.

## Use Cases

- **API Validation:** Perfect for high-traffic Node.js servers where performance is critical.
- **Complex Domain Models:** Use **Scopes** to define deep, interconnected data models with zero drift between your types and runtime logic.
- **Quick Prototyping:** Since the syntax matches TypeScript, you can copy-paste existing type definitions into `type()` and they usually "just work."
- **Data Transformation:** Use **Morphs** to validate and transform data in a single step, maintaining type safety throughout.
- **Pattern Matching:** Use the `match` API for type-safe handling of different data shapes.

## Quick Reference

### ArkType vs. Zod: Key Differences

| Feature | ArkType | Zod |
| --- | --- | --- |
| **Syntax** | Definition Strings (`"string > 5"`) | Chained Methods (`z.string().min(5)`) |
| **Performance** | JIT-compiled (Ultra Fast) | Interpreted (Standard) |
| **Recursion** | Native support via Scopes | Requires `z.lazy()` |
| **Inference** | Automatic from string/object | Requires `z.infer<...>` |
| **Bundle Size** | ~40kB (Zero dependencies) | ~13kB (Zero dependencies) |

> **Note:** While ArkType is slightly larger in bundle size than Zod, it often results in much less code written in your actual application because the definitions are so concise.

### Common Patterns

```typescript
// Optional field
const user = type({ "name?": "string" })

// Union type
const stringOrNumber = type("string | number")

// Array
const stringArray = type("string[]")

// Range constraint
const adult = type("number >= 18")

// Email validation
const email = type("string.email")

// Regex
const slug = type("/^[a-z0-9-]+$/")

// Intersection
const staffEmail = type("string.email & /.*@company.com/")

// Transform
const dateString = type("string").morph((s) => new Date(s))
```

## Resources

- **Official Documentation:** [arktype.io](https://arktype.io)
- **GitHub Repository:** [github.com/arktypeio/arktype](https://github.com/arktypeio/arktype)
- **Benchmarking Package:** `@ark/attest`
- **Hono Integration:** `@hono/arktype-validator`
- **Standard Schema Specification:** Compatible with React Hook Form, TanStack Query, tRPC, and more
