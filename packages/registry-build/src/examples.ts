import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentSpec, Framework } from "@baby-ui/registry-schema";
import type { InstallLayout } from "./layout";
import { COMPONENTS_DIR } from "./sources";
import { toJavaScript } from "./tojs";

const EXT: Record<Framework, string> = { react: ".tsx", svelte: ".svelte" };
const PORTS: readonly Framework[] = ["react", "svelte"];
const PACKAGE_IMPORT = /@baby-ui\/components\/(?:react|svelte)\/([a-z0-9-]+)/g;

export type ExampleVariant = { path: string; ts: string; js: string | null };
/** One component's examples by name, each with the ports it has. */
export type Examples = Record<string, Partial<Record<Framework, ExampleVariant>>>;

/** An example as a reader copies it: workspace package imports become install aliases. */
export function readerText(source: string, layout: InstallLayout): string {
	return source.replace(PACKAGE_IMPORT, (_m, slug: string) => layout.itemImport(slug));
}

/** `components/<slug>/examples/*`, rewritten for readers; null when the folder has none. */
export async function buildExamples(
	spec: ComponentSpec,
	layouts: Record<Framework, InstallLayout>,
): Promise<Examples | null> {
	const dir = join(COMPONENTS_DIR, spec.slug, "examples");
	if (!existsSync(dir)) return null;
	const examples: Examples = {};
	for (const file of readdirSync(dir).sort()) {
		const framework = PORTS.find((f) => file.endsWith(EXT[f]));
		if (!framework) continue;
		const name = file.slice(0, -EXT[framework].length);
		const ts = readerText(await readFile(join(dir, file), "utf8"), layouts[framework]);
		const js = await toJavaScript(ts, file).catch(() => null);
		examples[name] = { ...examples[name], [framework]: { path: file, ts, js } };
	}
	return Object.keys(examples).length ? examples : null;
}
