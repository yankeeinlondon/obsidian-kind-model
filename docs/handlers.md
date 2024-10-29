
# Query Handlers

> found in `src/handlers` in the source code

## Introduction

Query Handlers are higher order functions which render `km` code blocks. They include:

- `BackLinks`
- `VideoGallery`
- `Kind`
- `Book`
- `Movie`
- `Person` - _an opinionated way to show metadata for a file which represents a person_
- `Company` - _an opinionated way to show metadata for a file which represents a company_
- `People`
- `PageEntry`
- `IconPage`

Each handler is used in a manner that matches JS/TS conventions when calling a function. As an example, the following block inside a `km` block will render the 
`Kind` handler which receives filter criteria of [_kind_, _category_, _subcategory_]:

```ts
Kind("software", "productivity")
```

In this example we've decided show all "kinded pages" of the type `software` that are of the category `productivity`.

## Details

Now we'll go through each of the various handlers to become more familiar with  details.

### BackLinks

**Obsidian** comes with the ability to add visibility of backlinks to your page but the functionality is non-contextual and pretty basic. With this handler you'll get a _kind aware_ view into back links which you can customize to fit your needs.

## Other Docs

- [Overview Docs](../README.md)
- [Caching](./caching.md)
- [Page API](./page-api.md)
