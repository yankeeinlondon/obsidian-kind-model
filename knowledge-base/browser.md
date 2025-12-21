---
name: browser
description: Comprehensive guide to modern browser technologies including HTML, CSS, JavaScript interaction, browser APIs, and Progressive Web Apps
created: 2025-12-21
last_updated: 2025-12-21T19:30:00Z
hash: 5761413c0880d1e8
tags:
  - browser
  - html
  - css
  - javascript
  - pwa
  - web-apis
  - frontend
---

# Modern Browser Technologies

Modern browsers have evolved from simple document viewers into full-featured application platforms. In 2025, the web platform provides native capabilities for complex layouts, high-performance graphics, offline functionality, and hardware access that rival native applications.

This guide covers the complete spectrum of browser technologies: HTML markup and semantics, CSS layout and animation, JavaScript interaction patterns, browser APIs for accessing device capabilities, and Progressive Web App standards for installable web applications.

## Table of Contents

- [HTML: The Semantic Foundation](#html-the-semantic-foundation)
- [CSS: Layout and Visual Design](#css-layout-and-visual-design)
- [JavaScript Interaction Patterns](#javascript-interaction-patterns)
- [Browser APIs](#browser-apis)
- [Progressive Web Apps (PWAs)](#progressive-web-apps-pwas)
- [Cross-Browser Compatibility](#cross-browser-compatibility)
- [Best Practices and Patterns](#best-practices-and-patterns)
- [Resources](#resources)

---

## HTML: The Semantic Foundation

HTML in 2025 has transformed from a simple markup language into a rich semantic platform with declarative APIs for common UI patterns.

### Standards and Documentation

The authoritative sources for HTML standards:

- **[WHATWG HTML Living Standard](https://html.spec.whatwg.org/)**: The continuously updated specification
- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)**: Industry-standard implementation documentation
- **[Can I Use](https://caniuse.com/)**: Browser support tables
- **[W3C WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)**: Accessibility standards

### Modern Semantic Elements

Recent additions to HTML provide native solutions for common patterns:

#### The Popover API

The **Popover API** provides native "top layer" content management without JavaScript z-index battles:

```html
<button popovertarget="my-menu">Open Menu</button>

<div id="my-menu" popover>
  <p>This is a native popover!</p>
</div>
```

**Key characteristics:**

- Renders in a special "top layer" above all other content
- Automatic "light dismiss" (clicking outside or pressing Esc closes it)
- Non-modal by default (doesn't block page interaction)

#### Dialog Element

Native modal and non-modal dialogs:

```html
<dialog id="my-dialog">
  <p>Dialog content</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<script>
  document.querySelector('button').onclick = () => {
    document.getElementById('my-dialog').showModal();
  };
</script>
```

Use `.showModal()` for true modals that trap focus and prevent interaction with the rest of the page.

#### Search Element

Semantic wrapper for search functionality:

```html
<search>
  <form action="/search">
    <input type="search" name="q" placeholder="Search...">
    <button type="submit">Search</button>
  </form>
</search>
```

#### Details and Summary

Native accordion/disclosure widgets:

```html
<details>
  <summary>Click to expand</summary>
  <p>Hidden content revealed on click</p>
</details>
```

### Multimedia Support

Native media elements support advanced streaming and accessibility features.

#### Video Element

```html
<video controls poster="preview.jpg">
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  <track src="subs_en.vtt" kind="subtitles" srclang="en" label="English">
</video>
```

**Best practices:**

- Provide multiple formats (WebM, MP4) for browser compatibility
- Always include `<track>` tags for subtitles/captions (WCAG compliance)
- Use `poster` attribute for preview image
- Omit `controls` to build custom UI while leveraging native engine

### Form Input Types

Modern HTML provides native validation and specialized keyboards on mobile:

| Type | Purpose | Native Benefit |
|------|---------|----------------|
| `email` | Email addresses | Validates format; triggers @-symbol keyboard on mobile |
| `tel` | Phone numbers | Triggers numeric keypad on mobile |
| `color` | Color picker | Opens system-level color palette |
| `range` | Sliders | Creates native slider UI |
| `date` / `datetime-local` | Date/Time | Opens native calendar/time picker |

**Constraint validation** via `required`, `pattern`, `minlength`/`maxlength` enables client-side validation before form submission:

```html
<form>
  <input type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
  <button type="submit">Submit</button>
</form>
```

### ARIA Best Practices (2025)

The golden rule: **"If you can use a native HTML element instead of an ARIA role, do it."**

#### Common Mistakes to Avoid

- **Aria-redundancy**: Don't use `<nav role="navigation">` - the `<nav>` tag already implies that role
- **Missing live regions**: Use `aria-live="polite"` for status updates so screen readers announce changes without interrupting

#### The `inert` Attribute

A powerful global attribute that makes sections non-interactive and invisible to assistive technology:

```html
<main>
  <div inert>
    <!-- Background content when modal is open -->
  </div>

  <dialog open>
    <!-- Active modal content -->
  </dialog>
</main>
```

### HTML and JavaScript Interaction

HTML and JavaScript interact through the **Document Object Model (DOM)**, a tree-like representation of the page.

#### Finding Elements

```javascript
// Single element by ID
const element = document.getElementById('my-id');

// First match using CSS selector
const element = document.querySelector('.my-class');

// All matches
const elements = document.querySelectorAll('div.card');
```

#### Modifying Content

```javascript
// Change text content
element.textContent = "New text";

// Change HTML
element.innerHTML = "<strong>Bold text</strong>";

// Create and append new elements
const div = document.createElement('div');
div.textContent = "Created dynamically";
document.body.appendChild(div);
```

#### Event Handling

```javascript
button.addEventListener('click', (event) => {
  console.log('Button clicked');
});

// Common events: click, submit, keydown, mouseover, scroll
```

#### Data Attributes

Pass data from HTML to JavaScript:

```html
<div id="user" data-user-id="123" data-role="admin"></div>
```

```javascript
const user = document.getElementById('user');
const userId = user.dataset.userId;     // "123"
const role = user.dataset.role;         // "admin"
```

---

## CSS: Layout and Visual Design

In 2025, CSS has evolved from a styling language into a full-featured logic and layout engine. The era of "hacks" (floats for layout, heavy JavaScript for scroll effects) has given way to native browser capabilities.

### Modern CSS Pillars

#### 1. Advanced Layout (Grid & Flexbox)

**CSS Grid** is a two-dimensional layout system handling both rows and columns:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

**Subgrid** (universally supported in 2025) allows nested elements to align with parent grid:

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-columns: subgrid;
}
```

**Flexbox** is a one-dimensional system for linear layouts:

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

#### When to Use Each

| Feature | Flexbox | CSS Grid |
|---------|---------|----------|
| **Dimension** | 1D (Row OR Column) | 2D (Rows AND Columns) |
| **Philosophy** | Content-out (items define space) | Layout-in (grid defines space) |
| **Best For** | Navbars, buttons, small components | Page layouts, galleries, dashboards |

**Best practice**: Use Grid for macro-layout (page structure) and Flexbox for micro-layout (component internals).

#### 2. Logic Layer

**CSS Variables (Custom Properties)** allow reactive styling:

```css
:root {
  --primary-color: #3498db;
  --spacing: 1rem;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}
```

**The `:has()` pseudo-class** (the "parent selector") enables CSS-based logic:

```css
/* Disable submit button if form has invalid input */
form:has(input:invalid) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}
```

#### 3. Dynamic Color

**Color Level 4/5** provides wide-gamut colors and mixing functions:

```css
.element {
  background: color-mix(in srgb, var(--primary) 70%, white);
  color: light-dark(#333, #fff); /* Automatic light/dark mode */
}
```

#### 4. Performance-First UI

```css
.lazy-section {
  content-visibility: auto; /* Skip rendering off-screen content */
}

.will-animate {
  will-change: transform; /* Hint to browser for optimization */
}
```

### Container Queries

**Container Queries** enable component-level responsive design based on parent size, not viewport:

```css
/* Define container */
.card-wrapper {
  container-type: inline-size;
  container-name: card-container;
}

/* Base mobile-first styles */
.card {
  display: flex;
  flex-direction: column;
}

/* Adapt when container reaches 400px */
@container card-container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

#### Container Query Units

New relative units for container-based sizing:

- **`cqw` / `cqh`**: 1% of container width/height
- **`cqi` / `cqb`**: 1% of container inline/block size
- **`cqmin` / `cqmax`**: Smaller/larger of cqi or cqb

```css
.card-title {
  font-size: clamp(1rem, 5cqi, 2rem);
}
```

#### Style Queries (Advanced)

Query computed styles of containers:

```css
@container style(--theme: dark) {
  .card {
    background: #222;
    color: white;
  }
}
```

#### Scroll-State Queries

React to sticky positioning states:

```css
.scroll-container {
  container-type: scroll-state;
}

.sticky-header {
  position: sticky;
  top: 0;
  background: transparent;
  transition: all 0.3s ease;
}

/* Apply styles when stuck */
@container scroll-state(stuck: top) {
  .sticky-header {
    background: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
}
```

### Grid Layout Deep Dive

#### Core Concepts

- **Grid Container**: Element with `display: grid`
- **Grid Tracks**: Space between grid lines (rows and columns)
- **Grid Cell**: Smallest unit where row and column intersect
- **Grid Area**: Rectangular space of one or more cells
- **The `fr` unit**: Fractional unit representing available space

#### Common Patterns

**The "Holy Grail" Layout:**

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

**The Zero-Media-Query Responsive Grid:**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

This creates a grid where items are at least 300px wide but grow to fill space, automatically wrapping when needed.

**Layering Without z-index:**

```css
.hero {
  display: grid;
}

.hero-img,
.hero-text {
  grid-area: 1 / 1; /* Both items occupy same cell */
}
```

### Cascade Layers

**`@layer`** provides explicit specificity control:

```css
@layer base, theme, utilities;

@layer base {
  /* Even with high specificity, this loses to theme layer */
  #element {
    color: red;
  }
}

@layer theme {
  /* This wins despite lower specificity */
  .element {
    color: blue;
  }
}
```

Layers eliminate "specificity wars" and `!important` overuse.

### CSS Animation

CSS animation has evolved from simple transitions to a powerful motion engine.

#### Core Primitives

**`@keyframes`** defines the animation sequence:

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**Animation properties** control execution:

| Property | Description |
|----------|-------------|
| `animation-name` | Links to `@keyframes` |
| `animation-duration` | Length (e.g., `3s`, `500ms`) |
| `animation-timing-function` | Easing curve (`ease-in`, `cubic-bezier`) |
| `animation-delay` | Wait before starting |
| `animation-iteration-count` | Repeats (`3`, `infinite`) |
| `animation-direction` | Play direction (`normal`, `alternate`) |
| `animation-fill-mode` | State before/after (`forwards`, `both`) |
| `animation-play-state` | Pause/resume (`paused`, `running`) |

#### Scroll-Driven Animations

Link animations to scroll position instead of time:

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
  animation-timeline: scroll(); /* Linked to scroll position */
}
```

**Browser support (2025)**: ~85% (Safari and Firefox stable support landed late 2024/2025)

#### View Timelines

Animate based on element visibility:

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
  animation-timeline: view(--revealing);
  /* Start when 10% in view, end at 40% */
  animation-range: entry 10% contain 40%;
}
```

#### Animation Composition

Control how multiple animations combine:

```css
.element {
  animation: rotate 2s linear infinite;
}

.element:hover {
  animation: pulse 1s ease-in-out infinite;
  /* Don't replace rotate, add pulse to it */
  animation-composition: add;
}
```

- `replace`: (Default) Last animation wins
- `add`: Both values applied
- `accumulate`: Values mathematically combined

### View Transitions API

Animate between DOM states with the browser handling interpolation:

#### JavaScript Trigger

```javascript
function expandCard(card) {
  document.startViewTransition(() => {
    card.classList.toggle('active');
    document.querySelector('.grid').classList.toggle('expanded');
  });
}
```

#### CSS Control

```css
.profile-card-small {
  view-transition-name: profile-header;
}

.profile-page-hero {
  view-transition-name: profile-header;
}

/* Customize animation */
::view-transition-group(profile-header) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

The browser captures snapshots of old and new states, automatically calculating the interpolation.

### Anchor Positioning

Position elements relative to anchors without JavaScript:

```css
/* Define anchor */
.button {
  anchor-name: --my-button;
}

/* Tether tooltip */
.tooltip {
  position: fixed;
  position-anchor: --my-button;
  position-area: bottom center;

  /* Auto-flip if hits screen edge */
  position-try-fallbacks: flip-block;
  margin-top: 10px;
}
```

**Browser support (2025)**: ~78% (Chromium and Safari full support; Firefox shipping early 2026)

### CSS and JavaScript Interaction

The relationship has shifted from "JS controlling CSS" to collaborative partnership.

#### Declarative Interaction

Many tasks that required JavaScript now happen in CSS:

**Invoker Commands** (button-triggered actions without JS):

```html
<button commandfor="my-modal" command="show-modal">Open</button>
<dialog id="my-modal">...</dialog>
```

#### Shared State: CSS Custom Properties

The bridge between languages:

```javascript
// JS to CSS: Pass dynamic values
element.style.setProperty('--x', mouseX + 'px');

// CSS to JS: Read computed values
const state = getComputedStyle(element).getPropertyValue('--state');
```

#### @property for Type Safety

Define typed CSS variables:

```css
@property --rotation {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

This enables smooth JavaScript-driven animations of typed values rather than string snapping.

---

## Browser APIs

Modern browsers provide extensive APIs for accessing device capabilities and system features.

### Canvas API

The `<canvas>` element provides scriptable graphics rendering.

#### 2D Context

High-level drawing API:

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw shapes
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fillStyle = 'blue';
ctx.fill();

// Pixel manipulation
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// Modify imageData.data array for custom filters
ctx.putImageData(imageData, 0, 0);
```

**Coordinate system**: (0,0) is top-left, x increases right, y increases down

#### WebGL Context

Low-level 3D graphics via GPU:

```javascript
const gl = canvas.getContext('webgl');
```

Most developers use libraries like **Three.js** or **Babylon.js** which provide high-level 3D objects while managing WebGL complexity.

#### Performance Techniques

**OffscreenCanvas**: Move rendering to Web Worker to keep UI responsive

```javascript
// In worker
const offscreen = canvas.transferControlToOffscreen();
const ctx = offscreen.getContext('2d');
```

**Layering**: Use multiple stacked `<canvas>` elements with CSS `z-index`:

- Layer 1: Static background (drawn once)
- Layer 2: Moving characters (cleared/redrawn every frame)
- Layer 3: UI/Heads-up display (drawn only when needed)

**requestAnimationFrame**: Sync with monitor refresh rate (60Hz or 144Hz). Never use `setInterval` for animation

```javascript
function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw frame
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

#### 2D Animation Loop Example

A complete particle animation demonstrating the "Clear-Update-Draw" cycle:

```javascript
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// 1. Handle Resizing
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 2. The Particle Object
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2; // Velocity X
    this.vy = (Math.random() - 0.5) * 2; // Velocity Y
    this.radius = Math.random() * 5 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
    ctx.fill();
  }
}

// 3. Setup the Scene
const particles = Array.from({ length: 50 }, () => new Particle());

// 4. The Animation Loop
function animate() {
  // CLEAR the canvas for the new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Request the next frame
  requestAnimationFrame(animate);
}

animate();
```

**Key animation concepts**:

- **`ctx.clearRect()`**: Essential - without it, particles leave trails as canvas doesn't auto-erase previous frames
- **Delta time**: In professional games, pass a `timestamp` to `animate(time)` to calculate time between frames. This ensures consistent animation speed regardless of monitor refresh rate
- **State management**: Separation between `update()` (math/logic) and `draw()` (rendering) makes code easier to debug and scale

**Motion trails effect**: For "ghosting" or trail effects, replace `clearRect()` with a semi-transparent rectangle:

```javascript
// Replace clearRect with this for trails:
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

#### Canvas vs SVG

- **Use SVG** for few objects needing crisp scaling and DOM accessibility
- **Use Canvas** for thousands of particles, high-speed games, or pixel processing

### Drag and Drop API

Native HTML drag-and-drop for mouse/touch interactions. The API is event-driven and revolves around the **Draggable Source** and the **Drop Target**.

#### Core Attributes

```html
<div draggable="true" id="item">Drag me</div>
<div id="dropzone">Drop here</div>
```

**DataTransfer Object**: The "cargo ship" of the operation. It holds the data being dragged (e.g., text, files, URLs) and determines visual feedback (cursor icon)

#### Event Lifecycle

| Event | Target | Description |
|-------|--------|-------------|
| `dragstart` | Source | Fires when drag begins; only time `setData()` works |
| `dragover` | Target | Fires continuously; must call `preventDefault()` |
| `drop` | Target | Fires on release; use `getData()` here |
| `dragend` | Source | Fires when operation completes |

**Data store modes** (privacy protection):

1. **Read/Write (dragstart)**: You can add data
2. **Protected (dragover/dragenter)**: You can see data types (e.g., "Files") but not content
3. **Read-only (drop)**: You can finally read the data

#### Implementation Example

```javascript
const item = document.getElementById('item');
const dropzone = document.getElementById('dropzone');

item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', item.id);
  e.dataTransfer.effectAllowed = 'move';
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // Required to allow drop
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);
  dropzone.appendChild(element);
});
```

#### Polished Drop Animation with WAAPI

Combine Web Animations API (WAAPI) for smooth "snap-to-place" effects:

```javascript
const dropZone = document.querySelector('.drop-zone');

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(draggedId);

  // 1. Get the starting position (the mouse coords)
  const startX = e.clientX;
  const startY = e.clientY;

  // 2. Append the element to the new zone
  dropZone.appendChild(element);

  // 3. Get the final position (where the browser put it)
  const rect = element.getBoundingClientRect();
  const deltaX = startX - rect.left;
  const deltaY = startY - rect.top;

  // 4. Play a fluid animation from the mouse to the final slot
  element.animate([
    { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.1)`, opacity: 0.5 },
    { transform: 'translate(0, 0) scale(1)', opacity: 1 }
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  });
});
```

#### Accessible Navigation: Popover + ARIA Landmarks

While Drag and Drop is great for mouse users, it's difficult for screen reader users. Pair interactive elements with the **Popover API** and **ARIA Landmarks** for inclusivity:

```html
<nav aria-label="Main Menu">
  <button
    popovertarget="nav-menu"
    aria-expanded="false"
    aria-haspopup="true">
    Explore Sites
  </button>

  <div id="nav-menu" popover role="menu">
    <ul style="list-style: none; padding: 1rem;">
      <li role="none"><a href="/dashboard" role="menuitem">Dashboard</a></li>
      <li role="none"><a href="/settings" role="menuitem">Settings</a></li>
      <hr>
      <li role="none">
        <div
          draggable="true"
          role="menuitem"
          ondragstart="event.dataTransfer.setData('text/plain', 'QuickLink')"
          style="cursor: grab; border: 1px dashed #ccc; padding: 5px;">
          ⠿ Drag to Sidebar
        </div>
      </li>
    </ul>
  </div>
</nav>
```

**Accessibility features**:

- **Implicit relationship**: `popovertarget` automatically links button to menu
- **Keyboard logic**: Browsers automatically handle Esc key to close popover and return focus
- **Landmark role**: Placing inside `<nav>` allows screen reader users to jump to "Main Menu" using shortcut keys

### File System Access

Modern file system access has evolved into two distinct "worlds": user-visible files and Origin Private File System (OPFS).

| Feature | File System Access API (User-Visible) | Origin Private File System (OPFS) |
|---------|---------------------------------------|----------------------------------|
| **Visibility** | User picks files from their actual disk | Hidden from user; managed by browser |
| **Persistence** | Permanent (until user deletes) | Persistent (tied to site data/origin) |
| **Performance** | Standard disk I/O speed | Ultra-fast (byte-level sync access) |
| **Permission** | Requires explicit user prompt & gesture | No prompts (implicit origin-based access) |
| **Main Use Case** | Text editors, IDEs, Photo editors | SQLite databases, Wasm, local caching |

#### File System Access API (User-Visible Files)

Access files on user's disk with explicit permission. Works through **Handles**, which are persistent references to files or directories.

**Key methods**:

- `window.showOpenFilePicker()`: Opens native dialog, returns `FileSystemFileHandle`
- `window.showDirectoryPicker()`: Grants access to entire folder
- `window.showSaveFilePicker()`: Suggests name and location to save new file

**The write flow** (uses "swap file" strategy to prevent corruption):

```javascript
// 1. Open file picker
const [fileHandle] = await window.showOpenFilePicker();
const file = await fileHandle.getFile();
const contents = await file.text();

// 2. Save file picker
const handle = await window.showSaveFilePicker({
  suggestedName: 'document.txt',
  types: [{
    accept: { 'text/plain': ['.txt'] }
  }]
});

// 3. Create writable stream
const writable = await handle.createWritable();

// 4. Write data
await writable.write('File contents');

// 5. Close/Commit (changes applied to original file)
await writable.close();
```

**Non-PWA use cases**:

- **Browser-based code editors**: Sites like vscode.dev allow working on local projects. Click "Open Folder", grant permission, then Ctrl+S updates files directly on hard drive
- **In-browser media converters**: Tools like Squoosh handle large files. A 2GB video can be edited and saved without uploading to server or storing in browser cache
- **Log viewers**: Pick specific `.log` file from system to analyze

**Security model**:

- **Secure Context**: Only works on `https://` or `localhost`
- **Transient Activation**: Cannot trigger file picker automatically on page load; must follow user action
- **Permission Lifecycle**:
  - Read access granted when picker closes
  - Write access triggers secondary browser prompt ("Allow site to save changes?")
  - Chromium browsers support persisting permissions
- **Blocklist**: Browsers block access to sensitive system folders (`C:\Windows`, `/etc/`, Library folders)

**Browser support**: Chrome/Edge full support; Safari/Firefox limited or no support

#### Origin Private File System (OPFS)

High-performance virtual file system invisible to user. Considered a **Baseline** feature supported by Chrome, Firefox, and Safari.

**The Worker performance boost**: While main thread uses async calls, Web Workers can use `FileSystemSyncAccessHandle` with synchronous `read()` and `write()` methods. Synchronous I/O has much lower overhead than Promises, allowing libraries like SQLite to run at near-native speeds via WebAssembly.

```javascript
// Async API (main thread)
const root = await navigator.storage.getDirectory();
const fileHandle = await root.getFileHandle('data.db', { create: true });
const writable = await fileHandle.createWritable();
await writable.write('Hidden from user');
await writable.close();

// Sync API (Web Worker only) - ultra-fast
const accessHandle = await fileHandle.createSyncAccessHandle();
const buffer = new Uint8Array([1, 2, 3]);
accessHandle.write(buffer); // Synchronous!
accessHandle.flush();
accessHandle.close();
```

**Non-PWA use cases**:

- **SQLite databases**: WebAssembly version of SQLite creates virtual `.db` file inside OPFS. With synchronous access handles in Web Workers, SQLite reads/writes at near-native speeds - significantly faster than IndexedDB for complex queries
- **Game asset caching**: Complex 3D sites download 500MB of textures/models once and store in OPFS. Unlike browser cache (cleared when disk space low), OPFS is more persistent

**Global support status (late 2025)**:

| Browser | OPFS (Sandboxed) | Device-Level Pickers |
|---------|------------------|---------------------|
| Chrome/Edge | Full Support | Full Support |
| Safari | Full Support | No (Not implemented) |
| Firefox | Full Support | No (Not implemented) |
| Mobile | Limited Support | Generally Unsupported |

### Geolocation API

Access user's geographical coordinates.

#### Basic Usage

```javascript
if ('geolocation' in navigator) {
  const options = {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 5000,
    maximumAge: 0 // No cached positions
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Location: ${latitude}, ${longitude}`);
      console.log(`Accuracy: ${accuracy} meters`);
    },
    (error) => {
      console.error(`Error: ${error.message}`);
    },
    options
  );
}
```

#### Real-Time Tracking

```javascript
let watchId = null;

function startTracking() {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return;
  }

  const options = {
    enableHighAccuracy: true, // Force GPS for better tracking
    maximumAge: 0,            // Don't use old, cached positions
    timeout: 10000            // Wait up to 10s for a lock
  };

  // watchPosition returns an ID we can use to stop tracking later
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, speed, heading } = position.coords;

      console.log(`Updated Location: ${latitude}, ${longitude}`);

      // Update your UI or Map Marker here
      updateMapMarker(latitude, longitude);

      if (speed) console.log(`Traveling at: ${speed} m/s`);
    },
    (error) => {
      console.error("Tracking error:", error.message);
    },
    options
  );
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("Tracking stopped.");
  }
}
```

**Position object properties**:

| Property | Description |
|----------|-------------|
| `coords.latitude` | Decimal degrees |
| `coords.longitude` | Decimal degrees |
| `coords.accuracy` | Accuracy level in meters |
| `coords.heading` | Direction of travel in degrees clockwise from North (0-360) |
| `coords.speed` | Current ground speed in meters per second |
| `timestamp` | Exact time the location was acquired |

**Pro tips for real-time tracking**:

- **Battery management**: `watchPosition` with `enableHighAccuracy` is battery-intensive. If you don't need turn-by-turn precision, set `enableHighAccuracy: false` to use Wi-Fi/cell towers instead
- **Accuracy filtering**: In urban areas, GPS "jumps" due to signal bouncing off buildings. Check if `position.coords.accuracy < 30` before updating UI. Ignore updates with poor accuracy (e.g., 200m) to prevent map marker flickering
- **Handle "ghost" movements**: Even when standing still, coordinates might shift slightly. Use a small threshold (e.g., only update if user moved more than 5 meters) to keep the experience smooth

#### Distance Calculation (Haversine Formula)

To calculate distance between two coordinates on a globe, use the Haversine Formula for great-circle distance:

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters

  // Convert degrees to radians
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

**Distance tracking implementation**:

```javascript
let totalDistance = 0;
let lastCoords = null;

