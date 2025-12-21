# Scopes and Recursion

ArkType's **Scope** feature allows you to define collections of types that can reference each other, enabling complex and circular data structures without extra boilerplate.

## Key Concepts

A Scope is a collection of named types that can cross-reference. This is the primary way to handle:

- **Circular references** - Types that reference themselves (e.g., tree structures)
- **Interconnected types** - Types that reference other types in the same scope
- **Domain models** - Complex business logic with multiple related entities

## Basic Scope Usage

```typescript
import { scope } from "arktype"

// Define a recursive folder structure
export const types = scope({
    Folder: {
        name: "string",
        "subfolders?": "Folder[]",  // Reference self by name
        "files?": "File[]"
    },
    File: {
        name: "string",
        size: "number"
    }
}).export()

// Usage
const myFolder = types.Folder({
    name: "Documents",
    subfolders: [{
        name: "Work",
        files: [{ name: "resume.pdf", size: 1024 }]
    }]
})

if (myFolder.errors) {
    console.error(myFolder.errors.summary)
} else {
    console.log(myFolder.data.name) // Fully typed
}
```

## Why Scopes?

### Without Scopes (Zod approach)

```typescript
// Zod requires z.lazy() and type assertions
const FolderSchema: z.ZodType<Folder> = z.object({
    name: z.string(),
    subfolders: z.lazy(() => FolderSchema).array().optional(),
    files: z.lazy(() => FileSchema).array().optional()
})
```

### With Scopes (ArkType approach)

```typescript
// Clean, natural type references
const types = scope({
    Folder: {
        name: "string",
        "subfolders?": "Folder[]",
        "files?": "File[]"
    }
}).export()
```

## Advanced Pattern: Social Graph

```typescript
import { scope } from "arktype"

export const social = scope({
    User: {
        id: "number",
        email: "string.email",
        "friends?": "User[]",          // Self-reference
        "posts?": "Post[]"             // Cross-reference
    },
    Post: {
        id: "number",
        content: "string",
        author: "User",                 // Cross-reference
        "comments?": "Comment[]"
    },
    Comment: {
        id: "number",
        text: "string",
        author: "User",
        post: "Post"
    }
}).export()

// All types are now available with full validation
const user = social.User({
    id: 1,
    email: "dev@arktype.io",
    friends: [{ id: 2, email: "friend@arktype.io" }]
})
```

## Exporting Types

When you call `.export()`, you get an object with all named types as properties:

```typescript
const types = scope({
    User: { name: "string" },
    Post: { title: "string" }
}).export()

// Access individual types
const user = types.User({ name: "Alice" })
const post = types.Post({ title: "Hello" })

// TypeScript inference works
type User = typeof types.User.infer
type Post = typeof types.Post.infer
```

## Best Practices

- **Use scopes for domain models** - Group related types together
- **Export scopes as modules** - One scope per business domain
- **Name types clearly** - Use PascalCase for type names in scopes
- **Keep scopes focused** - Don't put unrelated types in the same scope
- **Reference by string name** - Use `"User"` not `User` within scope definitions

## Common Pitfalls

### Circular Reference Without Scope

```typescript
// WRONG: This doesn't work
const User = type({
    name: "string",
    friends: "User[]"  // Error: User is not defined yet
})
```

### Solution: Use a Scope

```typescript
// CORRECT: Define in a scope
const types = scope({
    User: {
        name: "string",
        friends: "User[]"
    }
}).export()
```

## Related

- [Generics](./generics.md) - Combine scopes with generic type functions
- [Pattern Matching](./pattern-matching.md) - Use scoped types in match expressions
