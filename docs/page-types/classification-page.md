# Category and subcategory definition pages

Kind Model uses **category definition pages** and **subcategory definition pages** to name the available classifications under a Kind and provide notes that entities can link to. The tag on the definition page encodes its place in the hierarchy. The note title is for readers; Kind Model looks up the definition by tag.

This page assumes the vault already has a Kind definition. For example, a note tagged `#kind/software` defines the `software` Kind. Kind Model discovers Kind tags from those definition tags, so use the exact Kind tag name as the first segment of category and subcategory tags.

## Definition tags and entity tags

The marker `category` or `subcategory` appears in a definition tag. An entity's tag leaves that marker out:

| Page | Tag | Meaning |
| --- | --- | --- |
| Kind definition | `#kind/software` | Defines the `software` Kind. |
| Category definition | `#software/category/productivity` | Defines `productivity` as a category of `software`. |
| Subcategory definition | `#software/subcategory/productivity/ide` | Defines `ide` as a subcategory of `productivity` in `software`. |
| Entity classified in a category | `#software/productivity` | This entity is `software` in the `productivity` category. |
| Entity classified in a subcategory | `#software/productivity/ide` | This entity is `software` in `productivity`, specifically `ide`. |

The `/` characters separate hierarchy segments. Keep each Kind, category, and subcategory name to one tag segment; a slash in a name would be read as another level. A subcategory always names its parent category, so the definition tag has both category and subcategory segments.

## Create definition notes

Use one definition note for each category or subcategory you want to describe and link to. The tag is the identifying requirement; no `role` frontmatter property is needed. Add a clear title and explanatory text so the note is useful when opened:

```md
# Productivity

Software used to organize work, notes, and personal tasks.

#software/category/productivity
```

```md
# IDE

An integrated development environment for editing and debugging code.

#software/subcategory/productivity/ide
```

The subcategory tag names its parent (`productivity`) directly. Keep the subcategory definition under the same Kind as that category.

## Classify an entity and add frontmatter links

Put the entity tag on the note you want to classify. With the definition notes above in the vault, a Visual Studio Code note could be:

```md
---
status: active
---

#software/productivity/ide

Visual Studio Code is a code editor with IDE features.
```

Run Kind Model's **update this page** command in Obsidian to add links to the resolved definitions. For this single-Kind example, the classification fields are:

```yaml
kind: "[[Software]]"
category: "[[Productivity]]"
subcategory: "[[IDE]]"
```

The entity tag expresses the classification; frontmatter links make the Kind, Category, and Subcategory available as page properties. If a category or subcategory definition note is missing, Update can write a link to a suggested future page, but it does not create the note or tag for you. See [the Update command](../commands/update-command.md) for its other frontmatter behavior.

## Supported shape and Type associations

The classification path has fixed levels: **Type > Kind > Category > Subcategory**. Category and subcategory are optional, and a subcategory requires a category. The plugin supports multiple Kinds on a page; each tag path still uses one Kind, at most one category, and at most one subcategory. It does not interpret arbitrary deeper tag paths as additional classification levels. See [the classification hierarchy](../classification-hierarchy.md) for the overall model.

A Category definition can also carry a Type tag when that Category belongs to a Type:

```md
# AI software

#software/category/ai #type/ai
```

Running **update this page** on the Category definition can write its `type` link. A single-Kind page tagged in that Category can inherit the Category's Type when its Kind has no Type link. A Kind's Type takes precedence, and a page's own Type link or `#type/...` tag takes precedence over both. Pages do not inherit a Type from a Subcategory definition; assign that Type to the Kind or Category when it should flow to their pages. See [Types](../types.md) for Type resolution details.
