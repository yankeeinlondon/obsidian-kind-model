# Drag and Drop API

Native HTML Drag and Drop (DnD) API for mouse and touch interactions. While third-party libraries (dnd-kit) are popular for complex UIs, the native API is preferred for file uploads, list reordering, and cross-application data transfer.

## Core Concepts

### Two Main Entities

1. **Draggable Source**: Element being dragged
2. **Drop Target**: Element receiving the drop

### DataTransfer Object

The "cargo ship" that holds data during the drag operation.

## Event Lifecycle

| Event | Target | Description | preventDefault() Required? |
|-------|--------|-------------|---------------------------|
| `dragstart` | Source | Drag begins | No |
| `drag` | Source | Fires continuously during drag | No |
| `dragenter` | Target | Dragged item enters target | No |
| `dragover` | Target | Fires every ~100ms over target | **YES** (to allow drop) |
| `dragleave` | Target | Dragged item leaves target | No |
| `drop` | Target | Item released over target | **YES** (prevent default action) |
| `dragend` | Source | Drag operation ends | No |

## Basic Implementation

### Make Element Draggable

```html
<div draggable="true" id="item1">Drag me</div>
```

### Drag Source Setup

```javascript
const draggable = document.getElementById('item1');

draggable.addEventListener('dragstart', (e) => {
  // Store data (only time you can write to dataTransfer)
  e.dataTransfer.setData('text/plain', e.target.id);

  // Set drag effect
  e.dataTransfer.effectAllowed = 'move';

  // Optional: Set drag image
  const dragImage = new Image();
  dragImage.src = 'drag-icon.png';
  e.dataTransfer.setDragImage(dragImage, 25, 25);
});
```

### Drop Target Setup

```javascript
const dropZone = document.getElementById('drop-zone');

// REQUIRED: Prevent default to allow drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

// Handle the drop
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  // Get data (only time you can read from dataTransfer)
  const id = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);

  // Move element
  dropZone.appendChild(element);
});
```

## DataTransfer Modes

The `DataTransfer` object has three privacy-preserving modes to protect user privacy:

1. **Read/Write (dragstart)**: Can add data via `setData()` - the only time you can write data
2. **Protected (dragover/dragenter)**: Can see data types (e.g., "Files") but cannot access actual content
3. **Read-only (drop)**: Can finally read data via `getData()` when drop completes

This mode system prevents tracking by ensuring dragged content isn't accessible until the user explicitly drops it.

## Effect Types

```javascript
// In dragstart
e.dataTransfer.effectAllowed = 'copy';    // Copy only
e.dataTransfer.effectAllowed = 'move';    // Move only
e.dataTransfer.effectAllowed = 'link';    // Link only
e.dataTransfer.effectAllowed = 'copyMove';// Copy or move
e.dataTransfer.effectAllowed = 'all';     // Any effect

// In dragover
e.dataTransfer.dropEffect = 'copy';  // Shows copy cursor
e.dataTransfer.dropEffect = 'move';  // Shows move cursor
e.dataTransfer.dropEffect = 'link';  // Shows link cursor
e.dataTransfer.dropEffect = 'none';  // Shows no-drop cursor
```

## File Drop (Upload)

```javascript
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');

  const files = Array.from(e.dataTransfer.files);

  files.forEach(file => {
    console.log('File:', file.name, file.type, file.size);

    // Upload file
    uploadFile(file);

    // Or read as text
    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Contents:', e.target.result);
      };
      reader.readAsText(file);
    }

    // Or read as data URL (image preview)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        document.body.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
});
```

## Visual Feedback

```css
/* Draggable element */
[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}

/* Drop zone states */
.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  transition: all 0.2s;
}

.drop-zone.drag-over {
  border-color: #007bff;
  background-color: #e3f2fd;
}

/* Dragging state (on source) */
.dragging {
  opacity: 0.5;
}
```

```javascript
draggable.addEventListener('dragstart', (e) => {
  e.target.classList.add('dragging');
});

draggable.addEventListener('dragend', (e) => {
  e.target.classList.remove('dragging');
});
```

## Accessible Navigation with Popover + ARIA

Combine drag-and-drop with accessible alternatives.

