import { Stat,  Vault } from "obsidian";

export interface TFile extends TAbstractFile {
	/** file `Stat` metadata */
	stat: Stat;

	/** the file extension */
	extension: string;

	/** whether file is being saved  */
	saving: boolean;

	/**
	 * whether the file was deleted or not
	 */
	deleted: boolean;

}

export interface TFolder extends TAbstractFile {
    /**
     * files in the directory
     */
    children: TAbstractFile[];

    /**
     * is the root of the vault
     */
    isRoot(): boolean;
}



/**
 * This can be either a `TFile` or a `TFolder`.
 */
export interface TAbstractFile {
	/**
	 * The name including file extension
	 */
	name: string;

    /**
     * @public
     */
    vault: Vault;
    /**
     * the full path to the file
     */
    path: string;
    /**
     * the name without the file extension
     */
    basename: string;

	/**
     * the parent folder
     */
	parent: TFolder | null;

}
