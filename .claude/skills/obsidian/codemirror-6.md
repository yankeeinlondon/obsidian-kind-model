# CodeMirror 6 Integration

Obsidian's editor (both Live Preview and source mode) uses CodeMirror 6. Plugins register custom extensions for syntax highlighting, decorations, and editor behavior.

> **Editing vs reading view.** Editor extensions only affect the *editing* view (Live Preview + source mode). To change the rendered *reading* view, use `registerMarkdownPostProcessor` / `registerMarkdownCodeBlockProcessor` instead — these operate on the HTML output and never run in the editor. Live Preview is the editing view, not the reading view, so it is driven by CM6 extensions (often `Decoration.replace`), not post-processors.

## Critical Setup

**Never bundle your own `@codemirror/*` or `@lezer/*` packages.** Obsidian ships its own CM6 instance; a second copy causes "two CodeMirrors" type/runtime conflicts. Mark them external, exactly as the official sample plugin does:

```javascript
// esbuild.config.mjs
import builtins from 'builtin-modules';

esbuild.context({
  format: 'cjs',
  target: 'es2021',
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins,
  ],
});
```

The granular CM6 packages (`closebrackets`, `comment`, `fold`, `gutter`, `highlight`, `history`, `matchbrackets`, `panel`, `rangeset`, `rectangular-selection`, `stream-parser`, `text`, `tooltip`) from the CM6 beta were **consolidated into `@codemirror/{view,state,commands,language}`** before the stable release. Do not list them.

## Core Concepts

### State vs View

- **EditorState**: Immutable document state (content, selection, metadata)
- **EditorView**: DOM rendering and user interaction
- **Transaction**: Describes state changes (applied atomically)

```typescript
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

// State is immutable - create new state via transaction
const transaction = state.update({
  changes: { from: 0, to: 5, insert: 'Hello' },
  selection: { anchor: 5 }
});

const newState = transaction.state;
```

### Transaction & change filters

Intercept or veto edits before they apply (both facets live in `@codemirror/state`):

```typescript
import { EditorState } from '@codemirror/state';

// Inspect/replace whole transactions
const txFilter = EditorState.transactionFilter.of(tr => tr);

// Veto/modify individual changes (e.g. block edits in a region)
const noEdits = EditorState.changeFilter.of(() => false);
```

### Reacting to updates

```typescript
import { EditorView } from '@codemirror/view';

const onChange = EditorView.updateListener.of(update => {
  if (update.docChanged) {
    // react to edits; do NOT dispatch synchronously from here
  }
});
```

## Extension Types

The two most common Obsidian extensions are **View plugins** and **State fields**. Choosing between them:

- **ViewPlugin** — decorations derivable from the current viewport. Runs *after* the viewport is computed, so it **cannot make changes that alter the viewport** (inserting block widgets, line breaks, replacements that change height). Generally the better-performing choice when either works.
- **StateField** — needed when decorations live outside the viewport, must persist across transactions, or change content/height (e.g. Live Preview-style `replace` that hides syntax). Processes the whole document, not just visible ranges.

### StateField

Adds computed state that updates with each transaction.

```typescript
import { StateField, StateEffect } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

// Effect to trigger updates
const addHighlight = StateEffect.define<{ from: number; to: number }>();

// StateField that maintains decorations
const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },

  update(decorations, tr) {
    decorations = decorations.map(tr.changes);

    for (const effect of tr.effects) {
      if (effect.is(addHighlight)) {
        const { from, to } = effect.value;
        decorations = decorations.update({
          add: [highlightMark.range(from, to)]
        });
      }
    }

    return decorations;
  },

  provide: field => EditorView.decorations.from(field)
});

const highlightMark = Decoration.mark({ class: 'my-highlight' });
```

### ViewPlugin

Responds to view updates (scroll, viewport, doc changes). Good for viewport-dependent decorations.

