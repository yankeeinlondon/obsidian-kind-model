# UI Component Libraries for VueJS

This guide covers the Vue 3 UI component ecosystem, organized by category to help you choose the right tools for your project.

---

## Quick Reference

| Category | Recommended | Use Case |
|----------|-------------|----------|
| **Full UI Suite** | Vuetify, PrimeVue, Quasar | Rapid development, consistent design |
| **Headless/Unstyled** | Headless UI, Inspira UI | Custom design systems, Tailwind projects |
| **Data Tables** | AG Grid, VXE-Table | Heavy data, enterprise apps |
| **Charts** | ECharts, ApexCharts | Dashboards, analytics |
| **Forms** | FormKit, VeeValidate | Complex form handling |
| **Dates** | Vue 3 Datepicker, V-Calendar | Date/time input, scheduling |
| **Rich Text** | Tiptap, Quill | Content editing |

---

## 1. Full UI Component Suites

These are batteries-included frameworks with dozens of components, themes, and layout systems.

### Vuetify 3

Material Design framework - the most popular Vue UI library.

- **License:** MIT
- **Stars:** ~40k
- **Website:** [vuetifyjs.com](https://vuetifyjs.com/)
- **Repo:** [github.com/vuetifyjs/vuetify](https://github.com/vuetifyjs/vuetify)

**Key Features:**

- Large component set: forms, data tables, navigation, overlays
- Strong layout/grid system with responsive breakpoints
- Theming (light/dark, custom palettes), localization, accessibility
- Official Vite plugin

**Best For:** Teams wanting Material Design with minimal effort. Great defaults, extensive ecosystem.

**Trade-offs:** Heavy if you only need a few components. Strongly opinionated Material styling.

---

### PrimeVue

Feature-rich library from PrimeFaces with 80+ components.

- **License:** MIT (core)
- **Stars:** ~14k
- **Website:** [primevue.org](https://primevue.org/)
- **Repo:** [github.com/primefaces/primevue](https://github.com/primefaces/primevue)

**Key Features:**

- 80+ components: DataTable, Tree, TreeTable, Galleria, Menus
- Multiple themes (Material, Bootstrap, Tailwind presets)
- TypeScript support

**Best For:** Projects needing a wide variety of ready-to-use components with flexible theming.

**Trade-offs:** Some advanced themes/tools are commercial. Large API surface.

---

### Quasar Framework

Build SPA, PWA, mobile, and desktop apps from one Vue 3 codebase.

- **License:** MIT
- **Stars:** ~27k
- **Website:** [quasar.dev](https://quasar.dev/)
- **Repo:** [github.com/quasarframework/quasar](https://github.com/quasarframework/quasar)

**Key Features:**

- 70+ UI components
- Multi-platform targets: SPA, PWA, SSR, Electron, Cordova/Capacitor
- CLI for scaffolding, building, and deploying

**Best For:** Cross-platform projects requiring a single codebase for web, mobile, and desktop.

**Trade-offs:** Strong "Quasar way" of doing things; not minimal.

---

### Naive UI

Modern, TypeScript-first component library.

- **License:** MIT
- **Stars:** ~18k
- **Website:** [naiveui.com](https://www.naiveui.com/)
- **Repo:** [github.com/tusen-ai/naive-ui](https://github.com/tusen-ai/naive-ui)

**Key Features:**

- Complete component set: forms, layouts, overlays, data display
- Excellent TypeScript support and DX
- Good tree-shaking; import only what you use
- SSR-friendly with Nuxt modules

**Best For:** TypeScript-heavy projects wanting excellent type inference.

**Trade-offs:** Smaller ecosystem compared to Vuetify/PrimeVue.

---

### Element Plus

Vue 3 port of the popular Element UI.

- **License:** MIT
- **Stars:** ~23k
- **Website:** [element-plus.org](https://element-plus.org/)
- **Repo:** [github.com/element-plus/element-plus](https://github.com/element-plus/element-plus)

**Key Features:**

- 100+ components, i18n support
- Desktop-app-style components (forms, tables, dialogs)
- Strong in admin dashboards and B2B UIs

**Best For:** Enterprise admin panels and internal tools.

---

### Ant Design Vue

Vue implementation of Ant Design.

- **License:** MIT
- **Stars:** ~20k
- **Website:** [antdv.com](https://www.antdv.com/)
- **Repo:** [github.com/vueComponent/ant-design-vue](https://github.com/vueComponent/ant-design-vue)

**Key Features:**

- Enterprise-style UI with 50+ components
- Strong focus on forms, tables, filters
- Consistent, clean design language
- TypeScript support

**Best For:** Teams familiar with Ant Design from React or wanting enterprise aesthetics.

---

### Nuxt UI

Tailwind-based library for Nuxt/Vue.

- **License:** MIT
- **Stars:** ~5.7k
- **Website:** [ui.nuxt.com](https://ui.nuxt.com/)
- **Repo:** [github.com/nuxt/ui](https://github.com/nuxt/ui)

**Key Features:**

- Built on Tailwind CSS
- Dark mode, theming, accessibility
- Tight Nuxt integration

**Best For:** Nuxt projects wanting a native, Tailwind-based component library.

---

## 2. Headless & Unstyled Libraries

These focus on behavior, accessibility, and state—not styling. Ideal for custom design systems.

### Headless UI (Vue)

Unstyled, accessible components from Tailwind Labs.

- **License:** MIT
- **Stars:** ~26k (monorepo)
- **Website:** [headlessui.com](https://headlessui.com/)
- **Repo:** [github.com/tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui)

**Components:**

- Dialog (modal), Menu, Listbox, Combobox, Popover
- Tabs, Disclosure, Radio Group, Switch, Transition

**Key Features:**

- Solves ARIA, focus management, keyboard navigation
- You bring your own CSS (Tailwind or otherwise)

**Best For:** Custom design systems with Tailwind CSS. Maximum control over styling.

**Trade-offs:** No styles whatsoever—not for quick prototyping.

---

### Inspira UI

Motion-focused component library with copy-and-customize model.

- **License:** MIT
- **Stars:** ~4.3k
- **Website:** [inspira-ui.com](https://inspira-ui.com/)
- **Repo:** [github.com/unovue/inspira-ui](https://github.com/unovue/inspira-ui)

**Key Features:**

- Rich built-in animation effects (hover, scroll, transitions)
- Built with Vue, TypeScript, TailwindCSS, and VueUse Motion
- Nuxt 3 compatible
- Copy-and-customize model rather than locked library
- Inspired by Aceternity UI and Magic UI

**Unique Components:**

- Dynamic hover effects on inputs (gradient borders, shadows)
- Animated file upload components
- Dynamic background animations
- Glowing logo effects
- 3D globe model with hover interactions

**Best For:** Projects needing polished animations and modern visual effects without custom animation work.

**Trade-offs:** Newer library with smaller ecosystem.

---

### Oruga UI

CSS-framework agnostic components.

- **License:** MIT
- **Stars:** ~2k
- **Website:** [oruga.io](https://oruga.io/)
- **Repo:** [github.com/oruga-ui/oruga](https://github.com/oruga-ui/oruga)

**Key Features:**

- Common UI components (button, input, dropdown, modal)
- Works with any CSS framework or none

**Best For:** Projects with existing CSS frameworks or custom styling needs.

---

### Floating UI

Positioning engine for tooltips, popovers, dropdowns.

- **License:** MIT
- **Website:** [floating-ui.com](https://floating-ui.com/)

**Key Features:**

- Robust positioning logic (flip, shift, overlap)
- Framework agnostic with Vue composables

**Best For:** Building custom tooltips/popovers/dropdowns with precise positioning.

---

## 3. Form & Input Libraries

### FormKit

Schema-driven form building framework.

- **License:** MIT (core)
- **Stars:** ~4.6k
- **Website:** [formkit.com](https://formkit.com/)
- **Repo:** [github.com/formkit/formkit](https://github.com/formkit/formkit)

**Key Features:**

- Schema-driven: define fields as JSON config
- Built-in validation, multi-step forms, file uploads
- Tailwind and theme support

**Best For:** Large, complex forms with dynamic fields.

**Trade-offs:** Pro features require subscription. Learning curve for schema approach.

---

### VeeValidate

Validation-centric library.

- **License:** MIT
- **Website:** [vee-validate.logaretm.com](https://vee-validate.logaretm.com/v4/)

**Key Features:**

- Declarative, component-based validation
- Large set of built-in rules plus custom rules
- Integrates with any input components (Vuetify, Naive UI, etc.)

**Best For:** Adding validation to existing form components.

**Trade-offs:** Doesn't provide input components—just validation.

---

## 4. Date/Time Pickers & Calendars

### Vue 3 Datepicker (Vuepic)

Most complete datepicker for Vue 3.

- **License:** MIT
- **Stars:** ~1.7k
- **Website:** [vue3datepicker.com](https://vue3datepicker.com/)
- **Repo:** [github.com/Vuepic/vue-datepicker](https://github.com/Vuepic/vue-datepicker)

**Key Features:**

- Single date, range, multiple dates, month/year pickers, time picker
- Flexible slots and custom input rendering
- Localization, dark mode, week numbers

**Best For:** Form date/time inputs with rich functionality.

---

### V-Calendar

Calendar and date picker with advanced features.

- **License:** MIT
- **Website:** [vcalendar.io](https://vcalendar.io/)

**Key Features:**

- Calendar component and DatePicker component
- Weekly views, time picker, repeating date ranges
- Advanced highlighting and attributes

**Best For:** Projects needing both calendar view and date picking.

---

### FullCalendar (Vue)

Full event calendar for scheduling.

- **License:** MIT (core); premium plugins commercial
- **Website:** [fullcalendar.io](https://fullcalendar.io/)

**Key Features:**

- Month/week/day views
- Drag-drop, recurring events
- Timeline and resource views (some premium)

**Best For:** Google Calendar-style scheduling applications.

---

## 5. Data Tables & Grids

### AG Grid (Vue)

Industry-standard enterprise grid.

- **License:** MIT (Community); Commercial (Enterprise)
- **Website:** [ag-grid.com](https://www.ag-grid.com/)

**Community (Free) Features:**

- Sorting, filtering, pagination, cell rendering

**Enterprise Features:**

- Row grouping, pivot, advanced filtering, Excel-like features

**Best For:** Data-heavy applications needing maximum performance.

**Trade-offs:** Enterprise license is expensive. Large API surface.

---

### VXE-Table

Powerful open-source table component.

- **License:** MIT
- **Website:** [vxetable.cn](https://vxetable.cn/)
- **Repo:** [github.com/x-extends/vxe-table](https://github.com/x-extends/vxe-table)

**Key Features:**

- Virtual scrolling for large datasets
- Tree tables, pivot tables, editable cells
- Export, charts plugins

**Best For:** Complex tables without commercial licensing.

**Trade-offs:** Documentation partly in Chinese.

---

## 6. Charts & Data Visualization

### Apache ECharts + vue-echarts

Comprehensive charting library.

- **License:** Apache-2.0
- **Website:** [echarts.apache.org](https://echarts.apache.org/)
- **Vue Wrapper:** [github.com/ecomfe/vue-echarts](https://github.com/ecomfe/vue-echarts)

**Key Features:**

- Wide variety: heatmaps, graphs, geographic maps, 3D charts
- Strong interactivity: zooming, brushing, tooltips
- Built-in themes and dark mode

**Best For:** Data-heavy dashboards with diverse chart types.

**Trade-offs:** Larger bundle size. Complex configuration.

---

### ApexCharts + vue3-apexcharts

Modern, interactive charts.

- **License:** MIT
- **Website:** [apexcharts.com](https://apexcharts.com/)

**Key Features:**

- Area, bar, line, radial charts
- Live updates, annotations
- Nice default aesthetics

**Best For:** Trading/timeseries dashboards, metrics displays.

---

### Chart.js + vue-chartjs

Simple, approachable charting.

- **License:** MIT
- **Website:** [chartjs.org](https://www.chartjs.org/)
- **Vue Wrapper:** [vue-chartjs.org](https://vue-chartjs.org/)
- **Detailed Guide:** [Chart.js with Vue 3](./chartjs.md)

**Key Features:**

- Line, bar, pie, radar, bubble, mixed charts
- Easy setup
- Tree-shakeable (register only components you use)
- Full TypeScript support with typed props and data

**Best For:** Small dashboards, admin panels.

**Trade-offs:** Less flexibility for huge datasets or custom visuals.

---

## 7. Rich Text Editors

### Tiptap

Headless editor built on ProseMirror.

- **License:** MIT (core); Pro UI commercial
- **Website:** [tiptap.dev](https://tiptap.dev/)

**Key Features:**

- JSON-based document schema
- Rich extension system
- Tables, mentions, code blocks, collaboration

**Best For:** Custom editor experiences with structured output.

**Trade-offs:** Build your own toolbar or pay for Tiptap Pro.

---

### Quill (Vue wrappers)

Simple WYSIWYG editor.

- **License:** BSD-3-Clause
- **Vue Wrapper:** [@vueup/vue-quill](https://github.com/vueup/vue-quill)

**Key Features:**

- Delta format for structured content
- Easy drop-in

**Best For:** Simple content editing needs.

**Trade-offs:** Less extensible than Tiptap.

---

### CKEditor 5 Vue

Full-featured enterprise editor.

- **License:** GPL + Commercial
- **Website:** [ckeditor.com](https://ckeditor.com/)

**Key Features:**

- Track changes, collaboration
- Multiple builds: classic, inline, balloon

**Best For:** Enterprise apps needing turnkey editor UI.

**Trade-offs:** License complexity and cost.

---

## 8. Notifications, Modals & Feedback

### Notivue

Modern toast notification system.

- **License:** MIT
- **Repo:** [github.com/smastrom/notivue](https://github.com/smastrom/notivue)

**Key Features:**

- Ready-made toasts and headless core
- Accessibility (focus handling, reduced motion)
- Queueing, dismissing

**Best For:** Flexible notification system with custom designs.

---

### Vue Final Modal

Programmatic modal management.

- **License:** MIT
- **Repo:** [github.com/vue-final/vue-final-modal](https://github.com/vue-final/vue-final-modal)

**Key Features:**

- Programmatic modals, nested modals
- Teleport-based mounting
- Minimal default styling

**Best For:** Complex modal logic (stacking, dynamic creation).

---

## 9. Drag-and-Drop

### Vue.Draggable (SortableJS)

List reordering via drag-and-drop.

- **License:** MIT
- **Repo:** [github.com/SortableJS/vue.draggable.next](https://github.com/SortableJS/vue.draggable.next)

**Key Features:**

- Reorder lists by drag/drop
- Drag between lists, clone mode, drag handles

**Best For:** Sortable lists, kanban boards.

**Trade-offs:** May need virtual lists for very large data.

---

## 10. Commercial Enterprise Suites

For apps requiring support contracts and SLAs.

### Kendo UI for Vue

- **License:** Commercial (per seat)
- **Website:** [telerik.com/kendo-vue-ui](https://www.telerik.com/kendo-vue-ui)
- 100+ components with enterprise support

### Syncfusion Essential Vue

- **License:** Commercial (free community license available)
- **Website:** [syncfusion.com/vue-components](https://www.syncfusion.com/vue-components)
- 1,600+ components across platforms

### DevExtreme Vue

- **License:** Commercial
- **Website:** [js.devexpress.com/Vue](https://js.devexpress.com/Vue/)
- High-quality datagrid, scheduler, charts

---

## Recommended Stacks

### Custom Design System (Tailwind)

```
Headless UI + Tailwind CSS
+ Vue 3 Datepicker (dates)
+ AG Grid Community (tables)
+ Tiptap (editing)
+ Notivue (notifications)
+ Vue.Draggable (drag/drop)
```

### Rapid Development

```
Vuetify 3 or PrimeVue
(includes most components you need out of the box)
```

### Animation-Rich Landing Pages

```
Inspira UI + Tailwind CSS
+ VueUse Motion (additional animations)
```

### Cross-Platform App

```
Quasar Framework
(SPA → PWA → Mobile → Desktop from one codebase)
```

### Enterprise Admin Panel

```
Element Plus or Ant Design Vue
+ AG Grid (data tables)
+ ECharts (visualizations)
```

---

## Selection Criteria

When choosing a UI library, consider:

1. **Design System Alignment** - Does it match your brand? (Material, custom, etc.)
2. **Bundle Size** - Full suite vs. targeted libraries
3. **TypeScript Support** - Type inference quality
4. **Customization** - Theming flexibility vs. opinionated defaults
5. **Accessibility** - ARIA support, keyboard navigation
6. **Maintenance** - Update frequency, community size
7. **License** - MIT vs. commercial requirements
