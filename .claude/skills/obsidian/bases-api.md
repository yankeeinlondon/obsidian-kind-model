# Bases API

The Bases API (Obsidian 1.10+) enables plugins to create custom database views that integrate with Obsidian's built-in Bases core plugin.

## Overview

Bases lets users query vault metadata and display results in various layouts. The API allows plugins to register custom view types beyond the built-in table, list, cards, and map views.

## Architecture

```
QueryController     # Manages queries, filtering, sorting
    |
BasesView           # Abstract class for custom views
    |
BasesQueryResult    # Filtered/sorted note entries
```

## Registering a Custom View

```typescript
import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    this.registerBasesView('timeline-view', {
      name: 'Timeline',
      icon: 'lucide-calendar',
      factory: (controller, containerEl) => {
        return new TimelineView(controller, containerEl);
      },
      options: () => this.getViewOptions()
    });
  }

  getViewOptions(): ViewOption[] {
    return [
      {
        type: 'dropdown',
        displayName: 'Group By',
        key: 'groupBy',
        default: 'month',
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Month', value: 'month' },
          { label: 'Year', value: 'year' }
        ]
      }
    ];
  }
}
```

## Creating a Custom View

```typescript
import { BasesView, QueryController, BasesEntry } from 'obsidian';

export class TimelineView extends BasesView {
  readonly type = 'timeline-view';
  private containerEl: HTMLElement;

  constructor(controller: QueryController, parentEl: HTMLElement) {
    super(controller);
    this.containerEl = parentEl.createDiv('timeline-container');
  }

  // Called when data changes
  public onDataUpdated(): void {
    this.render();
  }

  private render(): void {
    this.containerEl.empty();

    const data = this.controller.data;
    if (!data?.entries) return;

    data.entries.forEach(entry => {
      this.renderEntry(entry);
    });
  }

  private renderEntry(entry: BasesEntry): void {
    const entryEl = this.containerEl.createDiv('timeline-entry');

    // File metadata
    const title = entry.file?.name || 'Untitled';
    const modified = entry.file?.mtime?.toLocaleDateString();

    entryEl.createEl('h3', { text: title });
    entryEl.createEl('small', { text: `Modified: ${modified}` });

    // Access frontmatter properties
    const status = entry.properties?.['status']?.value;
    const priority = entry.properties?.['priority']?.value;

    if (status) {
      entryEl.createEl('span', {
        cls: `status-badge status-${status.toLowerCase()}`,
        text: status
      });
    }

    // Access computed formulas
    const daysLeft = entry.formulas?.['days-until-due']?.value;
  }
}
```

## View Configuration Options

```typescript
getViewOptions(): ViewOption[] {
  return [
    // Text input
    {
      type: 'text',
      displayName: 'Title Property',
      key: 'titleProperty',
      default: 'file.name'
    },

    // Dropdown
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

    // Toggle
    {
      type: 'toggle',
      displayName: 'Show Preview',
      key: 'showPreview',
      default: true
    },

    // Slider
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

// Access config values
private getConfigValue<T>(key: string, defaultValue: T): T {
  return this.config?.options?.[key] ?? defaultValue;
}
```

## Working with Entry Data

### File Properties

```typescript
private renderEntry(entry: BasesEntry): void {
  // File system metadata
  const fileName = entry.file.name;
  const filePath = entry.file.path;
  const basename = entry.file.basename;
  const extension = entry.file.extension;
  const created = entry.file.ctime;
  const modified = entry.file.mtime;

  // Frontmatter properties
  const tags = entry.properties?.['tags']?.value;
  const status = entry.properties?.['status']?.value;
  const dueDate = entry.properties?.['due-date']?.value;

  // Formula results
  const computed = entry.formulas?.['my-formula']?.value;
}
```

### Opening Notes

```typescript
private async openNote(path: string): Promise<void> {
  const file = this.app.vault.getAbstractFileByPath(path);
  if (file instanceof TFile) {
    await this.app.workspace.getLeaf().openFile(file);
  }
}
```

### Updating Properties

```typescript
private async updateProperty(
  path: string,
  property: string,
  value: any
): Promise<void> {
  const file = this.app.vault.getAbstractFileByPath(path);
  if (file instanceof TFile) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm[property] = value;
    });
  }
}
```

## Advanced Patterns

### Grouping Entries

