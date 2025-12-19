# Plugin Development

Obsidian plugins are TypeScript applications extending the `Plugin` class with access to the full Obsidian API.

## Plugin Structure

### Required Files

```
my-plugin/
├── main.ts           # Plugin entry point
├── manifest.json     # Plugin metadata
├── styles.css        # Optional styles
└── package.json      # Build dependencies
```

### Manifest Configuration

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "What this plugin does",
  "author": "Your Name",
  "authorUrl": "https://your-site.com",
  "isDesktopOnly": false
}
```

**Key Fields:**

- `id` must be unique and match folder name
- `minAppVersion` ensures compatibility
- `isDesktopOnly: true` if using Node.js/Electron APIs

## Plugin Lifecycle

### onload()

Runs when plugin is enabled. Keep it lightweight.

```typescript
async onload() {
  // Load saved settings
  await this.loadSettings();

  // Register commands
  this.addCommand({
    id: 'open-modal',
    name: 'Open Modal',
    callback: () => new MyModal(this.app).open()
  });

  // Register ribbon icon
  this.addRibbonIcon('star', 'My Plugin', () => {
    new Notice('Clicked!');
  });

  // Register settings tab
  this.addSettingTab(new MySettingTab(this.app, this));

  // Wait for layout before accessing vault
  this.app.workspace.onLayoutReady(() => {
    this.initializeAfterLayout();
  });
}
```

### onunload()

Runs when plugin is disabled. Auto-cleanup handles most cases.

```typescript
onunload() {
  // Only needed for DOM outside registration
  // or external resources
}
```

## Core API Classes

### App

Central hub for all Obsidian APIs.

```typescript
this.app.vault       // File operations
this.app.workspace   // UI/layout management
this.app.metadataCache  // Note metadata
this.app.fileManager // Safe file operations
```

### Vault API

File CRUD operations with caching and sync safety.

```typescript
// Read file
const content = await this.app.vault.read(file);

// Cached read (faster)
const cached = await this.app.vault.cachedRead(file);

// Modify file
await this.app.vault.modify(file, newContent);

// Create file
const newFile = await this.app.vault.create('path/to/file.md', content);

// Safe read-modify-write
await this.app.vault.process(file, (content) => {
  return content.replace('old', 'new');
});

// Get all markdown files
const files = this.app.vault.getMarkdownFiles();
```

### Workspace API

Manage UI layout and panes.

```typescript
// Get active view
const view = this.app.workspace.getActiveViewOfType(MarkdownView);

// Open a file
const leaf = this.app.workspace.getLeaf();
await leaf.openFile(file);

// Open in new tab
const newLeaf = this.app.workspace.getLeaf(true);

// Register custom view
this.registerView('my-view', (leaf) => new MyView(leaf));
```

### FileManager API

Safe file operations with link/frontmatter handling.

```typescript
// Process frontmatter atomically
await this.app.fileManager.processFrontMatter(file, (fm) => {
  fm.tags = [...(fm.tags || []), 'new-tag'];
  fm.modified = new Date().toISOString();
});

// Rename with link updates
await this.app.fileManager.renameFile(file, 'new-name.md');
```

## Commands

```typescript
// Basic command
this.addCommand({
  id: 'my-command',
  name: 'Do Something',
  callback: () => this.doSomething()
});

// Editor command (requires active editor)
this.addCommand({
  id: 'insert-text',
  name: 'Insert Text',
  editorCallback: (editor, view) => {
    editor.replaceSelection('inserted text');
  }
});

// Check callback (conditional availability)
this.addCommand({
  id: 'conditional-command',
  name: 'Conditional Command',
  checkCallback: (checking) => {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return false;
    if (!checking) {
      this.doSomethingWithView(view);
    }
    return true;
  }
});
```

## Event Handling

Always use `registerEvent` for automatic cleanup.

```typescript
// Vault events
this.registerEvent(
  this.app.vault.on('create', (file) => {
    console.log('Created:', file.path);
  })
);

this.registerEvent(
  this.app.vault.on('modify', (file) => {
    console.log('Modified:', file.path);
  })
);

this.registerEvent(
  this.app.vault.on('delete', (file) => {
    console.log('Deleted:', file.path);
  })
);