```html
<nav aria-label="Main Menu">
  <button
    popovertarget="nav-menu"
    aria-expanded="false"
    aria-haspopup="true">
    Menu
  </button>

  <div id="nav-menu" popover role="menu">
    <ul style="list-style: none; padding: 1rem;">
      <li role="none">
        <a href="/dashboard" role="menuitem">Dashboard</a>
      </li>
      <li role="none">
        <a href="/settings" role="menuitem">Settings</a>
      </li>
      <li role="none">
        <div
          draggable="true"
          role="menuitem"
          tabindex="0"
          ondragstart="event.dataTransfer.setData('text/plain', 'QuickLink')"
          onkeydown="handleKeyboardDrag(event)"
          style="cursor: grab; border: 1px dashed #ccc; padding: 5px;">
          Drag to Sidebar
        </div>
      </li>
    </ul>
  </div>
</nav>
```

### Keyboard Accessibility for Drag

```javascript
function handleKeyboardDrag(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const item = e.target;

    // Simulate drag with keyboard
    item.setAttribute('data-keyboard-drag', 'true');
    showDragTargets();
  }
}

// Let user select target with arrow keys
function showDragTargets() {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.add('keyboard-target');
    zone.tabIndex = 0;
  });
}
```

## Smooth Animations with WAAPI

```javascript
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  const draggedId = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(draggedId);

  // Get mouse position
  const startX = e.clientX;
  const startY = e.clientY;

  // Append element
  dropZone.appendChild(element);

  // Get final position
  const rect = element.getBoundingClientRect();
  const deltaX = startX - rect.left;
  const deltaY = startY - rect.top;

  // Animate from mouse to final position
  element.animate([
    {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(1.1)`,
      opacity: 0.5
    },
    {
      transform: 'translate(0, 0) scale(1)',
      opacity: 1
    }
  ], {
    duration: 300,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  });
});
```

## Popover Animation

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

[popover]:not(:popover-open) {
  opacity: 0;
  transform: translateY(-10px);
}
```

## List Reordering

```javascript
let draggedElement = null;

document.querySelectorAll('.sortable-item').forEach(item => {
  item.addEventListener('dragstart', (e) => {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  });

  item.addEventListener('dragover', (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(e.target.parentElement, e.clientY);

    if (afterElement == null) {
      e.target.parentElement.appendChild(draggedElement);
    } else {
      e.target.parentElement.insertBefore(draggedElement, afterElement);
    }
  });

  item.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    draggedElement = null;
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.sortable-item:not(.dragging)')
  ];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
```

## Cross-Window Drag

Drag data between different browser windows (same origin).

```javascript
// Window A (source)
draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', JSON.stringify({
    id: item.id,
    title: item.title,
    timestamp: Date.now()
  }));
});

// Window B (target)
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));

  // Use data from other window
  console.log('Received from other window:', data);
});
```

## Security Considerations

### Data Privacy

During `dragover`, you cannot read the actual data (only types) to prevent tracking.

```javascript
dropZone.addEventListener('dragover', (e) => {
  // Can check types
  if (e.dataTransfer.types.includes('text/plain')) {
    e.preventDefault(); // Allow drop
  }

  // CANNOT do this in dragover:
  // const data = e.dataTransfer.getData('text/plain'); // Returns empty string
});
```

### Cross-Origin Restrictions

Cannot drag sensitive data between different origins for security.

## Complete Example: Photo Gallery

```html
<div class="gallery">
  <div class="photo-item" draggable="true" data-id="photo1">
    <img src="photo1.jpg" alt="Photo 1">
  </div>
  <!-- More photos -->
</div>

<div class="album drop-zone" data-album="favorites">
  <h3>Favorites</h3>
</div>
```

```javascript
// Setup draggable photos
document.querySelectorAll('.photo-item').forEach(photo => {
  photo.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.effectAllowed = 'copy';
    e.target.style.opacity = '0.5';
  });

  photo.addEventListener('dragend', (e) => {
    e.target.style.opacity = '1';
  });
});

// Setup drop zones
document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');

    const photoId = e.dataTransfer.getData('text/plain');
    const photoElement = document.querySelector(`[data-id="${photoId}"]`);

    // Clone photo (since effectAllowed is 'copy')
    const clone = photoElement.cloneNode(true);
    zone.appendChild(clone);

    // Save to album
    saveToAlbum(zone.dataset.album, photoId);
  });
});
```

## Related

- [Popover API](./html.md#popover-api)
- [Web Animations API](./web-animations.md)
- [File System Access](./file-system.md)
