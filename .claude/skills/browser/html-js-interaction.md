# HTML and JavaScript Interaction

HTML provides the structure (skeleton), JavaScript provides the logic and behavior (nervous system). The bridge is the **Document Object Model (DOM)**.

## The Document Object Model (DOM)

When a browser loads HTML, it creates a tree-like representation. JavaScript doesn't read HTML text directly—it manipulates this live tree.

- **Nodes**: Every tag, attribute, and text becomes a "node"
- **`document` Object**: Entry point to the DOM tree

## Finding HTML Elements

### Selection Methods

| Method | Returns | Example |
|--------|---------|---------|
| `getElementById()` | Single element or null | `document.getElementById('header')` |
| `querySelector()` | First match or null | `document.querySelector('.button')` |
| `querySelectorAll()` | NodeList (array-like) | `document.querySelectorAll('li')` |
| `getElementsByClassName()` | HTMLCollection (live) | `document.getElementsByClassName('card')` |
| `getElementsByTagName()` | HTMLCollection (live) | `document.getElementsByTagName('p')` |

### Best Practices

```javascript
// Modern approach (use querySelector/querySelectorAll)
const button = document.querySelector('#submit-btn');
const cards = document.querySelectorAll('.card');

// Query within a specific element
const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');

// Complex selectors (CSS syntax)
const activeLinks = document.querySelectorAll('nav a.active');
const firstParagraph = document.querySelector('article > p:first-child');
```

## Three Pillars of Interaction

### 1. Modifying Content and Structure

#### Text Content

```javascript
const heading = document.querySelector('h1');

// Plain text (safe, no HTML injection)
heading.textContent = 'New Title';

// HTML content (use with caution)
heading.innerHTML = '<strong>Bold Title</strong>';

// Get vs. set
const currentText = heading.textContent;
```

#### Creating Elements

```javascript
// Create element
const div = document.createElement('div');
div.className = 'card';
div.id = 'card-1';
div.textContent = 'Hello';

// Append to parent
document.body.appendChild(div);

// Insert at specific position
const container = document.querySelector('.container');
const firstChild = container.firstChild;
container.insertBefore(div, firstChild);

// Remove element
div.remove();
```

#### Modern DOM Manipulation

```javascript
// Insert adjacent HTML
element.insertAdjacentHTML('beforebegin', '<p>Before</p>');
element.insertAdjacentHTML('afterbegin', '<p>First child</p>');
element.insertAdjacentHTML('beforeend', '<p>Last child</p>');
element.insertAdjacentHTML('afterend', '<p>After</p>');

// Replace content
element.replaceChildren(newChild1, newChild2);

// Clone element
const clone = element.cloneNode(true); // true = deep clone
```

### 2. Manipulating Styles and Attributes

#### Direct Styles

```javascript
const box = document.querySelector('.box');

// Set single style
box.style.backgroundColor = 'blue';
box.style.width = '200px';

// Set multiple styles
Object.assign(box.style, {
  backgroundColor: 'blue',
  width: '200px',
  borderRadius: '10px'
});

// Get computed style
const computedStyle = window.getComputedStyle(box);
console.log(computedStyle.width); // Actual rendered width
```

#### Class Manipulation (Preferred)

```javascript
// Add class
element.classList.add('active');

// Remove class
element.classList.remove('hidden');

// Toggle class
element.classList.toggle('expanded');

// Check if has class
if (element.classList.contains('selected')) {
  // ...
}

// Replace class
element.classList.replace('old-class', 'new-class');
```

#### Attributes

```javascript
// Get attribute
const href = link.getAttribute('href');

// Set attribute
img.setAttribute('src', 'new-image.jpg');
img.setAttribute('alt', 'Description');

// Remove attribute
element.removeAttribute('disabled');

// Check if attribute exists
if (element.hasAttribute('data-id')) {
  // ...
}

// Data attributes
element.dataset.userId = '123'; // <div data-user-id="123">
const userId = element.dataset.userId;
```

### 3. Event Handling

#### Adding Event Listeners

```javascript
const button = document.querySelector('button');

// Modern approach
button.addEventListener('click', (event) => {
  console.log('Clicked!', event);
});

// With options
button.addEventListener('click', handler, {
  once: true,      // Remove after first trigger
  capture: true,   // Capture phase
  passive: true    // Won't call preventDefault()
});

// Remove listener
button.removeEventListener('click', handler);
```

#### Common Events

