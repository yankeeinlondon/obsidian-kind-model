# HTML Standards

HTML has evolved from a simple document-linking system into a robust application platform with native, declarative APIs for complex UI patterns.

## Standards & Resources

- **[WHATWG HTML Living Standard](https://html.spec.whatwg.org/)**: The definitive specification
- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)**: Implementation documentation
- **[Can I Use](https://caniuse.com/)**: Browser support checker
- **[W3C WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)**: Accessibility standards

## Popover API (Top Layer Management)

The Popover API provides native "top layer" content management without z-index battles.

### Characteristics
- **Top Layer**: Renders above all other content automatically
- **Light Dismiss**: Clicking outside or pressing Esc closes by default
- **Non-Modal**: Doesn't block interaction with the page (unlike dialog)

### Example

```html
<button popovertarget="my-menu">Open Menu</button>

<div id="my-menu" popover>
  <p>This is a native popover!</p>
</div>
```

### Animating Popovers

```css
[popover] {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s,
    transform 0.3s,
    display 0.3s allow-discrete;
}

@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

## Dialog Element

Native modal and non-modal dialog support.

```html
<dialog id="modal">
  <h2>Modal Dialog</h2>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<script>
  // Modal (traps focus, blocks interaction)
  document.getElementById('modal').showModal();

  // Non-modal
  document.getElementById('modal').show();
</script>
```

## Semantic Elements

### Modern Tags (High Browser Adoption)

- **`<search>`**: Wraps search functionality (replaces `<div role="search">`)
- **`<details>` + `<summary>`**: Native accordion without JS
- **`<dialog>`**: Modal and non-modal dialogs
- **`<picture>` + `<source>`**: Responsive images with format negotiation

### Example: Responsive Images

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

## ARIA Best Practices (2025)

**Golden Rule**: If a native HTML element exists, use it instead of ARIA.

### Common Mistakes

```html
<!-- BAD: Redundant ARIA -->
<nav role="navigation">...</nav>

<!-- GOOD: Native element implies role -->
<nav>...</nav>
```

### Essential ARIA Attributes

- **`aria-live="polite"`**: Status updates for screen readers
- **`aria-expanded`**: Toggle state for collapsible content
- **`aria-controls`**: Links control to controlled element
- **`inert`**: Makes section non-interactive (perfect for modal backgrounds)

### Example: Accessible Popover Menu

```html
<nav aria-label="Main Menu">
  <button
    popovertarget="nav-menu"
    aria-expanded="false"
    aria-haspopup="true">
    Menu
  </button>

  <div id="nav-menu" popover role="menu">
    <a href="/dashboard" role="menuitem">Dashboard</a>
    <a href="/settings" role="menuitem">Settings</a>
  </div>
</nav>
```

## Multimedia

### Audio & Video Support

```html
<video controls poster="preview.jpg">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  <track src="subs_en.vtt" kind="subtitles" srclang="en" label="English">
</video>
```

**Best Practices**:
- Always include `<track>` for accessibility (WCAG compliance)
- Provide multiple formats for browser compatibility
- Use `poster` for preview image
- Omit `controls` to build custom UI while using native engine

## Built-in Input Types & Validation

Modern HTML handles data validation without custom RegEx.

| Type | Purpose | Native Benefit |
|------|---------|----------------|
| `email` | Email addresses | Format validation, @ keyboard on mobile |
| `tel` | Phone numbers | Numeric keypad on mobile |
| `color` | Color picker | System color palette |
| `range` | Sliders | Native slider UI |
| `date` / `datetime-local` | Date/Time | Native calendar picker |
| `number` | Numeric input | Increment/decrement controls |

### Constraint Validation

```html
<form>
  <input
    type="email"
    required
    pattern=".+@.+\..+"
    minlength="5"
    placeholder="user@example.com">

  <button type="submit">Submit</button>
</form>
```

The browser blocks submission and shows errors automatically using `required`, `pattern`, `minlength`/`maxlength` attributes.

## Form Best Practices

### Autocomplete Attributes

```html
<input type="text" name="name" autocomplete="name">
<input type="email" name="email" autocomplete="email">
<input type="tel" name="phone" autocomplete="tel">
```

### Label Association

```html
<!-- Explicit (preferred) -->
<label for="username">Username</label>
<input id="username" type="text">

<!-- Implicit (works but less flexible) -->
<label>
  Username
  <input type="text">
</label>
```

## Related

- [HTML-JavaScript Interaction](./html-js-interaction.md)
- [Progressive Web Apps](./pwa.md)
- [Web Storage](./web-storage.md)
