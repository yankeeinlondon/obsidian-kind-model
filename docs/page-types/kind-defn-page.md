# Kind Definition Page

A **Kind Definition Page** is a Markdown note that names a class of entity in your vault, such as software, books, or people. Kind Model identifies the note by its tag; the filename and page title can be chosen for readability. A Kind can optionally belong to a [Type](../types.md), and ordinary pages use its tag as the first part of their classification. See the [classification hierarchy](../classification-hierarchy.md) for how Categories and Subcategories fit in.

## Define a Kind

Create a note and give it one `#kind/<slug>` tag. Use a unique, single-segment slug: the plugin's current lookup takes the first segment after `#kind/`, so a slash inside the slug can make the Kind resolve incorrectly. The source does not validate that Kind tags are unique, so avoid defining the same slug on multiple notes.

For example, a note named `Software.md` can contain:

```md
# Software

Programs and services that run on a computer.

#kind/software
```

The tag makes this a Kind definition. There is no required frontmatter schema or special filename. The plugin scans vault tags for `#kind/...` and uses the tagged note as the Kind definition.

## Associate a Type

Add a `#type/<slug>` tag to the Kind definition to associate the whole Kind with a Type. For example, a `Product` Type and `Software` Kind can be linked like this:

```md
#kind/software #type/product
```

The [Update command](../commands/update-command.md) can write the matching Type page as a `type` frontmatter link on the definition note. The page API prefers an existing `type` link when resolving a Kind's Type, so keep the link and tag consistent if both are present. See [Types](../types.md) for how that association flows to kinded pages.

## How kinded pages refer to the Kind

An ordinary page usually records the Kind slug and any category levels in its classification tag. For example, a note about an IDE can use:

```md
---
kind: "[[Software]]"
type: "[[Product]]"
category: "[[Productivity]]"
subcategory: "[[IDE]]"
---

#software/productivity/ide
```

The tag encodes the classification path; frontmatter links point to the corresponding definition pages. Running **update this page** can fill the `kind`, `type`, `category`, and `subcategory` links when Kind Model can resolve their definition pages. For a page assigned to multiple Kinds, the plugin uses `kinds` and `types` instead of the singular properties. See [Kinded Page](./kinded-page.md) and the [Update command](../commands/update-command.md) for the details.

## Direct relationships and current limits

Classification links such as `kind`, `category`, and `type` are handled by Kind Model. A direct link between two entities can also be written as ordinary frontmatter, for example:

```yaml
parent: "[[Ada Lovelace]]"
```

That is a normal Obsidian link; Kind Model does not currently generate or validate direct relationship properties from a Kind definition. The source declares frontmatter shapes such as `__reln_0_1: ["parent::Person"]` and metric declarations such as `__metric_opt`, but the runtime has no reader for these fields. Treat them as unused declarations, not active configuration.

When a generated future classification page name identifies its Kind (for example, `"Productivity" as Category for "software"`), the runtime uses that Kind's `__default_dir` as the link's directory. If the property is absent, it uses the current note's directory. This affects the generated link only; it does not move files or enforce a folder layout. Other similarly named fields in the TypeScript interfaces should not be assumed to have runtime behavior unless a feature explicitly documents them.
