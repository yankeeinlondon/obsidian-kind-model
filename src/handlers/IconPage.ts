import { getFrontmatterMetadata } from "~/api";
import { createHandler } from "./createHandler";

export const IconPage = createHandler("IconPage")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { plugin: p, page } = evt;

    const icon = (i: string & keyof typeof page.current) =>
      `<span class="icon" style="display: flex; max-width: 32px; max-height: 32px;">${page.current[i]}</span>`;

    const meta = getFrontmatterMetadata(p)(page);

    p.info("Icon Props", { meta });

    page.render(`## **${page.current.file.name}** is an Icon Page`);
    page.render(
      `> _To define one of the icons here to be used as "icon" for another page you'll prefix the name with #icon/link._`,
    );

    page.table(
      ["name", "icon"],
      meta.svg_inline?.map(i => [i, icon(i)]),
    );
  });
