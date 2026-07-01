# Themes & CSS Variables

Obsidian themes are CSS stylesheets that override the app's appearance using CSS variables. This ensures compatibility across plugins and updates. Obsidian exposes 400+ CSS variables; the full tree is at [docs.obsidian.md/Reference/CSS variables](https://docs.obsidian.md/Reference/CSS+variables/CSS+variables) (Foundations, Components, Editor, Plugins, Window, Publish).

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
  "minAppVersion": "1.0.0",
  "author": "Your Name",
  "authorUrl": "https://your-site.com"
}
```

`name`, `version`, `minAppVersion`, and `author` are required. `authorUrl` is optional; `fundingUrl` (string or `{ label: url }` map) is also optional. `theme.css` is the only stylesheet Obsidian loads for a theme.

## Core Principles

- **Use CSS variables** - Override existing variables, not raw colors
- **Low specificity** - Simple selectors prevent breaking on updates
- **No `!important`** - It blocks users overriding via snippets and reduces flexibility
- **Local assets only** - No remote fonts/images; embed as base64 data URIs (community themes)
- **Support both modes** - Override shared variables under `body`; put colors under `.theme-light` / `.theme-dark`

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

  /* Accent (HSL components — the user-configurable accent feeds these) */
  --accent-h: 254;
  --accent-s: 80%;
  --accent-l: 68%;
  /* Obsidian derives --color-accent / --interactive-accent / --text-accent
     from the components above; prefer setting --accent-h/s/l over hardcoding */

  /* Interactive states */
  --interactive-normal: #363636;
  --interactive-hover: #464646;
  --interactive-accent: var(--interactive-accent);
}
```

> Setting `--accent-h/s/l` lets your theme define a default accent while still respecting the user's Appearance > Accent color choice. Use `hsl(var(--accent-h), var(--accent-s), var(--accent-l))` to build accent-tinted colors.

### Typography

```css
body {
  /* Font families — themes set the *-theme variants; --font-text /
     --font-interface / --font-monospace are computed by Obsidian */
  --font-text-theme: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-interface-theme: var(--font-text-theme);
  --font-monospace-theme: "Fira Code", monospace;

  /* Font sizes — UI sizes are fixed px, editor sizes are em-relative */
  --font-text-size: 16px;     /* base editor size */
  --font-ui-smaller: 12px;
  --font-ui-small: 13px;
  --font-ui-medium: 15px;
  --font-ui-large: 20px;

  /* Editor-relative sizes: --font-smallest (0.8em),
     --font-smaller (0.875em), --font-small (0.933em) */

  /* Font weights: --font-thin (100) .. --font-normal (400) ..
     --font-bold (700) .. --font-black (900) */

  /* Line height */
  --line-height-normal: 1.5;
  --line-height-tight: 1.3;
}
```

### Spacing

```css
body {
  /* Base spacing units — name is base-multiple (e.g. --size-4-3 = 4*3 = 12px) */
  --size-2-1: 2px;
  --size-2-2: 4px;
  --size-2-3: 6px;
  --size-4-1: 4px;
  --size-4-2: 8px;
  --size-4-3: 12px;
  --size-4-4: 16px;
  /* ...continues: --size-4-5 (20px), -4-6 (24px), -4-8 (32px),
     -4-9 (36px), -4-12 (48px), -4-16 (64px), -4-18 (72px) */

  /* Border radius */
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
  --radius-xl: 16px;
}
```

### Syntax Highlighting

```css
body {
  /* Code blocks */
  --code-background: var(--background-secondary);
  --code-size: 0.9em;

  /* Syntax tokens */
  --code-normal: var(--text-muted);   /* non-highlighted syntax */
  --code-comment: #6a9955;
  --code-function: #dcdcaa;
  --code-important: #d16969;          /* important, regex */
  --code-keyword: #569cd6;
  --code-operator: #d4d4d4;
  --code-property: #9cdcfe;
  --code-punctuation: #d4d4d4;
  --code-string: #ce9178;
  --code-tag: #569cd6;                /* tags, symbols, constants */
  --code-value: #b5cea8;
}
```

