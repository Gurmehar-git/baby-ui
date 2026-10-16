import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { Output, ROOT } from "./gen/core.mjs";
import { derivePort } from "./gen/derive.mjs";

const { completeSpec, defineComponent, variantsOf } = await import(
	"../packages/registry-schema/src/spec.ts"
);

const COMPONENTS = join(ROOT, "components");
const derive = (slug, port) =>
	derivePort(new Output(["components"]), COMPONENTS, slug, port);

test("a port ships its own files, primary first, plus the lib files they reach", () => {
	const { files, dependencies, registryDependencies } = derive("button", "react");
	assert.equal(files[0]?.path, "button/button.tsx");
	assert.ok(
		files.some((f) => f.path === "button/variants.ts" && f.type === "registry:ui"),
	);
	assert.ok(files.some((f) => f.path === "lib/cn.ts" && f.type === "registry:lib"));
	assert.ok(dependencies.includes("tailwind-variants"));
	assert.ok(!dependencies.includes("react"), "framework runtimes are peers");
	assert.deepEqual(registryDependencies, []);
});

test("importing another component makes it a registry dependency, not a shipped file", () => {
	const { files, registryDependencies } = derive("alert-dialog", "svelte");
	assert.ok(registryDependencies.includes("button"));
	assert.ok(!files.some((f) => f.path.startsWith("button/")));
});

test("a bare folder import names that component, not the components root", () => {
	const { registryDependencies } = derive("github-stats", "react");
	assert.ok(registryDependencies.includes("tabs"));
	assert.ok(!registryDependencies.includes("components"));
});

test("a types-only package installs as its @types package", () => {
	assert.ok(derive("choropleth-chart", "react").dependencies.includes("@types/geojson"));
});

test("listed extras join what was derived, and a pin replaces the bare name", () => {
	const manifest = defineComponent({
		slug: "x",
		name: "X",
		description: "x",
		category: "base",
		impl: {
			svelte: {
				entry: "X",
				files: [{ path: "lib/extra.ts", type: "registry:lib" }],
				dependencies: ["vaul-svelte@^1.0.0-next.7", "bits-ui"],
				registryDependencies: ["line-chart"],
			},
		},
	});
	const spec = completeSpec(manifest, {
		svelte: {
			files: [{ path: "x/x.svelte", type: "registry:ui" }],
			dependencies: ["clsx", "vaul-svelte"],
			registryDependencies: ["chart"],
		},
	});
	const impl = spec.impl.svelte;
	assert.deepEqual(
		impl.files.map((f) => f.path),
		["x/x.svelte", "lib/extra.ts"],
	);
	assert.deepEqual(impl.dependencies, ["bits-ui", "clsx", "vaul-svelte@^1.0.0-next.7"]);
	assert.deepEqual(impl.registryDependencies, ["chart", "line-chart"]);
});

test("variant options come from the tv(), and a missing axis fails loudly", () => {
	const tv = { variants: { size: { sm: "", default: "" }, tone: { a: "" } } };
	assert.deepEqual(variantsOf(tv, ["size"]), { size: ["sm", "default"] });
	assert.throws(() => variantsOf(tv, ["shape"]), /no "shape" axis/);
});
