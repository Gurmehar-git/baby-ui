import type { DemoLoader } from "@baby-ui/demos/svelte";
import type { Component } from "svelte";

// The only client-safe module reaching into the optional pro/ checkout; each glob matches
// nothing in a public checkout. Pro is always bundled: `__SHOW_PRO__` gates what is shown, not this.

// Prop types live in the Pro repo, which public CI never checks out.
// biome-ignore lint/suspicious/noExplicitAny: see above
type AnyComponent = Component<any>;
type Lazy<T> = Record<string, () => Promise<T>>;
type Samples = Record<string, Record<string, unknown>>;
type Template = { default: Component<Record<string, unknown>> };

const bySlug = <T>(globbed: Record<string, T>, suffix: string) =>
	Object.fromEntries(
		Object.entries(globbed).map(([path, value]) => [
			path.slice(path.lastIndexOf("/") + 1, -suffix.length),
			value,
		]),
	);
const first = <T>(globbed: Lazy<T>) => Object.values(globbed)[0]?.();

/** Pro demos by slug, following the public `<slug>-demo.svelte` convention. */
export const proDemos: Record<string, DemoLoader> = bySlug(
	import.meta.glob("../../../../pro/packages/demos/src/svelte/*-demo.svelte") as Record<
		string,
		DemoLoader
	>,
	"-demo.svelte",
);

const screens = import.meta.glob<{ default: AnyComponent }>(
	"../../../../pro/packages/demos/src/screens/*-screen.svelte",
);
// biome-ignore lint/suspicious/noExplicitAny: typed in the Pro repo
const screenSample: Lazy<Record<string, any>> = import.meta.glob(
	"../../../../pro/packages/demos/src/screens/sample.ts",
);

/** A Pro screen and its sample data, or undefined when Pro is absent or not shown. */
export async function proScreen(name: string) {
	const load = bySlug(screens, "-screen.svelte")[name];
	if (!__SHOW_PRO__ || !load || !Object.keys(screenSample).length) return undefined;
	const [mod, sample] = await Promise.all([load(), first(screenSample)]);
	return sample && { Screen: mod.default, sample };
}

export const proEmailTemplates = import.meta.glob<Template>(
	"../../../../pro/components/email-*/svelte/email-*.svelte",
);
export const proOgTemplates = import.meta.glob<Template>(
	"../../../../pro/components/og-*/svelte/og-*.svelte",
);

const emailSamples = import.meta.glob<Samples>(
	"../../../../pro/packages/demos/src/data/email-samples.ts",
	{ import: "EMAIL_SAMPLES" },
);
const ogSamples = import.meta.glob<Samples>(
	"../../../../pro/packages/demos/src/data/og-samples.ts",
	{ import: "OG_SAMPLES" },
);

const proComponentModules = import.meta.glob<Record<string, unknown>>(
	"../../../../pro/components/*/svelte/index.ts",
);

/** Pro components' own modules by slug (their folder), for pages that render one unframed. */
export const proComponents: Lazy<Record<string, unknown>> = Object.fromEntries(
	Object.entries(proComponentModules).map(([path, load]) => [
		path.split("/").at(-3) ?? path,
		load,
	]),
);

/** Sample props for a Pro email or OG template, when Pro is present. */
export const proEmailSample = async (slug: string) => (await first(emailSamples))?.[slug];
export const proOgSample = async (slug: string) => (await first(ogSamples))?.[slug];
