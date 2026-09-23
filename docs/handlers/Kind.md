# `Kind` handler

`Kind` queries the Dataview index and displays a table of pages whose tags match a kind path. Use it in a `km` code block when you want a list of pages for a kind, category, or subcategory.

```km
Kind("software")
```

Pass each tag segment as a quoted string, without the leading `#`. For the `software` kind, `Kind("software")` queries `#software`, `Kind("software", "development")` queries `#software/development`, and `Kind("software", "development", "ide")` queries `#software/development/ide`.

These examples assume your vault defines the kind with a note tagged `#kind/software` and classifies pages with tags such as `#software/development/ide`. See [the classification hierarchy](../classification-hierarchy.md) for how kind, category, and subcategory tags are structured.

## Arguments

| Position | Value | Required | Meaning |
| --- | --- | --- | --- |
| 1 | Kind name | Yes | The kind tag segment, such as `software`. |
| 2 | Category name | No | The category segment, such as `development`. |
| 3 | Subcategory name | No | A subcategory under the category in position 2, such as `ide`. |

Values are strings. The order is fixed: to query a subcategory, include its category first. The handler accepts at most three positional values. An options object, if present, must come last.

## Options

All options are optional. Unknown option names and values of the wrong type are rejected.

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `noClassificationResults` | boolean | `true` | When `true`, keeps only pages Kind Model identifies as `kinded` or `multi-kinded`. When `false`, skips this classification filter and returns all Dataview results for the tag path. |
| `hide` | array of strings | — | Removes named columns from the table. Matching is case-insensitive; available columns are `Page`, `Classification`, `Description`, and `Links`. |
| `show` | array of strings | — | Accepted by validation, but currently has no effect on the table. |

For example, query IDE pages, omit the Links column, and include matching Dataview pages even when Kind Model does not classify them as kinded:

```km
Kind("software", "development", "ide", {
  noClassificationResults: false,
  hide: ["Links"]
})
```

`Description` and `Links` are also hidden automatically when every result has an empty value for that column. The `hide` option removes a column even when it contains values.

## Results

The table has these columns:

- **Page** — a link to the matching note.
- **Classification** — the note's Kind Model classifications.
- **Description** — its description, when available.
- **Links** — its related links, when available.

With the default `noClassificationResults: true`, the handler filters the Dataview tag query to pages whose Kind Model page type is `kinded` or `multi-kinded`. Set the option to `false` when you want every Dataview match, including pages that only carry the tag and are not otherwise recognized as kinded.

## Complete example

This note lists pages in the `development` category of `software`. The options object follows the two positional arguments:

````markdown
```km
Kind("software", "development", { hide: ["Description", "Links"] })
```
````
