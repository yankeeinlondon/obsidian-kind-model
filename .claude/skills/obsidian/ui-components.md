# UI Components

Building user interfaces that integrate with Obsidian's native look and feel.

## Commands

Add to command palette:

```typescript
this.addCommand({
  id: 'my-action',
  name: 'Do My Action',
  callback: () => {
    // Execute action
  }
});

// Editor-only command
this.addCommand({
  id: 'editor-action',
  name: 'Editor Action',
  editorCallback: (editor, view) => {
    const selection = editor.getSelection();
    editor.replaceSelection(`**${selection}**`);
  }
});
```

## Ribbon Icons

Left sidebar icons:

```typescript
this.addRibbonIcon('dice', 'Roll dice', (evt) => {
  new Notice('Rolled!');
});
```

Icons use [Lucide](https://lucide.dev/) icon set.

## Status Bar

Bottom bar items (desktop only):

```typescript
const statusEl = this.addStatusBarItem();
statusEl.setText('Ready');

// Update later
statusEl.setText('Processing...');
```

## Modals

### Basic Modal

```typescript
import { App, Modal } from 'obsidian';

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
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.result = input.value;
        this.close();
        this.onSubmit(this.result);
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

// Usage
new MyModal(this.app, (result) => {
  console.log('Got:', result);
}).open();
```

### Fuzzy Suggest Modal

Searchable list selection:

```typescript
import { FuzzySuggestModal, TFile } from 'obsidian';

class FileSuggestModal extends FuzzySuggestModal<TFile> {
  getItems(): TFile[] {
    return this.app.vault.getMarkdownFiles();
  }

  getItemText(file: TFile): string {
    return file.path;
  }

  onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent) {
    this.app.workspace.openLinkText(file.path, '');
  }
}
```

## Settings Tab

```typescript
import { PluginSettingTab, Setting } from 'obsidian';

interface MySettings {
  greeting: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: MySettings = {
  greeting: 'Hello',
  enabled: true
};

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
      .setName('Greeting')
      .setDesc('Message to display')
      .addText(text => text
        .setPlaceholder('Enter greeting')
        .setValue(this.plugin.settings.greeting)
        .onChange(async (value) => {
          this.plugin.settings.greeting = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Enable feature')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        }));
  }
}

// In plugin class
class MyPlugin extends Plugin {
  settings: MySettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MySettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

## Custom Views

Register persistent panels:

```typescript
import { ItemView, WorkspaceLeaf } from 'obsidian';

const VIEW_TYPE = 'my-view';

class MyView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'My View';
  }

  getIcon(): string {
    return 'layout-dashboard';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h4', { text: 'My Custom View' });
  }
}

// Register in plugin
this.registerView(VIEW_TYPE, (leaf) => new MyView(leaf));

// Open view
this.app.workspace.getLeaf(true).setViewState({
  type: VIEW_TYPE,
  active: true
});
```

## Context Menus

```typescript
// File menu (file explorer right-click)
this.registerEvent(
  this.app.workspace.on('file-menu', (menu, file) => {
    menu.addItem((item) => {
      item.setTitle('My Action')
        .setIcon('star')
        .onClick(() => {
          // Handle file
        });
    });
  })
);

// Editor menu (editor right-click)
this.registerEvent(
  this.app.workspace.on('editor-menu', (menu, editor, view) => {
    menu.addItem((item) => {
      item.setTitle('Process Selection')
        .onClick(() => {
          const selection = editor.getSelection();
          // Process
        });
    });
  })
);
```

## Styling Best Practices

- Use CSS variables: `var(--text-normal)`, `var(--background-primary)`
- Add CSS classes, not inline styles
- Avoid `!important` (blocks user overrides)
- Use Lucide icons for consistency

## Related

- [Themes and CSS](./themes-css.md)
- [TypeScript API](./typescript-api.md)
