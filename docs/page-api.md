
# Page API

## Overview

The core methods we'll be talking about are:

- `getPage()`
- `getPageInfo()`
- and `getPageBlock()`

but we'll also touch on:

- `getPath()`
- `getFrontmatter()`
- `setFrontmatter()`

## Details of the Page API

### `getPage(ref) → Page` 

The most common, least expensive, and first call you should understand is `getPage()`. It takes a variety of input types which "reference" a page and returns a `Page` object. Inputs allowed include:

- `string` which is a "path" to a file in the vault
- `string` which is a "tag" reference
- `string` which is a "name" of a file in the vault (note: because this is not fully qualified obsidian will just lookup the _first_ file with this name)
- `DvPage` which is a page object returned by the [Dataview Plugin](https://blacksmithgu.github.io/obsidian-dataview/)
- `TFile` an Obsidian representation of a file 
- `Link` is a format provided by the [Dataview Plugin](https://blacksmithgu.github.io/obsidian-dataview/) which provides simple metadata that allows for building a _link_ to another page in the vault
- `Page`'s passed in will simply be proxied back

This method returns a `Page` object which closely resembles the `DvPage` you may be familiar with if you're fluent with **Dataview Queries** but adds on many helper methods. It is also "cache aware" so it can potentially resolve information slightly quicker than a straight up dataview query.

#### Resolving `string` references

For `string` types passed in we must resolve multiple _reference types_ and we will do it in the following order:

- any string with `/` but not starting with `/` will be treated as a path only
  - note: this will miss files who live in the root folder of a vault
- any string leading with a leading `#` will be treated only as a "tag reference"
- all other variants will use the following logic:
  - try lookup as both a "path" and using the cache's `lookupByTag` method
  - return the short circuited value (with preference for `lookupByTag` when found)
  - if nothing found then try to lookup as the "name"

### `getPageInfo(ref) → PageInfo`

This method provides everything that `Page` does but adds additional meta properties based on analyzing the frontmatter on the page. Because it does take some calculation effort, this is kept separate from `Page` and you can easily upgrade to it as `getPageInfo(ref)` takes any reference that `getPage(ref)` does plus it can proxy through an already existing `PageInfo`.

### `getPageBlock(ref, view) → PageBlock`

This method provides quite a bit more than `PageInfo` but it requires that an Obsidian `View` be passed in along with the page reference. 

## Other Documentation

- [Overview Docs](../README.md)
- [Caching][../caching.md]
- [Query Handlers](./handlers.md)
