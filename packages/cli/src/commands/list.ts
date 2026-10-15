import { c } from "../logger.ts";
import { installConfig } from "../project/paths.ts";
import { fetchJson } from "../registry/fetch.ts";
import { babyUiUrl } from "../registry/resolve.ts";
import { RegistryIndexSchema } from "../registry/schema.ts";
import { intro, note, outro } from "../ui/index.ts";
import { readLock } from "../write/lock.ts";
import { inspect } from "../write/state.ts";
import { type CommonOptions, configuredTargets } from "./shared.ts";

export interface ListOptions extends CommonOptions {
	readonly query?: string;
	readonly json?: boolean;
	readonly type?: string;
}

/** The Baby UI index for each target's framework, with install state from its lock. */
export async function list(options: ListOptions): Promise<void> {
	const targets = await configuredTargets(options);
	const query = options.query?.toLowerCase();
	const rows: Array<Record<string, string | boolean>> = [];
	if (!options.json) intro(query ? `baby-ui search ${query}` : "baby-ui list");
	for (const target of targets) {
		const cfg = installConfig(target);
		const ctx = {
			framework: cfg.framework,
			typescript: cfg.typescript,
			config: {},
			cwd: target.root,
		};
		const index = RegistryIndexSchema.parse(
			await fetchJson({ url: babyUiUrl("index", ctx), headers: {} }),
		);
		const states = await inspect(cfg, await readLock(target.root));
		const state = new Map(
			states.map((s) => [
				s.item.name,
				s.files.some((f) => f.health !== "clean") ? "edited" : "installed",
			]),
		);
		const matches = index.filter(
			(i) =>
				(!options.type || i.type === `registry:${options.type}`) &&
				(!query ||
					i.name.includes(query) ||
					i.title?.toLowerCase().includes(query) ||
					i.description?.toLowerCase().includes(query)),
		);
		for (const i of matches) {
			rows.push({
				target: target.path,
				name: i.name,
				type: i.type,
				installed: state.get(i.name) ?? "",
			});
		}
		if (options.json) continue;
		const width = Math.max(0, ...matches.map((i) => i.name.length));
		const lines = matches.map((i) => {
			const mark = state.get(i.name);
			const tag =
				mark === "edited" ? c.yellow(" edited") : mark ? c.green(" installed") : "";
			return `${i.name.padEnd(width)}  ${c.dim(i.description ?? "")}${tag}`;
		});
		note(
			lines.join("\n") || c.dim("no matches"),
			`${target.path} ${c.dim(`(${cfg.framework})`)}`,
		);
	}
	if (options.json) console.log(JSON.stringify(rows, null, 2));
	else outro(`${rows.length} item(s). Add one with ${c.brand("baby-ui add <name>")}`);
}
