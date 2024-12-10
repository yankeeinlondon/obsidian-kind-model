const RE = /(.+)|.*/;

export function strip_page_alias(page: string) {
  return page.startsWith("[[")
    ? `${page.replace(RE, "$1")}]]`
    : page.replace(RE, "$1");
}
