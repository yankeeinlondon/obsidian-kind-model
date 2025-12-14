# KM Codeblock Rendering Flow

This document describes the rendering lifecycle for `km` codeblocks, including how they are processed, when they re-render, and how data freshness is managed.

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Obsidian Page                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ```km                                                        │  │
│  │  BackLinks()                                                  │  │
│  │  ```                                                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    codeblockParser.ts                               │
│  - Registered via registerMarkdownCodeBlockProcessor("km", ...)     │
│  - Waits for Dataview ready state                                   │
│  - Routes to appropriate handler                                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     createHandler.ts                                │
│  - Parses query parameters                                          │
│  - Creates PageInfoBlock via getPageInfoBlock()                     │
│  - Invokes handler function with event object                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Handler (e.g., BackLinks)                        │
│  - Receives event with page data, options, render API               │
│  - Processes data and renders output to container element           │
└─────────────────────────────────────────────────────────────────────┘
```

## Registration

The `km` codeblock processor is registered in `codeblockParser.ts`:

```typescript
const registration = p.registerMarkdownCodeBlockProcessor("km", callback);
registration.sortOrder = -100;
```

The `sortOrder = -100` ensures the KM processor runs before other processors.

## Dataview Dependency

KM blocks depend on Dataview for page metadata. Processing is deferred until Dataview is ready:

```typescript
if (p.dvStatus !== "ready") {
  // Show loading indicator
  p.deferUntilDataviewReady(async () => {
    // Process handlers once ready
  });
  return;
}
```

## When KM Blocks Re-render

KM codeblocks re-render when:

| Trigger | Description |
|---------|-------------|
| **Codeblock edit** | Editing the content inside the `km` fence triggers re-render |
| **Page reload** | Closing and reopening the page, or switching tabs |
| **Layout change** | Obsidian layout changes (split panes, etc.) |
| **Plugin reload** | Disabling/enabling the plugin |
| **Host file metadata change** | When the file containing the KM block is saved (auto-refresh) |

### Auto-Refresh System

As of the latest update, KM blocks automatically re-render when their host file's metadata changes. This is implemented via `KmBlockTracker` which:

1. **Registers** each KM block when it renders, tracking the element and source
2. **Listens** to `metadataCache.on('changed')` events from Obsidian
3. **Re-renders** all KM blocks for a file when that file's metadata changes
4. **Debounces** refreshes (100ms) to avoid excessive re-renders
5. **Cleans up** stale block references when elements are unmounted

This means:
- Adding/removing links in the page body will update BackLinks within ~100ms of save
- The `dedupe` filter now correctly reflects current page state
- No manual refresh needed for most use cases

## Data Sources and Freshness

### Two Data Sources

KM blocks pull data from two sources with different freshness characteristics:

| Source | Description | Freshness |
|--------|-------------|-----------|
| **Obsidian MetadataCache** | Native Obsidian cache (`app().metadataCache`) | Updated immediately on file save |
| **Dataview Index** | Dataview's processed index (`p.dv`) | Updated on Dataview refresh interval |

### Freshness Strategy

With auto-refresh enabled, KM blocks now re-render when their host file is saved. For critical freshness (like `dedupe` filter), we also use Obsidian's MetadataCache directly:

```typescript
// Uses fresh data from Obsidian's MetadataCache
const outlinkPaths = new Set(obApp.resolvedLinksFor(page.path));
```

vs.

```typescript
// May be stale - comes from Dataview's cache
const outlinkPaths = new Set(page.outlinks.map(l => l.path));
```

## Data Flow Detail

### 1. Page Info Creation

When a KM block renders, `getPageInfoBlock()` creates a `PageInfoBlock`:

```
getPageInfoBlock(p)(evt)
    │
    ├── getPageInfo(p)(filePath)
    │       │
    │       ├── getPage(p)(pg)           → DvPage from Dataview
    │       ├── page.file.outlinks       → Links (from Dataview cache)
    │       ├── page.file.inlinks        → Backlinks (from Dataview cache)
    │       └── ... other metadata
    │
    └── Add codeblock context (el, ctx, sectionInfo)
```

### 2. Handler Execution

The handler receives an event object with:

```typescript
{
  plugin: KindModelPlugin,
  page: PageInfoBlock,        // Contains cached page data
  dv: DataviewApi,            // Direct Dataview access
  options: ParsedOptions,     // User-provided options
  createTable: TableFactory,  // Table rendering helper
  render: RenderApi,          // DOM rendering utilities
  // ... other utilities
}
```

### 3. Filter Chain (BackLinks Example)

```
page.inlinks (from Dataview)
        │
        ▼
┌───────────────────────────────────┐
│  1. Self-reference filter         │  Remove links to current page
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  2. ignoreTags filter             │  Remove by tag (existing)
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  3. dedupe filter                 │  Uses MetadataCache (fresh!)
│     obApp.resolvedLinksFor()      │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  4. classification filter         │  Uses getPageInfo (Dataview)
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  5. completedTasks filter         │  Uses page.inlinkTasks (Dataview)
└───────────────────────────────────┘
        │
        ▼
    Render Table
```

## File Event Handlers

The plugin listens to file events for cache management and KM block refresh:

| Event | Handler | Purpose |
|-------|---------|---------|
| `on_file_created` | `on_file_created.ts` | Update kind/type tag lists |
| `on_file_modified` | `on_file_modified.ts` | Refresh tag lists, auto-add frontmatter |
| `on_file_deleted` | `on_file_deleted.ts` | Clean up references |
| `on_editor_change` | `on_editor_change.ts` | Track editor state |
| `on_layout_change` | `on_layout_change.ts` | Handle workspace changes |
| `metadataCache.changed` | `km-block-refresh.ts` | **Auto-refresh KM blocks** in the changed file |

The `metadataCache.changed` event triggers KM block re-renders when files are saved.

## Best Practices

### For Users

1. **Auto-refresh**: KM blocks automatically update when you save the page
2. **Manual refresh**: If needed, edit the KM block (add/remove a space) to force re-render
3. **Page reload**: Close and reopen the tab for fresh data from linked files
4. **Understand defaults**: `dedupe: true` and `excludeCompletedTasks: true` are defaults

### For Developers

1. **Use MetadataCache for freshness-critical data**: `obApp.resolvedLinksFor()` over `page.outlinks`
2. **Keep filters efficient**: Cheap operations first (Set lookups), expensive last (getPageInfo calls)
3. **Add performance monitoring**: Warn if filter chain exceeds 100ms
4. **Handle missing data gracefully**: Return conservative results when data unavailable

## Future Considerations

Potential improvements for data freshness:

1. ~~**Auto-refresh on file change**: Listen to `metadataCache.on('changed')` for the current file~~ ✅ Implemented
2. ~~**Debounced refresh**: Re-render KM blocks after a short delay when page content changes~~ ✅ Implemented (100ms debounce)
3. **Selective invalidation**: Only refresh blocks affected by specific changes (currently refreshes all blocks in file)
4. **Cross-file refresh**: Refresh KM blocks when linked files change (e.g., update BackLinks when a linking page is modified)
