---
name: obsidian
description: Expert knowledge for developing Obsidian plugins and themes using TypeScript, CodeMirror 6, and CSS variables - covers plugin lifecycle, Vault API, Workspace API, editor extensions, and styling patterns
hash: 5cab48275e982426
---

# Obsidian Development

Build plugins and themes for Obsidian, the Markdown knowledge base app. Plugins use TypeScript to extend functionality; themes use CSS variables for styling.

## Core Principles

- Extend the `Plugin` class; use `onload()` for setup, `onunload()` for cleanup
- Access app via `this.app`, never the global `app` (debugging only)
- Prefer `Vault` API over `Adapter` for file operations (handles caching, race conditions)
- Use `onLayoutReady()` for startup tasks needing vault/files - `onload()` fires too early
- Register events with `this.registerEvent()` for automatic cleanup on unload
- Mark `@codemirror/*` packages as external - use Obsidian's bundled version
- Use CSS variables (`--text-normal`, `--background-primary`) not hardcoded colors
- Avoid `innerHTML` with user input - use DOM manipulation methods
- Set `isDesktopOnly: true` if using Node.js/Electron APIs (unavailable on mobile)
- Keep `onload()` lightweight - defer expensive operations

## Quick Reference

```typescript
// Basic plugin structure
import { Plugin, Notice } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    // Wait for vault ready if needed
    this.app.workspace.onLayoutReady(() => {
      const files = this.app.vault.getMarkdownFiles();
    });

    // Register command
    this.addCommand({
      id: 'my-command',
      name: 'Do something',
      callback: () => new Notice('Hello!')
    });

    // Register event (auto-cleanup)
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        console.log(`Modified: ${file.path}`);
      })
    );
  }
}
```

## Topics

### Plugin Development

- [Plugin Lifecycle](./plugin-lifecycle.md) - onload, onunload, event timing
- [TypeScript API](./typescript-api.md) - App, Vault, Workspace, FileManager
- [UI Components](./ui-components.md) - Commands, Modals, Settings, Ribbon

### Editor Extensions

- [CodeMirror 6](./codemirror6.md) - StateField, ViewPlugin, decorations

### Theming

- [Themes and CSS](./themes-css.md) - CSS variables, styling patterns

## Common Patterns

### File Operations

```typescript
// Read file
const content = await this.app.vault.read(file);

// Modify file (safe read-modify-write)
await this.app.vault.process(file, (data) => {
  return data.replace('old', 'new');
});

// Create file
await this.app.vault.create('path/note.md', 'content');
```

### Markdown Processing

```typescript
// Code block processor
this.registerMarkdownCodeBlockProcessor('mylang', (source, el, ctx) => {
  el.createEl('pre', { text: source });
});

// Post-processor for rendered markdown
this.registerMarkdownPostProcessor((el, ctx) => {
  el.querySelectorAll('.tag').forEach(tag => {
    // Transform tags
  });
});
```

## Resources

- [Official Developer Docs](https://docs.obsidian.md/Home)
- [Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Sample Theme](https://github.com/obsidianmd/obsidian-sample-theme)
- [CodeMirror 6 Docs](https://codemirror.net/docs/)