navigator.geolocation.watchPosition((pos) => {
  const { latitude, longitude, accuracy } = pos.coords;

  // Filter out low-accuracy updates to prevent "GPS drift"
  if (accuracy > 20) return;

  if (lastCoords) {
    const distanceStep = calculateDistance(
      lastCoords.latitude,
      lastCoords.longitude,
      latitude,
      longitude
    );

    // Only count movement if more than 2 meters
    // (prevents adding distance while standing still)
    if (distanceStep > 2) {
      totalDistance += distanceStep;
      console.log(`Total Distance: ${totalDistance.toFixed(2)} meters`);
    }
  }

  lastCoords = { latitude, longitude };
}, error, { enableHighAccuracy: true });
```

#### Security Requirements

- **HTTPS only** (except localhost)
- **Explicit user consent** via browser prompt
- **Permissions Policy** for iframes: `<iframe allow="geolocation">`

#### Location Methods

Browsers use a hierarchy of location sources:

1. **GPS**: Most accurate (meters), slow, battery-heavy
2. **Wi-Fi triangulation**: Scans nearby networks
3. **Cell tower ID**: Mobile cellular signals
4. **IP GeoIP**: Least accurate (city/region level)

### Web Share API

Trigger native OS share dialog. The API provides a bridge between your website and the device's native sharing capabilities (contacts, apps like WhatsApp/Slack, or system features).

**Security requirements**:

- **Secure Context**: Site must be served over HTTPS
- **Transient Activation**: Can only be triggered by user action (like button click). Cannot call automatically on page load

#### Basic Sharing

```javascript
const shareData = {
  title: 'Check this out!',
  text: 'Amazing content',
  url: 'https://example.com'
};

