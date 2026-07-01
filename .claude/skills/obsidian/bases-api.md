# Bases API

The Bases plugin API enables plugins to register custom database views for Obsidian's built-in **Bases** core plugin.

> Bases shipped as a core plugin in Obsidian **1.9.0**. The plugin-facing view API (`registerBasesView`, `BasesView`, etc.) is versioned **1.10.0** in the TypeScript definitions. Verified against the stable 1.12.x line (June 2026). The API is still young and has had breaking changes between minor releases (e.g. `shouldHide` lost its config argument in 1.12), so pin the `obsidian` types and re-check signatures after upgrades. Bases custom views are **desktop-focused**; some view options and plugins are desktop-only.

## Overview

Bases queries vault metadata (frontmatter, file metadata, computed formulas) and displays results in configurable layouts. Built-in view types are **table**, **cards**, **list**, and **map** (map requires the Maps plugin). The API lets plugins register additional view types.

## Putting a Base in a Note

Two mechanisms, both core (no plugin needed):

- Embed a standalone `.base` file: `![[Tasks.base]]` or a specific view `![[Tasks.base#Open]]` (first view is used by default).
- Inline a base directly in a note with a ` ```base ` code block containing `.base` YAML.

## The `.base` File Format

A `.base` file is YAML with up to five top-level keys:

```yaml
filters:               # dataset-wide conditions (also per-view; ANDed together)
  and:
    - file.hasTag("book")
    - 'price > 0'
formulas:              # computed properties, referenced as formula.<name>
  formatted_price: 'if(price, price.toFixed(2) + " dollars")'
properties:            # per-property config (display names, etc.)
  note.price:
    displayName: Price
views:
  - type: table        # table | cards | list | map | <plugin view type>
    name: "Library"
    limit: 50
    filters: { ... }   # view-specific filters
    order: [file.name, note.price]
    groupBy:
      property: note.author
      direction: ASC
    summaries:
      formula.ppu: Average
```

Property references use one of three prefixes (an unprefixed name implies `note.`):

| Prefix     | Source               | Example                  |
| ---------- | -------------------- | ------------------------ |
| `note.`    | Frontmatter property | `note.price`             |
| `file.`    | File metadata        | `file.name`, `file.mtime`, `file.tags`, `file.links`, `file.backlinks`, `file.size`, `file.ext`, `file.ctime` |
| `formula.` | Another formula      | `formula.formatted_price`|

Filter/formula statements are functions and operators evaluated as truthy/falsey (e.g. `file.hasTag(...)`, `file.hasLink(...)`, `.toFixed(...)`). See the official function reference for the full list, which expands frequently.

## Registering a Custom View

`registerBasesView(type, registration)` takes a view-type id and a `BasesViewRegistration`. It returns a falsy value if Bases is not enabled in the vault.

```typescript
import { Plugin, BasesView, QueryController, IconName } from 'obsidian';

export const ExampleViewType = 'example-view';

export default class MyPlugin extends Plugin {
  async onload() {
    const registered = this.registerBasesView(ExampleViewType, {
      name: 'Example',
      icon: 'lucide-graduation-cap',
      factory: (controller, containerEl) => new MyBasesView(controller, containerEl),
      // Optional: user-configurable options shown in the view menu.
      options: (config) => ([
        {
          type: 'text',
          key: 'separator',
          displayName: 'Property separator',
          default: ' - ',
        },
      ]),
    });

    if (!registered) {
      console.warn('Bases is not enabled; custom view not registered.');
    }
  }
}
```

`BasesViewRegistration`:

```typescript
interface BasesViewRegistration {
  name: string;                                            // label in the view selector
  icon: IconName;                                          // Lucide icon
  factory: (controller: QueryController, containerEl: HTMLElement) => BasesView;
  options?: (config: BasesViewConfig) => BasesAllOptions[]; // optional view-config controls
}
```

> Note: there is no per-view unregister API. Toggling a view off typically requires disabling/re-enabling the plugin or restarting Obsidian.

## Creating a Custom View

`BasesView` extends `Component` (not `ItemView`). The constructor is `protected` and takes the `QueryController`; call `super(controller)` and create your container from the `containerEl` passed to the factory. The only required override is `onDataUpdated()`.

```typescript
import {
  BasesView, QueryController, BasesEntry,
  HoverParent, HoverPopover, parsePropertyId,
} from 'obsidian';