this.registerEvent(
  this.app.vault.on('rename', (file, oldPath) => {
    console.log('Renamed:', oldPath, '->', file.path);
  })
);

// Workspace events
this.registerEvent(
  this.app.workspace.on('file-open', (file) => {
    console.log('Opened:', file?.path);
  })
);

this.registerEvent(
  this.app.workspace.on('active-leaf-change', (leaf) => {
    console.log('Active leaf changed');
  })
);

this.registerEvent(
  this.app.workspace.on('editor-change', (editor, view) => {
    console.log('Editor content changed');
  })
);

// DOM events (auto-cleanup)
this.registerDomEvent(document, 'keydown', (evt) => {
  if (evt.key === 'Escape') {
    // Handle escape
  }
});
```

## Settings

### Settings Tab

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
      .setDesc('Description of setting')
      .addText(text => text
        .setPlaceholder('Enter value')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Toggle')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Dropdown')
      .addDropdown(dropdown => dropdown
        .addOption('opt1', 'Option 1')
        .addOption('opt2', 'Option 2')
        .setValue(this.plugin.settings.choice)
        .onChange(async (value) => {
          this.plugin.settings.choice = value;
          await this.plugin.saveSettings();
        }));
  }
}
```

### Settings Data

```typescript
interface MyPluginSettings {
  mySetting: string;
  enabled: boolean;
  choice: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
  enabled: true,
  choice: 'opt1'
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

## UI Components

### Modal

```typescript
import { Modal, App } from 'obsidian';

class MyModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Enter value' });

    const input = contentEl.createEl('input', { type: 'text' });
    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        this.onSubmit(input.value);
        this.close();
      }
    });

    const btn = contentEl.createEl('button', { text: 'Submit' });
    btn.onclick = () => {
      this.onSubmit(input.value);
      this.close();
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
```

### Notice

```typescript
// Simple notice
new Notice('Operation complete!');

// Notice with duration (ms)
new Notice('This stays longer', 5000);
```

### Context Menu

```typescript
this.registerEvent(
  this.app.workspace.on('file-menu', (menu, file) => {
    menu.addItem((item) => {
      item
        .setTitle('My Action')
        .setIcon('star')
        .onClick(() => this.doAction(file));
    });
  })
);

this.registerEvent(
  this.app.workspace.on('editor-menu', (menu, editor, view) => {
    menu.addItem((item) => {
      item
        .setTitle('Editor Action')
        .onClick(() => this.editorAction(editor));
    });
  })
);
```

## Markdown Processing

### Post-Processor

Transform rendered markdown in reading view.

```typescript
this.registerMarkdownPostProcessor((el, ctx) => {
  // Find all code blocks
  const codeBlocks = el.querySelectorAll('pre > code');
  codeBlocks.forEach((block) => {
    // Modify rendered HTML
  });
});
```

### Code Block Processor

Handle specific code fence languages.

```typescript
this.registerMarkdownCodeBlockProcessor('myblock', (source, el, ctx) => {
  // source = content inside the code fence
  // el = container to render into
  const parsed = parseMyFormat(source);
  el.createEl('div', { text: parsed.title });
});
```

## Common Gotchas

### Startup Timing

```typescript
// DON'T - vault not ready
async onload() {
  const files = this.app.vault.getMarkdownFiles(); // May be empty!
}

// DO - wait for layout
async onload() {
  this.app.workspace.onLayoutReady(() => {
    const files = this.app.vault.getMarkdownFiles(); // Safe
  });
}
```

### Mobile Compatibility

```typescript
import { Platform } from 'obsidian';

if (!Platform.isMobile) {
  // Node.js / Electron APIs safe here
  const { shell } = require('electron');
  shell.openExternal('https://example.com');
}
```

### Avoid Data Loss

```typescript
// DON'T - race condition
const content = await this.app.vault.read(file);
const modified = content + '\nnew line';
await this.app.vault.modify(file, modified);

// DO - atomic operation
await this.app.vault.process(file, (content) => {
  return content + '\nnew line';
});
```

## Related

- [CodeMirror 6](./codemirror-6.md) - Editor extensions
- [Themes & CSS](./themes-css.md) - Styling your plugin
