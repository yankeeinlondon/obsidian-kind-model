# Plugin Lifecycle

Understanding plugin lifecycle and event timing is critical for reliable plugins.

## Lifecycle Methods

### onload()

Called when plugin is enabled. Use for:
- Registering commands, views, settings tabs
- Setting up event listeners
- Adding ribbon icons, status bar items

**Important:** Called before vault/workspace fully initialized. Do not access files directly.

### onunload()

Called when plugin is disabled. Used for cleanup, but most registrations auto-cleanup:
- `registerEvent()` - auto-removed
- `registerInterval()` - auto-cleared
- `registerEditorExtension()` - auto-removed

Only manually clean up DOM changes made outside registration methods.

## Initialization Timing

### The onLayoutReady Pattern

```typescript
async onload() {
  // DON'T do this - vault not ready
  // const files = this.app.vault.getMarkdownFiles(); // May be empty!

  // DO this instead
  this.app.workspace.onLayoutReady(() => {
    const files = this.app.vault.getMarkdownFiles(); // Safe
    this.initializePlugin(files);
  });
}
```

### Common Timing Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Empty file list on startup | `getMarkdownFiles()` called in `onload()` | Use `onLayoutReady()` |
| First note not processed | Plugin loads before file opens | Handle `file-open` event or check active view in `onLayoutReady()` |
| Stale data on modify | Reading file immediately after vault event | Use `Vault.process()` for atomic read-modify-write |

## Event Registration

Always use `registerEvent()` for automatic cleanup:

```typescript
// Workspace events
this.registerEvent(
  this.app.workspace.on('file-open', (file) => {
    if (file) this.processFile(file);
  })
);

this.registerEvent(
  this.app.workspace.on('active-leaf-change', (leaf) => {
    // User switched tabs/panes
  })
);

// Vault events
this.registerEvent(
  this.app.vault.on('create', (file) => { /* File created */ })
);

this.registerEvent(
  this.app.vault.on('modify', (file) => { /* File saved to disk */ })
);

this.registerEvent(
  this.app.vault.on('delete', (file) => { /* File deleted */ })
);

this.registerEvent(
  this.app.vault.on('rename', (file, oldPath) => { /* File renamed */ })
);
```

### Editor vs Vault Events

| Event | When It Fires | Use Case |
|-------|---------------|----------|
| `editor-change` | User types in editor | Live UI updates |
| `vault.modify` | File saved to disk | React to final content |

## Processing Active File on Startup

```typescript
async onload() {
  // Register event for future file opens
  this.registerEvent(
    this.app.workspace.on('file-open', (file) => {
      if (file) this.processFile(file);
    })
  );

  // Process currently open file (if any) after layout ready
  this.app.workspace.onLayoutReady(() => {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view?.file) {
      this.processFile(view.file);
    }
  });
}
```

## Intervals and Timeouts

```typescript
// Auto-cleared on unload
this.registerInterval(
  window.setInterval(() => {
    this.periodicTask();
  }, 60000)
);
```

## Related

- [TypeScript API](./typescript-api.md)
- [UI Components](./ui-components.md)
