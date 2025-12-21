# Constraints and Intersections

ArkType provides powerful constraint syntax that mirrors TypeScript operators. You can combine types, apply ranges, use regex patterns, and create complex validation rules.

## Range Constraints

ArkType supports mathematical operators for numeric ranges:

```typescript
import { type } from "arktype"

// Basic comparisons
const positive = type("number > 0")
const adult = type("number >= 18")
const underHundred = type("number < 100")
const maxAge = type("number <= 120")

// Combined ranges
const percentage = type("number >= 0 & <= 100")
const teenAge = type("number >= 13 & < 20")
```

## String Constraints

Built-in string validators and length constraints:

```typescript
// Built-in formats
const email = type("string.email")
const url = type("string.url")
const uuid = type("string.uuid")
const creditCard = type("string.creditCard")

// Length constraints
const username = type("string >= 3 & <= 20")
const shortString = type("string < 100")

// Pattern constraints
const slug = type("string & /^[a-z0-9-]+$/")
```

## Regex Patterns

Use regex with the `/pattern/` syntax:

```typescript
// Email from specific domain
const staffEmail = type("string.email & /.*@company\\.com$/")

// Password with special character
const password = type("string >= 8 & /.*[!@#$%^&*].*/")

// Hex color
const hexColor = type("string & /^#[0-9A-Fa-f]{6}$/")

// Phone number (US format)
const phone = type("string & /^\\d{3}-\\d{3}-\\d{4}$/")
```

## Divisibility and Modulo

Check if numbers are divisible by a value:

```typescript
// Even numbers
const even = type("number % 2")

// Multiples of 5
const multiplesOf5 = type("number % 5")

// Combined with range
const evenUnder100 = type("number % 2 & < 100")
```

## Union Types

Use `|` for "either/or" types:

```typescript
// Basic union
const stringOrNumber = type("string | number")

// Multiple types
const id = type("string | number | bigint")

// Object unions (discriminated)
const response = type([
    { status: "'success'", data: "string" },
    "|",
    { status: "'error'", message: "string" }
])
```

## Intersection Types

Use `&` to require multiple constraints:

```typescript
// String that's both email and specific domain
const corpEmail = type("string.email & /.*@corp\\.com$/")

// Number in range and even
const evenInRange = type("number >= 0 & <= 100 & % 2")

// Object intersection
const named = type({ name: "string" })
const aged = type({ age: "number" })
const person = type("named & aged") // Combines both

// Or inline
const person2 = type({
    name: "string"
} & {
    age: "number"
})
```

## Array Constraints

Constrain array length and element types:

```typescript
// Basic arrays
const strings = type("string[]")
const numbers = type("number[]")

// Length constraints
const shortList = type("string[] < 10")
const nonEmpty = type("string[] > 0")
const exactlyThree = type("string[] === 3")

// Combined constraints
const tags = type("string[] >= 1 & <= 5")

// Nested arrays
const matrix = type("number[][]")
```

## Tuple Types

Fixed-length arrays with specific types per position:

```typescript
// Coordinates
const point = type(["number", "number"])

// Mixed types
const record = type(["string", "number", "boolean"])

// Optional elements
const coords = type(["number", "number", "number?"])

// Rest elements
const args = type(["string", "...number[]"])
```

## Literal Types

Exact value matching:

```typescript
// String literals
const success = type("'success'")
const theme = type("'light' | 'dark'")

// Number literals
const zero = type("0")
const oneOrTwo = type("1 | 2")

// Boolean literals
const alwaysTrue = type("true")

// Object with literal fields
const config = type({
    version: "'2.0'",
    mode: "'production' | 'development'"
})
```

## Narrow Functions

Custom validation with arbitrary logic:

```typescript
import { type } from "arktype"

// Custom prime number validator
const prime = type("number").narrow((n, problems) => {
    if (n < 2) return problems.mustBe("at least 2")

    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return problems.mustBe("a prime number")
        }
    }

    return true
})

const result = prime(17)  // Valid
const result2 = prime(18) // Error: "must be a prime number"
```

## Date Constraints

Validate and constrain dates:

```typescript
// Date object
const futureDate = type("Date").narrow((d, problems) => {
    if (d.getTime() <= Date.now()) {
        return problems.mustBe("a future date")
    }
    return true
})

// ISO date string with range
const recentDate = type("string.date").morph(s => new Date(s))
    .narrow((d, problems) => {
        const daysAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
        if (daysAgo > 30) {
            return problems.mustBe("within the last 30 days")
        }
        return true
    })
```

## Complex Constraints

Combine multiple constraint types:

```typescript
// Email with length and domain restrictions
const validEmail = type(
    "string >= 5 & <= 100 & string.email & /.*@(company|partner)\\.com$/"
)

// Port number
const port = type("number >= 1 & <= 65535 & number.integer")

// Percentage with precision
const percentage = type("number >= 0 & <= 100")
    .narrow((n, problems) => {
        if (!Number.isFinite(n)) {
            return problems.mustBe("finite")
        }
        return true
    })
```

## Best Practices

- **Order constraints logically** - Type first, then refinements
- **Use built-ins when available** - Prefer `string.email` over custom regex
- **Combine with morphs** - Validate before transforming
- **Keep narrow functions simple** - Complex logic belongs elsewhere
- **Document custom constraints** - Explain non-obvious validation rules

## Performance Tips

- **Built-in validators are optimized** - Use `string.email` instead of custom regex
- **Narrow is slower than constraints** - Prefer declarative syntax when possible
- **Regex is compiled** - Patterns are JIT-optimized, not interpreted each time

## Common Patterns

### API Input Validation

```typescript
const createUserInput = type({
    username: "string >= 3 & <= 20 & /^[a-zA-Z0-9_]+$/",
    email: "string.email",
    age: "number >= 18 & <= 120",
    "role?": "'user' | 'admin'"
})
```

### Configuration Schema

```typescript
const config = type({
    port: "number >= 1024 & <= 65535",
    host: "string.url",
    maxConnections: "number > 0 & number.integer",
    ssl: "boolean",
    "logLevel?": "'debug' | 'info' | 'warn' | 'error'"
})
```

### Form Validation

```typescript
const signupForm = type({
    email: "string.email & /.*@gmail\\.com$/",
    password: "string >= 8 & /.*[A-Z].*/ & /.*[0-9].*/ & /.*[!@#$%^&*].*/",
    confirmPassword: "string",
    terms: "true" // Must be exactly true
}).narrow((data, problems) => {
    if (data.password !== data.confirmPassword) {
        return problems.mustBe("matching passwords")
    }
    return true
})
```

## Related

- [Morphs](./morphs.md) - Transform data after validation
- [Custom Error Messages](./error-messages.md) - Customize constraint error messages
- [Pattern Matching](./pattern-matching.md) - Match against constraint patterns