button.addEventListener('click', async () => {
  try {
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log('Shared successfully');
    }
  } catch (err) {
    console.error('Share failed:', err);
    // Fallback: copy to clipboard
  }
});
```

#### File Sharing

The API supports sharing images, PDFs, or audio files:

```javascript
const files = [new File(['content'], 'file.txt', { type: 'text/plain' })];

await navigator.share({
  title: 'My file',
  files: files
});
```

**Capability levels**:

| Feature | Supported Data |
|---------|----------------|
| **Basic Sharing** | `title`, `text`, `url` |
| **File Sharing** | `files` (array of `File` objects) |
| **Cross-Origin** | Requires `allow="web-share"` attribute on iframes |

**Why use it**:

1. **Reduced Payload**: No need to load heavy third-party SDKs for every social network
2. **User Privacy**: Browser doesn't know where user shared content; only knows if they did
3. **Consistency**: Users use same interface they're comfortable with on their device

**Limitations**:

- **No "Success" Tracking**: For privacy, API won't tell you which app user picked (e.g., Twitter vs. WhatsApp)
- **Local File Schemes**: Cannot share `file://` URLs for security reasons

**Browser support**: Excellent on mobile (iOS/Android); moderate on desktop (Safari macOS, Chrome/Edge Windows)

### Web Storage API

