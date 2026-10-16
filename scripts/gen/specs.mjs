import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";

/** Every manifest `<root>/<slug>/<slug>.ts` as `[slug, path]`, in file-name order. */
export function specFiles(root = "components") {
	const dir = join(ROOT, root);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.map((slug) => [slug, join(dir, slug, `${slug}.ts`)])
		.filter(([, path]) => existsSync(path))
		.sort(([a], [b]) => (`${a}.ts` < `${b}.ts` ? -1 : 1));
}
