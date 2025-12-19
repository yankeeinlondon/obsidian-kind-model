# CodeMirror 6 Integration

Obsidian's Live Preview editor uses CodeMirror 6. Plugins can register custom extensions for syntax highlighting, decorations, and editor behavior.

## Critical Setup

**Never bundle your own `@codemirror/*` packages.** Mark them as external in your build config:

```javascript
// esbuild.config.mjs
esbuild.build({
  external: [
    'obsidian',
    '@codemirror/autocomplete',
    '@codemirror/closebrackets',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/comment',
    '@codemirror/fold',
    '@codemirror/gutter',
    '@codemirror/highlight',
    '@codemirror/history',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/matchbrackets',
    '@codemirror/panel',
    '@codemirror/rangeset',
    '@codemirror/rectangular-selection',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/stream-parser',
    '@codemirror/text',
    '@codemirror/tooltip',
    '@codemirror/view',
  ]
});
```

Obsidian provides its own CM6 instance. Using a separate copy causes version conflicts.

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

## Extension Types

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

## Accessing Obsidian Context

Obsidian provides special StateFields to access the MarkdownView from within extensions.

```typescript
import { editorViewField, editorInfoField } from 'obsidian';

// Inside a ViewPlugin
const markdownView = view.state.field(editorViewField);
const editorInfo = view.state.field(editorInfoField);
const file = editorInfo.file; // Current TFile
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
