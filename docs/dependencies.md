# Project Dependencies

This page explains what the project’s direct dependencies do and where they fit
in the plugin. The source of truth for declared dependencies is `package.json`;
the checked-in `pnpm-lock.yaml` records the exact versions installed together.
Version numbers are intentionally not repeated here, so updates do not require
editing this overview.

Install the versions recorded in the lockfile with:

```sh
pnpm install --frozen-lockfile
```

## Runtime model

Kind Model runs inside Obsidian. Vite bundles imported JavaScript dependencies
into `dist/main.mjs`; the `./push` script uses tsup to create the CommonJS
`dist/main.js` that Obsidian loads. Obsidian provides its own API at runtime, so
the `obsidian` module is externalized in both `vite.config.ts` and
`tsup.config.ts` rather than copied into the plugin bundle.

Dataview is also a host plugin. Kind Model calls `getAPI(app)` and waits for
Dataview's index to initialize before running work that needs it. The
`obsidian-dataview` npm package supplies the API function and TypeScript types;
the Dataview plugin itself must be installed and enabled in the vault. The
current `manifest.json` does not declare a Dataview dependency, so Obsidian does
not enforce that requirement during installation.

For example, plugin startup gets the API and defers initialization until the
Dataview index is ready:

```ts
this.dv = getAPI(this.app);
this.deferUntilDataviewReady(async () => {
  await initializeKindLookups(this);
});
```

This is the pattern in `src/main.ts`; the readiness helper is implemented in
`src/startup/runAfterDataviewReady.ts`. If Dataview never becomes available,
the readiness watcher reports a timeout.

## Dependencies used by the plugin

These packages are in `dependencies`, which identifies them as production
dependencies. Imports reachable from the Vite entry are bundled unless the
build config marks them external.

| Package | Role in this plugin |
| --- | --- |
| `@markdoc/markdoc` | Parses Markdown into a document tree. `src/page/createPageView.ts` and `src/helpers/pageContent.ts` use it to inspect page structure. For example, `Markdoc.parse(content)` produces the tree used to find headings and content blocks. |
| `@popperjs/core` | Positions suggestion popups relative to their input. Used by `src/helpers/Suggest.ts`. |
| `@yankeeinlondon/happy-wrapper` | Provides DOM traversal and query helpers for scraping external pages, used in `src/helpers/scrapers.ts`. |
| `@yankeeinlondon/kind-error` | Creates and identifies structured errors with Kind Model-specific context; used by `src/errors.ts` and handler error reporting. |
| `arktype` | Defines runtime schemas for `km` handler arguments and options. For example, `src/handlers/Kind.ts` validates a required `kind` string and optional `category` and `subcategory` strings. |
| `inferred-types` | Supplies shared TypeScript types and runtime helpers such as string guards and path/string transforms. It is used across `src/`. |
| `vue` | Declared for Vue UI components. Vite is configured with `@vitejs/plugin-vue`, though the current `src/main.ts` entry does not import the `.vue` files. |
| `xxhash-wasm` | Declared, but no direct import from active source files was found. |
| `yaml` | Declared, but no direct import from active source files was found. Frontmatter text is currently split by project code in `src/utils/splitContent.ts`. |

Here is a small example of the runtime schema pattern used by handlers:

```ts
import { type } from "arktype";

const KindScalars = type({
  kind: "string",
  "category?": "string",
});

const result = KindScalars({ kind: "software", category: "development" });
```

The handler definitions and shared parser use schemas like this to validate
values parsed from a `km` code block before the handler works with them.

## Development dependencies

Packages in `devDependencies` support building, type checking, linting, or
testing the project. The section does not determine whether imported code is
bundled: Vite and tsup do. For example, `obsidian-dataview` and `luxon` are
development dependencies that active source files import. Dataview is needed
as a separate Obsidian plugin; `luxon` is used for date formatting and book
date parsing.

| Area | Packages | How they are used |
| --- | --- | --- |
| Build | `vite`, `@vitejs/plugin-vue`, `esbuild`, `tsup`, `pathe` | Vite builds the ESM entry; the Vue plugin handles `.vue` files; tsup converts the Vite output to CommonJS for Obsidian. `pathe` is used by `vite.config.ts`. |
| Obsidian and editor APIs | `obsidian`, `obsidian-dataview`, `@codemirror/autocomplete`, `@codemirror/commands`, `@codemirror/lang-javascript`, `@codemirror/language`, `@codemirror/lint`, `@codemirror/search`, `@codemirror/state`, `@codemirror/view`, `@types/codemirror`, `@types/luxon`, `@types/request` | API packages and declarations used for development and type checking. Obsidian and CodeMirror modules listed in the bundler external configuration are supplied by the host at runtime. `obsidian-dataview` also supplies the imported `getAPI` helper. |
| Desktop and compatibility | `electron` | Declared for desktop development; no active source import was found. |
| TypeScript | `typescript`, `tslib`, `@types/node` | Compiler, emitted helper library, and Node.js declarations used by tooling and configuration. |
| Tests | `vitest`, `@vitest/coverage-v8`, `@vitest/ui`, `obsimian`, `typed-tester`, `@type-challenges/utils` | Vitest runs the tests; the other packages provide coverage, an interactive test UI, Obsidian mocks, and type-level test helpers. |
| Linting and release | `oxlint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-format`, `husky`, `bumpp` | `pnpm lint` runs Oxlint; bumpp supports version releases. The ESLint-related packages and Husky are declared development tools, though the current package scripts do not invoke ESLint or Husky. |
| Other tooling | `@vue/compiler-sfc`, `unplugin-auto-import`, `unplugin-vue-components`, `unplugin-vue-macros`, `builtin-modules`, `jiti`, `luxon`, `npm-run-all` | Additional Vue, module, date, and command-line tooling declared in the manifest. Only plugins explicitly wired into `vite.config.ts` participate in the current Vite build; that config currently wires `@vitejs/plugin-vue`. `luxon` is used in `src/api/showApi.ts` and `src/helpers/scrapers.ts`. |

The relevant project commands are declared in `package.json`:

```sh
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

To update a dependency, change its declaration in `package.json`, update
`pnpm-lock.yaml` with pnpm, and commit both files. Check whether a package is
bundled or externalized in `vite.config.ts` and `tsup.config.ts` before
changing how it is classified.
