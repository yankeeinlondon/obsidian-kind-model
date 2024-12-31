# Types

**Types** are defined to create a _grouping_ of related **Kinds**.

## Characteristics

### Defining a Type

- a **Type** page (also referred to as a _type definition page_) is defined by a page which uses the tag: 

	```md
	#type/[NAME]
	```

### Expressing Membership to a Type

#### Kind Membership

- the most obvious means to associate to a **Type** -- and the recommended way unless you like living on the edge -- is to associate at the `Kind` level.
  - You can can define a kind's membership on a [Kind Definition Page](./kind-defn-page.md) by adding the Kind tag's identifier along with the type's tag identifer:

    ```md
    #kind/software #type/product
    ```

  - when a [kind definition page](./kind-defn-page.md) is _updated_ ([command](./command-update.md)) then it will ensure that the `kind` and `type` properties are both set.
  - when you associate a **Type** to a **Kind** then every [kinded page](./kinded-page.md) will _inherit_ this **Type** as well. 
    - Not as a "tagged representation", but rather ...
    - the property `type` will be populated when running the [update command](./command-update.md) on these pages allowing you to jump to the top of the [classification stack](./classification.md).

#### Associating to a Category

- In cases where you want only one (or a few) [_categories_](./categories.md) of a **Kind** to a Type rather than the whole Kind, you can now associate to a [category page](./categories.md)
- Structurally I suspect the use-cases where you'll want to do this will arise in situations where the category dimensions of one Kind are orthogonal to another's
- Here's a simple example of how you'd tag this relationship:

  ```md
  #concept/category/ai #type/ai
  ```

> this expresses that the given page is a [Category page](./categories.md) for  `concept` (a Kind).

#### What about Subcategories?

- Ok now you're pushing boundaries. :)
- In a few places in code I have added some _future_ support to make this work but for now you should consider this not supported at the moment

#### Kinded Pages

- As was stated above, a [kinded-page](./kinded-page.md) should never add the `#type/[NAME]` tags to their pages. 
- Instead, the [kinded page](./kinded-page.md) _inherits_ it's **Type** from it's **Kind** (most commonly) or occationally it's **Category**.
- When you run the [update command](./command-update.md) the `type` property will be set via this inheritance
- **The multi-Kinded page**
  - Unlike [Kind Definition pages](./kind-defn-page.md), a [kinded page](./kinded-page.md) _can_ have multiple Kind's associated with it.
  - I'd recommend **not** doing this to start but when you find _you need to_ then _you're allowed to_. You're welcome.
  - That said, as soon as you have more than one kind, the `type` property (which connotates a singular entity) no longer is used; in it's place we will set the `types` property with a list of `Kind` links
    - **Note:** if you have multiple kind's but only one of your Kind definitions has a Type then you'll find that you have the `types` property set but with only a single entity. That is expected behavior.


## Possible Examples

### Using Products as an Example

In my own vaults I tend use `product` as a **Type**. Underneath that I have the following `Kind`'s:

- `software`
- `hardware`
- `service`
- `purchase`

This allows for each of the _kinds_ to be further segmented using [categories](./categories.md) and [subcategories](./subcategories.md). Of course there are lots of ways you can model the world so please view this as just a _possible_ example.

Overall I don't use **Type**'s a ton because `Kind` provides me enough flexibility most of the time. Another example of where I'm experimenting with **Type** is with `AI`:

### Using AI as an Example

- I have a **Type** who's tag is `ai`
- And for kind's I have:
  - `#kind/ai-model #type/ai` - a kind to hold all model types
  - `#concept/ai #type/ai` - I have Kind called `concept` but I only want the concepts related to AI to be a part of the type
  - `#standard/ai #type/ai` - the same idea applies to standards
  - `#software/ai #type/ai` - and again to software

