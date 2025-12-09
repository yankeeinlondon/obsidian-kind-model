# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an **Obsidian plugin** called "Kind Model" that extends Obsidian with a "kinded model" system for organizing entities in a personal knowledge management vault. The plugin uses the Dataview plugin as a dependency and adds classification, relationships, and metrics to pages via frontmatter conventions.

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