> Editing and reading views use different syntax highlighters, so token colors can differ slightly between modes.

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

### Properties (frontmatter)

```css
body {
  --metadata-background: transparent;
  --metadata-display-reading: block;   /* or none to hide in reading view */
  --metadata-display-editing: block;
  --metadata-label-text-color: var(--text-muted);
  --metadata-label-width: 9em;
  --metadata-input-text-color: var(--text-normal);
  --metadata-input-background: transparent;
  --metadata-divider-color: var(--background-modifier-border);
}
```

## Dark/Light Mode

Override colors under `.theme-light` / `.theme-dark`; keep shared structural variables under `body`. The selectors live on `<body>` (`body.theme-dark`), so either `.theme-dark` or `body.theme-dark` works.

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

/* Callouts — --callout-color is an RGB triplet (e.g. "68, 138, 255"),
   so wrap it in rgb(). Per-type colors: --callout-info, --callout-warning,
   --callout-error, --callout-success, --callout-tip, etc. */
.callout {
  background: rgba(var(--callout-color), 0.1);
  border: var(--callout-border-width) solid rgba(var(--callout-color), var(--callout-border-opacity));
  border-radius: var(--callout-radius);
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

/* Accent elements — --accent-h/s/l are HSL components, so use hsl()/hsla(),
   not rgba(). For RGB-component tokens (e.g. --color-accent-rgb,
   --mono-rgb-100, --callout-color) use rgb()/rgba(). */
.my-plugin-highlight {
  background: hsla(var(--accent-h), var(--accent-s), var(--accent-l), 0.2);
  border-left: 3px solid var(--text-accent);
}
```

## Publish Themes

For Obsidian Publish sites, create `publish.css` in the vault root (it does not show in the file explorer but can be published from the Publish changes dialog). Publish reuses the app's CSS variables plus Publish-specific ones. Define Publish variables on `.published-container`, and colors under `.theme-light` / `.theme-dark`.

```css
/* publish.css */
.published-container {
  --page-width: 800px;        /* content column width */
  --page-side-padding: 48px;
}

.theme-light { --background-primary: #ebf2ff; --h1-color: #000; }
.theme-dark  { --background-primary: #1f2a3f; --h1-color: #fff; }
```

Publish-specific variable groups: Site fonts, Site header, Site navigation, Site components, Site sidebars, Site pages, Site footer.

## Inspecting Variables

Open Developer Tools (`Ctrl+Shift+I` / `Cmd+Opt+I`) and inspect the `body` element to see all available CSS variables.

```javascript
// Console: list custom properties declared on :root / body stylesheets
[...document.styleSheets]
  .flatMap(sheet => { try { return [...sheet.cssRules]; } catch { return []; } })
  .filter(rule => rule.selectorText === ":root" || rule.selectorText === "body")
  .flatMap(rule => [...rule.style].filter(prop => prop.startsWith("--")));

// Read one resolved value:
getComputedStyle(document.body).getPropertyValue("--background-primary");
```

## Complete Variable Reference

<details>
<summary>All Standard CSS Variables</summary>

### Base Colors
- `--color-base-00`, `-05`, `-10`, `-20`, `-25`, `-30`, `-35`, `-40`, `-50`, `-60`, `-70`, `-100` (not a continuous range)
- `--color-red`, `--color-orange`, `--color-yellow`
- `--color-green`, `--color-cyan`, `--color-blue`, `--color-purple`, `--color-pink`
- `--mono-rgb-0`, `--mono-rgb-100` (black/white as RGB triplets)

### RGB Variants (for opacity)
- `--color-red-rgb`, `--color-blue-rgb`, etc. (RGB triplets — wrap in `rgb()`/`rgba()`)

### Accent
- `--accent-h`, `--accent-s`, `--accent-l` (HSL components)
- `--interactive-accent-hsl`, `--color-accent`, `--color-accent-1`, `--color-accent-2`

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
- `--text-on-accent`, `--text-on-accent-inverted`
- `--text-error`, `--text-success`, `--text-warning`
- `--text-selection`, `--text-highlight-bg`
- `--caret-color`

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
