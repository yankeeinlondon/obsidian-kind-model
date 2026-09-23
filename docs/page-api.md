# Page API

The Kind Model Page API turns a page reference into either the page data Dataview indexed or a richer Kind Model view of that data. Use the richer result only when you need classification, task, or frontmatter helpers.

The plugin exposes these methods on `plugin.api`, where `plugin` is the `KindModelPlugin` instance:

| Method | Use it for | Result |
| --- | --- | --- |
| `getPage(ref)` | Read Dataview page data | `DvPage` or `undefined` |
| `getPageInfo(ref)` | Read page data plus Kind Model metadata | `PageInfo` or `undefined` |
| `getPageInfoBlock(evt)` | Get the page and render helpers for a `km` code block | `PageInfoBlock` or `undefined` |
| `createPageView(view)` | Combine page metadata with an open Markdown view | `PageView` or `undefined` |
| `getPath(ref)` | Extract a path from a page reference | `string` or `undefined` |

Page resolution uses the Dataview index. The plugin defers its own startup work until Dataview is ready; when calling the API from another plugin, wait until Kind Model and Dataview have loaded. `getPath()` only extracts a path and does not query Dataview.

## Page references

The lookup methods accept common page references: a Dataview page, an Obsidian file, a Dataview file link, a `PageInfo`, or a string. A `FuturePage` represents a page that does not exist yet, so `getPage()` returns `undefined` for it. For strings, pass a vault path such as `Projects/Obsidian.md`. `getPage()` also unwraps an Obsidian wikilink string such as `[[Projects/Obsidian.md|Obsidian]]`. Ordinary strings are passed to Dataview as page paths; a tag string such as `#kind/software` is not treated as a tag query.

`getPath(ref)` extracts a path without looking up the page or checking that it exists. A future page, or an unsupported value, has no path and returns `undefined`.

## Look up a Dataview page

`getPage(ref)` returns Dataview's `DvPage`, not a Kind Model wrapper. It preserves the page's Dataview fields, including `file.path` and `file.frontmatter`. It returns `undefined` when the reference cannot be resolved.

```ts
const page = plugin.api.getPage("Projects/Obsidian.md");

if (!page) {
  return;
}

console.log(page.file.path);
console.log(page.file.frontmatter.status);
```

Use this method for simple page lookups. If you need Kind Model classifications or helper methods, use `getPageInfo()`.

## Read Kind Model metadata

`getPageInfo(ref)` returns a `PageInfo`. Its `current` property is the underlying `DvPage`; `fm` is that page's frontmatter. The result also includes the page path and name, tags and aliases, incoming and outgoing links, task data, classification data, and metadata helpers.

`pageType` identifies the page's role in the model. Values include `kinded`, `kinded > category`, `kinded > subcategory`, their `multi-kinded` forms, `kind-defn`, `type-defn`, and `none`. An ordinary page with no recognized Kind Model classification can still produce a `PageInfo` with `pageType: "none"`.

For a page with one kind, `kind` and `type` contain the related Dataview pages (the type can be `undefined`). For a page with multiple kinds, `kinds` and `types` contain arrays instead. `categories`, `subcategories`, and `classifications` provide the page's category data.

```ts
const info = plugin.api.getPageInfo("Projects/Obsidian.md");

if (!info) {
  return;
}

console.log(info.pageType); // for example, "kinded"
console.log(info.current.file.path);
console.log(info.fm.status);
console.log(info.classifications);

for (const category of info.categories) {
  console.log(category.category, category.kind);
}
```

`getPageInfo()` computes the additional metadata from the Dataview page and Kind Model's classification helpers. Use `getPage()` when those fields are not needed.

## Update frontmatter

The Page API does not expose methods named `getFrontmatter()` or `setFrontmatter()`. Read frontmatter from `info.fm` (or `info.current.file.frontmatter`). `PageInfo` also includes path-bound asynchronous methods for common edits:

```ts
const info = plugin.api.getPageInfo("Projects/Obsidian.md");

if (info) {
  await info.setFmKey("status", "active");
  await info.removeFmKey("draft");
  await info.sortFmKeys();
}
```

The same operations are available through `plugin.api.fm` when you have only a path. The API is curried: first pass the path, then the property arguments.

```ts
await plugin.api.fm.setFmKey("Projects/Obsidian.md")("status", "active");
```

When the value passed to `setFmKey` is a page reference, it is converted to a wikilink; an array consisting entirely of page references is converted to an array of wikilinks. These methods use Obsidian's `processFrontMatter` API.

## Work with a `km` code block

`getPageInfoBlock(evt)` builds a `PageInfoBlock` from an Obsidian code block event. The event's `ctx.sourcePath` determines the containing note. The result adds the code block's source text as `content`, its HTML element as `container`, the Obsidian component as `component`, and a `render` API. Here `content` is the `km` block's source, not the full Markdown note.

```ts
const block = plugin.api.getPageInfoBlock(evt);

if (!block) {
  return;
}

await block.render.render(`## ${block.current.file.name}`);
```

Kind Model handlers already receive the containing page as `event.page` and a render API as `event.render`, so a handler usually does not need to call `getPageInfoBlock()` itself.

## Work with an open Markdown view

`createPageView(view)` accepts an Obsidian `MarkdownView`. It returns `undefined` if the view has no file or the file cannot be resolved through Dataview. Otherwise, it combines `PageInfo` fields with `dom` references to the view's elements and a `view` snapshot. The snapshot includes the current content and `contentStructure`, which separates frontmatter and body and includes heading sections and a Markdoc syntax tree.

```ts
const pageView = plugin.api.createPageView(markdownView);

if (pageView) {
  console.log(pageView.path);
  console.log(pageView.view.contentStructure.blocks);
  pageView.dom.content.addClass("kind-model-inspected");
}
```

The `view` data and DOM references come from the specific open view, so they are not stored in `PageInfo`. The `PageView` type currently declares a `component` property that `createPageView()` does not add at runtime. Likewise, `getPageInfoBlock()` currently adds `sectionInfo` at runtime, but `PageInfoBlock` does not declare that property.

## Related documentation

- [Kind Model handlers](./km-handlers.md)
- [KM block rendering flow](./km-render-flow.md)
- [Classification hierarchy](./classification-hierarchy.md)
- [Page and classification types](./types.md)
