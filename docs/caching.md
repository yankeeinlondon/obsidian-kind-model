
# Caching Strategy


## Overview

### Lookup Caching

In order to provide the quickest response time possible this plugin uses _caching_ where appropriate. The following characteristics are cached:

1. `kind-defn-lookups`
2. `kinded-page-lookups`
3. `kind-categories-lookups`
4. `kind-subcategory-lookups`

Each of these "lookups" are stored as part of the plugins configuration file as an array of entries which are defined by the type `Lookup`. Refer to the exact type by looking at `src/types/Lookup.ts` but here's a general overview of the type to understand what it _is_ and _is not_ storing:

```ts
type LookupType = "defn" | "category" | "subcategory";
type Lookup<T extends LookupType> = {
	/**  used to distinguish the lookup type being provided */
	kind: T;
	
	id: string;

	/** 
	 * The **tag** -- with a leading `#` char -- which identifies this page.
	 * 
	 * Note: with subcategories, the tag is represented as `[cat]/[subcat]`
	 */
	tag: string;

	/** 
	 * the "name" of the page
	 */
	name: string;

	/**
	 * the file's extension which is a hint to the content type
	 */
	ext: string;

	/** the fully qualified path to a file */
	path: string;
};
```

This content is _serializable_ and can be stored in the `kindDefinitions`, `kindedPages`, `kindCategories`, and `kindSubcategories` properties without issue.

## Details on Lookup Caching

Unless you're working on a PR that touches this area you'll likely not care too much about this section but in this section we'll cover how caching is implemented in the plugin's code and how to interact with it.

### The Plugin API

When the plugin starts up in `main.ts` it loads in all of the lookup properties into memory and exposes useful methods for plugin authors to use such as:

- `getKindDefinitionTags()`
- `getKindDefinitionPaths()`
- `isKindDefinition(pg)`
- `lookupKindDefinitionByTag(tag)`
- `lookupKindDefinitionByPath(path)`

These sorts of helper methods exist not only for _kind definitions_ but also 
any of the other major kind types (e.g., "kinded pages", "category pages", "subcategory pages").

In addition, there are a few "global" methods you can leverage:

- `lookupByTag(tag)`
- `lookupByPath(path)` 

These global methods allow the caller to not have to known what "type" of page they think they're looking for.

### Mechanics and Lifecycle of the Cache

A cache is really only useful if you can count on it being "fresh" and this section will explore how we initialize and then maintain a consistent cache for these lookups.

#### Initialization

When the plugin starts the `main.ts` file calls `initializeCache()` to load in the plugins configuration (which is synced across all clients) and then store in memory in a manner which is optimized for lookup functionality.

#### Post Initialization

One minute after initializing -- _the delay is provided to not throttle the CPU when loading_ -- this plugin will query current vault and look for any changes which may have occurred. Those changes will then be saved back to the plugin's configuration.

#### Page Change

Whenever a page is changed this plugin reacts to the change and updates the configuration where required.


### Interaction with the Page methods

If you've been exploring the API surface of this API then you're likely to know about `getPage`, `getPageInfo`, and `createPageBlock` methods which are used extensively to provide the appropriate context for a page.

The key thing to understand here is that these API features are _higher level_ abstractions and will be using the underlying caching mechanisms for you when needed. They **are** "cache aware".


## Other Documentation

- [Overview Docs](../README.md)
- [Page APIs](../page-apis.md)
- [Query Handlers](./handlers.md)
