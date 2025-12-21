# CSS and JavaScript Interaction

In 2025, the relationship between CSS and JavaScript has shifted to a **collaborative partnership**. CSS handles the "how" (visual state and movement), JavaScript handles the "what" (data and orchestration).

## Three Pillars of Interaction

### 1. Declarative Interaction (JS-Lite Era)

Many tasks that required JavaScript now work natively in CSS.

#### Anchor Positioning API

Tooltips and dropdowns without positioning libraries.

```css
/* Name the anchor */
.button {
  anchor-name: --my-button;
}

/* Tether tooltip */
.tooltip {
  position: fixed;
  position-anchor: --my-button;
  position-area: bottom center;
  position-try-fallbacks: flip-block;
}
```

```javascript
// JS only toggles visibility
button.onclick = () => {
  tooltip.toggleAttribute('hidden');
};
```

#### Invoker Commands (2025)

Buttons trigger actions without JavaScript.

```html
<button commandfor="modal" command="show-modal">Open</button>
<dialog id="modal">...</dialog>
```

No JavaScript required!

#### Scroll-Driven Animations

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fade-in linear;
  animation-timeline: scroll(); /* No JS scroll listener! */
}
```

### 2. CSS Custom Properties (The Bridge)

CSS Variables (`--vars`) are the primary communication channel between CSS and JavaScript.

#### JS to CSS

```javascript
// Pass data from JS to CSS
element.style.setProperty('--mouse-x', `${mouseX}px`);
element.style.setProperty('--mouse-y', `${mouseY}px`);
element.style.setProperty('--theme-color', '#3b82f6');
```

```css
.cursor-follower {
  position: fixed;
  left: var(--mouse-x);
  top: var(--mouse-y);
  background: var(--theme-color);
}
```

#### CSS to JS

```javascript
// Read CSS custom property
const themeColor = getComputedStyle(element)
  .getPropertyValue('--theme-color');

// Read state from CSS
const state = getComputedStyle(element)
  .getPropertyValue('--component-state');

if (state === 'expanded') {
  // Trigger business logic
}
```

#### @property (Typed Custom Properties)

Define types for smooth animations.

```css
@property --progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.progress-bar {
  width: var(--progress);
  transition: --progress 0.5s ease; /* Animated! */
}
```

```javascript
// JS can now animate custom properties
element.style.setProperty('--progress', '75%');
```

### 3. View Transitions API

The most sophisticated interaction: bridging DOM changes and visual continuity.

#### The Handshake

```javascript
// JS initiates state change
function updateUI() {
  document.startViewTransition(() => {
    // Change DOM (add/remove/modify elements)
    updateContent();
  });
}
```

#### CSS Controls Visuals

```css
/* Give elements transition names */
.card {
  view-transition-name: card-detail;
}

/* Customize animation */
::view-transition-old(card-detail) {
  animation: fade-out 0.3s ease;
}

::view-transition-new(card-detail) {
  animation: fade-in 0.3s ease;
}

::view-transition-group(card-detail) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Complete Example: Card Expansion

```html
<div class="grid">
  <div class="card" data-id="1">
    <img src="image.jpg" alt="Image">
    <h3>Title</h3>
  </div>
</div>

<div class="detail-view" hidden>
  <!-- Full-screen detail -->
</div>
```

```javascript
function expandCard(card) {
  if (!document.startViewTransition) {
    // Fallback for unsupported browsers
    showDetail(card);
    return;
  }

  document.startViewTransition(() => {
    // Hide grid, show detail
    document.querySelector('.grid').hidden = true;
    document.querySelector('.detail-view').hidden = false;

    // Populate detail content
    showDetail(card);
  });
}
```

