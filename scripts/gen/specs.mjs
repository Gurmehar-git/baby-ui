import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

const COMPONENTS = join(ROOT, "components");

/** Every manifest `components/<slug>/<slug>.ts` as `[slug, path]`, in file-name order. */
export function specFiles() {
	return readdirSync(COMPONENTS)
		.map((dir) => [dir, join(COMPONENTS, dir, `${dir}.ts`)])
		.filter(([, path]) => existsSync(path))
		.sort(([a], [b]) => (`${a}.ts` < `${b}.ts` ? -1 : 1));
}