export class MyBasesView extends BasesView implements HoverParent {
  readonly type = ExampleViewType;
  hoverPopover: HoverPopover | null = null;
  private containerEl: HTMLElement;

  constructor(controller: QueryController, parentEl: HTMLElement) {
    super(controller);
    this.containerEl = parentEl.createDiv('bases-example-view-container');
  }

  // Abstract: called whenever the query is re-executed (config or vault change).
  // Treat the view as a thin renderer; do not retain references to results.
  public onDataUpdated(): void {
    this.containerEl.empty();

    const separator = String(this.config.get('separator') ?? ' - ');
    const order = this.config.getOrder(); // BasesPropertyId[]

    for (const group of this.data.groupedData) {
      if (group.hasKey()) {
        this.containerEl.createEl('h3', { text: group.key?.toString() });
      }
      for (const entry of group.entries) {
        this.renderEntry(entry, order, separator);
      }
    }
  }

  private renderEntry(entry: BasesEntry, order: string[], separator: string): void {
    const el = this.containerEl.createDiv('entry');

    // File metadata (entry.file is a TFile).
    el.createEl('strong', { text: entry.file.basename });

    // Property values are wrapped Value objects; getValue may return null.
    const parts: string[] = [];
    for (const propertyId of order) {
      const value = entry.getValue(propertyId as any);
      if (!value || value.isEmpty()) continue;
      const { type, name } = parsePropertyId(propertyId);
      parts.push(value.toString());
    }
    el.createEl('span', { text: parts.join(separator) });
  }
}
```

### Key surfaces on `BasesView`

| Member                                              | Notes                                                        |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `app: App`                                          | App instance.                                                |
| `data: BasesQueryResult`                            | Latest query output (filtered + formulas evaluated).         |
| `config: BasesViewConfig`                           | This view's config object.                                   |
| `allProperties: BasesPropertyId[]`                  | All properties available in the dataset.                    |
| `abstract type: string`                             | This view's type id.                                         |
| `abstract onDataUpdated(): void`                    | Re-render here. Takes no arguments — read `this.data`.       |
| `createFileForView(baseFileName?, frontmatterProcessor?)` | Helper to create a new file in the base's context.    |

Inherited from `Component`: `onload()`, `onunload()`, `registerDomEvent()`, `registerEvent()`, `register()`, `addChild()`, etc. Use these for setup/teardown instead of ad-hoc listeners.

## Query Result Shape

```typescript
class BasesQueryResult {
  data: BasesEntry[];                  // flat list of entries
  get groupedData(): BasesEntryGroup[]; // grouped per the view's groupBy
  get properties(): BasesPropertyId[];
  getSummaryValue(/* ... */): Value;
}

class BasesEntryGroup {
  key?: Value;            // group key (absent when ungrouped)
  entries: BasesEntry[];
  hasKey(): boolean;
}