```typescript
private groupBy(
  entries: BasesEntry[],
  property: string
): Record<string, BasesEntry[]> {
  return entries.reduce((acc, entry) => {
    const key = entry.properties?.[property]?.value || 'Uncategorized';
    (acc[key] ||= []).push(entry);
    return acc;
  }, {} as Record<string, BasesEntry[]>);
}
```

### Virtual Scrolling

For large datasets, render only visible items:

```typescript
private renderVirtualList(): void {
  const itemHeight = 50;
  const visibleCount = Math.ceil(this.containerEl.clientHeight / itemHeight);
  const scrollTop = this.containerEl.scrollTop;
  const startIndex = Math.floor(scrollTop / itemHeight);

  const visibleEntries = this.controller.data?.entries.slice(
    startIndex,
    startIndex + visibleCount
  ) || [];

  this.contentEl.style.transform = `translateY(${startIndex * itemHeight}px)`;

  visibleEntries.forEach(entry => this.renderEntry(entry));
}
```

### Context Menus

```typescript
private setupContextMenu(element: HTMLElement, entry: BasesEntry): void {
  element.addEventListener('contextmenu', (e) => {
    const menu = new Menu();

    menu.addItem(item =>
      item.setTitle('Open Note')
        .setIcon('lucide-file')
        .onClick(() => this.openNote(entry.file.path))
    );

    menu.addItem(item =>
      item.setTitle('Copy Path')
        .setIcon('lucide-copy')
        .onClick(() => navigator.clipboard.writeText(entry.file.path))
    );

    menu.showAtMouseEvent(e);
  });
}
```

### Hover Previews

```typescript
private setupHoverPreview(element: HTMLElement, path: string): void {
  element.addEventListener('mouseover', (e) => {
    this.app.workspace.trigger('hover-link', {
      event: e,
      source: this.type,
      hoverParent: this.containerEl,
      targetEl: element,
      linktext: path
    });
  });
}
```

## Example: Kanban View

```typescript
export class KanbanView extends BasesView {
  readonly type = 'kanban-view';
  private columns = ['To Do', 'In Progress', 'Done'];

  public onDataUpdated(): void {
    this.renderBoard();
  }

  private renderBoard(): void {
    const board = this.containerEl.createDiv('kanban-board');

    this.columns.forEach(column => {
      const columnEl = board.createDiv('kanban-column');
      columnEl.createEl('h3', { text: column });

      const items = this.getItemsForColumn(column);
      items.forEach(item => this.renderCard(columnEl, item));

      // Drop zone
      this.setupDropZone(columnEl, column);
    });
  }

  private getItemsForColumn(column: string): BasesEntry[] {
    return this.controller.data?.entries.filter(entry =>
      entry.properties?.['status']?.value === column
    ) || [];
  }

  private renderCard(container: HTMLElement, entry: BasesEntry): void {
    const card = container.createDiv('kanban-card');
    card.draggable = true;
    card.createEl('h4', { text: entry.file.basename });

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer?.setData('text/plain', entry.file.path);
    });
  }

  private setupDropZone(columnEl: HTMLElement, status: string): void {
    columnEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      columnEl.addClass('drag-over');
    });

    columnEl.addEventListener('dragleave', () => {
      columnEl.removeClass('drag-over');
    });

    columnEl.addEventListener('drop', async (e) => {
      e.preventDefault();
      columnEl.removeClass('drag-over');

      const path = e.dataTransfer?.getData('text/plain');
      if (path) {
        await this.updateProperty(path, 'status', status);
      }
    });
  }
}
```

## Performance Tips

1. **Debounce updates** - Throttle rapid data changes
2. **Use DocumentFragment** - Batch DOM operations
3. **Limit decorations** - Only render visible entries
4. **Cache computations** - Avoid recalculating on every render

```typescript
private debouncedRender = debounce(() => this.render(), 100);

public onDataUpdated(): void {
  this.debouncedRender();
}

private render(): void {
  const fragment = new DocumentFragment();

  this.controller.data?.entries.forEach(entry => {
    const el = this.createEntryElement(entry);
    fragment.appendChild(el);
  });

  this.containerEl.empty();
  this.containerEl.appendChild(fragment);
}
```

## Related

- [Plugin Development](./plugin-development.md) - Plugin basics
- [Canvas API](./canvas-api.md) - Visual canvas views
