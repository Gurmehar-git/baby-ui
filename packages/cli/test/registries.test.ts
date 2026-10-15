import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { add } from "../src/commands/add.ts";
import { resolveSpecifier } from "../src/registry/resolve.ts";
import { fixture } from "./fixture.ts";

let server: Server;
let origin = "";
const seen: Array<{ url: string; auth: string | undefined }> = [];

const ITEMS: Record<string, object> = {
	"/r/fancy.json": {
		name: "fancy",
		type: "registry:ui",
		registryDependencies: ["./helper.json"],
		files: [
			{
				path: "ui/fancy.tsx",
				type: "registry:ui",
				content: 'import { help } from "@/lib/helper";\nexport const Fancy = help;\n',
			},
		],
	},
	"/r/helper.json": {
		name: "helper",
		type: "registry:lib",
		files: [
			{
				path: "lib/helper.ts",
				type: "registry:lib",
				content: "export const help = 1;\n",
			},
		],
	},
};

beforeEach(async () => {
	vi.spyOn(process.stdout, "write").mockReturnValue(true);
	vi.spyOn(console, "log").mockReturnValue();
	process.env.BABY_UI_CACHE_DIR = fixture({});
	process.env.ACME_TOKEN = "s3cret";
	seen.length = 0;
	server = createServer((req, res) => {
		const path = new URL(req.url ?? "/", "http://x").pathname;
		seen.push({ url: path, auth: req.headers.authorization });
		if (req.headers.authorization !== "Bearer s3cret") {
			res.writeHead(401).end();
			return;
		}
		const body = ITEMS[path];
		if (!body) res.writeHead(404).end();
		else
			res
				.writeHead(200, { "content-type": "application/json" })
				.end(JSON.stringify(body));
	});
	await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
	const address = server.address();
	origin = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
});

afterEach(async () => {
	vi.restoreAllMocks();
	delete process.env.BABY_UI_CACHE_DIR;
	delete process.env.ACME_TOKEN;
	await new Promise((done) => server.close(done));
});

const app = (registries: object) =>
	fixture({
		"package.json": { dependencies: { react: "19.0.0" } },
		"components.json": {
			$schema: "https://ui.shadcn.com/schema.json",
			tailwind: { css: "src/index.css" },
			aliases: { components: "@/components", utils: "@/lib/utils" },
			registries,
		},
		"tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
		"src/index.css": '@import "tailwindcss";\n',
	});

describe("third-party registries", () => {
	it("installs @ns/name with env headers, passing them to same-origin dependencies", async () => {
		const root = app({
			"@acme": {
				url: `${origin}/r/{name}.json`,
				// biome-ignore lint/suspicious/noTemplateCurlyInString: registry env placeholder
				headers: { Authorization: "Bearer ${ACME_TOKEN}" },
			},
		});
		await add({ cwd: root, items: ["@acme/fancy"], install: false });
		expect(readFileSync(join(root, "src/components/ui/fancy.tsx"), "utf8")).toContain(
			'from "@/lib/helper"',
		);
		expect(readFileSync(join(root, "src/lib/helper.ts"), "utf8")).toContain("help");
		expect(seen.map((s) => [s.url, s.auth])).toEqual([
			["/r/fancy.json", "Bearer s3cret"],
			["/r/helper.json", "Bearer s3cret"],
		]);
	});

	it("explains a 401 and a missing env var", async () => {
		const root = app({ "@acme": `${origin}/r/{name}.json` });
		await expect(
			add({ cwd: root, items: ["@acme/fancy"], install: false }),
		).rejects.toThrow(/authorisation/);
		delete process.env.ACME_TOKEN;
		const ctx = {
			framework: "react" as const,
			typescript: true,
			cwd: root,
			config: {
				registries: {
					// biome-ignore lint/suspicious/noTemplateCurlyInString: registry env placeholder
					"@acme": { url: "https://acme.dev/{name}", headers: { a: "${ACME_TOKEN}" } },
				},
			},
		};
		expect(() => resolveSpecifier("@acme/fancy", ctx)).toThrow(/ACME_TOKEN/);
	});

	it("maps @shadcn and bare dependency names to the upstream registries", () => {
		const react = { framework: "react" as const, typescript: true, cwd: ".", config: {} };
		expect(resolveSpecifier("@shadcn/button", react).url).toBe(
			"https://ui.shadcn.com/r/styles/new-york-v4/button.json",
		);
		expect(
			resolveSpecifier("button", react, "https://example.com/r/x.json").url,
		).toContain("ui.shadcn.com");
		expect(resolveSpecifier("button", react).url).toBe(
			"https://baby-ui.pages.dev/r/button.json",
		);
		const svelte = { ...react, framework: "svelte" as const, typescript: false };
		expect(resolveSpecifier("button", svelte).url).toBe(
			"https://baby-ui.pages.dev/svelte/r/js/button.json",
		);
	});
});

describe("pro auth", () => {
	it("sends the saved licence key to our /pro/ route and nowhere else", async () => {
		const { saveToken } = await import("../src/auth.ts");
		process.env.BABY_UI_CONFIG_DIR = fixture({});
		process.env.BABY_UI_REGISTRY_URL = origin;
		ITEMS["/pro/r/cover.json"] = {
			name: "cover",
			type: "registry:ui",
			registryDependencies: ["https://elsewhere.invalid/r/x.json"],
			files: [
				{ path: "ui/cover.tsx", type: "registry:ui", content: "export const C = 1;\n" },
			],
		};
		await saveToken("s3cret");
		const root = app({});
		const fetched: string[] = [];
		const real = globalThis.fetch;
		vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
			const url = String(input);
			const headers = new Headers(init?.headers);
			fetched.push(
				`${new URL(url).host}${new URL(url).pathname} ${headers.get("authorization") ?? "-"}`,
			);
			if (url.includes("elsewhere.invalid")) {
				return new Response(
					JSON.stringify({ name: "x", type: "registry:lib", files: [] }),
				);
			}
			return real(input, init);
		});
		await add({ cwd: root, items: ["@baby-ui-pro/cover"], install: false });
		expect(readFileSync(join(root, "src/components/ui/cover.tsx"), "utf8")).toContain(
			"C = 1",
		);
		expect(fetched).toEqual([
			`${new URL(origin).host}/pro/r/cover.json Bearer s3cret`,
			"elsewhere.invalid/r/x.json -",
		]);
		delete process.env.BABY_UI_CONFIG_DIR;
		delete process.env.BABY_UI_REGISTRY_URL;
	});
});