Client-side key-value storage.

#### localStorage vs sessionStorage

```javascript
// Persists across browser sessions
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');

// Cleared when tab closes
sessionStorage.setItem('tempData', JSON.stringify(data));
```

#### Key Gotchas

**String-only storage**:

```javascript
// Wrong - stores "[object Object]"
localStorage.setItem('user', { name: 'John' });

// Correct
localStorage.setItem('user', JSON.stringify({ name: 'John' }));
const user = JSON.parse(localStorage.getItem('user'));
```

**Synchronous blocking**: All operations block main thread. Writing large amounts of data (e.g., a 4MB JSON blob) can cause UI freezing or "jank"

**Private/Incognito mode**: Behavior varies by browser. Some browsers (like older Safari) provide a `localStorage` object with zero quota, causing every `setItem` call to throw an error immediately. Always wrap `setItem` in a `try...catch` block

**Quota limits**: ~5-10MB per origin. When exceeded, browsers throw a `QuotaExceededError`. Implement a cleanup strategy or Least Recently Used (LRU) cache for ephemeral data

**Security**: Accessible to all JavaScript (XSS vulnerability). Any script running on your page (including third-party analytics, ads, or compromised libraries) has full access to everything in Web Storage

**Best practice**: Never store sensitive data (tokens, PII) in Web Storage; use `HttpOnly` cookies instead

