import { describe, expect, test } from "bun:test";
import { button } from "../button/react/variants";
import { fullscreenNav } from "../fullscreen-nav/react/variants";
import { getSpec } from "../specs";
import { axesOf, derivePort, type Port } from "./derive";

const sortPaths = (files: Array<{ path: string; type: string }>) =>
	[...files].map((f) => `${f.type} ${f.path}`).sort();

describe.each(["button", "dialog", "fullscreen-nav"])("%s", (slug) => {
	const spec = getSpec(slug);
	if (!spec) throw new Error(`no spec ${slug}`);

	test.each(["react", "svelte"] as Port[])(
		"%s files and dependencies match the spec",
		(port) => {
			const impl = spec.impl[port];
			if (!impl) return;
			const derived = derivePort(slug, port);
			expect(sortPaths(derived.files)).toEqual(sortPaths(impl.files));
			expect(derived.dependencies).toEqual([...impl.dependencies].sort());
			expect(derived.registryDependencies).toEqual(
				[...(impl.registryDependencies ?? [])].sort(),
			);
		},
	);
});

// The manifest names its public tv(); dialog's frame and width tvs are internal, so it names none.
test("variant axes come straight from tv()", () => {
	expect(axesOf(button)).toEqual(getSpec("button")?.variants ?? {});
	expect(getSpec("dialog")?.variants).toEqual({});
});

// Found by this spike: the hand spec still lists size `md`, renamed `default` in code.
test("fullscreen-nav's hand spec has drifted from its tv()", () => {
	expect(axesOf(fullscreenNav).size).toContain("default");
	expect(getSpec("fullscreen-nav")?.variants.size).toContain("md");
});
