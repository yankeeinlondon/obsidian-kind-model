# Kinded pages

A **kinded page** is an ordinary note about an entity that belongs to one or more Kinds. A Kind names the entity class, such as `software`, `person`, or `book`. Kind Model usually identifies an entity from a classification tag whose first segment matches a Kind defined in the vault. The Kind definition note itself uses a `#kind/<name>` tag; entity notes use the Kind name as the tag's first segment.

Before classifying an entity, define its Kind in a note tagged `#kind/<name>`. For example, the `Software` Kind definition uses `#kind/software`. See [Kind definition pages](./kind-defn-page.md) and the [classification hierarchy](../classification-hierarchy.md) for how to define Kinds, Types, Categories, and Subcategories.

## Classify a page under one Kind

An entity tag can name just the Kind, or add a Category and Subcategory:

| Entity tag | Classification |
| --- | --- |
| `#software` | Software, without a Category |
| `#software/productivity` | Software in the `productivity` Category |
| `#software/productivity/ide` | Software in `productivity`, specifically in the `ide` Subcategory |

The category and subcategory names are tag segments. Their definition notes use explicit marker segments: `#software/category/productivity` and `#software/subcategory/productivity/ide`. Those definition notes let Kind Model link to readable Category and Subcategory pages; the `category` and `subcategory` marker words do not appear in an entity's tag.

For example, with a `Software` Kind, `Product` Type, `Productivity` Category, and `IDE` Subcategory defined, an entity note can start like this:

```md
---
status: active
---

#software/productivity/ide

Visual Studio Code is a code editor with IDE features.
```

Run Kind Model's **update this page** command on the open note. It adds links to the recognized classification pages. The YAML between the `---` lines is the note's frontmatter, where Obsidian and plugins expose page properties. If the `Software` Kind is associated with the `Product` Type, the frontmatter can become:

```yaml
type: "[[Product]]"
kind: "[[Software]]"
category: "[[Productivity]]"
subcategory: "[[IDE]]"
status: active
```

The tag remains the classification source; the frontmatter links make those relationships available as page properties. A missing Category or Subcategory definition does not prevent the command from suggesting a future-page link, but the command does not create the definition note. See the [Update command](../commands/update-command.md) for its behavior and limits.

## Classify a page under multiple Kinds

Put a classification tag for each Kind on the entity note. A page becomes multi-Kind when its tags identify more than one Kind. For example, if the vault defines `software` and `person` Kinds, this note belongs to both:

```md
---
status: active
---

#software/productivity/ide #person/author

An author who builds software tools.
```

After running **update this page**, the plugin uses plural `kinds` and `types` properties. Category and Subcategory properties are plural when multiple assignments resolve; one Subcategory remains singular:

```yaml
kinds:
  - "[[Software]]"
  - "[[Person]]"
types:
  - "[[Product]]"
  - "[[People]]"
categories:
  - "[[Productivity]]"
  - "[[Author]]"
subcategory: "[[IDE]]"
status: active
```

The Type links above are included when the two Kind definitions resolve to `Product` and `People`. A multi-Kind page can have one, several, or no resolved Type links; Kind Model writes the result to `types` and removes a singular `type` when it updates that property. It does not inherit a Type from the page's Category definitions when resolving a multi-Kind page. See [Types](../types.md) for Type assignment and inheritance rules.

## Supported classification shape

- Each entity tag uses a defined Kind as its first segment and can include at most one Category and one Subcategory: `#<kind>`, `#<kind>/<category>`, or `#<kind>/<category>/<subcategory>`.
- A Subcategory path includes its parent Category. Names occupy one tag segment; a slash starts another hierarchy level.
- A page can have multiple classification tags. Tags with different Kind roots make it multi-Kind; multiple category paths under the same Kind can add multiple Category assignments without adding another Kind.
- The plugin uses singular `kind` and `type` links for a single-Kind page, and plural `kinds` and `types` for a multi-Kind page. Category and Subcategory links likewise use singular or plural properties according to the number of resolved assignments.
- A direct `#type/<name>` tag can assign a Type to an entity. A single-Kind page can also inherit a Type from its Kind, then its Category if the Kind has none. Type inheritance from Categories is not applied to multi-Kind pages.

Kind Model does not treat arbitrary deeper tag paths as extra classification levels. Keep each Kind slug unique and use one segment for the Kind, Category, and Subcategory names. For further details, see [Category and Subcategory definition pages](./classification-page.md) and the [classification hierarchy](../classification-hierarchy.md).
