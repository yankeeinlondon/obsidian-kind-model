# Themes & CSS Variables

Obsidian themes are CSS stylesheets that override the app's appearance using CSS variables. This ensures compatibility across plugins and updates.

## Theme Structure

```
my-theme/
├── manifest.json    # Theme metadata
└── theme.css        # All styles
```

### Manifest

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "authorUrl": "https://your-site.com"
}
```

## Core Principles

- **Use CSS variables** - Override existing variables, not raw colors
- **Low specificity** - Simple selectors prevent breaking on updates
- **No `!important`** - Let users override with snippets
- **Local assets only** - No remote fonts/images (community themes)
- **Support both modes** - Handle `.theme-light` and `.theme-dark`

## Key CSS Variables

### Colors

```css
body {
  /* Background colors */
  --background-primary: #1e1e1e;
  --background-secondary: #262626;
  --background-modifier-border: #363636;

  /* Text colors */
  --text-normal: #dcddde;
  --text-muted: #888888;
  --text-faint: #666666;
  --text-accent: #7f6df2;

  /* Accent (HSL for dynamic theming) */
  --accent-h: 254;
  --accent-s: 80%;
  --accent-l: 68%;

  /* Interactive states */
  --interactive-normal: #363636;
  --interactive-hover: #464646;
  --interactive-accent: var(--text-accent);
}
```

### Typography

```css
body {
  /* Font families */
  --font-text: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-interface: var(--font-text);
  --font-monospace: "Fira Code", monospace;

  /* Font sizes */
  --font-text-size: 16px;
  --font-ui-small: 13px;
  --font-ui-medium: 15px;

  /* Line height */
  --line-height-normal: 1.5;
  --line-height-tight: 1.3;
}
```

### Spacing

```css
:root {
  /* Base spacing units */
  --size-2-1: 2px;
  --size-2-2: 4px;
  --size-2-3: 6px;
  --size-4-1: 4px;
  --size-4-2: 8px;
  --size-4-3: 12px;
  --size-4-4: 16px;

  /* Border radius */
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
}
```

### Syntax Highlighting

```css
body {
  /* Code blocks */
  --code-background: var(--background-secondary);

  /* Syntax colors */
  --code-comment: #6a9955;
  --code-function: #dcdcaa;
  --code-keyword: #569cd6;
  --code-string: #ce9178;
  --code-operator: #d4d4d4;
  --code-property: #9cdcfe;
  --code-value: #b5cea8;
  --code-tag: #569cd6;
}
```

### UI Components

```css
body {
  /* Ribbon */
  --ribbon-background: var(--background-secondary);

  /* Tabs */
  --tab-text-color: var(--text-muted);
  --tab-text-color-focused: var(--text-normal);
  --tab-background-active: var(--background-primary);

  /* Status bar */
  --status-bar-background: var(--background-secondary);
  --status-bar-text-color: var(--text-muted);

  /* Sidebar */
  --nav-item-color: var(--text-muted);
  --nav-item-color-hover: var(--text-normal);
  --nav-item-background-hover: var(--background-modifier-hover);
}
```

### Editor

```css
body {
  /* Editor line */
  --text-selection: rgba(100, 100, 255, 0.3);

  /* Headings */
  --h1-color: var(--text-normal);
  --h2-color: var(--text-normal);
  --h3-color: var(--text-normal);
  --h1-size: 2em;
  --h2-size: 1.6em;
  --h3-size: 1.37em;

  /* Links */
  --link-color: var(--text-accent);
  --link-color-hover: var(--text-accent);
  --link-external-color: var(--text-accent);

  /* Lists */
  --list-indent: 2em;
  --list-marker-color: var(--text-muted);

  /* Blockquotes */
  --blockquote-border-color: var(--interactive-accent);
  --blockquote-background-color: transparent;
}
```

## Dark/Light Mode

```css
/* Light mode */
.theme-light {
  --background-primary: #ffffff;
  --background-secondary: #f2f3f5;
  --text-normal: #2e3338;
  --text-muted: #888888;
}

/* Dark mode */
.theme-dark {
  --background-primary: #1e1e1e;
  --background-secondary: #262626;
  --text-normal: #dcddde;
  --text-muted: #888888;
}
```

## Common Selectors

### Workspace

```css
/* Main content area */
.workspace-leaf-content[data-type="markdown"] {
  /* Markdown view styles */
}

/* Reading view */
.markdown-reading-view {
  /* Reading mode styles */
}

