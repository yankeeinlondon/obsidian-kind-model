# Update command

Kind Model's **update this page** command fills or rewrites classification links in the frontmatter of the Markdown page that is open in the editor. It reads the page's recognized Kind, Type, Category, and Subcategory tags and the relationships Kind Model can resolve from their definition pages.

Use it from Obsidian's Command Palette by searching for **update this page**. The command acts on the active Markdown page; it does not use selected text.

## What it updates

The command can write these frontmatter properties:

| Property | When it is written |
| --- | --- |
| `type` | On an ordinary single-Kind page, a resolved Type is written when `type` is missing. A Kind or Category definition page tagged with a Type can have its `type` link written or corrected. |
| `types` | On a multi-Kind page, the command writes the Type links it can resolve (this can be an empty list) and removes a singular `type` property. |
| `kind` | A single Kind resolves for the page and its frontmatter link is missing or points to a different Kind page. |
| `kinds` | A multi-Kind page has Kind references to record and the `kinds` property is missing or has a different number of entries. The command removes a singular `kind` property. |
| `category` / `categories` | One or more Category assignments resolve from the page's classification tags. One assignment uses `category`; multiple assignments use `categories`. |
| `subcategory` / `subcategories` | One or more Subcategory assignments resolve from the page's classification tags. One assignment uses `subcategory`; multiple assignments use `subcategories`. |

Values are written as Obsidian links to the relevant definition pages. If a Category or Subcategory definition page does not exist yet, the command can write a link to a suggested future page. The examples below use short links such as `[[Product]]`; actual links may include a path and display name, such as `[[Types/Product.md|Product]]`. When the command makes updates, it sorts the Kind Model properties together near the top of the frontmatter, with `description` and `desc` near the bottom. Other frontmatter properties and the note body are preserved.

The command does not invent Type links, create classification tags, or infer a missing classification from the note title. A Type already set on an ordinary single-Kind page is left as-is. A multi-Kind page can receive an empty `types` list if none of its Kinds resolves to a Type. If it finds no Category or Subcategory assignment, it leaves existing properties at those levels untouched. Pages with category or subcategory assignments may show **Updates completed** each time because the command writes those values from the current assignments.

## Example: update a single-Kind page

Suppose the vault has a `Product` Type, a `Software` Kind assigned to that Type, and definition pages for the `Productivity` Category and `IDE` Subcategory. An IDE note is tagged `#software/productivity/ide`.

Before running the command, its frontmatter might contain only unrelated metadata:

```md
---
status: active
---

#software/productivity/ide
```

After running **update this page**, the classification links are added:

```md
---
type: "[[Product]]"
kind: "[[Software]]"
category: "[[Productivity]]"
subcategory: "[[IDE]]"
status: active
---

#software/productivity/ide
```

The existing tag remains the source of the Kind, Category, and Subcategory associations. The `type` link is included because the `Software` Kind definition is associated with `Product`. See [Classification hierarchy](../classification-hierarchy.md) and [Types](../types.md) for how to define these tags and relationships.

## Pages with multiple Kinds

For a page classified under more than one Kind, the command uses plural `kinds` and `types` properties. For example, if the page has both `#software` and `#service` classifications and those Kind definitions resolve to `Product` and `Service`, its frontmatter can include:

```yaml
kinds:
  - "[[Software]]"
  - "[[Service]]"
types:
  - "[[Product]]"
  - "[[Service Type]]"
```

A multi-Kind page can have only one resolved Type; `types` then contains that one link. Any singular `kind` or `type` property is removed when the corresponding plural relationship is written.

## When no update happens

Kind Model only processes pages it recognizes as a Type definition, Kind definition, or kinded page. If the active page has no recognized classification, the command returns without a notice. For a recognized page where it determines that no update is needed, Obsidian displays **No changes necessary for Update command**; after updates it displays **Updates completed**.