#### Advanced Best Practices

**Data versioning**: If you change the structure of stored objects in a new app version, your code might crash when trying to parse "old" data. Store a `version` key and check on app load. If versions don't match, clear storage or migrate data

**Namespacing**: Since all scripts on a domain share the same storage, generic keys like `user` or `settings` might collide with third-party scripts. Prefix your keys (e.g., `myapp_user_settings`)

#### Storage Events

Sync state across tabs:

```javascript
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    applyTheme(event.newValue);
  }
});
```

Note: Event fires in all tabs EXCEPT the one that made the change

#### Comparison with Alternatives

| Feature | Web Storage | IndexedDB | Cookies |
|---------|-------------|-----------|---------|
| Capacity | 5-10MB | Virtually unlimited | ~4KB |
| Data Types | Strings only | Objects, Blobs, Files | Strings only |
| Access | Synchronous | Asynchronous | Sync/Async |
| Security | XSS vulnerable | XSS vulnerable | Can be `HttpOnly` |
| Primary Use | UI state, preferences | Large app data | Authentication |

---

## Progressive Web Apps (PWAs)

Progressive Web Apps bridge the gap between web and native applications.

### Universal PWA Features (2025)

These features work across Chrome, Firefox, and Safari:

#### Service Workers

Background scripts enabling offline functionality:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

