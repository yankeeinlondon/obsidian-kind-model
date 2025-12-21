# Custom Error Messages

ArkType provides multiple levels of error message customization: global, scope-level, and individual type configuration. This allows precise control over validation error output.

## Error Structure

ArkType returns structured errors with detailed information:

```typescript
import { type } from "arktype"

const user = type({
    name: "string",
    age: "number >= 18"
})

const result = user({ name: "Alice", age: 15 })

if (result instanceof type.errors) {
    console.log(result.summary)
    // "age must be at least 18 (was 15)"

    console.log(result.byPath)
    // {
    //   age: [{
    //     path: ["age"],
    //     expected: "number >= 18",
    //     actual: 15,
    //     message: "must be at least 18"
    //   }]
    // }
}
```

## Using `.describe()`

The simplest way to customize error messages:

```typescript
const password = type("string >= 8")
    .describe("at least 8 characters long")

const result = password("short")
if (result instanceof type.errors) {
    console.log(result.summary)
    // "must be at least 8 characters long (was 'short')"
}
```

## Using `.configure()`

Advanced customization with full control:

```typescript
const password = type("string >= 8")
    .configure({
        // Custom message
        message: "Password must be at least 8 characters",

        // Hide actual value (for sensitive data)
        actual: () => "[REDACTED]"
    })

const result = password("123")
if (result instanceof type.errors) {
    console.log(result.summary)
    // "Password must be at least 8 characters (was [REDACTED])"
}
```

## Dynamic Error Messages

Use context to generate dynamic messages:

```typescript
const username = type("string >= 3")
    .configure({
        message: (ctx) =>
            `${ctx.path.join(".")} must be at least 3 characters (got ${ctx.actual?.length} characters)`
    })

const result = username("ab")
if (result instanceof type.errors) {
    console.log(result.summary)
    // "username must be at least 3 characters (got 2 characters)"
}
```

## Context Properties

The `ctx` object provides:

- **path** - Array of property names leading to the error
- **expected** - The expected type/constraint
- **actual** - The actual value that failed validation
- **rule** - The specific rule that failed (e.g., "min", "max", "pattern")

```typescript
const email = type("string.email")
    .configure({
        message: (ctx) => {
            return `"${ctx.actual}" is not a valid email address at ${ctx.path.join(".")}`
        }
    })
```

## Scope-Level Configuration

Configure errors for all types in a scope:

```typescript
import { scope } from "arktype"

const api = scope({
    User: {
        email: "string.email",
        age: "number >= 18"
    }
}, {
    // Scope-wide configuration
    onUndeclaredKey: "delete", // Remove extra properties

    codes: {
        // Customize specific error codes
        "email": () => "Please provide a valid email address",
        "min": (ctx) => `Must be at least ${ctx.expected}`
    }
}).export()
```

## Global Configuration

Set defaults for all ArkType schemas:

```typescript
import "arktype/config"
import { configure } from "arktype"

configure({
    // Remove the "(was ...)" suffix from all errors
    actual: () => undefined,

    // Custom format for all messages
    message: (ctx) => `Validation failed: ${ctx.message}`
})
```

## Field-Specific Messages

Different messages for different fields:

```typescript
const signupForm = type({
    email: "string.email".describe("a valid email address"),
    password: "string >= 8".describe("at least 8 characters"),
    age: "number >= 18".describe("18 or older")
})

const result = signupForm({
    email: "invalid",
    password: "short",
    age: 15
})

if (result instanceof type.errors) {
    result.byPath.email    // "must be a valid email address"
    result.byPath.password // "must be at least 8 characters"
    result.byPath.age      // "must be 18 or older"
}
```

## Internationalization (i18n)

Create localized error messages:

```typescript
const translations = {
    en: {
        email: "must be a valid email",
        password: "must be at least 8 characters"
    },
    es: {
        email: "debe ser un correo válido",
        password: "debe tener al menos 8 caracteres"
    }
}

function createSchema(locale: "en" | "es") {
    const t = translations[locale]

    return type({
        email: "string.email".describe(t.email),
        password: "string >= 8".describe(t.password)
    })
}

const schemaES = createSchema("es")
```

## Hiding Sensitive Data

Prevent sensitive values from appearing in error messages:

```typescript
const creditCard = type("string.creditCard")
    .configure({
        actual: () => "[HIDDEN]"
    })

const ssn = type("string & /^\\d{3}-\\d{2}-\\d{4}$/")
    .configure({
        actual: () => "***-**-****"
    })
```

## Custom Validation Messages

For narrow functions, return custom error messages:

```typescript
const prime = type("number").narrow((n, problems) => {
    if (n < 2) {
        return problems.mustBe("at least 2 for prime checking")
    }

    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return problems.mustBe(`a prime number (divisible by ${i})`)
        }
    }

    return true
})
```

## Comparison of Configuration Levels

| Level | Scope | Best For |
|-------|-------|----------|
| **Individual** | `.configure()` on single type | Field-specific requirements |
| **Scope** | Second param to `scope()` | Application/module consistency |
| **Global** | Import `arktype/config` | Formatting preferences across all schemas |

## Best Practices

- **Use `.describe()` for simple cases** - Cleaner than full `.configure()`
- **Hide sensitive data** - Always configure `actual` for passwords, tokens, etc.
- **Be specific** - Help users understand exactly what's wrong
- **Include context** - Use field names and expected values in messages
- **Avoid technical jargon** - Write for your users, not developers
- **Test error messages** - Validate that errors are clear and actionable

## Framework Integration

### Hono Example

```typescript
import { Hono } from "hono"
import { arktypeValidator } from "@hono/arktype-validator"
import { type } from "arktype"

const UserSchema = type({
    email: "string.email".describe("a valid email address"),
    age: "number >= 18".describe("at least 18 years old")
})

const app = new Hono()

app.post("/user", arktypeValidator("json", UserSchema), (c) => {
    const data = c.req.valid("json")
    return c.json({ success: true, data })
})

// Failed validation returns:
// { success: false, error: "email must be a valid email address" }
```

### API Response Formatting

```typescript
function formatErrors(errors: type.errors) {
    return {
        success: false,
        errors: Object.entries(errors.byPath).map(([path, errs]) => ({
            field: path,
            message: errs[0].message
        }))
    }
}

const result = userSchema(input)
if (result instanceof type.errors) {
    return res.status(400).json(formatErrors(result))
}
```

## Related

- [Constraints and Intersections](./constraints.md) - What triggers these errors
- [Framework Integration](./framework-integration.md) - Using errors in web frameworks
- [Morphs](./morphs.md) - Error handling in transformations
