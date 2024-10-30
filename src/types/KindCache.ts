import { KindDefinition } from "./KindDefinition";
import { PageId, PageIdType } from "./PageId";





/** the representation in memory of the Kind Model cache */
export interface KindCache {
	/**
	 * Kind definitions looked by **tag**.
	 */
	kindDefinitionsByTag: Map<string, KindDefinition<["tag"]>>,
	/**
	 * Kind definitions looked by **path**.
	 */
	kindDefinitionsByPath: Map<string, KindDefinition<["path"]>>,

	/**
	 * Type definitions looked by **tag**.
	 */
	typeDefinitionsByTag: Map<string, KindDefinition<["tag"]>>,
	/**
	 * Type definitions looked by **path**.
	 */
	typeDefinitionsByPath: Map<string, KindDefinition<["path"]>>,

	/** kind tags which are duplicates */
	kindTagDuplicates: Map<string, Set<KindDefinition<["tag"]>>>,
	/** type tags which are duplicates */
	typeTagDuplicates: Map<string, Set<KindDefinition<["tag"]>>>
}


