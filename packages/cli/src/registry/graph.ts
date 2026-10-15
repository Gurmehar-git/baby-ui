import { CliError } from "../errors.ts";
import { fetchJson } from "./fetch.ts";
import { type ItemRequest, type RegistryContext, resolveSpecifier } from "./resolve.ts";
import { type RegistryItem, RegistryItemSchema } from "./schema.ts";

export interface ResolvedItem {
	readonly url: string;
	readonly item: RegistryItem;
	/** True for items the user named, false for ones pulled in as dependencies. */
	readonly requested: boolean;
}

export async function load(request: ItemRequest): Promise<RegistryItem> {
	const parsed = RegistryItemSchema.safeParse(await fetchJson(request));
	if (!parsed.success) {
		throw new CliError(`${request.url} is not a registry item.`, {
			hint: parsed.error.issues
				.map((i) => `${i.path.join(".")}: ${i.message}`)
				.join("\n"),
		});
	}
	return parsed.data;
}

// Same-origin dependencies reuse the parent's headers, so a private registry's deps authorise too.
function inherit(child: ItemRequest, parent: ItemRequest): ItemRequest {
	if (Object.keys(child.headers).length) return child;
	if (child.url.startsWith("file:")) return child;
	return new URL(child.url).origin === new URL(parent.url).origin
		? { ...child, headers: parent.headers }
		: child;
}

/**
 * Fetches `specs` and their registryDependencies breadth-first. shadcn applies them deps-first,
 * shadcn-svelte in pre-order (item, then its deps); CSS output depends on which.
 */
export async function resolveTree(
	specs: readonly string[],
	ctx: RegistryContext,
): Promise<ResolvedItem[]> {
	const preOrder = ctx.framework === "svelte";
	const items = new Map<string, RegistryItem>();
	const edges = new Map<string, string[]>();
	const roots = specs.map((spec) => resolveSpecifier(spec, ctx));
	let level: ItemRequest[] = roots;

	while (level.length) {
		const fresh = [...new Map(level.map((r) => [r.url, r])).values()].filter(
			(r) => !items.has(r.url),
		);
		const loaded = await Promise.all(fresh.map(load));
		const next: ItemRequest[] = [];
		fresh.forEach((request, i) => {
			const item = loaded[i];
			if (!item) return;
			items.set(request.url, item);
			const deps = (item.registryDependencies ?? []).map((dep) =>
				inherit(resolveSpecifier(dep, ctx, request.url), request),
			);
			edges.set(
				request.url,
				deps.map((d) => d.url),
			);
			next.push(...deps);
		});
		level = next;
	}

	const ordered: string[] = [];
	const visiting = new Set<string>();
	const visit = (url: string) => {
		if (ordered.includes(url) || visiting.has(url)) return;
		visiting.add(url);
		if (preOrder) ordered.push(url);
		for (const dep of edges.get(url) ?? []) visit(dep);
		visiting.delete(url);
		if (!preOrder) ordered.push(url);
	};
	for (const root of roots) visit(root.url);

	const requested = new Set(roots.map((r) => r.url));
	return ordered.flatMap((url) => {
		const item = items.get(url);
		return item ? [{ url, item, requested: requested.has(url) }] : [];
	});
}
