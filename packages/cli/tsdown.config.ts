import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: "esm",
	platform: "node",
	target: "node22",
	fixedExtension: false,
	sourcemap: true,
	clean: true,
	// devDependencies are bundled and `dependencies` (native oxc-parser) stay external;
	// this allowlist fails the build if anything else sneaks into the bundle.
	deps: {
		onlyBundle: [
			"commander",
			"yaml",
			"tinyglobby",
			"fdir",
			"picomatch",
			"zod",
			"postcss",
			"nanoid",
			"picocolors",
			"source-map-js",
			"magic-string",
			"@jridgewell/sourcemap-codec",
		],
	},
});
