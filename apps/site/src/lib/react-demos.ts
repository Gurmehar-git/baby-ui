import {
	type DemoComponent,
	type DemoLoader,
	type DemoSource,
	loadRuntime,
	prefetch,
} from "@baby-ui/react-preview";

/** Every React demo loader by slug. Server builds return early, so React never reaches the Worker. */
export const reactDemos: DemoSource = async () => {
	if (import.meta.env.SSR) return {};
	// The optional Pro checkout; matches nothing in a public one.
	const proModules = import.meta.glob<{ demos: Record<string, DemoComponent> }>(
		"../../../../pro/packages/demos/src/react/index.tsx",
	);
	const [{ demos }, pro] = await Promise.all([
		import("@baby-ui/demos/react"),
		Promise.all(Object.values(proModules).map((load) => load())),
	]);
	const proLoaders = pro.flatMap((mod) =>
		Object.entries(mod.demos).map(([slug, Demo]): [string, DemoLoader] => [
			slug,
			async () => ({ default: Demo }),
		]),
	);
	return { ...demos, ...Object.fromEntries(proLoaders) };
};

/** Skips speculative React downloads on data-saver connections. */
function saveData() {
	const connection: unknown =
		typeof navigator !== "undefined" && "connection" in navigator
			? navigator.connection
			: undefined;
	return (
		typeof connection === "object" &&
		connection !== null &&
		"saveData" in connection &&
		connection.saveData === true
	);
}

/** Warms React and one demo before the reader picks React, e.g. on hover of the toggle. */
export function prefetchReact(slug?: string) {
	if (saveData()) return;
	if (slug) prefetch(reactDemos, slug);
	else loadRuntime().catch(() => {});
}

/** When React is the saved preference, loads its runtime once the page goes idle. */
export function warmReactWhenIdle() {
	if (saveData()) return;
	const run = () => loadRuntime().catch(() => {});
	if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 3000 });
	else setTimeout(run, 1500);
}
