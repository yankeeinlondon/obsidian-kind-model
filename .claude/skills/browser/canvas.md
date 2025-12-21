# Canvas API

The Canvas API provides scriptable 2D and 3D graphics rendering directly in the browser.

## The Canvas Element

The `<canvas>` element is a transparent container. All rendering happens via JavaScript through a **Rendering Context**.

```javascript
const canvas = document.getElementById('myCanvas');

// 2D graphics
const ctx = canvas.getContext('2d');

// 3D graphics (hardware accelerated)
const gl = canvas.getContext('webgl');
```

## 2D Context vs. WebGL

| Feature | 2D Context | WebGL |
|---------|------------|-------|
| **Primary Use** | Charts, 2D games, photo editing | 3D environments, VR, simulations |
| **Engine** | CPU-bound (software) | GPU-bound (hardware accelerated) |
| **Complexity** | High-level (easy) | Low-level (hard: shaders, GLSL) |
| **Performance** | Great for ~1,000 objects | Great for ~1,000,000+ objects |

## 2D Rendering Context

### Coordinate System

- Origin `(0, 0)` is **top-left corner**
- X-axis increases right
- Y-axis increases downward

### Basic Drawing

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50); // x, y, width, height

// Stroke (outline)
ctx.strokeStyle = 'red';
ctx.lineWidth = 3;
ctx.strokeRect(10, 70, 100, 50);

// Clear area
ctx.clearRect(20, 20, 80, 30);
```

### Path-Based Drawing

```javascript
// Start path
ctx.beginPath();

