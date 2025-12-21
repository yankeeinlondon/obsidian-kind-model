# Framework Integration

ArkType is a **Standard Schema** compliant library, meaning it integrates seamlessly with modern web frameworks. This document covers integration patterns for popular frameworks.

## Standard Schema Compliance

ArkType implements the [Standard Schema](https://github.com/standard-schema/standard-schema) specification, which means:

- **Universal compatibility** - Works with any library expecting Standard Schema
- **No adapter needed** - Direct integration with React Hook Form, TanStack Query, tRPC, etc.
- **Consistent API** - Same validation interface across frameworks

```typescript
import { type } from "arktype"

const schema = type({ name: "string" })

// Standard Schema compliant libraries can use this directly
const result = schema({ name: "Alice" })
```

## Hono Integration

Hono provides first-class ArkType support via `@hono/arktype-validator`:

```typescript
import { Hono } from "hono"
import { arktypeValidator } from "@hono/arktype-validator"
import { type } from "arktype"

const app = new Hono()

const UserSchema = type({
    name: "string",
    email: "string.email",
    age: "number >= 18"
})

// Validate JSON body
app.post("/user", arktypeValidator("json", UserSchema), (c) => {
    // 'data' is automatically inferred as { name: string, email: string, age: number }
    const data = c.req.valid("json")
    return c.json({ message: `Created user ${data.name}` })
})

// Validate query parameters
const SearchSchema = type({
    q: "string",
    "limit?": "number > 0"
})

app.get("/search", arktypeValidator("query", SearchSchema), (c) => {
    const { q, limit } = c.req.valid("query")
    return c.json({ results: search(q, limit ?? 10) })
})
```

### Hono Validation Targets

```typescript
// Request body (JSON)
arktypeValidator("json", schema)

// Query parameters
arktypeValidator("query", schema)

// Route parameters
arktypeValidator("param", schema)

// Form data
arktypeValidator("form", schema)

// Headers
arktypeValidator("header", schema)

// Cookies
arktypeValidator("cookie", schema)
```

### Custom Error Responses

```typescript
app.post("/user",
    arktypeValidator("json", UserSchema, (result, c) => {
        if (result instanceof type.errors) {
            return c.json({
                success: false,
                errors: result.byPath
            }, 400)
        }
    }),
    (c) => {
        const data = c.req.valid("json")
        return c.json({ success: true, data })
    }
)
```

## Fastify Integration

While Fastify typically uses JSON Schema, ArkType works perfectly in route handlers:

```typescript
import Fastify from "fastify"
import { type } from "arktype"

const server = Fastify()

const ProductSchema = type({
    id: "number",
    name: "string >= 1",
    price: "number > 0"
})

server.post("/product", async (request, reply) => {
    const { data, errors } = ProductSchema(request.body)

    if (errors) {
        return reply.status(400).send({
            success: false,
            message: errors.summary
        })
    }

    // data is fully typed
    const product = await createProduct(data)
    return { success: true, product }
})
```

### Fastify Type Provider (Advanced)

Create a custom Type Provider for schema-first routing:

```typescript
import { FastifyPluginAsync } from "fastify"
import { type as arktype } from "arktype"

const routes: FastifyPluginAsync = async (server) => {
    server.route({
        method: "POST",
        url: "/user",
        schema: {
            body: arktype({
                name: "string",
                email: "string.email"
            })
        },
        handler: async (request, reply) => {
            // request.body is typed from the schema
            const { name, email } = request.body
            return { success: true, name, email }
        }
    })
}
```

## Express Integration

Manual integration with Express middleware:

```typescript
import express from "express"
import { type } from "arktype"

const app = express()
app.use(express.json())

// Validation middleware factory
function validate(schema: any) {
    return (req: any, res: any, next: any) => {
        const result = schema(req.body)

        if (result instanceof type.errors) {
            return res.status(400).json({
                success: false,
                errors: result.byPath
            })
        }

        req.validatedBody = result.data
        next()
    }
}

const UserSchema = type({
    name: "string",
    email: "string.email"
})

app.post("/user", validate(UserSchema), (req, res) => {
    const user = req.validatedBody
    res.json({ success: true, user })
})
```

## React Hook Form

ArkType works with React Hook Form via Standard Schema:

```typescript
import { useForm } from "react-hook-form"
import { type } from "arktype"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"

const schema = type({
    username: "string >= 3",
    email: "string.email",
    age: "number >= 18"
})

function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: standardSchemaResolver(schema)
    })

    const onSubmit = (data) => {
        console.log(data) // Fully typed
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("username")} />
            {errors.username && <span>{errors.username.message}</span>}

            <input {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}

            <input type="number" {...register("age")} />
            {errors.age && <span>{errors.age.message}</span>}

            <button type="submit">Submit</button>
        </form>
    )
}
```

## tRPC Integration

Use ArkType for input validation in tRPC procedures:

```typescript
import { initTRPC } from "@trpc/server"
import { type } from "arktype"

const t = initTRPC.create()

const UserInput = type({
    name: "string",
    email: "string.email"
})

export const appRouter = t.router({
    createUser: t.procedure
        .input((val) => {
            const result = UserInput(val)
            if (result instanceof type.errors) {
                throw new Error(result.summary)
            }
            return result.data
        })
        .mutation(({ input }) => {
            // input is fully typed
            return createUser(input)
        })
})
```

## Next.js API Routes

Validate API route inputs:

```typescript
import { type } from "arktype"
import type { NextApiRequest, NextApiResponse } from "next"

const UserSchema = type({
    name: "string",
    email: "string.email"
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const result = UserSchema(req.body)

    if (result instanceof type.errors) {
        return res.status(400).json({
            error: "Validation failed",
            details: result.byPath
        })
    }

    const user = await createUser(result.data)
    res.status(201).json(user)
}
```

## GraphQL Integration

Validate resolver inputs:

```typescript
import { type } from "arktype"

const CreateUserInput = type({
    name: "string",
    email: "string.email",
    age: "number >= 18"
})

const resolvers = {
    Mutation: {
        createUser: async (_, args) => {
            const result = CreateUserInput(args.input)

            if (result instanceof type.errors) {
                throw new Error(`Validation failed: ${result.summary}`)
            }

            return createUser(result.data)
        }
    }
}
```

## Performance Considerations

### Why ArkType for High-Traffic APIs

1. **JIT Compilation** - Schemas compile to optimized functions, not interpreted on every request
2. **Zero Dependencies** - Smaller install footprint
3. **Type-Level Performance** - Faster TypeScript compilation for large schemas
4. **Set Theory Optimization** - Discriminated unions validated in O(1) time

### Benchmarks

ArkType is typically **10x-100x faster** than Zod for validation:

- **Single object validation** - ~0.001ms vs ~0.01ms (Zod)
- **Array of 10k objects** - ~10ms vs ~1000ms (Zod)
- **Complex nested schemas** - ~0.005ms vs ~0.5ms (Zod)

For most applications, this doesn't matter. For high-throughput APIs (>1000 req/s), it's significant.

## Best Practices

- **Reuse schemas** - Define once, use in multiple routes
- **Use scopes for large APIs** - Group related schemas together
- **Validate early** - Check input at API boundaries
- **Return structured errors** - Use `result.byPath` for field-specific errors
- **Leverage type inference** - Let TypeScript infer types from schemas
- **Test error cases** - Verify error messages are user-friendly

## Common Patterns

### Shared Schema Library

```typescript
// schemas/user.ts
import { scope } from "arktype"

export const userSchemas = scope({
    CreateUser: {
        name: "string >= 1",
        email: "string.email",
        "age?": "number >= 18"
    },
    UpdateUser: {
        "name?": "string >= 1",
        "email?": "string.email",
        "age?": "number >= 18"
    },
    UserId: "string.uuid"
}).export()
```

### Validation Middleware

```typescript
function validateBody(schema: any) {
    return (req: any, res: any, next: any) => {
        const result = schema(req.body)

        if (result instanceof type.errors) {
            return res.status(400).json({
                success: false,
                errors: Object.entries(result.byPath).map(([field, errors]) => ({
                    field,
                    message: errors[0].message
                }))
            })
        }

        req.validated = result.data
        next()
    }
}
```

## Related

- [Custom Error Messages](./error-messages.md) - Format errors for API responses
- [Generics](./generics.md) - Reusable API response envelopes
- [Benchmarking](./benchmarking.md) - Measure validation performance
