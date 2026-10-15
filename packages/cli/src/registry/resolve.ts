import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { CliError } from "../errors.ts";
import type { Framework } from "../project/config.ts";
import { isRecord, type Json } from "../project/fs.ts";

export const BABY_UI_ORIGIN = "https://baby-ui.pages.dev";

/** `BABY_UI_REGISTRY_URL` swaps our origin everywhere, including inside items' dependency URLs. */
export const registryOrigin = () =>
	(process.env.BABY_UI_REGISTRY_URL ?? BABY_UI_ORIGIN).replace(/\/$/, "");

export interface RegistryContext {
	readonly framework: Framework;
	/** False installs the JS dialect our registry builds (`/r/js/`), or fails for others. */
	readonly typescript: boolean;
	readonly config: Json;
	readonly cwd: string;
}

export interface ItemRequest {
	readonly url: string;
	readonly headers: Readonly<Record<string, string>>;
}

export function babyUiUrl(name: string, ctx: RegistryContext): string {
	const route = ctx.framework === "react" ? "r" : "svelte/r";
	return `${registryOrigin()}/${route}${ctx.typescript ? "" : "/js"}/${name}.json`;
}

/** shadcn and shadcn-svelte resolve a bare dependency name against their own registry. */
function upstreamUrl(name: string, ctx: RegistryContext): string {
	const style = typeof ctx.config.style === "string" ? ctx.config.style : undefined;
	if (ctx.framework === "react") {
		return `https://ui.shadcn.com/r/styles/${style ?? "new-york-v4"}/${name}.json`;
	}
	const base =
		typeof ctx.config.registry === "string"
			? ctx.config.registry
			: "https://shadcn-svelte.com/registry";
	return `${base.replace(/\/$/, "")}/styles/${style ?? "vega"}/${name}.json`;
}

function expandEnv(value: string): string {
	return value.replace(/\$\{(\w+)\}/g, (_, name: string) => {
		const found = process.env[name];
		if (found === undefined) {
			throw new CliError(`Environment variable ${name} is not set.`, {
				hint: "A registry in components.json references it in its url or headers.",
			});
		}
		return found;
	});
}

/** Pro items sit under `/pro/` on our registry and need a licence token. */
export function proUrl(name: string, ctx: RegistryContext): string {
	const route = ctx.framework === "react" ? "r" : "svelte/r";
	return `${registryOrigin()}/pro/${route}${ctx.typescript ? "" : "/js"}/${name}.json`;
}

function namespaced(ns: string, name: string, ctx: RegistryContext): ItemRequest {
	if (ns === "@baby-ui") return { url: babyUiUrl(name, ctx), headers: {} };
	// Our own auth adds the token in fetch, so components.json needs no entry for this.
	if (ns === "@baby-ui-pro") return { url: proUrl(name, ctx), headers: {} };
	const registries = isRecord(ctx.config.registries) ? ctx.config.registries : {};
	const entry = registries[ns];
	if (entry === undefined) {
		if (ns === "@shadcn") return { url: upstreamUrl(name, ctx), headers: {} };
		throw new CliError(`Unknown registry ${ns}.`, {
			hint: `Add it under "registries" in components.json, e.g. "${ns}": "https://example.com/r/{name}.json".`,
		});
	}
	const spec = typeof entry === "string" ? { url: entry } : isRecord(entry) ? entry : {};
	if (typeof spec.url !== "string") throw new CliError(`Registry ${ns} has no url.`);
	const style = typeof ctx.config.style === "string" ? ctx.config.style : "";
	const url = new URL(
		expandEnv(spec.url).replace("{name}", name).replace("{style}", style),
	);
	for (const [key, value] of Object.entries(isRecord(spec.params) ? spec.params : {})) {
		if (typeof value === "string") url.searchParams.set(key, expandEnv(value));
	}
	const headers: Record<string, string> = {};
	for (const [key, value] of Object.entries(isRecord(spec.headers) ? spec.headers : {})) {
		if (typeof value === "string") headers[key] = expandEnv(value);
	}
	return { url: url.toString(), headers };
}

/** A request for a URL from the lock, with headers from the components.json registry it came from. */
export function requestFor(url: string, ctx: RegistryContext): ItemRequest {
	if (url.startsWith("file:")) return { url, headers: {} };
	const registries = isRecord(ctx.config.registries) ? ctx.config.registries : {};
	for (const [ns, entry] of Object.entries(registries)) {
		const spec =
			typeof entry === "string" ? { url: entry } : isRecord(entry) ? entry : {};
		if (typeof spec.url !== "string") continue;
		const origin = new URL(spec.url.replace(/\{\w+\}/g, "x").replace(/\$\{\w+\}/g, "x"))
			.origin;
		if (new URL(url).origin === origin)
			return { url, headers: namespaced(ns, "x", ctx).headers };
	}
	return { url: withOrigin(url), headers: {} };
}

const withOrigin = (url: string) =>
	url.startsWith(BABY_UI_ORIGIN)
		? registryOrigin() + url.slice(BABY_UI_ORIGIN.length)
		: url;

/** The public URL for the lock, so a local `BABY_UI_REGISTRY_URL` never gets committed. */
export function canonicalUrl(url: string): string {
	const origin = registryOrigin();
	return origin !== BABY_UI_ORIGIN && url.startsWith(origin)
		? BABY_UI_ORIGIN + url.slice(origin.length)
		: url;
}

/**
 * Turns a user or dependency specifier into a request. Bare names mean Baby UI at the top
 * level and the parent's upstream registry inside a third-party item.
 */
export function resolveSpecifier(
	spec: string,
	ctx: RegistryContext,
	parent?: string,
): ItemRequest {
	if (/^https?:\/\//.test(spec)) return { url: withOrigin(spec), headers: {} };
	if (spec.startsWith("file:")) return { url: spec, headers: {} };
	const ns = /^(@[\w-]+)\/(.+)$/.exec(spec);
	if (ns?.[1] && ns[2]) return namespaced(ns[1], ns[2], ctx);
	if (parent && (spec.startsWith("./") || spec.startsWith("../"))) {
		return { url: new URL(spec, parent).toString(), headers: {} };
	}
	if (spec.endsWith(".json") && existsSync(resolve(ctx.cwd, spec))) {
		return { url: pathToFileURL(resolve(ctx.cwd, spec)).toString(), headers: {} };
	}
	const fromUs =
		!parent || parent.startsWith(registryOrigin()) || parent.startsWith("file:");
	return { url: fromUs ? babyUiUrl(spec, ctx) : upstreamUrl(spec, ctx), headers: {} };
}
