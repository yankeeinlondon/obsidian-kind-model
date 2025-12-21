# Chart.js with Vue 3

[Chart.js](https://www.chartjs.org/) is a flexible JavaScript charting library. For Vue 3 integration, [vue-chartjs](https://vue-chartjs.org/) provides reactive Vue components that wrap Chart.js charts.

## Installation

```bash
pnpm add vue-chartjs chart.js
```

> **Important**: `chart.js` is a peer dependency - you must install both packages.

---

## Quick Start

```vue
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// Register required components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: '#42A5F5',
      data: [40, 20, 12, 39]
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
```

---

## Available Chart Components

vue-chartjs exports a component for each Chart.js chart type:

| Component | Chart Type | Required Elements |
|-----------|------------|-------------------|
| `Bar` | Bar chart | `BarElement`, `CategoryScale`, `LinearScale` |
| `Line` | Line chart | `LineElement`, `PointElement`, `CategoryScale`, `LinearScale` |
| `Pie` | Pie chart | `ArcElement` |
| `Doughnut` | Doughnut chart | `ArcElement` |
| `Radar` | Radar chart | `RadarController`, `RadialLinearScale`, `PointElement`, `LineElement` |
| `PolarArea` | Polar area chart | `ArcElement`, `RadialLinearScale` |
| `Bubble` | Bubble chart | `PointElement`, `LinearScale` |
| `Scatter` | Scatter chart | `PointElement`, `LinearScale` |

---

## Tree Shaking & Component Registration

Chart.js 4 is tree-shakeable. You must register only the components you use:

### Minimal Registration (Recommended)

```typescript
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
```

### Full Registration (No Tree Shaking)

```typescript
import { Chart as ChartJS, registerables } from 'chart.js'

ChartJS.register(...registerables)
```

> **Warning**: Importing from `chart.js/auto` disables tree shaking entirely. Avoid this in production.

### Component Reference

| Category | Components |
|----------|------------|
| **Controllers** | `BarController`, `LineController`, `PieController`, `DoughnutController`, `RadarController`, `PolarAreaController`, `BubbleController`, `ScatterController` |
| **Elements** | `ArcElement`, `LineElement`, `BarElement`, `PointElement` |
| **Scales** | `CategoryScale`, `LinearScale`, `LogarithmicScale`, `RadialLinearScale`, `TimeScale`, `TimeSeriesScale` |
| **Plugins** | `Title`, `Tooltip`, `Legend`, `Filler`, `Decimation` |

---

## TypeScript Support

### Typed Props and Data

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Typed chart data
const chartData = ref<ChartData<'line'>>({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Revenue',
      data: [65, 59, 80, 81, 56],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
})

// Typed chart options
const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Monthly Revenue'
    }
  }
})
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
```

### Generic Chart Types

Chart.js provides generic types for each chart type:

```typescript
import type { ChartData, ChartOptions } from 'chart.js'

// For bar charts
const barData: ChartData<'bar'> = { ... }
const barOptions: ChartOptions<'bar'> = { ... }

// For line charts
const lineData: ChartData<'line'> = { ... }
const lineOptions: ChartOptions<'line'> = { ... }

// For pie/doughnut charts
const pieData: ChartData<'pie'> = { ... }
const pieOptions: ChartOptions<'pie'> = { ... }
```

---

## Reactivity

### Automatic Updates

Since vue-chartjs v4, charts automatically update when `data` or `options` change:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'

const chartData = ref({
  labels: ['A', 'B', 'C'],
  datasets: [{ label: 'Values', data: [10, 20, 30] }]
})

// Chart automatically updates when data changes
function updateData() {
  chartData.value = {
    labels: ['A', 'B', 'C'],
    datasets: [{ label: 'Values', data: [Math.random() * 100, Math.random() * 100, Math.random() * 100] }]
  }
}
</script>

<template>
  <Bar :data="chartData" />
  <button @click="updateData">Update</button>
</template>
```

### Handling Readonly Reactive Data

If you get "Target is readonly" warnings, clone the data:

```typescript
import { computed } from 'vue'

// If props.data is readonly
const chartData = computed(() =>
  JSON.parse(JSON.stringify(props.data))
)
```

### Computed Data

For data derived from other reactive sources:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData } from 'chart.js'

interface Props {
  metrics: number[]
  labels: string[]
}

const props = defineProps<Props>()

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Metrics',
      data: props.metrics,
      borderColor: '#42A5F5'
    }
  ]
}))
</script>

<template>
  <Line :data="chartData" />
</template>
```

---

## Accessing the Chart Instance

Use template refs to access the underlying Chart.js instance:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import type { Chart } from 'chart.js'

const chartRef = ref<{ chart: Chart } | null>(null)

onMounted(() => {
  if (chartRef.value?.chart) {
    // Access the Chart.js instance
    console.log(chartRef.value.chart)

    // Call Chart.js methods
    chartRef.value.chart.resize()
  }
})

function downloadChart() {
  if (chartRef.value?.chart) {
    const url = chartRef.value.chart.toBase64Image()
    // Download logic...
  }
}
</script>

<template>
  <Bar ref="chartRef" :data="chartData" />
  <button @click="downloadChart">Download</button>
</template>
```