```css
/* Small card and large detail share same transition name */
.card {
  view-transition-name: active-card;
}

.detail-view {
  view-transition-name: active-card;
}

/* Browser morphs between them automatically */
::view-transition-group(active-card) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Advanced Techniques

### Houdini Paint API

Write JavaScript that runs in the rendering engine.

```javascript
// paint-worklet.js
registerPaint('circle-pattern', class {
  paint(ctx, size, properties) {
    const radius = 10;
    const spacing = 30;

    for (let x = 0; x < size.width; x += spacing) {
      for (let y = 0; y < size.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      }
    }
  }
});
```

```css
.element {
  background: paint(circle-pattern);
}
```

```javascript
// Register worklet
CSS.paintWorklet.addModule('paint-worklet.js');
```

### @scope (Scoped Styles)

```css
@scope (.card) to (.card-footer) {
  /* Only applies within .card, but not inside .card-footer */
  p {
    color: blue;
  }
}
```

```javascript
// JS can manipulate scoped styles
const scopeRule = document.styleSheets[0].cssRules[0];
if (scopeRule.type === CSSRule.SCOPE_RULE) {
  console.log('Scope:', scopeRule.cssText);
}
```

## Practical Examples

### Mouse Follower

```html
<div class="cursor-follower"></div>
```

```css
:root {
  --mouse-x: 0px;
  --mouse-y: 0px;
}

.cursor-follower {
  position: fixed;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(var(--mouse-x), var(--mouse-y));
  transition: transform 0.1s ease;
}
```

```javascript
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});
```

### Theme Switcher

```css
:root {
  --bg: white;
  --text: black;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: white;
}

body {
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}
```

```javascript
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
```

### Scroll Progress Indicator

```html
<div class="progress-bar"></div>
```

```css
@property --scroll-progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: var(--scroll-progress);
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: width 0.1s ease;
}
```

```javascript
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;

  document.documentElement.style.setProperty(
    '--scroll-progress',
    `${scrolled}%`
  );
});
```

### Dynamic Color Palette

```javascript
// Extract colors from image
function extractColors(imgElement) {
  // Use library like color-thief or vibrant.js
  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(imgElement, 5);

  // Apply to CSS
  palette.forEach((color, i) => {
    const [r, g, b] = color;
    document.documentElement.style.setProperty(
      `--palette-${i}`,
      `rgb(${r}, ${g}, ${b})`
    );
  });
}
```

```css
.card {
  background: var(--palette-0);
  color: var(--palette-4);
}

.accent {
  border-color: var(--palette-2);
}
```

### Animate on Scroll (Intersection Observer + CSS)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.dataset.visible = 'true';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}
```

## Performance Patterns

### Read-Then-Write (Avoid Layout Thrashing)

```javascript
// BAD: Forces multiple reflows
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.width = height + 'px'; // Write
});

// GOOD: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.width = heights[i] + 'px';
});
```

### Use requestAnimationFrame

```javascript
// Smooth CSS updates
function updateProgress(value) {
  requestAnimationFrame(() => {
    element.style.setProperty('--progress', `${value}%`);
  });
}
```

### CSS Containment

```css
.card {
  /* Isolate layout calculations */
  contain: layout style paint;
}
```

## Who Does What?

### JavaScript Handles

- **Data**: Fetching APIs, managing state
- **State**: Is user logged in? What's selected?
- **Orchestration**: Triggering view transitions
- **Complex Logic**: Business rules, calculations

### CSS Handles

- **Motion**: Interpolation, easing curves
- **Layout**: Responsive math, positioning
- **Encapsulation**: Scoping, cascade layers
- **Visual State**: Hover, focus, active states

## Migration Pattern (Old to New)

### Old Way (JS-Heavy)

```javascript
// All in JavaScript
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;

  progressBar.style.width = progress + '%';
  progressBar.style.transform = `scaleX(${progress / 100})`;
});
```

### New Way (CSS-Driven)

```css
/* CSS handles animation */
@keyframes progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-bar {
  animation: progress linear;
  animation-timeline: scroll(); /* Magic! */
}
```

```javascript
// JS only needed for fallback
if (!CSS.supports('animation-timeline', 'scroll()')) {
  // Use old JS method
}
```

## Browser Support

### View Transitions

- Chrome/Edge: Full (2023+)
- Safari: Full (2024+)
- Firefox: In development

### Scroll-Driven Animations

- Chrome/Edge: Full (2023+)
- Safari: Full (2024+)
- Firefox: Full (2024+)

### Anchor Positioning

- Chrome/Edge: Full (2024+)
- Safari: Partial (2025+)
- Firefox: In development

## Related

- [View Transitions](./view-transitions.md)
- [CSS Modern Features](./css.md)
- [HTML-JavaScript Interaction](./html-js-interaction.md)
- [Web Animations API](./web-animations.md)
