# CSS Modern Features

CSS has transitioned from a styling language into a full-blown logic and layout engine with native browser power replacing JavaScript hacks.

## Four Pillars of Modern CSS

1. **Advanced Layout**: Grid & Flexbox with Subgrid support
2. **Logic Layer**: CSS Variables (Custom Properties) and `:has()` pseudo-class
3. **Dynamic Range & Color**: Wide-gamut colors (P3), `color-mix()`, `light-dark()`
4. **Performance-First UI**: `content-visibility`, `will-change` for 60fps experiences

## Baseline Support (2025)

| Feature | Description | Adoption |
|---------|-------------|----------|
| **Scroll-Driven Animations** | Animate based on scroll progress | ~85% |
| **Container Queries** | Style based on parent size | ~98% |
| **Native Nesting** | `.parent { .child { } }` | ~96% |
| **Anchor Positioning** | Attach popovers without JS | ~75% |
| **Subgrid** | Nested grid alignment | ~95% |

## Layout Systems

### Grid vs. Flexbox

| Feature | Flexbox | CSS Grid |
|---------|---------|----------|
| **Dimension** | 1D (Row OR Column) | 2D (Rows AND Columns) |
| **Philosophy** | Content-out (items define space) | Layout-in (grid defines space) |
| **Best For** | Navbars, buttons, components | Page layouts, galleries, dashboards |

**Best Practice**: Grid for macro-layout (page structure), Flexbox for micro-layout (component internals).

### CSS Grid Patterns

#### Zero-Media-Query Grid

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

Items automatically wrap when screen size changes. No media queries needed.

#### Holy Grail Layout

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

#### Layering Without z-index

```css
.hero {
  display: grid;
}

.hero-img,
.hero-text {
  grid-area: 1 / 1; /* Both items in same cell */
}

.hero-text {
  z-index: 1; /* Optional: ensure text is on top */
}
```

### Flexbox Patterns

```css
/* Center anything */
.container {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center; /* vertical */
}

/* Space between items */
.nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Responsive flex wrap */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
```

## Container Queries

Style components based on parent size, not viewport.

### Core Goals
- **Modularity**: Components carry their own responsiveness
- **Context-Awareness**: Adapt to available space
- **Separation**: Media queries for page, container queries for components

### Basic Usage

```css
/* Define container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* Query container */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* Container Query Units */
.card-title {
  font-size: clamp(1rem, 5cqi, 2rem); /* 5% of container inline size */
}
```

### Container Query Units

- **`cqw` / `cqh`**: 1% of container width/height
- **`cqi` / `cqb`**: 1% of container inline/block size
- **`cqmin` / `cqmax`**: Smaller/larger of cqi or cqb

### Advanced: Style Queries

```css
/* Query parent's CSS variable */
@container style(--theme: dark) {
  .card {
    background: #222;
    color: white;
  }
}
```

### Grid + Container Queries

```css
.grid-parent {
  container-type: inline-size;
  container-name: main-layout;
}

.dynamic-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@container main-layout (min-width: 500px) {
  .dynamic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container main-layout (min-width: 800px) {
  .dynamic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid-item {
    padding: 2cqi;
  }
}
```

## The `:has()` Pseudo-Class

The "parent selector" that's actually a logic gate.

```css
/* Disable submit if any input is invalid */
form:has(input:invalid) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}

/* Style card differently if it contains an image */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Sibling logic */
.section:has(+ .section) {
  border-bottom: 1px solid #ccc;
}
```

## Cascade Layers

Control specificity explicitly, solving "specificity wars."

```css
@layer base, theme, utilities;

@layer base {
  #specific-id {
    color: red;
  }
}

@layer theme {
  p {
    color: blue; /* This wins despite lower specificity! */
  }
}
```

Layers defined first have lowest priority. Theme layer always wins over base layer, even if base uses IDs.

## Scroll-Driven Animations

Animations triggered by scroll position, not time.

### Scroll Progress Indicator

```css
@keyframes progress-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 5px;
  background: #3498db;
  transform-origin: 0% 50%;

  animation: progress-grow linear;
  animation-timeline: scroll(); /* Tracks viewport scroll */
}
```

### View Timeline (Intersection-based)

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-box {
  view-timeline-name: --revealing;
  view-timeline-axis: block;

  animation: reveal linear both;
  animation-range: entry 10% contain 40%;
}
```

**Benefit**: Runs on compositor thread, stays smooth even when main thread is busy.

## Anchor Positioning

Position tooltips/popovers relative to anchor elements without JS.

```css
/* Name the anchor */
.anchor-button {
  anchor-name: --my-button;
}

/* Tether the tooltip */
.tooltip {
  position: fixed;
  position-anchor: --my-button;
  position-area: bottom center;
  position-try-fallbacks: flip-block;
  margin-top: 10px;
}
```

**Browser Support (2025)**: ~78% (Chrome/Edge/Safari full, Firefox implementing)

## Animation Best Practices

### Animation Composition

```css
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.btn:hover {
  transform: scale(1.05);
  animation: pulse 1.5s infinite;
  animation-composition: add; /* Prevents conflicts */
}
```

### View Transitions API

```javascript
// JS: Trigger transition
document.startViewTransition(() => {
  element.classList.toggle('expanded');
});
```

```css
/* CSS: Define transition */
.card {
  view-transition-name: card-transition;
}

::view-transition-group(card-transition) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Color & Theming

### Modern Color Functions

```css
:root {
  --primary: oklch(60% 0.15 270);
}

.element {
  /* Mix colors */
  background: color-mix(in oklch, var(--primary) 80%, white);

  /* Light/dark mode in one line */
  color: light-dark(#333, #fff);
}
```

### Wide-Gamut Colors (P3)

```css
.vibrant {
  color: color(display-p3 1 0 0); /* Brighter red than sRGB */
}
```

## Performance Optimizations

```css
/* Skip rendering off-screen content */
.long-list-item {
  content-visibility: auto;
}

/* Optimize specific animations */
.moving-element {
  will-change: transform;
}

/* Remove will-change when not animating */
.moving-element.stopped {
  will-change: auto;
}
```

## Related

- [Container Queries Deep Dive](./container-queries.md)
- [CSS-JavaScript Interaction](./css-js-interaction.md)
- [Grid Layout Patterns](./grid-layout.md)
- [Animation in CSS](./animation.md)
