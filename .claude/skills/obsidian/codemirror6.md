# CodeMirror 6 Extensions

Obsidian's Live Preview editor is built on CodeMirror 6. Create custom editor behavior with CM6 extensions.

## Critical Setup

**Never bundle your own `@codemirror/*` packages.** Mark them as external in your build config:

```javascript
// esbuild.config.mjs
external: [
  'obsidian',
  '@codemirror/state',
  '@codemirror/view',
  '@codemirror/language',
  // ... all @codemirror/* packages
]
```

Obsidian provides its CM6 instance to plugins. Using your own copy causes conflicts.

## Extension Types

### StateField

Manages state that updates with every transaction. Good for decorations based on document content.

```typescript
import { StateField, StateEffect } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    // Rebuild decorations based on doc content
    if (tr.docChanged) {
      const builder = new RangeSetBuilder<Decoration>();
      // Add decorations...
      decorations = builder.finish();
    }
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});
```

### ViewPlugin

Responds to editor events and viewport changes. Good for dynamic UI elements.

```typescript
import { ViewPlugin, ViewUpdate, Decoration, DecorationSet } from '@codemirror/view';

const myViewPlugin = ViewPlugin.fromClass(class {
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
    // Add decorations for visible ranges
    for (const { from, to } of view.visibleRanges) {
      // Process visible content
    }
    return builder.finish();
  }
}, {
  decorations: v => v.decorations
});
```

## Registering Extensions

```typescript
import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension(highlightField);
    // or
    this.registerEditorExtension([highlightField, myViewPlugin]);
  }
}
```

Extensions auto-load into all editors and auto-cleanup on unload.

## Accessing Obsidian Context

Use Obsidian's special fields to get context from within extensions:

```typescript
import { editorViewField, editorEditorField } from 'obsidian';

// Inside a StateField or ViewPlugin
const obsidianView = state.field(editorViewField); // MarkdownView
const file = obsidianView.file;
const app = obsidianView.app;
```

## Decoration Types

### Line Decoration

Style entire lines:

```typescript
const lineHighlight = Decoration.line({
  class: 'my-highlighted-line'
});
// Add at line start position
builder.add(lineStart, lineStart, lineHighlight);
```

### Mark Decoration

Style inline ranges:

```typescript
const highlight = Decoration.mark({
  class: 'my-highlight'
});
builder.add(from, to, highlight);
```

### Widget Decoration

Insert custom DOM elements:

```typescript
class MyWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const span = document.createElement('span');
    span.textContent = '[widget]';
    span.className = 'my-widget';
    return span;
  }
}

const widget = Decoration.widget({
  widget: new MyWidget(),
  side: 1 // 1 = after cursor, -1 = before
});
builder.add(pos, pos, widget);
```

### Replace Decoration

Replace content with widget (like Live Preview does for syntax):

```typescript
const replacement = Decoration.replace({
  widget: new MyWidget()
});
builder.add(from, to, replacement);
```

## Editor Suggest (Autocomplete)

For autocomplete popups, use Obsidian's EditorSuggest rather than CM6's autocomplete:

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
    return ['option1', 'option2'].filter(s => s.includes(context.query));
  }

  renderSuggestion(value: string, el: HTMLElement) {
    el.setText(value);
  }

  selectSuggestion(value: string) {
    this.context?.editor.replaceRange(
      `@@${value}@@`,
      this.context.start,
      this.context.end
    );
  }
}

// Register
this.registerEditorSuggest(new MySuggest(this.app));
```

## Built-in CM6 Features in Obsidian

Obsidian includes these CM6 extensions:

- **Live Preview** - Hides/reveals syntax via StateField decorations
- **Syntax highlighting** - Markdown grammar via Lezer parser
- **Bracket matching/pairing** - Auto-pairs `**`, `==`, `%%`, quotes, brackets
- **Folding** - Collapse headings and lists
- **Spellcheck** - OS-level via Chromium
- **Search/Replace** - Standard CM6 search panel

## Gotchas

1. **Syntax tree access:**
   ```typescript
   import { syntaxTree } from '@codemirror/language';
   const tree = syntaxTree(state);
   ```

2. **Dynamic reconfiguration:** Use CM6 `Compartment` if extension needs runtime changes

3. **Performance:** ViewPlugins should only process `visibleRanges`, not entire document

## Related

- [Plugin Lifecycle](./plugin-lifecycle.md)
- [CodeMirror 6 Docs](https://codemirror.net/docs/)
