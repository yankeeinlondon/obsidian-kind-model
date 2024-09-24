import { Scalar, Tag, parse, transform} from "@markdoc/markdoc";
import { HeadingLevel, HeadingTag } from "types/frontmatter";
import KindModelPlugin from "~main";

const isTag = <T extends Tag | Scalar>(v: T): v is T & Tag<string,Record<any,any>> => {
  return typeof v === "object" ? true : false
}

/**
 * Reduce the raw content of a page to an array of `HeadingTag`'s
 * at a a specified level.
 * 
 * Key properties are:
 * 
 * - `content`: string representing string "as is" of H tag
 * - `name`: same as _content_ but all HTML tags extracted
 * - `link`: is a [Dataview]() link to the tag level which uses `name` as an alias to `content`
 */
export const getHeadingLevel = <
  TLevel extends HeadingLevel
>(
  /** the full file path to the file including filename and ext */
  file: string,
  content: string, 
  level: TLevel, 
  plugin: KindModelPlugin
): HeadingTag<TLevel>[] => {
  const root = transform(parse(content || ""));
  let headings: HeadingTag<TLevel>[] = [];
  if (isTag(root)) {
    const nodes = root.children;
  
    headings = nodes.filter(n => isTag(n) && n.name === `h${level}`).map((h: Tag) => {
      const content = h.children.join("\n");
      const name = content.replaceAll(/<(.+)>/gs, "").trim();
  
      return {
        level,
        name,
        content,
        link: plugin.dv.fileLink(`${file}#${content}`, false, name),
        attributes: h.attributes,
      } as HeadingTag<TLevel>
    });

    plugin.debug( 
      `H${level} tags`, 
      () => `${nodes.length} total nodes, ${nodes.filter(i => isTag(i)).length} are tags, the rest are scalar items.`,
      `Of these tags, ${headings.length} are H${level} tags.`,
      headings
    );

  } else {
    plugin.error(`The page content passed in did not result in a renderable tag node!`);
  }

  return headings;
}