/* Source/Live Preview */
.markdown-source-view {
  /* Editing mode styles */
}

/* Live Preview specifically */
.markdown-source-view.is-live-preview {
  /* Live preview only */
}
```

### Editor Elements

```css
/* Headings in editor */
.cm-header-1 { font-size: var(--h1-size); }
.cm-header-2 { font-size: var(--h2-size); }
.cm-header-3 { font-size: var(--h3-size); }

/* Links */
.cm-link, .cm-url { color: var(--link-color); }

/* Code */
.cm-inline-code {
  background: var(--code-background);
  padding: 2px 4px;
  border-radius: var(--radius-s);
}

/* Code blocks */
.HyperMD-codeblock {
  background: var(--code-background);
}
```

### Reading View

```css
/* Headings */
.markdown-preview-view h1 { font-size: var(--h1-size); }
.markdown-preview-view h2 { font-size: var(--h2-size); }

/* Links */
.markdown-preview-view a.internal-link { color: var(--link-color); }
.markdown-preview-view a.external-link { color: var(--link-external-color); }

/* Code blocks */
.markdown-preview-view pre {
  background: var(--code-background);
  padding: var(--size-4-3);
  border-radius: var(--radius-m);
}

/* Callouts */
.callout {
  background: var(--background-secondary);
  border-left: 4px solid var(--callout-color);
}
```

### Sidebar

```css
/* File explorer */
.nav-file-title {
  color: var(--nav-item-color);
}

.nav-file-title:hover {
  background: var(--nav-item-background-hover);
  color: var(--nav-item-color-hover);
}

/* Folder */
.nav-folder-title {
  font-weight: 600;
}
```

## Plugin Styling Best Practices

When styling plugins, use CSS variables for consistency:

```css
/* Plugin-specific container */
.my-plugin-container {
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-m);
  padding: var(--size-4-3);
}

/* Interactive elements */
.my-plugin-button {
  background: var(--interactive-normal);
  color: var(--text-normal);
  border-radius: var(--radius-s);
}

.my-plugin-button:hover {
  background: var(--interactive-hover);
}

/* Accent elements */
.my-plugin-highlight {
  background: rgba(var(--accent-h), var(--accent-s), var(--accent-l), 0.2);
  border-left: 3px solid var(--text-accent);
}
```

## Publish Themes

For Obsidian Publish sites, create `publish.css`:

```css
/* publish.css - for public sites */
.published-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Different styling for public consumption */
.site-header {
  background: var(--background-secondary);
}
```

## Inspecting Variables

Open Developer Tools (`Ctrl+Shift+I` / `Cmd+Opt+I`) and inspect the `body` element to see all available CSS variables.

```javascript
// Console: List all CSS variables
getComputedStyle(document.body)
  .cssText
  .split(';')
  .filter(s => s.includes('--'))
  .map(s => s.trim());
```

## Complete Variable Reference

<details>
<summary>All Standard CSS Variables</summary>

### Base Colors
- `--color-base-00` through `--color-base-100`
- `--color-red`, `--color-orange`, `--color-yellow`
- `--color-green`, `--color-cyan`, `--color-blue`, `--color-purple`, `--color-pink`

### RGB Variants (for opacity)
- `--color-red-rgb`, `--color-blue-rgb`, etc.

### Background
- `--background-primary`, `--background-primary-alt`
- `--background-secondary`, `--background-secondary-alt`
- `--background-modifier-hover`
- `--background-modifier-active-hover`
- `--background-modifier-border`
- `--background-modifier-border-hover`
- `--background-modifier-border-focus`
- `--background-modifier-error`
- `--background-modifier-success`
- `--background-modifier-message`

### Text
- `--text-normal`, `--text-muted`, `--text-faint`
- `--text-accent`, `--text-accent-hover`
- `--text-on-accent`
- `--text-error`, `--text-success`, `--text-warning`
- `--text-selection`
- `--text-highlight-bg`

### Interactive
- `--interactive-normal`, `--interactive-hover`
- `--interactive-accent`, `--interactive-accent-hover`

### Input
- `--input-shadow`, `--input-shadow-hover`
- `--input-border-color`, `--input-hover-border-color`

### Scrollbar
- `--scrollbar-bg`, `--scrollbar-thumb-bg`
- `--scrollbar-active-thumb-bg`

</details>

## Related

- [Plugin Development](./plugin-development.md) - Using styles in plugins
- [CodeMirror 6](./codemirror-6.md) - Editor-specific styling
