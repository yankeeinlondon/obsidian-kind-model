# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an **Obsidian plugin** called "Kind Model" that extends Obsidian with a "kinded model" system for organizing entities in a personal knowledge management vault. The plugin uses the Dataview plugin as a dependency and adds classification, relationships, and metrics to pages via frontmatter conventions.

### Classification Hierarchy

```
Type > Kind > Category > SubCategory
```

- **Type** (`#type/product`) - Top-level grouping of related kinds
- **Kind** (`#kind/software`) - Entity type definition
- **Category** (`#kind/category/development`) - Classification within a kind
- **Subcategory** (`#kind/category/subcategory/ide`) - Further refinement

## Common Commands

```bash
# Development (builds with watch mode, auto-pushes to vault)
pnpm dev

# Build once
pnpm build

# Run tests
pnpm test

# Run single test file
pnpm test path/to/test.test.ts

# Lint
pnpm lint
pnpm lint:fix

# Push built files to Obsidian vault
pnpm push
```

## Architecture

### Entry Point & Plugin Lifecycle

- `src/main.ts` - Plugin entry point extending Obsidian's `Plugin` class
- Plugin maintains state: `kindTags`, `typeTags`, `kindTagLookup`, `kindPathLookup`
- Initialization deferred until Dataview is ready via `deferUntilDataviewReady()`
- Settings persisted in Obsidian's plugin data file

### Core Systems

**Caching (`src/startup/`)**
- Kind/Type definitions cached from configuration file on load
- Refreshed asynchronously after initialization
- Lookups by tag (`lookupKindByTag`) and path (`lookupKindByPath`)
- File monitoring via `on_xxx` event handlers updates cache

**Page API (`src/page/`, `src/api/`)**
- `getPage(ref)` - Returns `Page` (enhanced DvPage) from any page reference type
- `getPageInfo(ref)` - Returns `PageInfo` with classification and relationship data
- `getPageInfoBlock(ref, view)` - Returns `PageBlock` with DOM access and content structure
- `createPageView(view)` - Creates `PageView` from Obsidian's MarkdownView

**Query Handlers (`src/handlers/`)**
- Process `km` codeblocks in markdown files
- Each handler is a higher-order function (e.g., `Kind("software", "productivity")`)
- Available: `BackLinks`, `VideoGallery`, `Kind`, `Book`, `PageEntry`, `IconPage`, `Accounts`, `Journal`, `Children`, `Tasks`, `Debug`
- Created via `createHandler()` factory function

**Codeblock Parser (`src/events/codeblockParser.ts`)**
- Registers handler for `km` language codeblocks
- Routes to appropriate query handler based on parsed content
- Displays errors in UI when handler not found or parsing fails

### Type Imports

Path aliases configured in `tsconfig.json`:
- `~/` maps to `src/`
- `test/` maps to `test/`

### Key Dependencies

- `obsidian` - Obsidian API
- `obsidian-dataview` - Dataview plugin API (required runtime dependency)
- `inferred-types` - Type utilities for narrow types
- `vue` - Used for potential UI components
- `@yankeeinlondon/kind-error` - Error handling utilities

### Globals (`src/globals.ts`)

Exposes Obsidian runtime APIs:
- `obApp` - Main API surface (vault, workspace, metadata, file operations)
- `dvApi` - Dataview API surface
- `moment` - Moment.js from Obsidian global
- `electron` - Electron APIs when running in desktop

### Event System (`src/events/`)

File and editor event handlers:
- `on_file_created`, `on_file_deleted`, `on_file_modified`
- `on_editor_change`, `on_tab_change`, `on_layout_change`

## Build Output

- Vite builds to `dist/` with `main.mjs` entry file
- `push` script copies built files to Obsidian vault for testing
- External dependencies (obsidian, codemirror, etc.) not bundled

## Testing

Tests use Vitest with `describe`/`it` blocks. Test files in `test/` directory.

## Handler Development

