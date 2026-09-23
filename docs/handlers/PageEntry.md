# `PageEntry` handler

`PageEntry` renders a compact summary near the top of the note that contains the `km` code block. It can show the note's classification, a short description, an inline SVG icon, links to Wikipedia or a source repository, and a banner image.

Use it when a note represents an entity in your vault and you want its key metadata visible before the body text. It reads the current note's Dataview fields and frontmatter; it does not take a page reference as an argument.

## Add the handler

Put a `PageEntry()` call in a `km` code block below the note's H1 (or wherever the summary should appear):

````markdown
```km
PageEntry()
```
````

The call accepts no positional arguments. Its only option is `verbose`, an optional boolean. The current renderer accepts this option but does not use it, so `PageEntry()` and `PageEntry({ verbose: true })` render the same output. Unknown options and non-boolean `verbose` values are rejected.

## Frontmatter the handler reads

All frontmatter is optional. Add only the properties useful for the note. For classification properties, use Obsidian links to the relevant definition notes; Kind Model's **update this page** command can populate these links from recognized classification tags.

| Property | Accepted names or shape | How it is used |
| --- | --- | --- |
| Classification | `type`, `kind`, `category`, `categories`, `subcategory` | Resolved page links are shown as breadcrumbs in this order: Type > Kind > Category > Subcategory. `categories` can show multiple category links separated by `|`. |
| Description | First defined property among `desc`, `description`, `about`, `tagline`, `summary`; its value must be a string | A description shorter than 120 characters is used as the callout title. A description of 120 characters or more appears in the callout body. |
| Icon | First defined property among `icon`, `_icon`, `svgIcon`, `_svgIcon`; its value must be inline SVG markup | A valid inline SVG is used as the callout icon. If a callout renders for another reason and the selected icon value is invalid, the standard Markdown page icon is used. |
| Wikipedia | `wiki` or `wikipedia` | A valid Wikipedia URL can appear as a `Wikipedia` link in the title area when some other property causes a callout and no short description replaces the title. |
| Repository | First recognized repository URL among `repo`, `github`, `git`, `homepage`, `url`, `home` | A recognized URL can appear as a `Repo` link in the title area when some other property causes a callout and no short description replaces the title. |
| Banner | `_banner` as a URL; optional `_banner_aspect` as a CSS aspect ratio | A valid `_banner` URL renders a full-width, cropped image after the callout. The aspect ratio defaults to `32/12` if `_banner_aspect` is missing or invalid. |
| Related pages | `about`, `related`, `competitors`, or `partners` | Related links may appear beside the breadcrumbs when the note has no parent or child links. The current link collector checks aliases in order and stops at the first missing property, so `about` is the reliable property to use. |

The callout is rendered when the note has a valid inline SVG icon, a string description, or at least one resolved Type, Kind, Category, or Categories link. A subcategory by itself does not trigger the callout, though it appears in the breadcrumbs when another value causes the callout to render. A Wikipedia or repository URL by itself also does not trigger a callout. A banner is independent and can render even if there is no callout.

## Example

This note defines its classification and summary in YAML frontmatter, then places the entry beneath its title:

````markdown
---
type: "[[Product]]"
kind: "[[Software]]"
category: "[[Productivity]]"
subcategory: "[[IDE]]"
desc: "Visual Studio Code is a source-code editor from Microsoft for building and debugging applications, with support for extensions and a large ecosystem of development tools."
icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2 2h12v12H2z"/></svg>'
wiki: "https://en.wikipedia.org/wiki/Visual_Studio_Code"
repo: "https://github.com/microsoft/vscode"
_banner: "https://example.com/editor-banner.jpg"
_banner_aspect: "16/5"
---

# Visual Studio Code

```km
PageEntry()
```

Notes about the editor go here.
````

The resulting callout uses the SVG as its icon and the four classification links as breadcrumbs. Because this description is at least 120 characters long, the Wikipedia and repository links appear in the title area and the description appears in the callout body. The banner renders below the callout. Replace the example URLs with locations available to your vault and device.

## Display details

- Classification values should resolve to notes in the vault. Missing or unresolved links are omitted from the breadcrumb.
- The description and icon aliases use the first defined property. If that property's value has the wrong shape, later aliases are not tried.
- A description shorter than 120 characters replaces the title area, so Wikipedia and repository links are not shown in that case. Without a description, or when it is at least 120 characters long, valid Wikipedia and repository links appear in the title area. A long description is shown in the callout body with a final period added when needed.
- If the note has no classification links, the breadcrumb area says *no classification* when a callout is otherwise rendered.
- Related links are appended beside the breadcrumb only when a classification breadcrumb exists, related links are found, and no parent or child links are found. The handler checks `parent` before `parents`, `father`, `mother`, `belongs_to`, `member_of`, and `child_of`; it checks `child` before `children`, `son`, and `daughter`. The link collector stops at the first missing property in each list, so later aliases are only considered when all preceding properties are populated. Parent and child links are not rendered by this handler.
- If the note has none of the properties that trigger a callout, `PageEntry()` produces no callout. A valid banner can still appear on its own.

See [Kind Model handlers](../km-handlers.md) for the shared `km` code block conventions and [Classification hierarchy](../classification-hierarchy.md) for the meaning of Type, Kind, Category, and Subcategory.
