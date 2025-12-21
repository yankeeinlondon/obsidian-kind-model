# Project Dependencies

## Structure

- `package.json` - Root project configuration

## Production Dependencies

- [@markdoc/markdoc](https://markdoc.dev/) [ _v0.5.4_ ]

  A powerful, flexible, Markdown-based authoring framework for creating custom documentation sites and content experiences.

- [@popperjs/core](https://popper.js.org/) _v2.11.8_

  Positioning engine to calculate the optimal position of popovers, tooltips, and other floating elements.

- [@yankeeinlondon/happy-wrapper](https://github.com/yankeeinlondon/happy-wrapper) _v3.5.7_

  Functional programming utility library for wrapping and composing operations with better type inference.

- [@yankeeinlondon/kind-error](https://github.com/yankeeinlondon/kind-error) _v1.4.1_

  Strongly-typed error handling utilities with classification and context preservation.

- [arktype](https://arktype.io/) _v2.1.29_

  TypeScript's 1:1 runtime validator. Provides highly-optimized runtime validation that matches TypeScript types exactly, 20x faster than Zod.

- [inferred-types](https://www.npmjs.com/package/inferred-types) _v1.4.5_

  Collection of TypeScript utilities providing narrow type inference paired with runtime functions to keep design-time types and runtime values in sync.

- [vue](https://vuejs.org/) _v3.5.25_

  Progressive JavaScript framework for building user interfaces with reactive data binding and composable components.

- [xxhash-wasm](https://github.com/jungomi/xxhash-wasm) _v1.1.0_

  WebAssembly implementation of the xxHash algorithm for fast, non-cryptographic hashing.

- [yaml](https://eemeli.org/yaml/) _v2.8.2_

  JavaScript parser and stringifier for YAML with full support for YAML 1.2 and detailed error reporting.

## Development Dependencies

### Build Tools

- [vite](https://vitejs.dev/) _v7.2.7_

  Next generation frontend build tool providing instant server start and lightning-fast HMR.

- [esbuild](https://esbuild.github.io/) _v0.27.1_

  Extremely fast JavaScript/TypeScript bundler and minifier written in Go.

- [tsup](https://tsup.egoist.dev/) _v8.5.1_

  Fast TypeScript/JavaScript bundler built on top of esbuild with zero config.

- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) _v20.3.0_

  Auto-import APIs on-demand for Vite, Webpack, and other bundlers to eliminate import statements.

- [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) _v30.0.0_

  Auto-import Vue components on-demand without explicit imports.

- [unplugin-vue-macros](https://vue-macros.dev/) _v2.14.5_

  Explore and extend more macros and syntax sugar to Vue with compile-time transformations.

### Vue Ecosystem

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) _v6.0.2_

  Official Vite plugin for Vue 3 single file component support.

- [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) _v3.5.25_

  Vue 3 single file component compiler for parsing and compiling .vue files.

### Testing

- [vitest](https://vitest.dev/) _v4.0.15_

  Next-generation testing framework powered by Vite with Jest-compatible API, native ESM/TypeScript support, and blazing fast performance.

- [@vitest/coverage-v8](https://vitest.dev/guide/coverage) _v4.0.15_

  V8-based code coverage provider for Vitest using Chrome's built-in coverage instrumentation.

- [@vitest/ui](https://vitest.dev/guide/ui) _v4.0.15_

  Web-based UI for Vitest test results with interactive test exploration and filtering.

- [typed-tester](https://github.com/yankeeinlondon/typed-tester) _v0.13.2_

  Type-level testing utilities for validating TypeScript type transformations and inference.

- [@type-challenges/utils](https://github.com/type-challenges/type-challenges) _v0.1.1_

  Type utilities for solving TypeScript type challenges and advanced type testing.

### TypeScript

- [typescript](https://www.typescriptlang.org/) _v5.9.3_

  Strongly-typed programming language that builds on JavaScript with static type checking.

- [tslib](https://github.com/microsoft/tslib) _v2.8.1_

  Runtime library for TypeScript containing helper functions emitted by the TypeScript compiler.

- [@typescript-eslint/eslint-plugin](https://typescript-eslint.io/) _v8.49.0_

  ESLint plugin providing linting rules for TypeScript codebases.

- [@typescript-eslint/parser](https://typescript-eslint.io/) _v8.49.0_

  ESLint parser allowing ESLint to lint TypeScript source code.

### Linting & Formatting

- [oxlint](https://oxc.rs/docs/guide/usage/linter) _v1.32.0_

  Extremely fast linter written in Rust as part of the Oxc project, designed to catch common errors and enforce code quality.

- [eslint-plugin-format](https://github.com/antfu/eslint-plugin-format) _v1.1.0_

  ESLint plugin for formatting code using Prettier, dprint, or other formatters through ESLint.

### Obsidian Development

- [obsidian](https://github.com/obsidianmd/obsidian-api) _v1.11.0_

  Type definitions for the Obsidian API providing interfaces for vault, workspace, metadata, and plugin development.

- [obsidian-dataview](https://github.com/blacksmithgu/obsidian-dataview) _v0.5.68_

  Data index and query language over Markdown files for Obsidian, treating your vault as a queryable database.

- [obsimian](https://github.com/motif-software/obsimian) _v0.4.0_

  Testing utilities and mocks for Obsidian plugin development.

### CodeMirror

- [@codemirror/autocomplete](https://codemirror.net/docs/ref/#autocomplete) _v6.20.0_

  Autocompletion support for CodeMirror 6 editor.

- [@codemirror/commands](https://codemirror.net/docs/ref/#commands) _v6.10.0_

  Standard editing commands for CodeMirror 6.

- [@codemirror/lang-javascript](https://codemirror.net/docs/ref/#lang-javascript) _v6.2.4_

  JavaScript/TypeScript language support for CodeMirror 6.

- [@codemirror/language](https://codemirror.net/docs/ref/#language) _v6.11.3_

  Language support infrastructure for CodeMirror 6.

- [@codemirror/lint](https://codemirror.net/docs/ref/#lint) _v6.9.2_

  Linting integration for CodeMirror 6 editor.

- [@codemirror/search](https://codemirror.net/docs/ref/#search) _v6.5.11_

  Search and replace functionality for CodeMirror 6.

- [@codemirror/state](https://codemirror.net/docs/ref/#state) _v6.5.2_

  State management and transactions for CodeMirror 6.

- [@codemirror/view](https://codemirror.net/docs/ref/#view) _v6.39.3_

  View component and DOM integration for CodeMirror 6 editor.

### Type Definitions

- [@types/codemirror](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/codemirror) _v5.60.17_

  TypeScript type definitions for CodeMirror 5.

- [@types/luxon](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/luxon) _v3.7.1_

  TypeScript type definitions for Luxon date/time library.

- [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node) _v22.19.2_

  TypeScript type definitions for Node.js APIs.

- [@types/request](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/request) _v2.48.13_

  TypeScript type definitions for the request HTTP client library.

### Utilities

- [builtin-modules](https://github.com/sindresorhus/builtin-modules) _v5.0.0_

  List of Node.js built-in modules for bundler externalization.

- [bumpp](https://github.com/antfu/bumpp) _v10.3.2_

  Interactive CLI for bumping package versions with git tag creation and changelog generation.

- [electron](https://www.electronjs.org/) _v39.2.6_

  Framework for building cross-platform desktop apps with JavaScript, HTML, and CSS using Chromium and Node.js.

- [husky](https://typicode.github.io/husky/) _v9.1.7_

  Git hooks made easy. Automatically lint and test code before commits and pushes.

- [jiti](https://github.com/unjs/jiti) _v2.6.1_

  Runtime TypeScript and ESM support for Node.js with automatic transpilation and caching.

- [luxon](https://moment.github.io/luxon/) _v3.7.2_

  Modern, powerful library for working with dates and times in JavaScript.

- [npm-run-all](https://github.com/mysticatea/npm-run-all) _v4.1.5_

  CLI tool to run multiple npm scripts sequentially or in parallel.

- [pathe](https://github.com/unjs/pathe) _v2.0.3_

  Universal path utilities for Node.js and browsers with consistent cross-platform behavior.
