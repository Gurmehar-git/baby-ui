import type { Framework } from "@baby-ui/registry-schema";

/** One file as registry-build writes it to generated/sources, before highlighting. */
export type GeneratedSourceFile = {
	path: string;
	target: string;
	ts: string;
	js: string | null;
	jsPath: string | null;
};

type SourcesModule = { default: Partial<Record<Framework, GeneratedSourceFile[]>> };
type CssModule = { default: Partial<Record<Framework, string>> };

// One module per component instead of one combined import: a request for a single slug
// only ever loads that slug's file, not every component's source text.
const sourcesModules = import.meta.glob<SourcesModule>("./generated/sources/*.json");
const cssModules = import.meta.glob<CssModule>("./generated/css/*.json");

export async function sourceFiles(
	slug: string,
	framework: Framework,
): Promise<GeneratedSourceFile[]> {
	const load = sourcesModules[`./generated/sources/${slug}.json`];
	if (!load) return [];
	const mod = await load();
	return mod.default[framework] ?? [];
}

/** The stylesheet the CLI writes for this component, for the Manual view. */
export async function componentCss(
	slug: string,
	framework: Framework,
): Promise<string | null> {
	const load = cssModules[`./generated/css/${slug}.json`];
	if (!load) return null;
	const mod = await load();
	return mod.default[framework] ?? null;
}

/** Class and keyframe names a stylesheet defines, e.g. [".pop-in", "@keyframes pop-in"]. */
export function cssNames(css: string): string[] {
	const names = new Set<string>();
	for (const line of css.split("\n")) {
		if (!line.endsWith("{")) continue;
		const keyframes = line.match(/^@keyframes\s+([\w-]+)/);
		if (keyframes) names.add(`@keyframes ${keyframes[1]}`);
		else for (const m of line.matchAll(/\.([a-zA-Z][\w-]*)/g)) names.add(`.${m[1]}`);
	}
	return [...names];
}
