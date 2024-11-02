import { TFile } from "obsidian";
import KindModelPlugin from "~/main";

/**
 * higher order function which interacts with **Obsidian** to remove
 * a property from a page's frontmatter.
 */
export const removeFmKey = (p: KindModelPlugin) => 
/**
 * A higher order function which interacts with **Obsidian** to remove
 * a property from a page's frontmatter.
 */
(
	path: string
) => 	
/**
 *  Removes the specified `key` from the current page.
 */	
async (key: string) => {
	const abstractFile = p.app.vault.getAbstractFileByPath(path);
	
	if (abstractFile instanceof TFile) {
		const file = abstractFile as TFile;
		try {
			await p.app.fileManager.processFrontMatter(file, (frontmatter) => {
				delete frontmatter[key];
			});

			p.debug(`Frontmatter key '${key}' removed successfully from file: ${path}`);
		} catch (error) {
			p.error('Error removing frontmatter key:', error);
		}
	} else {
		p.error(`File "${path}" not found or is a folder.`);
	}
}

/**
 * A higher order function which interacts with **Obsidian** to set the 
 * value of one of the Frontmatter's properties
 */
export const setFmKey = (p: KindModelPlugin) => (
	path: string
) => 
/**
 * Sets the value of the specified **key** in the _frontmatter_ properties.
 */	
async (key: string, value: any) => {
	const abstractFile = p.app.vault.getAbstractFileByPath(path);

	if (abstractFile instanceof TFile) {
		const file = abstractFile as TFile;

		try {
			await p.app.fileManager.processFrontMatter(file, (frontmatter) => {
				frontmatter[key] = value;
			});

			p.debug(`Frontmatter updated successfully for file: ${path}`);
		} catch (error) {
			p.error(`Error updating frontmatter [${key}] for file "${path}":`, error);
		}
	} else {
		console.error(`File "${path}" not found or is a folder.`);
	}
}

type FmReturns<T extends string | undefined> = T extends string
? {
	setFmKey: ReturnType<ReturnType<typeof setFmKey>>;
	removeFmKey: ReturnType<ReturnType<typeof removeFmKey>>;
}
: {
	setFmKey: ReturnType<typeof setFmKey>;
	removeFmKey: ReturnType<typeof removeFmKey>;
}


export const fmApi = <TPath extends string | undefined>(
	p: KindModelPlugin, 
	path?: TPath
): FmReturns<TPath> => (
	path
	? {
	/** set **key** on current page's _frontmatter_. */
	setFmKey: setFmKey(p)(path),
	/** remove **key** from current page's _frontmatter_. */
	removeFmKey: removeFmKey(p)(path)
	}
	: ({
		setFmKey: setFmKey(p),
		removeFmKey: removeFmKey(p),
	})
) as FmReturns<TPath>
