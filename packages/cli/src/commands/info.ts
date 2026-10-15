import { relative } from "node:path";
import { c } from "../logger.ts";
import { toPosix } from "../project/fs.ts";
import {
	discoverTargets,
	findWorkspace,
	type Target,
	targetAt,
} from "../project/targets.ts";
import { intro, note, outro } from "../ui/index.ts";

export interface InfoOptions {
	cwd: string;
	json?: boolean;
}

function describe(t: Target): string {
	const config = t.config
		? `components.json ${c.dim(`(${t.config.framework ?? "unknown"} schema)`)}`
		: c.yellow("no components.json, run init");
	const aliases = t.aliases.length
		? t.aliases
				.map(
					(a) => `${a.prefix} ${c.dim("→")} ${toPosix(relative(t.root, a.dir)) || "."}`,
				)
				.join(c.dim(", "))
		: c.dim("none");
	return [
		`framework  ${t.framework} ${c.dim(`${t.meta ?? "unknown"}, from ${t.frameworkSource}`)}`,
		`config     ${config}`,
		`css        ${t.config?.css ?? c.dim("unset")}`,
		`aliases    ${aliases}${t.dollarLib ? c.dim(", $lib (kit < 3)") : ""}`,
		`pm         ${t.pm} ${c.dim(`from ${t.pmSource}`)}`,
	].join("\n");
}

export async function info(options: InfoOptions): Promise<void> {
	const workspace = await findWorkspace(options.cwd);
	const targets = await discoverTargets(workspace);
	const here = targetAt(targets, options.cwd);

	if (options.json) {
		const rows = targets.map(({ dependencies, config, ...t }) => ({
			...t,
			config: config?.raw,
			current: t === here,
		}));
		console.log(JSON.stringify({ workspace, targets: rows }, null, 2));
		return;
	}

	intro(`baby-ui info ${c.dim(workspace.root)}`);
	for (const t of targets) {
		const name = t.name ? c.dim(` ${t.name}`) : "";
		note(describe(t), `${t.path}${name}${t === here ? c.brand("  (current)") : ""}`);
	}
	outro(
		targets.length
			? `${targets.length} project(s)`
			: c.yellow("No React or Svelte project found"),
	);
}
