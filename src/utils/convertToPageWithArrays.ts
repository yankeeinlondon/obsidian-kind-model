import type { DvFileProperties, DvPage, DvPageWithArray, Link } from "../types/dataview_types";

/**
 * **convertToPageWithArrays**(obj)
 *
 * Converts either a `DvFileProperty` -- or an object with a file property
 * which is a `DvFileProperty` -- to modify any `DataArray<T>` arrays to
 * regular JS arrays.
 */
export function convertToPageWithArrays<
  T extends DvPage | null,
>(obj: T): T extends null ? null : DvPageWithArray {
  if (obj === null) {
    return null as T extends null ? null : DvPageWithArray;
  }

  const root: DvFileProperties = obj.file;

  const file = {
    ...(obj?.file ? obj.file : obj),
    aliases: Array.from(root.aliases.values || []) as string[],
    inlinks: Array.from(root.inlinks.values || []) as Link[],
    outlinks: Array.from(root.outlinks.values || []) as Link[],
    etags: Array.from(root.etags.values || []) as string[],
    tags: Array.from(root.tags.values || []) as string[],
    tasks: Array.from(root.tasks.values || []),
    lists: Array.from(root.lists.values || []),
  };

  return { ...obj, file } as unknown as T extends null ? null : DvPageWithArray;
}