```typescript
import { ViewPlugin, ViewUpdate, DecorationSet, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

const lineHighlighter = ViewPlugin.fromClass(
  class {
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

      for (const { from, to } of view.visibleRanges) {
        for (let pos = from; pos < to; ) {
          const line = view.state.doc.lineAt(pos);

          if (line.text.startsWith('TODO')) {
            builder.add(
              line.from,
              line.to,
              Decoration.line({ class: 'todo-line' })
            );
          }

          pos = line.to + 1;
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: v => v.decorations
  }
);
```

### Compartment

Enables dynamic extension reconfiguration.

```typescript
import { Compartment } from '@codemirror/state';

const themeCompartment = new Compartment();

// Initial config
const extensions = [
  themeCompartment.of(lightTheme)
];

// Later: reconfigure
view.dispatch({
  effects: themeCompartment.reconfigure(darkTheme)
});
```

## Decorations

### Mark Decoration

Style a range of text.

```typescript
const boldMark = Decoration.mark({ class: 'bold-text' });

// Apply to range
builder.add(from, to, boldMark);
```

### Widget Decoration

Insert a DOM element at a position.

```typescript
import { WidgetType } from '@codemirror/view';

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) {
    super();
  }

  toDOM() {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = this.checked;
    input.className = 'task-checkbox';
    return input;
  }

  eq(other: CheckboxWidget) {
    return other.checked === this.checked;
  }
}

const checkboxDecoration = Decoration.widget({
  widget: new CheckboxWidget(true),
  side: -1 // Before the position
});
```

### Replace Decoration

Replace content with a widget (like Live Preview hiding syntax).

```typescript
const replaceDeco = Decoration.replace({
  widget: new MyWidget()
});

// Hide the **bold** markers, show formatted text
builder.add(boldStart, boldEnd, replaceDeco);
```

### Line Decoration

Style entire lines.

```typescript
const activeLine = Decoration.line({ class: 'active-line' });

builder.add(line.from, line.from, activeLine);
```

## Registering Extensions

```typescript
import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    // Single extension
    this.registerEditorExtension(lineHighlighter);

    // Multiple extensions
    this.registerEditorExtension([
      highlightField,
      lineHighlighter,
      myKeymap
    ]);
  }
}
```

### Reconfiguring at runtime (settings changes)

`registerEditorExtension()` snapshots its argument, so changing a setting won't update open editors on its own. Register a **stable array reference**, mutate it in place, then call `app.workspace.updateOptions()` to reconfigure every open editor.

```typescript
export default class MyPlugin extends Plugin {
  private extensions: Extension[] = [];

  async onload() {
    this.buildExtensions();
    this.registerEditorExtension(this.extensions); // same array, kept by Obsidian
  }

  buildExtensions() {
    this.extensions.length = 0; // mutate; never reassign
    if (this.settings.enabled) this.extensions.push(lineHighlighter);
  }

  onSettingChange() {
    this.buildExtensions();
    this.app.workspace.updateOptions(); // push new config to live editors
  }
}
```

Use a `Compartment` (below) only when you need to swap one extension inside a config you control directly; for plugin-registered extensions the mutable-array + `updateOptions()` pattern is the idiomatic path.

### Controlling precedence

When your extension must out-rank or under-rank others (e.g. a keymap that should win over defaults), wrap it with `Prec` from `@codemirror/state`:

```typescript
import { Prec } from '@codemirror/state';

this.registerEditorExtension(Prec.highest(myKeymap));
```

## Accessing Obsidian Context

CM6's `EditorState` is isolated from the view, so a StateField/ViewPlugin has no built-in way to know which note it belongs to. Obsidian injects StateFields for this.

```typescript
import { editorInfoField } from 'obsidian';

// Inside a ViewPlugin or StateField (state = view.state)
const info = view.state.field(editorInfoField); // MarkdownFileInfo
const file = info.file; // Current TFile (may be null)
```

`editorInfoField` returns a `MarkdownFileInfo`, which is **not always** a full `MarkdownView` (e.g. embedded/popover editors). Narrow with `instanceof MarkdownView` before using view-only members.

