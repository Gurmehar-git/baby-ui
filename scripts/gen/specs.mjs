import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

/** Every manifest `<root>/<slug>/component.ts` as `[slug, path]`. Sorted as `<slug>.ts` names
 * (`button-group` before `button`), the order the registry has always listed them in. */
export function specFiles(root = "components") {
	const dir = join(ROOT, root);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.map((slug) => [slug, join(dir, slug, "component.ts")])
		.filter(([, path]) => existsSync(path))
		.sort(([a], [b]) => (`${a}.ts` < `${b}.ts` ? -1 : 1));
}
