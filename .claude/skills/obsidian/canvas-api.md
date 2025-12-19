# Canvas API

The Canvas API allows plugins to create, read, update, and manipulate Obsidian Canvas files programmatically. Canvas provides an infinite 2D space for organizing notes, media, and web content with visual connections.

## Data Format

Canvas files (`.canvas`) use the open JSON Canvas format:

```typescript
interface CanvasFile {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}
```

### Node Types

```typescript
// Text node
interface TextNode {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // '1'-'6' for presets
}

// File node
interface FileNode {
  id: string;
  type: 'file';
  file: string; // File path
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

// Web node
interface WebNode {
  id: string;
  type: 'web';
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}
```

### Edge Structure

```typescript
interface CanvasEdge {
  id: string;
  fromNode: string;
  fromSide: 'left' | 'right' | 'top' | 'bottom';
  toNode: string;
  toSide: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  label?: string;
}
```

## Accessing Canvas Views

```typescript
import { ItemView } from 'obsidian';

function getActiveCanvas(app: App): CanvasView | null {
  const leaf = app.workspace.getActiveViewOfType(ItemView);
  if (leaf?.getViewType() === 'canvas') {
    return leaf as CanvasView;
  }
  return null;
}
```

## Reading Canvas Data

```typescript
const canvas = getActiveCanvas(this.app);
if (canvas) {
  const data = JSON.parse(canvas.getViewData());

  // Iterate nodes
  data.nodes.forEach((node: CanvasNode) => {
    console.log(`Node ${node.id}: ${node.type} at (${node.x}, ${node.y})`);
  });

  // Iterate edges
  data.edges.forEach((edge: CanvasEdge) => {
    console.log(`Edge: ${edge.fromNode} -> ${edge.toNode}`);
  });
}
```

## Modifying Canvas Data

### Adding Nodes

```typescript
function addTextNode(
  canvas: CanvasView,
  text: string,
  x: number,
  y: number
): TextNode {
  const data = JSON.parse(canvas.getViewData());

  const newNode: TextNode = {
    id: generateId(),
    type: 'text',
    text: text,
    x: x,
    y: y,
    width: 250,
    height: 100
  };

  data.nodes.push(newNode);
  canvas.setViewData(JSON.stringify(data));

  return newNode;
}

function addFileNode(
  canvas: CanvasView,
  filePath: string,
  x: number,
  y: number
): FileNode {
  const data = JSON.parse(canvas.getViewData());

  const newNode: FileNode = {
    id: generateId(),
    type: 'file',
    file: filePath,
    x: x,
    y: y,
    width: 400,
    height: 300
  };

  data.nodes.push(newNode);
  canvas.setViewData(JSON.stringify(data));

  return newNode;
}
```

### Connecting Nodes

```typescript
function connectNodes(
  canvas: CanvasView,
  fromId: string,
  toId: string,
  label?: string
): CanvasEdge {
  const data = JSON.parse(canvas.getViewData());

  const newEdge: CanvasEdge = {
    id: generateId(),
    fromNode: fromId,
    fromSide: 'right',
    toNode: toId,
    toSide: 'left',
    label: label
  };

  data.edges.push(newEdge);
  canvas.setViewData(JSON.stringify(data));

  return newEdge;
}
```

### Updating Nodes

```typescript
function updateNodePosition(
  canvas: CanvasView,
  nodeId: string,
  x: number,
  y: number
): void {
  const data = JSON.parse(canvas.getViewData());

  const node = data.nodes.find((n: CanvasNode) => n.id === nodeId);
  if (node) {
    node.x = x;
    node.y = y;
    canvas.setViewData(JSON.stringify(data));
  }
}

function updateNodeColor(
  canvas: CanvasView,
  nodeId: string,
  color: string
): void {
  const data = JSON.parse(canvas.getViewData());

  const node = data.nodes.find((n: CanvasNode) => n.id === nodeId);
  if (node) {
    node.color = color;
    canvas.setViewData(JSON.stringify(data));
  }
}
```

### Removing Elements

```typescript
function removeNode(canvas: CanvasView, nodeId: string): void {
  const data = JSON.parse(canvas.getViewData());

  // Remove node
  data.nodes = data.nodes.filter((n: CanvasNode) => n.id !== nodeId);

  // Remove connected edges
  data.edges = data.edges.filter(
    (e: CanvasEdge) => e.fromNode !== nodeId && e.toNode !== nodeId
  );

  canvas.setViewData(JSON.stringify(data));
}
```

## Creating a Canvas File

```typescript
async function createCanvas(
  app: App,
  name: string,
  nodes: CanvasNode[],
  edges: CanvasEdge[]
): Promise<TFile> {
  const data = JSON.stringify({ nodes, edges });
  const file = await app.vault.create(`${name}.canvas`, data);

  // Open the canvas
  const leaf = app.workspace.getLeaf();
  await leaf.openFile(file);

  return file;
}
```

## Event Handling

### Workspace Events

```typescript
this.registerEvent(
  this.app.workspace.on('active-leaf-change', (leaf) => {
    if (leaf?.view.getViewType() === 'canvas') {
      this.onCanvasOpened(leaf.view as CanvasView);
    }
  })
);
```

### DOM Events

