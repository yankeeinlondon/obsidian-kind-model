import { MetricCategory, Uom } from "inferred-types";

/**
 * Defines a relationship between a FM property and a `Kind`.
 * 
 * - `{{property}}::{{Kind}}`
 */
export type FmRelationship = `${string}::${string}`;

/**
 * Associates a Frontmatter property as being a Metric:
 * 
 * - `{{property}}::{{Metric Category}}::{{Default UOM}}`
 */
export type FmMetric<
	T extends MetricCategory = MetricCategory
> = `${string}::${T}::${Uom<T>}`;


/**
 * The frontmatter properties on a Kind definition page which will
 * 
 */
export interface KindDefinitionProps {
	// LAYOUT and STYLE

	__sections?: string[];
	__exclude_from_backlinks?: string[];

	__icon?: string;

	// DEFAULT DIRS

	/**
	 * the default directory for page which are _kinded_ this Kind.
	 * 
	 * - this will also provide a default for category and subcategory pages
	 * if their respective defaults aren't set independently.
	 */
	__default_dir?: string;

	/**
	 * the default directory for **category** pages for this Kind.
	 * 
	 * - this will provide the default for **subcategory** pages too
	 * if the `__default_dir_subcategory` property isn't set too.
	 */
	__default_dir_category?: string;
	/**
	 * the default directory for **subcategory** pages for this Kind.
	 */
	__default_dir_subcategory?: string;

	// FM PROPs

	/** 
	 * Express properties for this Kind which should have a 0:1 cardinality.
	 * 
	 * - for example `parent::Person` would indicate that:
	 * 		- the `parent` property on this Kind has a singular relationship (aka, it will be undefined or have an MD link reference)
	 * 		- if a page is referenced 
	 */
	__reln_0_1?: FmRelationship[];
	__reln_1_1?: FmRelationship[];
	__reln_0_M?: FmRelationship[];
	__reln_1_M?: FmRelationship[];


	/** 
	 * Metric properties which are treated as "optional"
	 */
	__metric_opt?: FmMetric[];
	/**
	 * Metric properties which are treaded as "required"
	 */
	__metric_req?: FmMetric[];


	// OTHERS

	/** 
	 * a kind can define itself as **boss** which put's it a higher priority
	 * than other kinds which a _kinded_ page may be a member of alongside this
	 * one. 
	 * 
	 * This can help produce more consistent results for things like the 
	 * "default directory" on kinded pages with multiple kinds.
	*/
	__boss?: boolean;
}

/**
 * The full set of _expected_ frontmatter properties for a
 * Kind definition page; while also allowing other properties
 * to be set too.
 * 
 * This is a superset of the `KindDefinitionProps` properties.
 */
export interface KindFrontmatter extends KindDefinitionProps {
	kind?: string;
	type?: string;
	[key: string]: unknown;
}

export type KindLookup = {
	/** tag which is to identify the given tag (note: no leading "#") */
	tag: string;
	/** the fully qualified tag for this page's kind definition */
	defnTag: `#kind/${string}`;
	/** fully qualified path to Kind definition file */
	path: string;
	/**
	 * the page's name (filepath without path and file extension)
	 */
	name: string;
	/**
	 * The Frontmatter on the page which includes all of the 
	 * `KindDefinitionProps`.
	 */
	fm: KindFrontmatter;
}