| Category | Events |
|----------|--------|
| **Mouse** | `click`, `dblclick`, `mousedown`, `mouseup`, `mouseenter`, `mouseleave`, `mousemove` |
| **Keyboard** | `keydown`, `keyup`, `keypress` (deprecated) |
| **Form** | `submit`, `input`, `change`, `focus`, `blur` |
| **Window** | `load`, `resize`, `scroll`, `beforeunload` |
| **Touch** | `touchstart`, `touchmove`, `touchend` |

#### Event Object

```javascript
element.addEventListener('click', (e) => {
  e.target;              // Element that triggered event
  e.currentTarget;       // Element with listener attached
  e.preventDefault();    // Prevent default action
  e.stopPropagation();   // Stop bubbling

  // Mouse events
  e.clientX, e.clientY;  // Mouse position
  e.button;              // Which button clicked

  // Keyboard events
  e.key;                 // Key pressed ('a', 'Enter', etc.)
  e.code;                // Physical key ('KeyA', 'Enter')
  e.ctrlKey, e.shiftKey; // Modifier keys
});
```

#### Event Delegation

Handle events on parent instead of many children.

```javascript
// Bad: Add listener to each button
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// Good: Single listener on parent
container.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    handleClick(e);
  }
});
```

## Data Flow: HTML to JavaScript

### Form Inputs

```javascript
const input = document.querySelector('input[name="username"]');

// Get value
const value = input.value;

// Set value
input.value = 'new value';

// Listen for changes
input.addEventListener('input', (e) => {
  console.log('Current value:', e.target.value);
});
```

### Data Attributes

```html
<div id="user" data-user-id="123" data-role="admin"></div>
```

```javascript
const user = document.getElementById('user');

// Read data attributes
const userId = user.dataset.userId;   // '123'
const role = user.dataset.role;       // 'admin'

// Set data attributes
user.dataset.status = 'active';
```

## Common Patterns

### Form Handling

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  // Get form data (modern)
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log(data);

  // Or manually
  const username = form.elements.username.value;
  const password = form.elements.password.value;
});
```

### Dynamic List

```javascript
const items = ['Apple', 'Banana', 'Cherry'];
const list = document.querySelector('ul');

// Clear existing
list.innerHTML = '';

// Add items
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  list.appendChild(li);
});

// Or with template literals
list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
```

### Show/Hide Elements

```javascript
const modal = document.querySelector('.modal');
const openBtn = document.querySelector('.open-modal');
const closeBtn = document.querySelector('.close-modal');

openBtn.addEventListener('click', () => {
  modal.classList.add('active');
  // Or: modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  // Or: modal.style.display = 'none';
});
```

### Loading States

```javascript
async function loadData() {
  const button = document.querySelector('button');
  const container = document.querySelector('.content');

  // Show loading
  button.disabled = true;
  button.textContent = 'Loading...';
  container.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    // Update content
    container.innerHTML = data.map(item =>
      `<div class="item">${item.title}</div>`
    ).join('');
  } catch (error) {
    container.innerHTML = `<p class="error">${error.message}</p>`;
  } finally {
    button.disabled = false;
    button.textContent = 'Refresh';
  }
}
```

## Script Placement

### Defer and Async

```html
<!-- Defer: Wait for HTML parsing, maintain order -->
<script src="script.js" defer></script>

<!-- Async: Load in parallel, execute ASAP (order not guaranteed) -->
<script src="analytics.js" async></script>

<!-- Module: Defer by default -->
<script type="module" src="app.js"></script>
```

### Best Practice

```html
<!DOCTYPE html>
<html>
<head>
  <title>Page</title>
  <!-- Use defer for scripts that need DOM -->
  <script src="app.js" defer></script>
</head>
<body>
  <!-- Content here -->
</body>
</html>
```

## Modern DOM APIs

### Element.closest()

Find nearest ancestor matching selector.

```javascript
button.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) {
    card.classList.toggle('selected');
  }
});
```

### Element.matches()

Check if element matches selector.

```javascript
element.addEventListener('click', (e) => {
  if (e.target.matches('button.delete')) {
    // Handle delete
  }
});
```

### IntersectionObserver

Detect when element enters viewport.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.lazy').forEach(el => {
  observer.observe(el);
});
```

## Performance Tips

### Batch DOM Updates

```javascript
// Bad: Multiple reflows
for (let i = 0; i < 100; i++) {
  list.appendChild(createItem(i));
}

// Good: Single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  fragment.appendChild(createItem(i));
}
list.appendChild(fragment);
```

### Debounce Events

```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Use for scroll, resize, input
window.addEventListener('resize', debounce(() => {
  console.log('Resize finished');
}, 250));
```

## Related

- [CSS-JavaScript Interaction](./css-js-interaction.md)
- [Web Animations API](./web-animations.md)
- [Forms and Validation](./forms.md)