### Creating Handlers

Handlers are created using the `createHandler()` factory with a fluent API:

```typescript
export const MyHandler = createHandler("MyHandler")
  .scalar("kind AS string", "category AS opt(string)")  // positional params
  .options({
    myOption: "opt(bool)",
    tags: "array(string)",
  })
  .handler(async (evt) => {
    const { plugin, page, options, scalar, createTable, render } = evt;
    // Handler implementation
    return true;
  });
```

User invocation in markdown:
```km
MyHandler("software", "development", {myOption: true})
```

### TypeToken System

Options use a TypeToken syntax for runtime validation:
- `"string"`, `"number"`, `"bool"` - primitives
- `"opt(T)"` - optional type
- `"array(T)"` - array of type
- `"enum(a,b,c)"` - enum values
- `"T1|T2"` - union types (e.g., `"opt(string|array(string))"`)

See `docs/km-type-validation-and-parsing.md` for parsing internals and known limitations.

### Handler Event Object

Handlers receive an event with:
- `plugin` - KindModelPlugin instance
- `page` - PageInfoBlock with page metadata
- `options` - Parsed user options
- `createTable` - Table rendering factory
- `render` - DOM rendering API
- `dv` - Dataview API access

## Data Freshness

### Two Cache Sources

The plugin uses two data sources with different freshness:

| Source | Access | Freshness |
|--------|--------|-----------|
| Obsidian MetadataCache | `obApp.resolvedLinksFor(path)` | Immediate on save |
| Dataview Index | `page.outlinks`, `page.inlinks` | Delayed (refresh interval) |

### When to Use Each

- **MetadataCache** (`obApp`): For freshness-critical data like current page outlinks
- **Dataview**: For complex queries, page metadata, classifications

Example - prefer MetadataCache for dedupe:
```typescript
// Fresh - uses Obsidian's cache
const outlinkPaths = new Set(obApp.resolvedLinksFor(page.path));

// May be stale - from Dataview
const outlinkPaths = new Set(page.outlinks.map(l => l.path));
```

### KM Block Re-rendering

KM codeblocks re-render when:
- The codeblock content is edited
- The page is reloaded/tab switched
- Layout changes occur
- **Host file metadata changes** (auto-refresh via `KmBlockTracker`)

The auto-refresh system uses a 100ms debounce and compares normalized HTML to avoid unnecessary DOM updates.

See `docs/km-render-flow.md` for detailed rendering lifecycle documentation.

## Key Patterns

### Higher-Order Functions

Most APIs use currying with the plugin instance as the first argument:

```typescript
// Pattern: functionName(plugin)(args)
const page = getPage(p)(link);
const pageInfo = getPageInfo(p)(ref);
const handlers = queryHandlers(p)(evt);
```

This enables composition and partial application throughout the codebase.

### Filter Chain Pattern

When filtering data (like BackLinks), order filters by cost:
1. Cheap Set lookups first (reduces data size)
2. Expensive operations last (e.g., `getPageInfo` per item)

```typescript
links = filterDedupe(page)(links, options?.dedupe ?? true);        // O(1) lookup
links = filterByClassification(p)(links, options?.exclude);        // O(n) getPageInfo
links = filterCompletedTasks(page)(links, options?.excludeCompletedTasks ?? true);
```

### Conservative Filtering

When data is unavailable, keep items rather than filter them:
```typescript
const pageInfo = getPageInfo(p)(link);
if (!pageInfo) return false;  // Don't match = don't exclude = keep the link
```

## Documentation

- `docs/km-render-flow.md` - KM block rendering lifecycle and auto-refresh system
- `docs/km-type-validation-and-parsing.md` - TypeToken parsing, validation, and known limitations
- `docs/handlers.md` - Handler reference
- `docs/page-api.md` - Page API documentation
- `docs/types.md` - Type (not Kind) definition and inheritance
- `docs/classification-hierarchy.md` - Type > Kind > Category > Subcategory structure