// Circle
ctx.arc(100, 100, 50, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle

// Fill
ctx.fillStyle = 'green';
ctx.fill();

// Stroke
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.stroke();
```

### Lines and Curves

```javascript
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(150, 50); // Straight line
ctx.quadraticCurveTo(200, 100, 150, 150); // Quadratic curve
ctx.bezierCurveTo(100, 200, 50, 200, 50, 150); // Bezier curve
ctx.closePath(); // Connect back to start
ctx.stroke();
```

### Text

```javascript
ctx.font = '24px Arial';
ctx.fillStyle = 'black';
ctx.fillText('Hello Canvas', 50, 50);

// With stroke
ctx.strokeStyle = 'blue';
ctx.strokeText('Outlined Text', 50, 100);

// Measure text
const metrics = ctx.measureText('Hello');
console.log(metrics.width);
```

### Transformations

```javascript
// Save state before transform
ctx.save();

// Translate (move origin)
ctx.translate(100, 100);

// Rotate (radians)
ctx.rotate(Math.PI / 4); // 45 degrees

// Scale
ctx.scale(2, 2);

// Draw at new coordinate system
ctx.fillRect(0, 0, 50, 50);

// Restore original state
ctx.restore();
```

### Pixel Manipulation

```javascript
// Get pixel data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // Uint8ClampedArray [r, g, b, a, r, g, b, a, ...]

// Modify pixels (grayscale filter)
for (let i = 0; i < data.length; i += 4) {
  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  data[i] = avg;     // Red
  data[i + 1] = avg; // Green
  data[i + 2] = avg; // Blue
  // data[i + 3] is alpha (unchanged)
}

// Put modified data back
ctx.putImageData(imageData, 0, 0);
```

### Images

```javascript
const img = new Image();
img.onload = () => {
  // Draw entire image
  ctx.drawImage(img, 0, 0);

  // Draw scaled
  ctx.drawImage(img, 0, 0, 200, 100);

  // Draw portion (sprite sheet)
  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  ctx.drawImage(img, 32, 0, 32, 32, 50, 50, 64, 64);
};
img.src = 'image.png';
```

## Animation Loop Pattern

### The Clear-Update-Draw Cycle

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
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

// Setup
const particles = Array.from({ length: 50 }, () => new Particle());

// Animation loop
function animate(timestamp) {
  // CLEAR canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // UPDATE & DRAW
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Request next frame
  requestAnimationFrame(animate);
}

// Start animation
animate();
```

### Delta Time (Frame-Independent Animation)

```javascript
let lastTime = 0;

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Use deltaTime for frame-independent movement
  particles.forEach(p => {
    p.x += p.vx * deltaTime * 0.001; // Scale to seconds
    p.y += p.vy * deltaTime * 0.001;
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.draw());

  requestAnimationFrame(animate);
}

animate(0);
```

## WebGL (3D Context)

WebGL is low-level. Most developers use libraries like **Three.js** or **Babylon.js**.

### WebGL Pipeline

1. **Vertex Shader**: Calculates 3D point positions
2. **Fragment Shader**: Calculates pixel colors
3. **Rasterization**: Converts shapes to pixels

### Raw WebGL Example (Triangle)

```javascript
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// Vertex shader (GLSL)
const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Fragment shader (GLSL)
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red
  }
`;

// Compile shaders (helper functions omitted for brevity)
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Triangle vertices
const vertices = new Float32Array([
  0.0,  0.5,  // Top
 -0.5, -0.5,  // Bottom left
  0.5, -0.5   // Bottom right
]);

// Create buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Link buffer to shader attribute
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Clear and draw
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

### Three.js (High-Level 3D)

```javascript
import * as THREE from 'three';

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
```

## Performance Techniques

### OffscreenCanvas (Web Worker)

Move heavy rendering off main thread.

```javascript
// main.js
const canvas = document.getElementById('canvas');
const offscreen = canvas.transferControlToOffscreen();

const worker = new Worker('render-worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

```javascript
// render-worker.js
self.addEventListener('message', (event) => {
  const canvas = event.data.canvas;
  const ctx = canvas.getContext('2d');

  function render() {
    // Heavy rendering here
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... draw complex graphics

    requestAnimationFrame(render);
  }

  render();
});
```

### Layer Multiple Canvases

Instead of one canvas, stack multiple with CSS z-index.

```html
<div class="canvas-container">
  <canvas id="background"></canvas> <!-- Static, drawn once -->
  <canvas id="characters"></canvas> <!-- Redrawn every frame -->
  <canvas id="ui"></canvas>         <!-- Drawn only on updates -->
</div>
```

```css
.canvas-container {
  position: relative;
}

.canvas-container canvas {
  position: absolute;
  top: 0;
  left: 0;
}
```

### requestAnimationFrame

Never use `setInterval` for animation.

```javascript
// BAD
setInterval(() => {
  render();
}, 16); // ~60fps

// GOOD
function render() {
  // ... rendering code
  requestAnimationFrame(render);
}
render();
```

**Benefits**:
- Syncs with monitor refresh rate
- Pauses when tab is inactive
- Better performance

## Canvas vs. SVG

| Feature | Canvas | SVG |
|---------|--------|-----|
| **Type** | Raster (pixel-based) | Vector (math-based) |
| **Performance** | Great for thousands of objects | Struggles with >100 objects |
| **Scalability** | Pixelated when zoomed | Crisp at any zoom level |
| **DOM** | No DOM (just pixels) | Each element in DOM |
| **Accessibility** | Limited | Full (screen reader support) |
| **Use Cases** | Games, charts, photo editing | Logos, maps, simple graphics |

## Common Patterns

### Motion Trails Effect

```javascript
// Replace clearRect with semi-transparent fill
function render() {
  // Instead of: ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw particles (creates trailing effect)
  particles.forEach(p => p.draw());

  requestAnimationFrame(render);
}
```

### Responsive Canvas

```javascript
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

### Mouse Interaction

```javascript
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Make particles flee from mouse
  particles.forEach(p => {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      p.x += (dx / dist) * 2;
      p.y += (dy / dist) * 2;
    }
  });

  requestAnimationFrame(render);
}
```

## Related

- [Web Animations API](./web-animations.md)
- [OffscreenCanvas](./offscreen-canvas.md)
- [WebGL Fundamentals](./webgl.md)
