# Canvas API

Obsidian Canvas provides an infinite 2D space for organizing notes, media, and web content with visual connections. Canvas files use the **JSON Canvas** open format (`.canvas`).

> **What is official vs. not:**
> - The **`.canvas` file format is officially specified** by the [JSON Canvas 1.0 spec](https://jsoncanvas.org/spec/1.0/), and the data types ship in Obsidian's [`canvas.d.ts`](https://github.com/obsidianmd/obsidian-api/blob/master/canvas.d.ts).
> - The **runtime Canvas view object** (`view.canvas`, `addNode`, `requestSave`, etc.) is **undocumented internal API**. Obsidian exposes no public Canvas runtime API. Internal usage is version-fragile and may break without notice. Sections below are marked **(INTERNAL — unstable)** where they rely on it.

## Data Format

The top-level structure contains two arrays. Per the spec both are *optional*; Obsidian's `CanvasData` type declares them as present (use `?? []` defensively when reading).

```typescript
// From obsidian-api/canvas.d.ts
interface CanvasData {
  nodes: AllCanvasNodeData[];
  edges: CanvasEdgeData[];
  // additional keys allowed for forward compatibility
}

type AllCanvasNodeData =
  | CanvasFileData
  | CanvasTextData
  | CanvasLinkData
  | CanvasGroupData;
```

### Node Types

Every node shares a base. `x`, `y`, `width`, `height` are integers; `color` is optional.

```typescript
interface CanvasNodeData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: CanvasColor; // '1'-'6' preset, or hex '#FF0000'
}

// Text node — Markdown content
interface CanvasTextData extends CanvasNodeData {
  type: 'text';
  text: string;
}

// File node — embeds a vault file
interface CanvasFileData extends CanvasNodeData {
  type: 'file';
  file: string;     // vault-relative path
  subpath?: string; // links to a heading/block; starts with '#'
}

// Link node — embeds an external URL (NOT type 'web')
interface CanvasLinkData extends CanvasNodeData {
  type: 'link';
  url: string;
}

// Group node — visual container for other nodes
interface CanvasGroupData extends CanvasNodeData {
  type: 'group';
  label?: string;
  background?: string;            // vault image path
  backgroundStyle?: BackgroundStyle;
}

type BackgroundStyle = 'cover' | 'ratio' | 'repeat';
```

### Edge Structure

Only `id`, `fromNode`, and `toNode` are required. Sides and ends are optional; when omitted Obsidian auto-routes. `fromEnd` defaults to `'none'`, `toEnd` defaults to `'arrow'`.

```typescript
interface CanvasEdgeData {
  id: string;
  fromNode: string;
  toNode: string;
  fromSide?: NodeSide;
  toSide?: NodeSide;
  fromEnd?: EdgeEnd; // default 'none'
  toEnd?: EdgeEnd;   // default 'arrow'
  color?: CanvasColor;
  label?: string;
}

type NodeSide = 'top' | 'right' | 'bottom' | 'left';
type EdgeEnd = 'none' | 'arrow';
```

### Color Values

`CanvasColor` is a `string`. Use either a preset index or a hex string:

| Preset | Color  |
|--------|--------|
| `'1'`  | red    |
| `'2'`  | orange |
| `'3'`  | yellow |
| `'4'`  | green  |
| `'5'`  | cyan   |
| `'6'`  | purple |

Hex example: `color: '#FF0000'`.

## Accessing a Canvas View

Obsidian does **not** export a `CanvasView` type. The canvas view extends the documented `TextFileView`, so you can rely on its `getViewData()` / `setViewData()` methods for reading and writing the JSON. Anything beyond that (the `.canvas` runtime object) is internal.

```typescript
import { App, TextFileView } from 'obsidian';

// Returns the active leaf's view if it is a canvas, else null.
function getActiveCanvasView(app: App): TextFileView | null {
  const view = app.workspace.getActiveViewOfType(TextFileView);
  return view?.getViewType() === 'canvas' ? view : null;
}
```

## Reading Canvas Data

`getViewData()` returns the serialized JSON of the open canvas (documented `TextFileView` method).

```typescript
const view = getActiveCanvasView(app);
if (view) {
  const data = JSON.parse(view.getViewData()) as CanvasData;
  const nodes = data.nodes ?? [];
  const edges = data.edges ?? [];

  for (const node of nodes) {
    console.log(`Node ${node.id}: ${node.type} at (${node.x}, ${node.y})`);
  }
  for (const edge of edges) {
    console.log(`Edge: ${edge.fromNode} -> ${edge.toNode}`);
  }
}
```

Alternatively, read a `.canvas` file directly without opening it — fully officially supported:

```typescript
const file = app.vault.getFileByPath('My Canvas.canvas');
if (file) {
  const data = JSON.parse(await app.vault.read(file)) as CanvasData;
}
```

## Modifying Canvas Data

There are two approaches:

1. **JSON round-trip via `setViewData()`** (uses documented `TextFileView` methods). Works, but rebuilds the view and discards transient state like selection/viewport. Best for batch/structural edits.
2. **Internal `view.canvas` object** (INTERNAL — unstable). Lets you mutate live nodes without a full reload, but relies on undocumented methods.

The examples below use approach (1) unless noted.

### Adding Nodes

```typescript
function addTextNode(
  view: TextFileView,
  text: string,
  x: number,
  y: number
): CanvasTextData {
  const data = JSON.parse(view.getViewData()) as CanvasData;

  const node: CanvasTextData = {
    id: generateId(),
    type: 'text',
    text,
    x, y,
    width: 250,
    height: 100
  };

  (data.nodes ??= []).push(node);
  view.setViewData(JSON.stringify(data), false);
  return node;
}

function addFileNode(
  view: TextFileView,
  filePath: string,
  x: number,
  y: number
): CanvasFileData {
  const data = JSON.parse(view.getViewData()) as CanvasData;

  const node: CanvasFileData = {
    id: generateId(),
    type: 'file',
    file: filePath,
    x, y,
    width: 400,
    height: 300
  };

  (data.nodes ??= []).push(node);
  view.setViewData(JSON.stringify(data), false);
  return node;
}
```

### Connecting Nodes

```typescript
function connectNodes(
  view: TextFileView,
  fromId: string,
  toId: string,
  label?: string
): CanvasEdgeData {
  const data = JSON.parse(view.getViewData()) as CanvasData;

  const edge: CanvasEdgeData = {
    id: generateId(),
    fromNode: fromId,
    fromSide: 'right',
    toNode: toId,
    toSide: 'left',
    label
  };

  (data.edges ??= []).push(edge);
  view.setViewData(JSON.stringify(data), false);
  return edge;
}
```

### Updating Nodes

```typescript
function updateNodePosition(
  view: TextFileView,
  nodeId: string,
  x: number,
  y: number
): void {
  const data = JSON.parse(view.getViewData()) as CanvasData;
  const node = data.nodes?.find(n => n.id === nodeId);
  if (node) {
    node.x = x;
    node.y = y;
    view.setViewData(JSON.stringify(data), false);
  }
}

function updateNodeColor(
  view: TextFileView,
  nodeId: string,
  color: CanvasColor
): void {
  const data = JSON.parse(view.getViewData()) as CanvasData;
  const node = data.nodes?.find(n => n.id === nodeId);
  if (node) {
    node.color = color;
    view.setViewData(JSON.stringify(data), false);
  }
}
```

### Removing Elements

```typescript
function removeNode(view: TextFileView, nodeId: string): void {
  const data = JSON.parse(view.getViewData()) as CanvasData;

  data.nodes = (data.nodes ?? []).filter(n => n.id !== nodeId);
  data.edges = (data.edges ?? []).filter(
    e => e.fromNode !== nodeId && e.toNode !== nodeId
  );

  view.setViewData(JSON.stringify(data), false);
}
```

### Live Mutation via the Internal Canvas Object (INTERNAL — unstable)

Many community plugins (Advanced Canvas, Enhanced Canvas, etc.) avoid the full `setViewData` reload by reaching the undocumented runtime object. **None of this is in Obsidian's public type definitions** — you must augment types yourself (or use the community `obsidian-typings` package), and it can break across Obsidian releases.

```typescript
// INTERNAL: shape is reverse-engineered, not guaranteed by Obsidian.
const canvas = (view as any).canvas;
// canvas.nodes / canvas.edges        — live Map of node/edge objects
// canvas.createTextNode({...})        — add a node in place
// node.setData({...})                 — mutate a live node, persists on re-render
// canvas.requestSave()                — flush changes to disk
```

Prefer the `setViewData` JSON approach unless you specifically need to preserve live view state, and feature-detect before calling internal methods.

## Creating a Canvas File

Writing a `.canvas` file via the vault API is fully official.

```typescript
async function createCanvas(
  app: App,
  name: string,
  nodes: AllCanvasNodeData[],
  edges: CanvasEdgeData[]
): Promise<TFile> {
  const data = JSON.stringify({ nodes, edges } satisfies CanvasData);
  const file = await app.vault.create(`${name}.canvas`, data);

  const leaf = app.workspace.getLeaf();
  await leaf.openFile(file);
  return file;
}
```

## Event Handling

### Workspace Events

`active-leaf-change` is a documented workspace event. The view type string `'canvas'` is stable in practice but not formally specified.

```typescript
this.registerEvent(
  this.app.workspace.on('active-leaf-change', (leaf) => {
    if (leaf?.view.getViewType() === 'canvas') {
      this.onCanvasOpened(leaf.view as TextFileView);
    }
  })
);
```

`file-open` fires when focusing a Canvas file card, which lets you respond to navigation within a canvas.

### DOM Events (INTERNAL — relies on internal CSS classes)

The DOM structure (`.canvas-wrapper`, `.canvas-node`, the `data-node-id`-style attributes) is internal and may change. Treat as best-effort.

```typescript
function setupCanvasInteraction(view: TextFileView): void {
  const wrapper = view.containerEl.querySelector('.canvas-wrapper');
  wrapper?.addEventListener('click', (e) => {
    const nodeEl = (e.target as HTMLElement).closest('.canvas-node');
    if (nodeEl) console.log('Clicked node:', (nodeEl as HTMLElement).dataset.id);
  });
}
```

## Practical Examples

### Auto-Layout Command

```typescript
class AutoLayoutPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'auto-layout',
      name: 'Auto-layout Canvas',
      checkCallback: (checking) => {
        const view = getActiveCanvasView(this.app);
        if (!view) return false;
        if (!checking) this.autoLayout(view);
        return true;
      }
    });
  }

  autoLayout(view: TextFileView): void {
    const data = JSON.parse(view.getViewData()) as CanvasData;
    const nodes = data.nodes ?? [];
    const edges = data.edges ?? [];
    const levels = this.calculateLevels(nodes, edges);

    const spacing = { x: 300, y: 150 };
    const levelCounts: Record<number, number> = {};

    for (const node of nodes) {
      const level = levels[node.id] ?? 0;
      levelCounts[level] = (levelCounts[level] ?? 0) + 1;
      node.x = level * spacing.x + 50;
      node.y = levelCounts[level] * spacing.y + 50;
    }

    view.setViewData(JSON.stringify(data), false);
  }

  calculateLevels(
    nodes: AllCanvasNodeData[],
    edges: CanvasEdgeData[]
  ): Record<string, number> {
    const levels: Record<string, number> = {};
    const roots = nodes.filter(n => !edges.some(e => e.toNode === n.id));
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
  const nodes: AllCanvasNodeData[] = [
    { id: 'title', type: 'text', text: '# My Dashboard',
      x: 400, y: 50,  width: 300, height: 80,  color: '1' },
    { id: 'tasks', type: 'text', text: '## Tasks\n- [ ] Task 1\n- [ ] Task 2',
      x: 100, y: 200, width: 250, height: 200, color: '2' },
    { id: 'notes', type: 'text', text: '## Quick Notes\nAdd notes here...',
      x: 400, y: 200, width: 250, height: 200, color: '3' },
    { id: 'links', type: 'text', text: '## Important Links\n- [[Project A]]\n- [[Project B]]',
      x: 700, y: 200, width: 250, height: 200, color: '4' }
  ];

  const edges: CanvasEdgeData[] = [
    { id: 'e1', fromNode: 'title', fromSide: 'bottom', toNode: 'tasks', toSide: 'top' },
    { id: 'e2', fromNode: 'title', fromSide: 'bottom', toNode: 'notes', toSide: 'top' },
    { id: 'e3', fromNode: 'title', fromSide: 'bottom', toNode: 'links', toSide: 'top' }
  ];

  await createCanvas(app, 'Dashboard', nodes, edges);
}
```

## Canvas CSS Variables (INTERNAL — class names not guaranteed)

These class names and variables are part of Obsidian's internal styling and can change between versions.

```css
.canvas-wrapper {
  --canvas-background: #1e1e1e;
  --canvas-dot-pattern: #333333;
}

.canvas-node.color-1 { background: var(--canvas-color-1); }
.canvas-node.color-2 { background: var(--canvas-color-2); }
/* ...color-3 through color-6... */
```

## Utility Functions

```typescript
function generateId(): string {
  // 16-char id similar to Obsidian's own node ids
  return Math.random().toString(36).slice(2, 18);
}

function batchUpdate(
  view: TextFileView,
  updates: ((data: CanvasData) => void)[]
): void {
  const data = JSON.parse(view.getViewData()) as CanvasData;
  updates.forEach(update => update(data));
  view.setViewData(JSON.stringify(data), false);
}

function validateCanvasData(data: any): data is CanvasData {
  return (
    !!data &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges) &&
    data.nodes.every((n: any) => n.id && n.type && n.x !== undefined)
  );
}
```

## Error Handling

```typescript
import { Notice } from 'obsidian';

function safeCanvasOperation(
  view: TextFileView,
  operation: (data: CanvasData) => void
): boolean {
  try {
    const data = JSON.parse(view.getViewData());
    operation(data);

    if (!validateCanvasData(data)) {
      new Notice('Invalid canvas data');
      return false;
    }

    view.setViewData(JSON.stringify(data), false);
    return true;
  } catch (error) {
    console.error('Canvas operation failed:', error);
    new Notice('Failed to update canvas');
    return false;
  }
}
```

## Related

- [JSON Canvas 1.0 spec](https://jsoncanvas.org/spec/1.0/) - Official `.canvas` file format
- [obsidian-api `canvas.d.ts`](https://github.com/obsidianmd/obsidian-api/blob/master/canvas.d.ts) - Official data types
- [Plugin Development](./plugin-development.md) - Plugin basics
- [Bases API](./bases-api.md) - Database views
