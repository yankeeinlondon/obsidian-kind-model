# Classification hierarchy

Kind Model organizes pages from a broad grouping to a more specific classification:

```text
Type > Kind > Category > Subcategory
```

For example, `Product > Software > Productivity > IDE` describes software that is a product, belongs to the productivity category, and is specifically an integrated development environment. A page does not need to use every level: a kinded page can have no category, one or more categories, and an optional subcategory.

## What each level means

| Level | Purpose | Example |
| --- | --- | --- |
| **Type** | Groups related kinds, or can be associated with a specific category when only part of a kind belongs in the group. | `Product` |
| **Kind** | Names the kind of entity represented by a page. A kind is defined by a note tagged `#kind/<name>`. | `Software` |
| **Category** | Groups pages of a kind by a broad attribute. | `Productivity` |
| **Subcategory** | Refines a category with a narrower classification. | `IDE` within `Productivity` |

Types are optional. A type is commonly associated with a kind definition, and kinded pages inherit that type when their metadata is updated. A type can also be associated with a category definition when only that category should belong to the type.

## Tag patterns

The tag on an entity page records its kind and any category levels. For a `Software` kind, these tags mean:

| Entity tag | Meaning |
| --- | --- |
| `#software` | This page is software, with no category specified. |
| `#software/productivity` | This page is software in the `Productivity` category. |
| `#software/productivity/ide` | This page is software in `Productivity`, specifically in its `IDE` subcategory. |

Tags on definition pages have explicit marker segments so Kind Model can tell them apart from entity classifications:

| Definition page tag | Defines |
| --- | --- |
| `#kind/software` | The `Software` kind. |
| `#type/product` | The `Product` type. |
| `#software/category/productivity` | The `Productivity` category for `Software`. |
| `#software/subcategory/productivity/ide` | The `IDE` subcategory under `Productivity` for `Software`. |

In particular, `#software/productivity` is used on an entity page, while `#software/category/productivity` identifies a category definition page. The same distinction applies to entity subcategory tags and subcategory definition tags.

## Worked example

Suppose the vault has a `Product` type and a `Software` kind. The `Software` kind definition can associate itself with the type like this:

```md
#kind/software #type/product
```

A note for an IDE such as Visual Studio Code can use the entity classification tag:

```md
#software/productivity/ide
```

The category and subcategory can each have their own definition notes:

```md
<!-- Productivity category definition -->
#software/category/productivity
```

```md
<!-- IDE subcategory definition -->
#software/subcategory/productivity/ide
```

The markers `category` and `subcategory` identify definition pages; they are not part of the category names used in entity tags. Kind Model reads the entity tag as the path through the hierarchy and can use the corresponding definition pages as navigable classification targets.

## Notes on the shape of the hierarchy

- Categories and subcategories are optional. A page tagged only `#software` is still a kinded page.
- A page can have multiple kinds, and the plugin supports multiple category assignments. The four-level chain is the common way to describe one classification path.
- A type is a grouping relationship. It can connect to a kind or to a selected category, so the hierarchy can represent the useful grouping without requiring every page to carry a `#type/...` tag.
