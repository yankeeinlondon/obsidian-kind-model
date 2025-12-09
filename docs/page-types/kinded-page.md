# Kinded Page

A page which is defined by a [Kind Definition Page](./kind-defn-page.md) but not the Kind definition itself.

## Example

- Imagine you have a Kind called `software`
  - a _category_ of software called `audio`
  - and a _subcategory_ of the **audio** category called `player`

I you defined a page with the tag `#software/audio/player` you would be expressing that this page fits into that Kind as well as the Category and Subcategory. When you execute the [update command](./command-update.md) then these properties will automatically be filled in for you.