---

## Plugins

### Using Built-in Plugins

```typescript
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler  // For area charts
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, Filler)

const options = {
  plugins: {
    title: {
      display: true,
      text: 'My Chart'
    },
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  }
}
```

### Custom Plugins

```typescript
import type { Plugin } from 'chart.js'

const customPlugin: Plugin = {
  id: 'customBackground',
  beforeDraw: (chart) => {
    const ctx = chart.ctx
    ctx.save()
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, chart.width, chart.height)
    ctx.restore()
  }
}

// Register globally
ChartJS.register(customPlugin)

// Or per-chart via options
const options = {
  plugins: {
    customBackground: {
      // Plugin options
    }
  }
}
```

### Popular Plugins

| Plugin | Purpose | Package |
|--------|---------|---------|
| chartjs-plugin-datalabels | Display values on charts | `chartjs-plugin-datalabels` |
| chartjs-plugin-zoom | Pan and zoom | `chartjs-plugin-zoom` |
| chartjs-plugin-annotation | Draw lines, boxes, labels | `chartjs-plugin-annotation` |

```typescript
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ChartDataLabels)
```

---

## Common Patterns

### Responsive Container

```vue
<template>
  <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
    <Bar :data="chartData" :options="{ responsive: true, maintainAspectRatio: false }" />
  </div>
</template>
```

### Loading State

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'

const chartData = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  const response = await fetch('/api/metrics')
  const data = await response.json()

  chartData.value = {
    labels: data.labels,
    datasets: [{ label: 'Data', data: data.values }]
  }

  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">Loading chart...</div>
  <Line v-else :data="chartData" />
</template>
```

### Multiple Datasets

```typescript
const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: '2023',
      data: [65, 59, 80, 81],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: '2024',
      data: [28, 48, 40, 19],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
})
```

### Custom Tooltips

```typescript
const options: ChartOptions<'line'> = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          return `Revenue: $${value.toLocaleString()}`
        },
        title: (tooltipItems) => {
          return `Month: ${tooltipItems[0].label}`
        }
      }
    }
  }
}
```

### Axis Formatting

```typescript
const options: ChartOptions<'bar'> = {
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${value}k`
      },
      title: {
        display: true,
        text: 'Revenue (thousands)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Quarter'
      }
    }
  }
}
```

---

## Accessibility

Add accessibility attributes:

```vue
<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
    aria-label="Sales data bar chart"
    role="img"
  >
    <!-- Fallback for screen readers -->
    <p>Bar chart showing quarterly sales: Q1: $40k, Q2: $20k, Q3: $12k, Q4: $39k</p>
  </Bar>
</template>
```

---

## Composable Pattern

Create a reusable chart composable:

```typescript
// composables/useChart.ts
import { ref, computed, type Ref } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'

interface UseChartOptions<T extends 'line' | 'bar' | 'pie'> {
  type: T
  labels: Ref<string[]>
  datasets: Ref<ChartData<T>['datasets']>
  title?: string
}

export function useChart<T extends 'line' | 'bar' | 'pie'>(options: UseChartOptions<T>) {
  const chartData = computed<ChartData<T>>(() => ({
    labels: options.labels.value,
    datasets: options.datasets.value
  }))

  const chartOptions = ref<ChartOptions<T>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: !!options.title,
        text: options.title
      },
      legend: {
        position: 'top'
      }
    }
  })

  return {
    chartData,
    chartOptions
  }
}
```

Usage:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { useChart } from '@/composables/useChart'

const labels = ref(['Jan', 'Feb', 'Mar'])
const datasets = ref([
  { label: 'Revenue', data: [100, 200, 150], borderColor: '#42A5F5' }
])

const { chartData, chartOptions } = useChart({
  type: 'line',
  labels,
  datasets,
  title: 'Monthly Revenue'
})
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
```

---

## Troubleshooting

### "category" is not a registered scale

Register `CategoryScale`:

```typescript
import { CategoryScale } from 'chart.js'
ChartJS.register(CategoryScale)
```

### Chart not updating

1. Ensure you're replacing the entire data object, not mutating it
2. Check that vue-chartjs v4+ is installed (older versions need manual updates)

### Type errors with options

Use `as const` for string literal options:

```typescript
const options = {
  plugins: {
    legend: {
      position: 'top' as const  // Not just 'top'
    }
  }
}
```

### Canvas already in use

Ensure the chart is properly destroyed when the component unmounts. vue-chartjs handles this automatically, but if using raw Chart.js:

```typescript
onUnmounted(() => {
  chart.value?.destroy()
})
```

---

## Related Resources

- [VueJS](./SKILL.md) - Core Vue.js patterns and best practices
- [VueUse](./vueuse.md) - Useful composables (e.g., `useResizeObserver` for responsive charts)
- [Chart.js Documentation](https://www.chartjs.org/docs/) - Full Chart.js API reference
- [vue-chartjs Documentation](https://vue-chartjs.org/) - Vue wrapper documentation
