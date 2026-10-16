import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readerText } from "../../packages/registry-build/src/examples";
import { installLayout } from "../../packages/registry-build/src/layout";
import { specs } from "../specs";

const read = (file: string) => readFileSync(resolve(import.meta.dir, "..", file), "utf8");

test("React examples read with the shadcn alias", () => {
	const text = readerText(
		read("button/examples/loading.tsx"),
		installLayout("react", specs),
	);
	expect(text).toContain('import { Button } from "@/components/ui/button";');
	expect(text).not.toContain("@baby-ui/");
});

test("Svelte examples read with the SvelteKit 3 alias", () => {
	const text = readerText(
		read("button/examples/loading.svelte"),
		installLayout("svelte", specs),
	);
	expect(text).toContain('from "#lib/components/ui/button/index.js"');
	expect(text).not.toContain("@baby-ui/");
});
