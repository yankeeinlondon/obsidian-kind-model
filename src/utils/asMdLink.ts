import { ensureTrailing, retainUntil, stripBefore, stripLeading, type IsArray } from "inferred-types";
import { dirname, join } from "pathe";
import type KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { isDvPage, isFuturePage } from "~/type-guards";
import type { FuturePage, PageReference } from "~/types";

/**
 * Creates a MD page link to a "future page", where:
 * 
 * - the path will include a directory plus filename
 * - the filename comes from the `FuturePage`
 * - the path is calculated by using the default for the
 * "kind" of the page if this can be deduced
 * - or will use the current page's directory otherwise
 * 
 * The important thing is that the link have a fully qualified path
 * so that if it's name is _renamed_ in the future (which is likely)
 * then pages linking to it will automatically update.
 */
function createFuturePageLink(p: KindModelPlugin) {
	return (fp: FuturePage) => {
		const filename = fp.file.name;
		const o = p.api.obsidian;

		let kind: string | undefined = undefined;
		let category: string | undefined = undefined;
		let subcategory: string | undefined = undefined;
	
		if(filename.includes(`for "`)) {
			kind = retainUntil(stripBefore(filename, `for "`), `"`);
		}
	
		if(filename.includes(`" as Category for`)) {
			category = retainUntil(stripLeading(filename, `"`), `"`);
		}
	
		if(filename.includes(`" as Subcategory of the "`)) {
			subcategory = retainUntil(stripLeading(filename, `"`), `"`);
			category = retainUntil(stripBefore(filename, `as Subcategory of the "`), `"`)
		}

		const kindLookup = kind ? p.kindTagLookup.get(kind) : undefined;

		const kindDir = kindLookup
			? kindLookup.fm.__default_dir
			: undefined;
		const currentDir = dirname(o.getCurrentFile().path);
		const dir = kindDir || currentDir;

		const path = join(dir, ensureTrailing(filename, ".md"));
		p.info(`future page: ${path}`, {path, filename})

		return `[[${path}|${filename}]]`

	}
}


export function asMdLink(p: KindModelPlugin) {
  return <
    T extends PageReference | PageReference[],
  >(
    ref: T,
  ): IsArray<T> extends true ? string[] : string => {
	const o = p.api.obsidian;
	/** the parent file */
	const parent = o.getCurrentFile();

    if (Array.isArray(ref)) {
      const links = ref.map(
        i => isDvPage(i)
          ? `[[${i.file.path}|${i.file.name}]]`
          : isFuturePage(i)
            ? createFuturePageLink(p)(i)
            : String(i),
      );

      return links as IsArray<T> extends true ? string[] : string;
    }

    const page = getPage(p)(ref);
    return (
      isDvPage(page)
        ? `[[${page.file.path}|${page.file.name}]]`
        : isFuturePage(ref)
          ? createFuturePageLink(p)(ref)
          : String(ref)
    ) as IsArray<T> extends true ? string[] : string;
  };
}
