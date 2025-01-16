import {
	Contains,
	isEqual,
	isString,
	retainUntil,
	stripBefore,
	stripLeading
} from "inferred-types";
import { dirname } from "pathe";
import { obApp } from "~/globals";

export type FutureFileInference<T extends "category" | "subcategory"> = {
	/** how to handle the page */
	handleAs: T;
	originalPath: string;
	changedPath: string;
	kind: string;
	category: string;
	subcategory: T extends "subcategory" ? string : undefined;

	/** the Kind's default directory if stated */
	kindDefDirectory?: string;
	refPageDirectory?: string;
}

export type Returns<F extends string> = 
false | (
	Contains<F, "Subcategory"> extends true ? 
	FutureFileInference<"subcategory">
	: FutureFileInference<"category">
);

export function inferFromFutureFilename<F extends string>(
	filename: F
): Returns<F> {
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

	let handleAs: "category" | "subcategory" | "ignore" = subcategory
		? "subcategory"
		: category
		? "category"
		: "ignore";

	const o = obApp;

	return (
		isEqual("ignore")(handleAs)
		? false
		: isString(kind) && isString(category)
			? {
				handleAs,
				originalPath: filename,
				changedPath: "",
				kind,
				category,
				subcategory,
				kindDefDirectory: undefined,
				refPageDirectory: o.getCurrentFile() 
					? dirname(o.getCurrentFile()?.path as string) 
					: undefined
			} satisfies FutureFileInference<"category" | "subcategory">
		: false
	) as Returns<F>;
}
