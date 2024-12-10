import { isArray } from "inferred-types";
import { getKindTagsOfPage } from "~/api/classificationApi";
import KindModelPlugin from "~/main";
import { getPage } from "~/page";
import { KindDefinition, Metric, PageReference } from "~/types";

/**
 * Creates a `KindDefinition` from a page reference.
 *
 * > used primarily for caching purposes
 */
export const createKindDefinition =
	(p: KindModelPlugin) =>
	(ref: PageReference): KindDefinition<["path"]> | undefined => {
		const pg = getPage(p)(ref);

		if (pg) {
			try {
				const tags = getKindTagsOfPage(p)(pg);
				const defn: Omit<KindDefinition<["path"]>, "hash"> = {
					path: pg.file.path,
					tag: tags ? tags[0] : undefined,
					requiredProps: (isArray(pg._requiredProps)
						? pg._requiredProps
						: isArray(pg.__requiredProps)
							? pg.__requiredProps
							: undefined) as undefined | string[],
					metricProps: (pg._metricProps ||
						pg.__metricProps) as Metric[],
				};
				const hash = p.hasher(JSON.stringify(defn));

				p.debug(`kind defn hash: ${hash}`, { ref });

				return {
					...defn,
					hash,
				} as KindDefinition<[]>;
			} catch (e) {
				const msg = e?.msg || e?.message || String(e);
				p.error(
					`Problem calling createKindDefinition(${String(ref)}): ${msg}`,
				);
			}
		} else {
			if (!ref) {
				p.warn(
					`an empty reference was passed to createKindDefinition!`,
				);
			} else {
				p.warn("can not create KindDefinition", { ref, pg });
			}
		}
	};