#### Web App Manifest

JSON file defining app metadata:

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196f3",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Link in HTML:

```html
<link rel="manifest" href="/manifest.json">
```

#### Web Push Notifications

As of 2025, push notifications work universally (including Safari iOS 16.4+):

```javascript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey
  });

  // Send subscription to server
}
```

#### Origin Private File System

Universal support for high-performance sandboxed storage:

```javascript
const root = await navigator.storage.getDirectory();
const fileHandle = await root.getFileHandle('cache.db', { create: true });
```

### Platform-Specific Features

#### Chromium Exclusive (Chrome/Edge)

**File System Access API**: Direct access to user's files

**Web Bluetooth/USB/Serial**: Hardware access

**Multi-Screen Window Placement**: Professional desktop features

**Protocol Handlers**: Register as default app for custom URL schemes

#### Safari Improvements (2025)

**File System WritableStream**: Limited file system access (sandboxed)

**Add to Dock**: macOS PWAs appear in Dock and App Switcher

**Roadmap**: Digital Credentials API, improved Service Worker reliability

#### Firefox Status (2025)

**Taskbar Tabs**: Pin sites to Windows taskbar (Firefox 143+)

**Maintains browser protections**: Extensions like uBlock Origin work in "app" view

**Roadmap**: Linux/macOS support by mid-2026; investigating Background Sync