```typescript
function setupCanvasInteraction(canvas: CanvasView): void {
  const canvasEl = canvas.containerEl.querySelector('.canvas-wrapper');

  canvasEl?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest('.canvas-node');

    if (nodeEl) {
      const nodeId = nodeEl.dataset.nodeId;
      console.log('Clicked node:', nodeId);
    }
  });
}
```

## Practical Examples

### Auto-Layout Plugin

```typescript
class AutoLayoutPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'auto-layout',
      name: 'Auto-layout Canvas',
      checkCallback: (checking) => {
        const canvas = getActiveCanvas(this.app);
        if (!canvas) return false;
        if (!checking) this.autoLayout(canvas);
        return true;
      }
    });
  }

  autoLayout(canvas: CanvasView): void {
    const data = JSON.parse(canvas.getViewData());
    const levels = this.calculateLevels(data.nodes, data.edges);

    // Position nodes by level
    const spacing = { x: 300, y: 150 };
    const levelCounts: Record<number, number> = {};

    data.nodes.forEach((node: CanvasNode) => {
      const level = levels[node.id] || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;

      node.x = level * spacing.x + 50;
      node.y = levelCounts[level] * spacing.y + 50;
    });

    canvas.setViewData(JSON.stringify(data));
  }

  calculateLevels(
    nodes: CanvasNode[],
    edges: CanvasEdge[]
  ): Record<string, number> {
    const levels: Record<string, number> = {};

    // Find root nodes (no incoming edges)
    const roots = nodes.filter(
      n => !edges.some(e => e.toNode === n.id)
    );

    // BFS to assign levels
    const queue = roots.map(n => ({ id: n.id, level: 0 }));
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (visited.has(id)) continue;

      visited.add(id);
      levels[id] = level;

      edges
        .filter(e => e.fromNode === id)
        .forEach(e => queue.push({ id: e.toNode, level: level + 1 }));
    }

    return levels;
  }
}
```

### Dashboard Creator

```typescript
async function createDashboard(app: App): Promise<void> {
  const nodes: CanvasNode[] = [
    {
      id: 'title',
      type: 'text',
      text: '# My Dashboard',
      x: 400,
      y: 50,
      width: 300,
      height: 80,
      color: '1'
    },
    {
      id: 'tasks',
      type: 'text',
      text: '## Tasks\n- [ ] Task 1\n- [ ] Task 2',
      x: 100,
      y: 200,
      width: 250,
      height: 200,
      color: '2'
    },
    {
      id: 'notes',
      type: 'text',
      text: '## Quick Notes\nAdd notes here...',
      x: 400,
      y: 200,
      width: 250,
      height: 200,
      color: '3'
    },
    {
      id: 'links',
      type: 'text',
      text: '## Important Links\n- [[Project A]]\n- [[Project B]]',
      x: 700,
      y: 200,
      width: 250,
      height: 200,
      color: '4'
    }
  ];

  const edges: CanvasEdge[] = [
    {
      id: 'e1',
      fromNode: 'title',
      fromSide: 'bottom',
      toNode: 'tasks',
      toSide: 'top'
    },
    {
      id: 'e2',
      fromNode: 'title',
      fromSide: 'bottom',
      toNode: 'notes',
      toSide: 'top'
    },
    {
      id: 'e3',
      fromNode: 'title',
      fromSide: 'bottom',
      toNode: 'links',
      toSide: 'top'
    }
  ];

  await createCanvas(app, 'Dashboard', nodes, edges);
}
```

## Canvas CSS Variables

```css
/* Canvas background */
.canvas-wrapper {
  --canvas-background: #1e1e1e;
  --canvas-dot-pattern: #333333;
}

/* Node colors (1-6) */
.canvas-node.color-1 { background: var(--canvas-color-1); }
.canvas-node.color-2 { background: var(--canvas-color-2); }
.canvas-node.color-3 { background: var(--canvas-color-3); }
.canvas-node.color-4 { background: var(--canvas-color-4); }
.canvas-node.color-5 { background: var(--canvas-color-5); }
.canvas-node.color-6 { background: var(--canvas-color-6); }

/* Custom node styling */
.canvas-node {
  --canvas-card-label-color: #ffffff;
}
```

## Utility Functions

```typescript
function generateId(): string {
  return Math.random().toString(36).substr(2, 16);
}

function batchUpdate(
  canvas: CanvasView,
  updates: ((data: CanvasFile) => void)[]
): void {
  const data = JSON.parse(canvas.getViewData());
  updates.forEach(update => update(data));
  canvas.setViewData(JSON.stringify(data));
}

function validateCanvasData(data: any): boolean {
  return (
    data &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges) &&
    data.nodes.every((n: any) => n.id && n.type && n.x !== undefined)
  );
}
```

## Error Handling

```typescript
async function safeCanvasOperation(
  canvas: CanvasView,
  operation: (data: CanvasFile) => void
): Promise<boolean> {
  try {
    const data = JSON.parse(canvas.getViewData());
    operation(data);

    if (!validateCanvasData(data)) {
      new Notice('Invalid canvas data');
      return false;
    }

    canvas.setViewData(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Canvas operation failed:', error);
    new Notice('Failed to update canvas');
    return false;
  }
}
```

## Related

- [Plugin Development](./plugin-development.md) - Plugin basics
- [Bases API](./bases-api.md) - Database views
