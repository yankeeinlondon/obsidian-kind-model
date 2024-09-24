import { 
	TypedFunction, 
	isArray, 
	isGithubRepoUrl, 
	isObject, 
	isString, 
	isUrl, 
	isYouTubeCreatorUrl, 
	isYouTubeVideoUrl 
} from "inferred-types";
import { TFile } from "obsidian";
import
	Markdoc, 
	{ 
		Node, 
		RenderableTreeNode
} from "@markdoc/markdoc";

import KindModelPlugin from "~/main";
import { DvPage, Link } from "~/types/dataview_types";
import { ExternalLink, PagePath, PropertyLink, Traversable } from "~/types/general";
import { Frontmatter } from "~/types/frontmatter";
import { splitContent } from "~/utils/splitContent";
import { PageBlock } from "~/types/settings_types";
import { isDvPage, isFileLink, isTFile } from "~/type-guards";

export type PageContent = {
	/**
	 * the filepath to the file in the vault 
	 */
	filepath: string;
	/**
	 * The raw yaml in file (should it exist)
	 */
	yaml: string | undefined;

	/**
	 * the raw content, including any possible YAML along
	 * with other markdown content.
	 */
	content: string;

	/**
	 * The non-yaml raw content
	 */
	body: string;


	/**
	 * Any non-yaml content that exists above the `H1`
	 * tag (this can only exist _if_ there _is_ an H1 tag
	 * on the given page)
	 */
	preH1: undefined | string;

	/** 
	 * The `H1` content on the page (if defined)
	 */
	h1: string | undefined;

	/**
	 * **postH1**
	 * 
	 * - All non-yaml/frontmatter content on the page _after_ the `H1` tag 
	 * should an **H1** exist
	 * - all non-yaml/frontmatter content (e.g., identical to `body`) if 
	 * no `H1` tag found on page
	 */
	postH1: string;

	/**
	 * The DvPage representation of the page with all metadata
	 */
	page: DvPage;

	/**
	 * An array of content blocks which are segmented by `H2` elements.
	 * 
	 * **Note:** because we are _splitting_ on `H2` the first block is likely to
	 * be "anonymous" in name and would in that case represent any `postH1` content
	 * prior to the first identified **H2**.
	 */
	blocks: PageBlock[];

	/**
	 * The AST of the markdown as an HTML Node.
	 */
	ast: Node;
	/**
	 * A renderable tree node as provided by 
	 * [Markdoc]()
	 */
	renderableTree(): RenderableTreeNode

	/**
	 * gets links to sources outside the vault:
	 * 
	 * 1. `ExternalLink[]` - links in page content (which may also be in FM)
	 * 2. `PropertyLink[]` - links found in FM with the property they were 
	 * found in
	 */
	externalLinks(): [ ExternalLink[], PropertyLink[] ]

	/**
	 * gets an array of "outlinks" on the page to other pages
	 * within the vault
	 */
	internalLinks(): Link[]
}

/**
 * 
 * 
 */
export function traverse <
	T extends Traversable,
	CB extends ((node: T) => unknown)
>(
	tree: T, 
	cb: CB & TypedFunction
) {
	if (isObject(tree) && "children" in tree && isArray(tree.children)) {
		// recurse
		for (let child of tree.children) {
			if (isObject(child) && child) {
				let node = {...child, parent: tree} as Traversable
				traverse(node, cb)
			} 
		}
	}

	cb(tree)
}

/**
 * Traversal callback to extract links out of a page
 */
export const find_links = <P extends DvPage>(
	links: ExternalLink[], 
	fm_links: PropertyLink[],
	page: P
) => <T extends Traversable>(t: T) => {
	if (isObject(t) && isUrl(t?.attributes?.src)) [
		links.push({
			url: t.attributes.src,
			title: t.attributes?.alt || page.file.name,
			in_content: true,
			in_frontmatter: fm_links.map(i => i.url).includes(t.attributes.src),
			tagName: t.name,
			domain: isYouTubeCreatorUrl(t.attributes.src)
				? "youtube-creator"
				: isYouTubeVideoUrl(t.attributes.src)
				? "youtube-video"
				: isGithubRepoUrl(t.attributes.src)
				? "github-repo"
				: undefined
		})
	]

	return links
}

function linksInFrontmatter(
	fm: Frontmatter
) {
	let links: PropertyLink[] = []
	Object.keys(fm).forEach(k => {
		const prop = fm[k];

		if (isArray(prop)) {
			prop.forEach(p => {
				if (isUrl(p)) {
					links.push({ url: p, property: k})
				}
			})
		} else {
			if (isUrl(prop)) {
				links.push({ url: prop, property: k})
			}
		}
	})

	return links
}

/**
 * **pageContent**`(ref)`
 * 
 * Given a page reference of some sort, this function will load
 * markdown content and provide useful metadata alongside it.
 */
export const pageContent = (p: KindModelPlugin) => 
async <T extends TFile | Link | PagePath | DvPage>(ref: T): Promise<undefined | PageContent> => {
	const path = isFileLink(ref)
		? ref.path
		: isTFile(ref)
		? ref.path
		: isString(ref)
		? ref
		: isDvPage(ref)
		? ref.file.path
		: undefined;
	
	if (!path) {
		p.error("invalid path reference sent into pageContent()", ref)
		return undefined
	}

	const content = await p.dv.io.load(path);
	
	if (!content) {
		p.error(`the path passed to pageContent(${path}) was not a valid file in the vault`)
		return undefined
	}
	p.debug({[`content [${typeof content}]`]: content})
	
	const {yaml,body,blocks,h1,preH1,postH1} = splitContent(content);
	const ast: Node = Markdoc.parse(content);
	const renderableTree =() => {
		const result = Markdoc.transform(ast);
		return isString(result) 
			? JSON.parse(result)
			: result
	}

	const page = isDvPage(ref)
		? ref
		: (p.dv.page(path) as DvPage);

	return {
		filepath: path,
		content,
		yaml,
		body,
		h1,
		preH1,
		postH1,
		blocks,
		ast,
		page,
		renderableTree,
		externalLinks: () => {
			let links: ExternalLink[] = [];
			let tree = renderableTree();
			let fm_links = linksInFrontmatter(page.file.frontmatter);
			
			traverse(tree, find_links(links, fm_links, page));

			return [links, fm_links]
		},

		internalLinks: () => {
			return isDvPage(ref)
				? Array.from(ref.file.outlinks) as Link[]
				: Array.from((p.dv.page(path) as DvPage).file.outlinks) as Link[]
		}
	}
}
