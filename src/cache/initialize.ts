import { ensureLeading, stripLeading } from "inferred-types";
import KindModelPlugin from "~/main";
import { KindDefinition } from "~/types";
import { updateKindDefinitionInCache } from "./update";
import { isTagKindDefinition } from "~/type-guards";


const findStaleByTag = async(p: KindModelPlugin) => {
	const kinds = p.dv.pages(`#kind`)
		.where(k => k.file?.etags?.some(i => i.startsWith(`#kind/`)));
	const types = p.dv.pages(`#type`)
		.where(k => k.file?.etags?.some(i => i.startsWith(`#type/`)));
		
	let problems: string[] = [];

	for (const pg of kinds) {

			const kp = p.dv.page(pg.file.path);
			if(kp) {
				updateKindDefinitionInCache(p)(pg.file.path);
				p.debug(`caching by file path ${kp.file.path}`);
			} else {
				p.warn(`Page missing kind tag`, {pg});
			}
			
	}

	if (problems.length > 0) {
		p.warn(`${problems.length} problems loading cache`, "failed to insert the following elements into cache", problems)
	}
};



export const initializeKindCaches = async (p: KindModelPlugin) => {
	const kinds: KindDefinition[] = Array.isArray(p.settings?.kinds)
		? p.settings?.kinds
		: [];
	const types: KindDefinition[] = Array.isArray(p.settings?.types)
	? p.settings?.types
	: [];
	p.info(
		`cache updated with user settings`,
		`${kinds.length} kinds defined in user settings`,
		`${types.length} types defined in user settings`
	);


	// iterate through Kind Definitions which are found in settings file
	for (const kind of kinds) {
		if (isTagKindDefinition(kind)) {
			if (p.cache.kindDefinitionsByTag.has(kind.tag)) {
				if (p.cache.kindTagDuplicates.has(kind.tag)) {
					const current = p.cache.kindTagDuplicates.get(kind.tag) as Set<KindDefinition<["tag", "path"]>>;
					current?.add(kind);
					p.cache.kindTagDuplicates.set(kind.tag, current);
				} else {
					p.cache.kindTagDuplicates.set(
						kind.tag, 
						new Set<KindDefinition<["tag", "path" | never]>>(
							[
								kind,
								p.cache.kindTagDuplicates.get(kind.tag)
							] as KindDefinition<["tag", "path" | never]>[]
						)
					);
				}
			}
			p.cache.kindDefinitionsByTag.set(kind.tag, kind);
		}
		if (kind.path) {
			p.cache.kindDefinitionsByPath.set(kind.path, kind);
		}
	}

	// iterate through Type Definitions which are found in settings file
	for (const t of types) {
		if (isTagKindDefinition(t)) {
			if (p.cache.kindDefinitionsByTag.has(t.tag)) {
				if (p.cache.kindTagDuplicates.has(t.tag)) {
					const current = p.cache.kindTagDuplicates.get(t.tag) as Set<KindDefinition<["tag", "path"]>>;
					current?.add(t);
					p.cache.kindTagDuplicates.set(t.tag, current);
				} else {
					p.cache.kindTagDuplicates.set(
						t.tag, 
						new Set<KindDefinition<["tag", "path" | never]>>(
							[
								t,
								p.cache.kindTagDuplicates.get(t.tag)
							] as KindDefinition<["tag", "path" | never]>[]
						)
					);
				}
			}
			p.cache.kindDefinitionsByTag.set(t.tag, t);
		}
		if (t.path) {
			p.cache.kindDefinitionsByPath.set(t.path, t);
		}
	}

	p.info(`Kind (${kinds.length}) and Type (${types.length}) Lookups cached`)

	// remainder can be done async
	return Promise.all([
		// findStaleByPath(p),
		findStaleByTag(p).then(() => p.info("Cache refreshed"))
	])
}



