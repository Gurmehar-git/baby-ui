import type { Framework } from "@baby-ui/registry-schema";

export type ExampleSource = { path: string; ts: string; js: string | null };
type ExamplesModule = {
	default: Record<string, Partial<Record<Framework, ExampleSource>>>;
};

// One generated file per component, so a page only loads its own examples' text.
const modules = import.meta.glob<ExamplesModule>("./generated/examples/*.json");

/** An example's reader text per port, written by registry-build from `components/<slug>/examples`. */
export async function exampleSources(
	slug: string,
	name: string,
): Promise<Partial<Record<Framework, ExampleSource>>> {
	const load = modules[`./generated/examples/${slug}.json`];
	if (!load) return {};
	return (await load()).default[name] ?? {};
}
