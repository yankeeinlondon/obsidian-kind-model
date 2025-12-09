# Themes and CSS

Customize Obsidian's appearance with themes and CSS snippets using the CSS variable system.

## Theme Structure

```
.obsidian/themes/my-theme/
├── manifest.json
└── theme.css
```

### manifest.json

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "minAppVersion": "1.0.0",
  "author": "Your Name",
  "authorUrl": "https://github.com/username"
}
```

### Basic theme.css

```css
/* Apply to both modes */
body {
  --font-text-theme: Georgia, serif;
}

/* Dark mode colors */
.theme-dark {
  --background-primary: #1a1a2e;
  --background-secondary: #16213e;
  --text-normal: #e4e4e4;
  --text-muted: #a0a0a0;
}

/* Light mode colors */
.theme-light {
  --background-primary: #ffffff;
  --background-secondary: #f5f5f5;
  --text-normal: #1a1a1a;
  --text-muted: #666666;
}
```

## Essential CSS Variables

### Colors

```css
/* Background */
--background-primary        /* Main content area */
--background-secondary      /* Sidebars, panels */
--background-modifier-hover /* Hover states */
--background-modifier-error /* Error states */

/* Text */
--text-normal    /* Body text */
--text-muted     /* Secondary text */
--text-faint     /* Tertiary/disabled */
--text-accent    /* Links, emphasis */

/* Accent (HSL for flexibility) */
--accent-h  /* Hue */
--accent-s  /* Saturation */
--accent-l  /* Lightness */

/* Extended colors */
--color-red
--color-orange
--color-yellow
--color-green
--color-cyan
--color-blue
--color-purple
--color-pink

/* RGB variants for opacity */
--color-red-rgb  /* Usage: rgba(var(--color-red-rgb), 0.5) */
```

### Typography

```css
--font-text-theme      /* Editor text */
--font-interface-theme /* UI elements */
--font-monospace-theme /* Code blocks */

--font-text-size       /* Base font size */
--line-height-normal   /* Line height */
```

### Spacing

```css
/* Size scale (multiples of 4px) */
--size-4-1   /* 4px */
--size-4-2   /* 8px */
--size-4-3   /* 12px */
--size-4-4   /* 16px */
/* ... up to --size-4-18 */

/* Border radius */
--radius-s   /* Small */
--radius-m   /* Medium */
--radius-l   /* Large */
```

### Code/Editor

```css
--code-background
--code-normal
--code-comment
--code-function
--code-string
--code-keyword
--code-operator
```

### UI Components

```css
--ribbon-background
--tab-text-color
--status-bar-background
--input-focus-border-color
--checkbox-radius
--toggle-thumb-width
```

## CSS Snippets

For users without creating full themes, snippets go in `.obsidian/snippets/`:

```css
/* .obsidian/snippets/my-snippet.css */
.markdown-preview-view h1 {
  color: var(--color-blue);
}
```

Enable in Settings > Appearance > CSS snippets.

## Best Practices

### DO

- **Use CSS variables** - Changes propagate correctly across app
- **Use low-specificity selectors** - Simple class names, avoid deep nesting
- **Support both modes** - Always define `.theme-light` and `.theme-dark`
- **Bundle assets locally** - No remote fonts/images (privacy, offline support)

### DON'T

- **Avoid `!important`** - Prevents user snippet overrides
- **Avoid hardcoded colors** - Will clash with other themes
- **Avoid complex selectors** - May break on Obsidian updates
- **Don't load remote resources** - Rejected from community themes

## Plugin Styling

When plugins inject HTML, use Obsidian's CSS variables:

```css
/* In plugin styles.css */
.my-plugin-warning {
  color: var(--text-normal);
  background-color: var(--background-modifier-error);
  padding: var(--size-4-2);
  border-radius: var(--radius-s);
}
```

```typescript
// In plugin code - add class, not inline styles
el.addClass('my-plugin-warning');
```

## Targeting Editor Modes

```css
/* Source mode (raw markdown) */
.markdown-source-view { }

/* Live Preview */
.markdown-source-view.is-live-preview { }

/* Reading view */
.markdown-reading-view { }
.markdown-preview-view { }
```

## Publish Themes

For Obsidian Publish sites, create `publish.css`:

```css
/* publish.css - styles for published site only */
.published-container {
  max-width: 800px;
  margin: 0 auto;
}
```

## Inspecting Variables

Open Developer Tools (`Ctrl+Shift+I` / `Cmd+Opt+I`) and inspect `<body>` element to see all defined CSS variables.

## Related

- [UI Components](./ui-components.md)
- [Sample Theme](https://github.com/obsidianmd/obsidian-sample-theme)
