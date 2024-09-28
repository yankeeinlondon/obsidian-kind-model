

export type DecomposedKindTag = {
	type: "kind";
	tag: string;
	safeTag: string;
	kindTag: string;
	kindDefnTag: `kind/${string}`;
	isCategoryDefn: false;
	isSubcategoryDefn: false;
	isKindDefn: boolean;
}

export type DecomposedCategoryTag = {
	type: "category";
	tag: string;
	safeTag: string;
	kindTag: string;
	kindDefnTag: `kind/${string}`;
	categoryTag: string;
	categoryDefnTag: `${string}/category/${string}`;
	isCategoryDefn: boolean;
	isSubcategoryDefn: false;
	isKindDefn: false;
}

export type DecomposedSubcategoryTag = {
	type: "subcategory";
	tag: string;
	safeTag: string;
	kindTag: string;
	kindDefnTag: `kind/${string}`;
	categoryTag: string;
	categoryDefnTag: `${string}/category/${string}`;
	subcategoryTag: string;
	subcategoryDefnTag: `${string}/subcategory/${string}/${string}`;
	isCategoryDefn: false;
	isSubcategoryDefn: boolean;
	isKindDefn: false;
}

export type DecomposedTypeTag = {
	type: "type";
	tag: string;
	safeTag: string;
	typeTag: string;
	typeDefnTag: `type/${string}`;
	isCategoryDefn: false,
	isSubcategoryDefn: false,
	isKindDefn: false
}

export type DecomposedUnknownTag = {
	type: "unknown";
	tag: string;
	safeTag: string;
	suggestions: string[];
}


export type DecomposedTag = 
| DecomposedUnknownTag
| DecomposedTypeTag
| DecomposedKindTag 
| DecomposedCategoryTag 
| DecomposedSubcategoryTag;
