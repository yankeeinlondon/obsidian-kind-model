
# Caching Strategy


## Kind/Type Definitions Cache

Caching starts with the **configuration file** (_the JSON config file each plugin is allowed to populate_) which has both a `kinds` and `types` property which keeps a record of the kind and type definitions known about.

### Lifecycle

1. Initialization
	As soon as **Obsidian** starts the _in memory cache_ is initialized with the data from the configuration file. This file should be largely up-to-date so we allow the plugin to start at this stage.
2. Refresh
	Immediately following the initialization stage, the plugin will query and freshen any stale entries found in the cache (and ensure these updates are sent back to the config file too).
3. Monitoring
    The final stage is to monitor all open files in `Obsidian` which might effect our Lookups and update accordingly

In the `src/main.ts` file you'll find the first two properties of the lifecycle by the call to `initializeKindCaches` and then the `on_xxx` calls setup callbacks which provide the monitoring.

### Lookups

Both **kinds** and **types** have lookups by `tag` and `path`. You will see this in code by looking for calls to:

- `lookupKindByTag(tag) → KindDefinition`, 
- `lookupKindByPath(path) → KindDefinition`, 
- `lookupTypeByTag(tag) → TypeDefinition`, 
- `lookupTypeByPath(tag) → TypeDefinition`


### Updates

When it is detected that a cache entry is stale then one of the following is called:

- `updateKindWithTag(tag)  → void`
- `updateType(tag | path)  → void`

These functions are found in `src/cache/*`.



## Other Documentation

- [Overview Docs](../README.md)
- [Page APIs](../page-apis.md)
- [Query Handlers](./handlers.md)

