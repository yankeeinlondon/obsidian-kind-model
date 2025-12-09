# TypeScript API

Core classes and interfaces for interacting with Obsidian programmatically.

## Core Classes

### App

Central hub accessed via `this.app`:

```typescript
this.app.vault        // File operations
this.app.workspace    // UI/layout management
this.app.metadataCache // Note metadata (frontmatter, links)
this.app.fileManager  // Safe file operations affecting links
```

### Vault

File system operations with caching and safety:

```typescript
// Read
const content = await this.app.vault.read(file);
const cached = await this.app.vault.cachedRead(file); // Faster, may be stale

// Write
await this.app.vault.create('path/new.md', 'content');
await this.app.vault.modify(file, newContent);
await this.app.vault.delete(file);
await this.app.vault.rename(file, 'new/path.md');

// Atomic read-modify-write (prevents race conditions)
await this.app.vault.process(file, (data) => {
  return data.replace('find', 'replace');
});

// Query
const files = this.app.vault.getMarkdownFiles();
const file = this.app.vault.getAbstractFileByPath('path/note.md');
```

**Best Practice:** Prefer `Vault` over `Adapter` (low-level filesystem). Vault handles caching and race conditions.

### Workspace

Manage panes, views, and layout:

```typescript
// Get active view
const view = this.app.workspace.getActiveViewOfType(MarkdownView);
if (view) {
  const editor = view.editor;
  const file = view.file;
}

// Open file
await this.app.workspace.openLinkText('note.md', '', false);

// Get/create leaves (panes)
const leaf = this.app.workspace.getLeaf(true); // New tab
await leaf.openFile(file);

// Register custom view
this.registerView('my-view', (leaf) => new MyView(leaf));
```

### FileManager

Safe operations that update links:

```typescript
// Rename with link updates
await this.app.fileManager.renameFile(file, 'new-name.md');

// Process frontmatter safely
await this.app.fileManager.processFrontMatter(file, (fm) => {
  fm.tags = fm.tags || [];
  fm.tags.push('new-tag');
});
```

### MetadataCache

Access parsed note metadata:

```typescript
const cache = this.app.metadataCache.getFileCache(file);
if (cache) {
  const frontmatter = cache.frontmatter;
  const links = cache.links;       // Internal links
  const headings = cache.headings;
  const tags = cache.tags;
}

// Listen for cache updates
this.registerEvent(
  this.app.metadataCache.on('changed', (file) => {
    // Metadata re-parsed
  })
);
```

## Key Interfaces

### Command

```typescript
this.addCommand({
  id: 'unique-command-id',
  name: 'Human Readable Name',

  // Simple callback
  callback: () => { /* runs anywhere */ },

  // OR editor callback (only when editor active)
  editorCallback: (editor, view) => {
    editor.replaceSelection('text');
  },

  // Optional: check callback (enables/disables command)
  checkCallback: (checking) => {
    if (someCondition) {
      if (!checking) { /* execute */ }
      return true;
    }
    return false;
  },

  hotkeys: [{ modifiers: ['Mod'], key: 'j' }]
});
```

### Editor

```typescript
// Get/set content
const content = editor.getValue();
editor.setValue(newContent);

// Cursor and selection
const cursor = editor.getCursor();
const selection = editor.getSelection();
editor.replaceSelection('new text');
editor.replaceRange('text', from, to);

// Line operations
const line = editor.getLine(lineNum);
editor.setLine(lineNum, newText);
```

### TFile / TFolder

```typescript
// TFile
file.path      // 'folder/note.md'
file.name      // 'note.md'
file.basename  // 'note'
file.extension // 'md'
file.parent    // TFolder

// TFolder
folder.path
folder.children // TAbstractFile[]
```

## Notice (Toast Notifications)

```typescript
new Notice('Quick message');
new Notice('Longer message', 5000); // 5 second duration
```

## Related

- [Plugin Lifecycle](./plugin-lifecycle.md)
- [UI Components](./ui-components.md)