### PWA Manifest: Platform Optimization

#### Android (Chrome/Edge/Samsung)

```json
{
  "name": "My App",
  "short_name": "App",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196f3",
  "icons": [
    {
      "src": "android-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

**Maskable icons**: Keep critical elements within center 80% to avoid OS cropping

**Splash screens**: Auto-generated from `background_color`, `name`, and 512x512 icon

#### iOS (Safari)

Safari requires HTML meta tags (manifest not used for icons/splash):

```html
<link rel="apple-touch-icon" href="apple-touch-icon.png">

<link rel="apple-touch-startup-image"
      media="screen and (device-width: 393px)"
      href="splash-iphone15.png">

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="My App">
```

**Icon format**: Flat square with no transparency (iOS handles rounding)

**Splash screens**: Provide device-specific images to avoid black screen during boot

#### Desktop (Windows/macOS/ChromeOS)

```json
{
  "name": "Desktop App",
  "display": "standalone",
  "display_override": ["window-controls-overlay", "minimal-ui"],
  "icons": [
    {
      "src": "icon.ico",
      "sizes": "32x32 48x48 128x128",
      "type": "image/x-icon"
    },
    {
      "src": "icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ],
  "shortcuts": [
    {
      "name": "New Document",
      "url": "/new",
      "icons": [{ "src": "new.png", "sizes": "96x96" }]
    }
  ]
}
```

**Window Controls Overlay**: Place content in title bar next to window controls

**Shortcuts**: Right-click taskbar icon shows jump list

### PWA Installation API

Control installation user experience:

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);
    deferredPrompt = null;
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
  installButton.style.display = 'none';
});
```

**Browser support**:
- **Chrome/Edge**: Full support for `beforeinstallprompt`
- **Safari**: No support; users must manually "Add to Home Screen"
- **Firefox**: Minimal support; re-adding features in 2025

### File Handling API

Register PWA as file handler:

**Manifest declaration**:

```json
{
  "file_handlers": [
    {
      "action": "/open-file",
      "accept": {
        "text/plain": [".txt"],
        "image/*": [".png", ".jpg"]
      }
    }
  ]
}
```

**JavaScript consumer**:

```javascript
if ('launchQueue' in window) {
  launchQueue.setConsumer(async (launchParams) => {
    if (launchParams.files.length > 0) {
      const fileHandle = launchParams.files[0];
      const file = await fileHandle.getFile();
      console.log(`Opening: ${file.name}`);
      // Load file into editor
    }
  });
}
```

**Browser support**: Chromium only (Chrome/Edge)

### Web Share Target API

Allow PWA to receive shared content:

**Manifest declaration**:

```json
{
  "share_target": {
    "action": "/receive",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "media",
          "accept": ["image/*", "video/*"]
        }
      ]
    }
  }
}
```

**Service Worker handler**:

```javascript
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/receive') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const file = formData.get('media');

      // Store in IndexedDB
      await storeFile(file);

      return Response.redirect('/view', 303);
    })());
  }
});
```

**Requirements**: HTTPS, valid manifest, PWA must be installed

**Browser support**: Android (Chrome/Edge/Samsung), Windows (Chrome/Edge); not supported on iOS/Safari

### IndexedDB for Offline Data

Asynchronous database for large datasets:

```javascript
const OfflineStore = {
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppDB', 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('outbox')) {
          db.createObjectStore('outbox', { autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async queueData(data) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('outbox', 'readwrite');
      const store = tx.objectStore('outbox');
      store.add(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};
```

### Background Sync

Defer operations until connectivity restored:

**Main thread**:

```javascript
async function handleSubmit(data) {
  try {
    await sendToServer(data);
  } catch (err) {
    // Offline - queue for later
    await OfflineStore.queueData(data);

    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-outbox');

    alert('Offline. Will sync when reconnected!');
  }
}
```

**Service Worker**:

```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-outbox') {
    event.waitUntil(processOutbox());
  }
});

async function processOutbox() {
  const db = await openIDB();
  const records = await getAllRecords(db);

  for (const record of records) {
    try {
      await fetch('/api/data', {
        method: 'POST',
        body: JSON.stringify(record)
      });
      await deleteRecord(record.id);
    } catch (e) {
      throw e; // Browser will retry later
    }
  }
}
```

**Browser support**: Chrome/Edge/Opera; Safari/Firefox use manual retry on `online` event

### Network Information API

Adapt behavior based on connection quality:

```javascript
const conn = navigator.connection || navigator.mozConnection;

if (conn) {
  console.log(`Type: ${conn.effectiveType}`); // '4g', '3g', '2g', 'slow-2g'
  console.log(`Speed: ${conn.downlink} Mbps`);
  console.log(`Data saver: ${conn.saveData}`);

  conn.addEventListener('change', () => {
    if (conn.effectiveType === 'slow-2g' || conn.saveData) {
      // Pause heavy operations
      document.body.classList.add('low-bandwidth');
    }
  });
}
```

### Universal PWA Wrapper

Feature detection wrapper for progressive enhancement:

```javascript
const PWAWrapper = {
  // File System
  canUseNativeFileSystem: () => 'showOpenFilePicker' in window,

  async saveFile(content, fileName, mimeType = 'text/plain') {
    if (this.canUseNativeFileSystem()) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ accept: { [mimeType]: ['.txt'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return { method: 'native' };
      } catch (err) {
        if (err.name === 'AbortError') return { method: 'cancelled' };
      }
    }

    // Fallback: download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    return { method: 'fallback' };
  },

  // Installation
  isInstalled: () => {
    return window.matchMedia('(display-mode: standalone)').matches
           || window.navigator.standalone === true;
  },

  // Push Notifications
  async initPush(vapidKey) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { supported: false };
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });
    }
    return { supported: true, subscription };
  },

  // Background Sync
  async registerSync(tag) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      return { success: true, method: 'BackgroundSync' };
    }
    return { success: false, method: 'Manual' };
  },

  // Network
  getConnectionStatus: () => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!conn) return { supported: false };

    return {
      supported: true,
      effectiveType: conn.effectiveType,
      downlink: conn.downlink,
      saveData: conn.saveData
    };
  },

  isConnectionExpensive: () => {
    const status = this.getConnectionStatus();
    if (!status.supported) return false;

    const isSlow = ['2g', 'slow-2g'].includes(status.effectiveType);
    return isSlow || status.saveData;
  }
};
```

---

## Cross-Browser Compatibility

### Browser Support Levels (2025)

| Feature | Chrome/Edge | Safari | Firefox |
|---------|-------------|--------|---------|
| Service Workers | Full | Full | Full |
| Web App Manifest | Full | Full | Full |
| Web Push | Full | iOS 16.4+ | Full |
| Container Queries | Full | Full | Full |
| Scroll-Driven Animations | Full | Recent | Recent |
| Anchor Positioning | Full | Full | Q1 2026 |
| File System Access | Full | Limited | Read-only |
| Web Bluetooth/USB | Full | No | No |
| PWA Desktop Install | Full | Add to Dock | Experimental |

### Feature Detection Pattern

Always use feature detection, never browser sniffing:

```javascript
// Good
if ('serviceWorker' in navigator) {
  // Use Service Worker
}

// Bad
if (navigator.userAgent.includes('Chrome')) {
  // Fragile and wrong
}
```

### Progressive Enhancement

Build from baseline up:

1. **Baseline**: Works everywhere (basic HTML/CSS)
2. **Enhanced**: Add modern features with detection
3. **Exceptional**: Platform-specific capabilities

```javascript
// Baseline: Traditional download
function saveData(content) {
  downloadBlob(content);
}

// Enhanced: Native file picker where available
if ('showSaveFilePicker' in window) {
  async function saveData(content) {
    const handle = await window.showSaveFilePicker();
    await writeFile(handle, content);
  }
}
```

---

## Best Practices and Patterns

### HTML Best Practices

1. **Use semantic elements**: `<nav>`, `<main>`, `<article>`, `<section>` over generic `<div>`
2. **Provide text alternatives**: `alt` attributes on images
3. **Label form inputs**: Use `<label>` or `aria-label`
4. **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
5. **Valid HTML**: Use validator to catch errors

### CSS Best Practices

1. **Mobile-first**: Start with mobile styles, add desktop with media queries
2. **Grid for layout, Flexbox for components**: Use the right tool for the job
3. **CSS variables for theming**: Centralize design tokens
4. **Avoid `!important`**: Use cascade layers instead
5. **Performance**: Use `content-visibility` for long pages

### JavaScript Best Practices

1. **Progressive enhancement**: Core functionality works without JS
2. **Async operations**: Use `async`/`await` for cleaner code
3. **Event delegation**: Attach listeners to parent elements
4. **Debounce expensive operations**: Rate-limit scroll/resize handlers
5. **Error handling**: Always `try`/`catch` async operations

### PWA Best Practices

1. **Offline-first**: Cache critical assets in Service Worker
2. **Fast loading**: Use cache-first strategies
3. **Re-engagement**: Push notifications for important updates
4. **Responsive**: Works on all screen sizes
5. **Installable**: Provide clear installation prompts

### Security Best Practices

1. **HTTPS only**: Required for modern APIs
2. **Validate input**: Never trust client data
3. **HttpOnly cookies**: For authentication tokens
4. **CSP headers**: Content Security Policy to prevent XSS
5. **CORS properly**: Configure cross-origin access correctly

---

## Resources

### Standards

- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [W3C CSS Specifications](https://www.w3.org/Style/CSS/)
- [TC39 JavaScript Proposals](https://github.com/tc39/proposals)

### Documentation

- [MDN Web Docs](https://developer.mozilla.org/)
- [web.dev](https://web.dev/)
- [Can I Use](https://caniuse.com/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Firefox Developer Tools](https://firefox-source-docs.mozilla.org/devtools-user/)

### Learning Resources

- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [CSS-Tricks](https://css-tricks.com/) - CSS techniques and patterns
- [A11y Project](https://www.a11yproject.com/) - Accessibility resources

### Browser Compatibility

- [Can I Use](https://caniuse.com/) - Feature support tables
- [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data)
- [Web Platform Tests](https://wpt.fyi/) - Cross-browser test results