class BasesEntry {
  file: TFile;
  getValue(propertyId: BasesPropertyId): Value | null; // note.*, file.*, formula.*
}
```

`BasesPropertyId` is the template-literal type `` `${'note' | 'file' | 'formula'}.${string}` ``. Use `parsePropertyId(id)` to split it into `{ type, name }`.

### Working with `Value`

Property values are wrapped in `Value` subclasses (e.g. `StringValue`, `NumberValue`, `DateValue`, `BooleanValue`, `ListValue`, `LinkValue`, `DurationValue`). Common operations:

- `value.isEmpty()` — whether the value is empty.
- `value.toString()` — string rendering.

> The exact full `Value` method surface (beyond `isEmpty`/`toString`) is not fully enumerated in the public docs. Prefer `toString()` plus narrowing by concrete subclass; verify any other method against the installed `obsidian.d.ts`.

## View Config (`BasesViewConfig`)

```typescript
class BasesViewConfig {
  name: string;
  get(key: string): unknown;                              // read a view option
  set(key: string, value: any | null): void;             // persist a view option
  getAsPropertyId(key: string): BasesPropertyId | null;
  getEvaluatedFormula(view: BasesView, key: string): Value;
  getOrder(): BasesPropertyId[];                          // configured column order
  getSort(): BasesSortConfig[];
  getDisplayName(propertyId: BasesPropertyId): string;    // honors user renames
}
```

## View Options

`options` returns `BasesAllOptions[]` — controls rendered into the view's config menu; user input is applied automatically and read back via `this.config.get(key)`. Available option kinds (`BasesOptions`): `text`, `multitext`, `dropdown`, `slider`, `toggle`, `property`, `file`, `folder`, `formula`, plus a `group` wrapper (`BasesOptionGroup`) for nested, collapsible sections.

```typescript
options: (config) => ([
  { type: 'text',     key: 'titleProperty', displayName: 'Title property', placeholder: 'file.name' },
  { type: 'toggle',   key: 'showPreview',   displayName: 'Show preview',   default: true },
  { type: 'slider',   key: 'cardWidth',     displayName: 'Card width', min: 200, max: 600, step: 10, default: 300 },
  {
    type: 'dropdown', key: 'layout', displayName: 'Layout', default: 'grid',
    options: { grid: 'Grid', list: 'List' },
  },
  { type: 'property', key: 'groupProperty', displayName: 'Group by' },
])
```

> The exact field set per option kind is not exhaustively documented; inspect the `ViewOption`/`BasesOptions` types in your `obsidian.d.ts`. Breaking change to watch: in 1.12, `BaseOption#shouldHide` no longer receives the config argument — read options from the registration's `options` callback instead.

## Common Patterns

### Opening notes

```typescript
await this.app.workspace.getLeaf().openFile(entry.file);
```

### Updating a property

```typescript
await this.app.fileManager.processFrontMatter(entry.file, (fm) => {
  fm.status = 'Done';
});
```

### Hover previews

Implement `HoverParent` and trigger `hover-link` with `this` as `hoverParent`:

```typescript
el.addEventListener('mouseover', (e) => {
  this.app.workspace.trigger('hover-link', {
    event: e,
    source: this.type,
    hoverParent: this,
    targetEl: el,
    linktext: entry.file.path,
    sourcePath: entry.file.path,
  });
});
```

### Context menus

```typescript
el.addEventListener('contextmenu', (e) => {
  const menu = new Menu();
  menu.addItem((i) => i.setTitle('Open').setIcon('lucide-file')
    .onClick(() => this.app.workspace.getLeaf().openFile(entry.file)));
  menu.showAtMouseEvent(e);
});
```

## Performance

An unfiltered base yields one entry per file in the vault, so views must scale to thousands of entries:

1. Render only what's visible (virtualize long lists).
2. Reuse DOM nodes across `onDataUpdated` calls instead of full rebuilds where possible.
3. Batch DOM writes (e.g. `DocumentFragment`).
4. Keep `onDataUpdated` cheap; it can fire frequently.

## Caveats / Unverified

- `QueryController`'s public shape is not documented beyond being the value passed to your factory/constructor; treat it as opaque.
- The `Value` subclass hierarchy and per-option `ViewOption` fields are only partially documented publicly — verify against the installed `obsidian.d.ts` (`obsidianmd/obsidian-api`).
- No public per-view unregister API.

## Related

- [Plugin Development](./plugin-development.md) — Plugin basics
- Official tutorial: `docs.obsidian.md/plugins/guides/bases-view`
- Bases user docs: `help.obsidian.md/bases`
