# Type definition pages

A **Type definition page** names a Type: a group that can connect related Kinds or selected Categories within different Kinds. For example, a `Product` Type could group the `Software` and `Hardware` Kinds, while an `AI` Type could group only the AI Categories of several Kinds.

Kind Model identifies a Type by its tag. The page title and body are for people reading the note; they do not determine its identity.

## Define a Type

Create one Markdown page for each Type and give it a tag in the form `#type/<name>`. Use a distinct tag for each Type, and keep the Type page separate from Kind and Category definition pages.

For example, `Product.md` can contain:

```md
# Product

Software, devices, and services that I use or evaluate.

#type/product
```

The `#type/product` tag is required. The title does not have to match `product`, and the Type page needs no `type` frontmatter property. Create the Type page itself; tagging another page does not create it automatically.

## Assign a Type to a whole Kind

To associate every page in a Kind with a Type, add the Type tag to that Kind's definition page. For example, a Software Kind assigned to Product can look like this:

```md
# Software

#kind/software #type/product
```

The Type tag makes the association discoverable by Type queries. Run Kind Model's **update this page** command on the Kind definition to write the resolved Type page as a `type` frontmatter link:

```yaml
type: "[[Product]]"
```

The `type` link is the relationship used when Kind Model resolves a page's Type. You can add it yourself instead, but retain the `#type/product` tag if you want the Type page's `Children()` query to list this Kind definition. If both the link and tag are present, a Kind definition's tag is used by Update to set or correct the link.

Pages classified under that Kind inherit its Type when their own metadata does not assign a Type. See [Kind definition pages](./kind-defn-page.md) for the Kind tag pattern.

## Assign a Type to selected Categories

Use a Category definition when only some pages in a Kind belong to a Type. Put the Type tag on the Category definition page. For example, these notes define AI Categories for two different Kinds and associate both with the same `AI` Type:

```md
<!-- Types/AI.md -->
# Artificial intelligence

#type/ai
```

```md
<!-- Categories/Software AI.md -->
# Software AI

#software/category/ai #type/ai
```

```md
<!-- Categories/Concept AI.md -->
# AI concepts

#concept/category/ai #type/ai
```

Run **update this page** on each Category definition to write its `type` link. An ordinary page classified with `#software/ai` or `#concept/ai` can then inherit the Type through its Category, as long as the Kind definition has no Type link. A Kind-level Type takes precedence over a Category-level Type. A page's own `type` link or `#type/...` tag takes precedence over both.

The tags on the definitions and entities have different forms: `#software/category/ai` defines the Category, while `#software/ai` classifies an entity in that Category. See [Category and subcategory definition pages](./classification-page.md) for more on those patterns.

## Resolve Type frontmatter

For a page with one Kind, Kind Model resolves its `type` in this order:

1. The page's own `type` frontmatter link.
2. A `#type/...` tag on the page.
3. The Type link on the Kind definition.
4. The Type link on the Category definition, when the page has a Category and its Kind has no Type link.

Run **update this page** on an ordinary page to write its resolved `type` link when the property is missing. An existing `type` link on an ordinary page is left as-is. For a page with multiple Kinds, Kind Model uses `types` (an array of Type links); Update writes that property and removes a singular `type` property.

For example, if Software and Consulting are Kinds assigned to Product and Service, a page with both Kinds can have:

```yaml
kinds:
  - "[[Software]]"
  - "[[Consulting]]"
types:
  - "[[Product]]"
  - "[[Service]]"
```

The Type links resolve only when a matching Type definition page exists. Kind Model does not create a missing Type page or infer one from a page title.

## List a Type's definitions

Add a `Children()` block to a Type definition page to display the Kind and Category definitions associated with it:

````md
```km
Children()
```
````

For a Type tagged `#type/ai`, the query finds pages that carry that tag and are recognized as Kind definition pages or Category definition pages. For example, with the definitions above and a Kind definition tagged `#kind/research #type/ai`, the table lists the Research Kind and the Software AI and AI concepts Category definitions. It does not list every ordinary page that inherits the Type; those pages do not need their own `#type/ai` tag. A Type association stored only as a frontmatter link also does not make a definition appear in this query.

`Children()` on a Type page does not list Subcategory definitions. Kind Model resolves page Types through a Kind or Category, not through a Subcategory definition. Use a Kind or Category association when its pages should inherit a Type.

## Related documentation

- [Types and Type resolution](../types.md)
- [Classification hierarchy](../classification-hierarchy.md)
- [Update command](../commands/update-command.md)
