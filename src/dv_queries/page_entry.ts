import { 
	isCssAspectRatio, 
	isInlineSvg, 
	isString, 
	isUrl 
} from "inferred-types";
import KindModelPlugin from "../main";
import { Component, MarkdownPostProcessorContext } from "obsidian";

/**
 * Renders the entry or beginning of a page (right under H1)
 */
export const page_entry = (p: KindModelPlugin) => async (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => {
	const dv = p.api.dv_page(source, container, component, filePath);
	const {fmt} = dv;


	const banner_img = isUrl(dv.current["_banner"]) ? dv.current["_banner"] : undefined ;
	const banner_aspect = isCssAspectRatio(dv.current["_banner_aspect"])
		? dv.current["_banner_aspect"]
		: "32/12";

	const hasBanner = isUrl(banner_img);

	let [_p1, icon] = dv.get_prop(dv.current, "icon","_icon","svgIcon", "_svgIcon");
	const hasIcon = isInlineSvg(icon);

	let [_p2, desc] = dv.get_prop(dv.current, "desc","description","about","tagline", "summary");
	const hasDesc = isString(desc);

	if(hasDesc) {
		await fmt.callout("example", desc, {
			style: {
				mt: "0.35rem",
				mb: "1rem"
			},
			icon: hasIcon ? icon : undefined
		});
	} else if(hasIcon) {
		const msg = `${dv.createFileLink(dv.current.kind)} > ${dv.createFileLink(dv.current.category)}`
		await fmt.callout("example", msg, {
			style: {
				mt: "0.35rem",
				mb: "1rem"
			},
			icon
		});
	}

	if(hasBanner) {
		dv.renderValue(`<img src="${banner_img}" style="width:100%;aspect-ratio:${banner_aspect}; object-fit: cover"> `)
	}

}