> `editorViewField` is **deprecated** — it assumed a `MarkdownView` and is now just an alias for `editorInfoField`. Use `editorInfoField`.

## Reaching the EditorView from Obsidian

The Obsidian API does not type the underlying `EditorView`. From a `MarkdownView` / `Editor`:

```typescript
// @ts-expect-error - cm is not in the public types
const editorView = view.editor.cm as EditorView;

// Read a registered ViewPlugin instance:
const instance = editorView.plugin(myViewPlugin);

// Dispatch effects/changes directly:
editorView.dispatch({ effects: [myEffect.of(value)] });
```

## Event Handling

### Keymap

```typescript
import { keymap } from '@codemirror/view';

const myKeymap = keymap.of([
  {
    key: 'Ctrl-Shift-h',
    run: (view) => {
      // Handle key
      console.log('Triggered!');
      return true; // Handled
    }
  },
  {
    key: 'Tab',
    run: (view) => {
      // Custom tab behavior
      return true;
    }
  }
]);
```

### DOM Events

```typescript
import { EditorView } from '@codemirror/view';

const clickHandler = EditorView.domEventHandlers({
  click: (event, view) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('my-widget')) {
      handleWidgetClick(target);
      return true;
    }
    return false;
  },

  mousedown: (event, view) => {
    // Handle mousedown
    return false;
  }
});
```

## Syntax Tree Access

```typescript
import { syntaxTree } from '@codemirror/language';

function findHeadings(state: EditorState) {
  const headings: { level: number; text: string }[] = [];

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name.startsWith('ATXHeading')) {
        const level = parseInt(node.name.slice(-1));
        const text = state.doc.sliceString(node.from, node.to);
        headings.push({ level, text });
      }
    }
  });

  return headings;
}
```

## Built-in Obsidian Components

Obsidian ships these CM6 features:

| Component | Description |
|-----------|-------------|
| Live Preview | WYSIWYG editing with hidden syntax |
| Vim Mode | Vim keybindings (optional) |
| Spell Check | OS-level spellcheck integration |
| Folding | Collapse headings and lists |
| Bracket Matching | Highlight matching brackets |
| Auto-pairs | Auto-close brackets, quotes, markdown syntax |
| Line Numbers | Optional line number gutter |

## Common Patterns

### Highlight Pattern Matches

```typescript
const patternHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    pattern = /\[\[([^\]]+)\]\]/g;

    constructor(view: EditorView) {
      this.decorations = this.findMatches(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.findMatches(update.view);
      }
    }

    findMatches(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>();

      for (const { from, to } of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);
        let match;

        while ((match = this.pattern.exec(text))) {
          const start = from + match.index;
          const end = start + match[0].length;
          builder.add(start, end, linkMark);
        }
      }

      return builder.finish();
    }
  },
  { decorations: v => v.decorations }
);

const linkMark = Decoration.mark({ class: 'internal-link' });
```

### Interactive Widget

```typescript
class ButtonWidget extends WidgetType {
  constructor(readonly onClick: () => void) {
    super();
  }

  toDOM() {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.className = 'my-button';
    button.onclick = this.onClick;
    return button;
  }

  ignoreEvent() {
    return false; // Allow events to propagate
  }
}
```

## Performance Tips

1. **Limit to viewport** - Only decorate visible ranges
2. **Batch changes** - Use single transaction for multiple changes
3. **Debounce updates** - Avoid expensive work on every keystroke
4. **Cache computations** - Store results in StateField when possible

```typescript
// Efficient: only process visible content
for (const { from, to } of view.visibleRanges) {
  // Process only visible text
}

// Batch changes
view.dispatch({
  changes: [
    { from: 0, insert: 'A' },
    { from: 10, insert: 'B' },
    { from: 20, insert: 'C' }
  ]
});
```

## Related

- [Plugin Development](./plugin-development.md) - Plugin basics
- [Themes & CSS](./themes-css.md) - Styling decorations
