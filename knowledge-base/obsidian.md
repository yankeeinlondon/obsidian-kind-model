---
name: obsidian
description: Comprehensive guide to Obsidian plugin and theme development, including TypeScript API, CodeMirror 6 integration, Canvas API, and Bases API
created: 2024-12-09
hash: 7617845c59bc5d3f
tags:
  - obsidian
  - plugins
  - typescript
  - codemirror
  - theming
  - knowledge-management
---

# Obsidian Developer Ecosystem

Obsidian is an extensible knowledge management application built on Electron that stores notes as local Markdown files. The developer ecosystem is built around four core pillars: **Plugins**, **Themes**, **CSS Variables**, and the **TypeScript API**. This guide covers everything from basic plugin development to advanced CodeMirror 6 integration, the Canvas API, and the Bases API.

## Table of Contents

- [Foundation](#foundation)
  - [Plugin Architecture](#plugin-architecture)
  - [Development Environment Setup](#development-environment-setup)
  - [Plugin Lifecycle](#plugin-lifecycle)
- [TypeScript API](#typescript-api)
  - [Core Modules](#core-modules)
  - [Event Handling](#event-handling)
  - [UI Components](#ui-components)
  - [Data Persistence](#data-persistence)
- [Themes and Styling](#themes-and-styling)
  - [Theme Development](#theme-development)
  - [CSS Variables Reference](#css-variables-reference)
  - [Styling Best Practices](#styling-best-practices)
- [CodeMirror 6 Integration](#codemirror-6-integration)
  - [Core Concepts](#codemirror-6-core-concepts)
  - [State Management](#state-management)
  - [Extensions and Decorations](#extensions-and-decorations)
  - [Built-in Editor Components](#built-in-editor-components)
  - [Common Gotchas](#codemirror-6-gotchas)
- [Canvas API](#canvas-api)
  - [Data Structure](#canvas-data-structure)
  - [Manipulating Canvas Elements](#manipulating-canvas-elements)
  - [Custom Node Rendering](#custom-node-rendering)
- [Bases API](#bases-api)
  - [Architecture Overview](#bases-architecture-overview)
  - [Building Custom Views](#building-custom-views)
  - [Advanced Patterns](#bases-advanced-patterns)
- [Platform Considerations](#platform-considerations)
  - [Electron and Node.js](#electron-and-nodejs)
  - [Mobile Compatibility](#mobile-compatibility)
- [Advanced Topics](#advanced-topics)
  - [Hooks and Extension Points](#hooks-and-extension-points)
  - [Markdown Post-Processing](#markdown-post-processing)
  - [Protocol Handlers](#protocol-handlers)
- [Notable Community Plugins](#notable-community-plugins)
- [Quick Reference](#quick-reference)
- [Resources](#resources)

---

## Foundation

### Plugin Architecture

Obsidian plugins are TypeScript applications that extend core functionality through direct interaction with the Obsidian API. Every plugin extends the `Plugin` class from the `obsidian` package.

**Plugin Structure:**

```
my-plugin/
  ├── manifest.json      # Plugin metadata
  ├── main.ts           # Entry point
  ├── styles.css        # Optional styling
  └── package.json      # Dependencies
```

**Manifest Configuration (`manifest.json`):**

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Plugin description",
  "author": "Your Name",
  "authorUrl": "https://your-website.com",
  "fundingUrl": "https://your-funding-page.com",
  "isDesktopOnly": false
}
```

Key manifest considerations:
- The `id` must be unique and should match the folder name
- Always update `minAppVersion` to ensure compatibility
- Set `isDesktopOnly: true` if your plugin uses Node.js or Electron APIs

**Basic Plugin Template:**

```typescript
import { Notice, Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    // Add ribbon icon
    this.addRibbonIcon('dice', 'My Plugin', () => {
      new Notice('Hello, world!');
    });

    // Add command
    this.addCommand({
      id: 'my-command',
      name: 'Execute my command',
      callback: () => {
        // Command logic
      }
    });

    // Add settings tab
    this.addSettingTab(new MySettingTab(this.app, this));
  }

  onunload() {
    // Cleanup when plugin is disabled
  }
}
```

### Development Environment Setup

1. **Environment Setup**: Install Node.js and Git on your local machine. Create a dedicated vault for plugin development.

2. **Clone Sample Plugin**:
   ```bash
   cd .obsidian/plugins
   git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
   cd obsidian-sample-plugin
   npm install
   ```

3. **Build and Watch**:
   ```bash
   npm run dev
   ```

4. **Hot Reloading**: Install the "Hot-Reload" community plugin to automatically refresh your plugin when code changes.

### Plugin Lifecycle

Understanding the plugin lifecycle is crucial for avoiding timing issues and memory leaks.

**`onload()` vs `onLayoutReady()`:**

Your plugin's `onload()` runs during Obsidian startup, before the workspace layout and vault scanning are complete. If your plugin needs to work with the current open note or list all files on startup, wait until initialization completes:

```typescript
async onload() {
  // Register commands, events, etc.

  // Wait for vault to be ready
  this.app.workspace.onLayoutReady(() => {
    // Safe to access vault files and active view here
    const files = this.app.vault.getMarkdownFiles();
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
  });
}
```

**Common Timing Issues:**

- Do NOT call `getMarkdownFiles()` directly in `onload()` - the vault may not be indexed yet
- Use `onLayoutReady()` or listen for the `file-open` event for the first note
- For editor content manipulation, wait until the file is actually open

**Event Registration and Cleanup:**

Always use `this.registerEvent()` so events auto-remove on unload:

```typescript
this.registerEvent(
  this.app.vault.on('modify', (file) => {
    console.log(`File modified: ${file.path}`);
  })
);

this.registerDomEvent(document, 'keydown', (evt) => {
  // Handle keydown event
});

this.registerInterval(
  window.setInterval(() => {
    // Periodic task
  }, 5000)
);
```

---

## TypeScript API

### Core Modules

| Class | Purpose | Key Properties/Methods |
|-------|---------|----------------------|
| `App` | Central application instance | `vault`, `workspace`, `metadataCache`, `fileManager` |
| `Vault` | File system operations | `create`, `read`, `modify`, `delete`, `rename`, `process` |
| `Workspace` | UI layout management | `getLeaf`, `getActiveViewOfType`, `openLinkText`, `registerView` |
| `MetadataCache` | Note metadata access | `getFileCache`, `getCache`, `on('changed')` |
| `FileManager` | Safe file operations | `processFrontMatter`, `renameFile`, `getMarkdownFiles` |

**Vault API vs Adapter API:**

Prefer the `Vault` API over the lower-level `Adapter` API. The Vault API handles race conditions and caching safely:

```typescript
// Preferred: Vault API with atomic read-modify-write
await this.app.vault.process(file, (content) => {
  return content.replace('old', 'new');
});

// Also good: Direct modify
await this.app.vault.modify(file, newContent);

// Avoid: Direct adapter access (unless necessary)
// this.app.vault.adapter.write(...)
```

**FileManager for Safe Operations:**

When modifying frontmatter or renaming files that might affect links:

```typescript
await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
  frontmatter.status = 'completed';
  frontmatter.modified = new Date().toISOString();
});
```

### Event Handling

**Workspace Events:**

```typescript
// File lifecycle
this.app.workspace.on('file-open', (file) => { /* active file changed */ });
this.app.workspace.on('active-leaf-change', (leaf) => { /* tab switched */ });
this.app.workspace.on('layout-change', () => { /* panes resized */ });

// Editor events
this.app.workspace.on('editor-change', (editor, view) => { /* text edited */ });
this.app.workspace.on('editor-paste', (evt, editor, view) => { /* paste event */ });
this.app.workspace.on('editor-menu', (menu, editor, view) => { /* context menu */ });
```

**Vault Events:**

```typescript
this.app.vault.on('create', (file) => { /* file created */ });
this.app.vault.on('modify', (file) => { /* file saved to disk */ });
this.app.vault.on('delete', (file) => { /* file deleted */ });
this.app.vault.on('rename', (file, oldPath) => { /* file renamed */ });
```

**MetadataCache Events:**

```typescript
this.app.metadataCache.on('changed', (file) => {
  // Frontmatter or links changed
  const cache = this.app.metadataCache.getFileCache(file);
});
```

### UI Components

**Commands:**

```typescript
this.addCommand({
  id: 'my-editor-command',
  name: 'My Editor Command',
  editorCallback: (editor, view) => {
    // Requires active editor
    const selection = editor.getSelection();
    editor.replaceSelection(`**${selection}**`);
  }
});

this.addCommand({
  id: 'my-check-command',
  name: 'My Conditional Command',
  checkCallback: (checking) => {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return false;
    if (!checking) {
      // Execute command
    }
    return true;
  }
});
```

**Modals:**

```typescript
import { Modal, App } from 'obsidian';

class MyModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'My Modal' });
    contentEl.createEl('p', { text: 'Modal content here' });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

// Usage
new MyModal(this.app).open();
```

**Settings Tab:**

```typescript
import { PluginSettingTab, Setting } from 'obsidian';

class MySettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('My Setting')
      .setDesc('Description of the setting')
      .addText(text => text
        .setPlaceholder('Enter value')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));
  }
}
```

**Notices:**

```typescript
import { Notice } from 'obsidian';

// Simple notification
new Notice('Operation completed!');

// With duration (ms)
new Notice('This stays longer', 5000);
```

### Data Persistence

```typescript
interface MyPluginSettings {
  mySetting: string;
  enableFeature: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
  enableFeature: true
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

---

## Themes and Styling

### Theme Development

Themes are CSS stylesheets that override Obsidian's default appearance.

**Theme Structure:**

```
my-theme/
  ├── manifest.json
  └── theme.css
```

**Theme Manifest:**

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your Name"
}
```

**Supporting Light and Dark Modes:**

```css
body {
  --font-text-theme: Georgia, serif;
}

.theme-dark {
  --background-primary: #18004F;
  --background-secondary: #220070;
}

.theme-light {
  --background-primary: #ECE4FF;
  --background-secondary: #D9C9FF;
}
```

**Theme Guidelines:**

- Use CSS variables rather than hard-coded styles
- Use low-specificity selectors to avoid breaking on updates
- All assets must be bundled locally (no remote resources)
- Avoid `!important` to allow user overrides via snippets
- Test both light and dark modes

### CSS Variables Reference

**Foundational Variables:**

| Category | Variables | Purpose |
|----------|-----------|---------|
| Colors | `--background-primary`, `--background-secondary`, `--text-normal`, `--text-muted` | Base colors |
| Accent | `--accent-h`, `--accent-s`, `--accent-l` | HSL values for dynamic theming |
| Typography | `--font-text`, `--font-interface`, `--font-monospace` | Font families |
| Spacing | `--size-4-1`, `--size-4-2`, `--radius-s`, `--radius-m` | Layout units |

**Color System:**

```css
/* Base colors (--color-base-00 lightest to --color-base-100 darkest) */
background: var(--color-base-25);

/* Extended colors with RGB variants for opacity */
color: var(--color-red);
background-color: rgba(var(--color-red-rgb), 0.2);

/* Accent colors using HSL */
--interactive-accent: hsl(var(--accent-h), var(--accent-s), var(--accent-l));
```

**Component Variables:**

```css
/* Code blocks */
--code-background, --code-comment, --code-function, --code-string

/* Lists */
--list-indent, --list-marker-color

/* UI Elements */
--ribbon-background, --tab-text-color, --status-bar-background

/* Input components */
--input-focus-border-color, --checkbox-radius, --toggle-thumb-width
```

**Development Tip:** Open Developer Tools (`Ctrl+Shift+I` / `Cmd+Opt+I`) and inspect the `body` element to see all available CSS variables.

### Styling Best Practices

**For Plugin Developers:**

1. **Use Theme Classes**: Add Obsidian classes like `markdown-preview-view` to inherit styles
2. **Leverage CSS Variables**: Never hard-code colors

   ```css
   .myplugin-warning {
     color: var(--text-normal);
     background-color: var(--background-modifier-error);
   }
   ```

3. **Avoid Inline Styles**: Use CSS classes instead of `el.style.color = 'white'`
4. **Use Lucide Icons**: Access via `addRibbonIcon` or the Icon component to match Obsidian's style

---

## CodeMirror 6 Integration

Obsidian's Live Preview editor is built on CodeMirror 6 (CM6), a complete rewrite of the code editor library with a modern, reactive architecture.

### CodeMirror 6 Core Concepts

CM6 uses an immutable state model where all modifications happen through transactions:

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

// Create state
const state = EditorState.create({
  doc: "Hello World",
  extensions: []
});

// Update through transactions
const transaction = state.update({
  changes: { from: 6, to: 11, insert: "CodeMirror" },
  selection: { anchor: 16 }
});

const newState = transaction.state;
```

**Extension Types:**

| Type | Purpose | Use Case |
|------|---------|----------|
| StateField | Extra state properties | Document decorations, custom data |
| ViewPlugin | DOM interactions, viewport logic | Live widgets, dynamic UI |
| Facet | Configurable behavior | Combined settings from multiple sources |
| Compartment | Dynamic reconfiguration | Runtime extension swapping |

### State Management

```typescript
import { StateField, StateEffect } from '@codemirror/state';

// Define a state effect
const addHighlight = StateEffect.define<{from: number, to: number}>();

// Create a state field
const highlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(highlights, tr) {
    highlights = highlights.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(addHighlight)) {
        highlights = highlights.update({
          add: [highlightDecoration.range(e.value.from, e.value.to)]
        });
      }
    }
    return highlights;
  },
  provide: f => EditorView.decorations.from(f)
});
```

### Extensions and Decorations

**Registering Extensions in Obsidian:**

```typescript
import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  onload() {
    this.registerEditorExtension(myExtension);
  }
}
```

**Creating Decorations:**

```typescript
import { Decoration, DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

const highlightPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    // Add decorations to builder
    // builder.add(from, to, Decoration.mark({class: 'my-highlight'}));
    return builder.finish();
  }
}, {
  decorations: v => v.decorations
});
```

**Important:** Do NOT bundle your own `@codemirror/*` packages. Mark them as external and use Obsidian's provided CM6 instance:

```javascript
// esbuild.config.mjs
export default {
  external: [
    'obsidian',
    '@codemirror/state',
    '@codemirror/view',
    '@codemirror/language',
    // ... other @codemirror packages
  ]
};
```

### Built-in Editor Components

Obsidian ships with these CM6 components:

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Live Preview | WYSIWYG markdown editing | StateField with replace decorations |
| Syntax Highlighting | Language-specific coloring | Lezer-based Markdown grammar |
| Spell Checking | Underline misspelled words | Chromium native spellcheck |
| Auto-completion | Link/tag suggestions | EditorSuggest API |
| Auto-pairing | Bracket/quote matching | closeBrackets extension |
| Folding | Collapse headings/lists | fold extension with gutter |
| Search/Replace | Find dialog | search package |

**Live Preview Implementation:**

The Live Preview mode uses a StateField that provides replace decorations to hide Markdown syntax (like `**` for bold, `[[` for links) when not being edited. When the cursor enters a region, the decoration is removed to reveal raw syntax.

**Accessing Obsidian Context from Extensions:**

```typescript
import { editorViewField, editorEditorField } from 'obsidian';

// Inside your extension
const obsidianView = state.field(editorViewField); // Get MarkdownView
const editorView = state.field(editorEditorField); // Get CM EditorView
```

### CodeMirror 6 Gotchas

1. **Reactive Mindset Required**: Don't directly manipulate DOM or state - use transactions

2. **Extension Order Matters**: Later keymaps take precedence
   ```typescript
   // Custom overrides come AFTER defaults
   const extensions = [defaultKeymap, myCustomKeymap];
   ```

3. **Performance Pitfalls**:
   - Avoid expensive computations in view plugin `update()` methods
   - Limit decorations to visible viewport
   - Batch changes into single transactions:
   ```typescript
   // Bad: Multiple transactions
   view.dispatch({ changes: { insert: "a" } });
   view.dispatch({ changes: { insert: "b" } });

   // Good: Single transaction
   view.dispatch({
     changes: [{ insert: "a" }, { insert: "b" }]
   });
   ```

4. **Bundle Size**: Only import what you need; use tree-shaking

5. **Use Obsidian's CM6 Instance**: Never bundle your own @codemirror packages

---

## Canvas API

The Canvas API provides an interface for manipulating Obsidian's visual note-taking canvas, which stores elements as JSON with `.canvas` file extensions based on the open JSON Canvas format.

### Canvas Data Structure

```typescript
interface CanvasFile {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

// Node types
interface TextNode {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // 1-6 for preset colors
}

interface FileNode {
  id: string;
  type: "file";
  file: string; // File path
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WebNode {
  id: string;
  type: "web";
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Edge structure
interface CanvasEdge {
  id: string;
  fromNode: string;
  fromSide: "left" | "right" | "top" | "bottom";
  toNode: string;
  toSide: "left" | "right" | "top" | "bottom";
  color?: string;
  label?: string;
}
```

### Manipulating Canvas Elements

**Accessing the Active Canvas:**

```typescript
function getActiveCanvas(app: App): CanvasView | null {
  const leaf = app.workspace.getActiveViewOfType(ItemView);
  if (leaf?.getViewType() === 'canvas') {
    return leaf as CanvasView;
  }
  return null;
}
```

**Reading and Modifying Canvas Data:**

```typescript
function addTextNode(canvas: CanvasView, text: string, x: number, y: number) {
  const canvasData = JSON.parse(canvas.getViewData());

  const newNode = {
    id: generateId(),
    type: "text",
    text: text,
    x: x,
    y: y,
    width: 200,
    height: 100
  };

  canvasData.nodes.push(newNode);
  canvas.setViewData(JSON.stringify(canvasData));
  return newNode;
}

function connectNodes(canvas: CanvasView, fromId: string, toId: string, label?: string) {
  const canvasData = JSON.parse(canvas.getViewData());

  const newEdge = {
    id: generateId(),
    fromNode: fromId,
    fromSide: "right",
    toNode: toId,
    toSide: "left",
    label: label
  };

  canvasData.edges.push(newEdge);
  canvas.setViewData(JSON.stringify(canvasData));
}
```

**Batch Updates for Performance:**

```typescript
function batchCanvasUpdate(canvas: CanvasView, updates: ((data: any) => void)[]) {
  const canvasData = JSON.parse(canvas.getViewData());
  updates.forEach(update => update(canvasData));
  canvas.setViewData(JSON.stringify(canvasData));
}
```

### Custom Node Rendering

**Auto-Layout Plugin Example:**

```typescript
class AutoLayoutPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'auto-layout-canvas',
      name: 'Auto-layout Canvas',
      checkCallback: (checking: boolean) => {
        const canvas = getActiveCanvas(this.app);
        if (!canvas) return false;
        if (!checking) {
          this.autoLayoutCanvas(canvas);
        }
        return true;
      }
    });
  }

  autoLayoutCanvas(canvas: CanvasView) {
    const data = JSON.parse(canvas.getViewData());
    const levels = this.calculateNodeLevels(data.nodes, data.edges);

    // Apply hierarchical layout
    const horizontalSpacing = 250;
    const verticalSpacing = 150;
    const levelCounts: Record<number, number> = {};

    data.nodes = data.nodes.map((node: any) => {
      const level = levels[node.id] || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;

      return {
        ...node,
        x: level * horizontalSpacing + 50,
        y: levelCounts[level] * verticalSpacing + 50
      };
    });

    canvas.setViewData(JSON.stringify(data));
  }

  calculateNodeLevels(nodes: any[], edges: any[]): Record<string, number> {
    const levels: Record<string, number> = {};
    const rootNodes = nodes.filter(node =>
      !edges.some(edge => edge.toNode === node.id)
    );

    // BFS to assign levels
    const queue = rootNodes.map(node => ({ nodeId: node.id, level: 0 }));
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;
      levels[nodeId] = level;

      edges
        .filter(edge => edge.fromNode === nodeId)
        .forEach(edge => {
          if (!visited.has(edge.toNode)) {
            queue.push({ nodeId: edge.toNode, level: level + 1 });
            visited.add(edge.toNode);
          }
        });
    }

    return levels;
  }
}
```

**Canvas CSS Variables:**

| Variable | Description |
|----------|-------------|
| `--canvas-background` | Canvas background color |
| `--canvas-dot-pattern` | Dot grid pattern color |
| `--canvas-color-1` through `--canvas-color-6` | Preset node colors |

---

## Bases API

The Bases API (introduced in Obsidian 1.10) enables plugin developers to create custom database views that integrate with Obsidian's built-in Bases core plugin.

### Bases Architecture Overview

The API follows an MVC-like pattern:

| Component | Purpose |
|-----------|---------|
| `QueryController` | Manages data queries, filtering, sorting |
| `BasesView` | Abstract base class for custom views |
| `BasesQueryResult` | Provides access to filtered/sorted entries |

**Registering a Custom View:**

```typescript
export default class MyPlugin extends Plugin {
  async onload() {
    this.registerBasesView('my-view', {
      name: 'My Custom View',
      icon: 'lucide-star',
      factory: (controller, containerEl) => {
        return new MyCustomView(controller, containerEl);
      },
      options: () => this.getViewOptions()
    });
  }
}
```

### Building Custom Views

```typescript
import { BasesView, QueryController } from 'obsidian';

export class MyCustomView extends BasesView {
  readonly type = 'my-custom-view';
  private containerEl: HTMLElement;

  constructor(controller: QueryController, parentEl: HTMLElement) {
    super(controller);
    this.containerEl = parentEl.createDiv('my-view-container');
  }

  // Called whenever data changes
  public onDataUpdated(): void {
    this.render();
  }

  private render(): void {
    this.containerEl.empty();

    const data = this.controller.data;
    if (!data?.entries) return;

    data.entries.forEach(entry => {
      const el = this.containerEl.createDiv('entry');

      // Access file properties
      const title = entry.file?.name || 'Untitled';
      const status = entry.properties?.['status']?.value;
      const priority = entry.properties?.['priority']?.value;

      // Access formulas
      const progress = entry.formulas?.['completion']?.value;

      el.createEl('h3', { text: title });
      el.createEl('span', { text: `Status: ${status}`, cls: `status-${status}` });
    });
  }
}
```

**View Configuration Options:**

```typescript
private getViewOptions(): ViewOption[] {
  return [
    {
      type: 'text',
      displayName: 'Title Property',
      key: 'titleProp',
      default: 'file.name'
    },
    {
      type: 'dropdown',
      displayName: 'Layout',
      key: 'layout',
      default: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' }
      ]
    },
    {
      type: 'toggle',
      displayName: 'Show Preview',
      key: 'showPreview',
      default: true
    },
    {
      type: 'slider',
      displayName: 'Card Width',
      key: 'cardWidth',
      default: 300,
      min: 200,
      max: 600
    }
  ];
}
```

### Bases Advanced Patterns

**Timeline View Example:**

```typescript
export class TimelineView extends BasesView {
  readonly type = 'timeline-view';

  public onDataUpdated(): void {
    const container = this.containerEl.createDiv('timeline');
    const entries = this.controller.data?.entries || [];

    // Group by project
    const grouped = this.groupBy(entries, 'project');

    Object.entries(grouped).forEach(([project, items]) => {
      const lane = container.createDiv('timeline-lane');
      lane.createEl('h4', { text: project });

      items.forEach(item => {
        const start = item.properties?.['start-date']?.value;
        const end = item.properties?.['end-date']?.value;

        const bar = lane.createDiv('timeline-bar');
        bar.style.left = this.calculatePosition(start);
        bar.style.width = this.calculateDuration(start, end);
      });
    });
  }

  private groupBy(entries: BasesEntry[], property: string) {
    return entries.reduce((acc, entry) => {
      const key = entry.properties?.[property]?.value || 'Uncategorized';
      (acc[key] ||= []).push(entry);
      return acc;
    }, {} as Record<string, BasesEntry[]>);
  }
}
```

**Kanban View Example:**

```typescript
export class KanbanView extends BasesView {
  private columns = ['To Do', 'In Progress', 'Review', 'Done'];

  public onDataUpdated(): void {
    const board = this.containerEl.createDiv('kanban-board');

    this.columns.forEach(column => {
      const columnEl = board.createDiv('kanban-column');
      columnEl.createEl('h3', { text: column });

      const items = this.controller.data?.entries.filter(entry =>
        entry.properties?.['status']?.value === column
      ) || [];

      items.forEach(item => this.renderCard(columnEl, item));
    });
  }

  private renderCard(container: HTMLElement, entry: BasesEntry): void {
    const card = container.createDiv('kanban-card');
    card.draggable = true;
    card.createEl('h4', { text: entry.file.basename });

    card.addEventListener('dragend', async (e) => {
      const newStatus = this.detectDropColumn(e);
      if (newStatus) {
        await this.updateProperty(entry.file.path, 'status', newStatus);
      }
    });
  }

  private async updateProperty(path: string, property: string, value: any): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm[property] = value;
      });
    }
  }
}
```

**Performance Tips:**

1. **Debounce Updates:**
   ```typescript
   private debouncedRender = debounce(() => this.render(), 100);
   public onDataUpdated(): void { this.debouncedRender(); }
   ```

2. **Virtual Scrolling** for large datasets
3. **Use DocumentFragments** for batch DOM operations:
   ```typescript
   private render(): void {
     const fragment = new DocumentFragment();
     this.controller.data?.entries.forEach(entry => {
       fragment.appendChild(this.createEntryElement(entry));
     });
     this.containerEl.empty();
     this.containerEl.appendChild(fragment);
   }
   ```

---

## Platform Considerations

### Electron and Node.js

Obsidian's desktop app runs on Electron, providing access to Node.js APIs:

```typescript
// Access Node.js modules (desktop only)
import { shell } from 'electron';
shell.openExternal('https://example.com');

// File system access outside vault
import * as fs from 'fs';
const content = fs.readFileSync('/external/path', 'utf8');

// Execute system commands
import { exec } from 'child_process';
exec('git status', (error, stdout) => { /* ... */ });
```

**Platform Checks:**

```typescript
import { Platform } from 'obsidian';

if (Platform.isDesktop) {
  // Desktop-only code
}

if (Platform.isMobile) {
  // Mobile fallback
}

if (Platform.isMacOS) {
  // macOS-specific
}
```

### Mobile Compatibility

Mobile apps use a Capacitor-like environment without Node.js:

- Mark Node.js-dependent plugins with `isDesktopOnly: true`
- Guard Node.js code: `if (!Platform.isMobile) { ... }`
- Mobile lacks status bar and ribbon bar (on phones)
- No hover events on touch devices
- Avoid regex lookbehinds (limited iOS support)

---

## Advanced Topics

### Hooks and Extension Points

**Core Plugin Integrations:**

```typescript
// Provide content for Page Preview hover popups
this.registerHoverLinkSource('my-source', {
  display: 'My Source',
  defaultMod: true
});
```

### Markdown Post-Processing

**Reading Mode Post-Processing:**

```typescript
this.registerMarkdownPostProcessor((el, ctx) => {
  // Transform rendered HTML
  const codeBlocks = el.querySelectorAll('pre > code');
  codeBlocks.forEach(block => {
    // Modify code block rendering
  });
});

// For specific code fence languages
this.registerMarkdownCodeBlockProcessor('dataview', (source, el, ctx) => {
  // Render custom content for ```dataview blocks
  el.createEl('div', { text: 'Processed: ' + source });
});
```

**Editor Suggestions:**

```typescript
import { EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo } from 'obsidian';

class MySuggest extends EditorSuggest<string> {
  onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
    const line = editor.getLine(cursor.line);
    const match = line.slice(0, cursor.ch).match(/@@(\w*)$/);
    if (match) {
      return {
        start: { line: cursor.line, ch: cursor.ch - match[0].length },
        end: cursor,
        query: match[1]
      };
    }
    return null;
  }

  getSuggestions(context: EditorSuggestContext): string[] {
    return ['suggestion1', 'suggestion2'].filter(s =>
      s.includes(context.query)
    );
  }

  renderSuggestion(value: string, el: HTMLElement): void {
    el.setText(value);
  }

  selectSuggestion(value: string): void {
    // Insert the selected suggestion
  }
}

// Register in onload()
this.registerEditorSuggest(new MySuggest(this.app));
```

### Protocol Handlers

Handle custom `obsidian://` URLs:

```typescript
this.registerObsidianProtocolHandler('my-action', (params) => {
  // Handle obsidian://my-action?param=value
  const value = params.param;
  // Process the request
});
```

---

## Notable Community Plugins

These plugins demonstrate advanced Obsidian API usage:

| Plugin | Key Features | Technologies Used |
|--------|-------------|-------------------|
| **Dataview** | Query vault as database, live results | Markdown code block processor, custom query parser, metadataCache |
| **Templater** | Advanced templating with JS execution | Vault events, Modal API, sandboxed code execution |
| **Kanban** | Drag-and-drop task boards | Custom view, DOM event handling, Markdown file sync |
| **Excalidraw** | Drawing and diagrams | Custom ItemView, React integration, protocol handlers |
| **Calendar** | Daily notes navigation | Custom view, date parsing, workspace events |
| **Tasks** | Task management and filtering | CM6 syntax tree, EditorSuggest, Markdown post-processing |
| **Advanced Tables** | Table editing and navigation | CM6 transactions, custom keymaps |
| **Metadata Menu** | Enhanced frontmatter editing | file-menu/editor-menu events, Modal API, field validation |

**Plugin Repositories:**
- Dataview: [github.com/blacksmithgu/obsidian-dataview](https://github.com/blacksmithgu/obsidian-dataview)
- Templater: [github.com/SilentVoid13/Templater](https://github.com/SilentVoid13/Templater)
- Kanban: [github.com/mgmeyers/obsidian-kanban](https://github.com/mgmeyers/obsidian-kanban)
- Excalidraw: [github.com/zsviczian/obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin)
- Tasks: [github.com/obsidian-tasks-group/obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks)

---

## Quick Reference

### Plugin Checklist

- [ ] Manifest has unique `id` matching folder name
- [ ] `minAppVersion` set appropriately
- [ ] `isDesktopOnly` set if using Node.js/Electron APIs
- [ ] Events registered with `this.registerEvent()`
- [ ] Cleanup handled in `onunload()`
- [ ] Vault access uses `onLayoutReady()` callback
- [ ] Settings persisted with `loadData()`/`saveData()`

### API Quick Reference

```typescript
// File operations
this.app.vault.create(path, content);
this.app.vault.read(file);
this.app.vault.modify(file, content);
this.app.vault.delete(file);
this.app.vault.process(file, (content) => newContent);

// Workspace
this.app.workspace.getActiveViewOfType(MarkdownView);
this.app.workspace.getLeaf(true); // New tab
this.app.workspace.openLinkText(linkText, sourcePath);

// Metadata
this.app.metadataCache.getFileCache(file);
this.app.metadataCache.getFirstLinkpathDest(linkpath, sourcePath);

// File manager
this.app.fileManager.processFrontMatter(file, callback);
this.app.fileManager.renameFile(file, newPath);
```

### Event Reference

| Event | Source | Trigger |
|-------|--------|---------|
| `file-open` | workspace | Active file changes |
| `active-leaf-change` | workspace | Tab switch |
| `editor-change` | workspace | Editor content modified |
| `editor-paste` | workspace | Paste event in editor |
| `editor-menu` | workspace | Right-click in editor |
| `layout-change` | workspace | Panes resized |
| `create` | vault | File created |
| `modify` | vault | File saved |
| `delete` | vault | File deleted |
| `rename` | vault | File renamed |
| `changed` | metadataCache | Frontmatter/links changed |

### Common CSS Variables

```css
/* Backgrounds */
--background-primary
--background-secondary
--background-modifier-hover
--background-modifier-error

/* Text */
--text-normal
--text-muted
--text-accent

/* Interactive */
--interactive-normal
--interactive-hover
--interactive-accent

/* Code */
--code-background
--code-normal
```

---

## Resources

**Official Documentation:**
- [Obsidian Developer Docs](https://docs.obsidian.md/Home)
- [Obsidian API Reference](https://docs.obsidian.md/Reference/TypeScript+API)
- [Sample Plugin Repository](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Sample Theme Repository](https://github.com/obsidianmd/obsidian-sample-theme)

**CodeMirror 6:**
- [CodeMirror System Guide](https://codemirror.net/docs/guide/)
- [CodeMirror Reference](https://codemirror.net/docs/ref/)

**Community Resources:**
- [Obsidian Hub](https://publish.obsidian.md/hub)
- [Plugin Developer FAQ](https://liamca.in/Obsidian/API+FAQ/index) (Liam Cain)
- [Obsidian Discord](https://discord.gg/obsidianmd) - #plugin-dev channel

**JSON Canvas Format:**
- [JSON Canvas Specification](https://jsoncanvas.org/)
