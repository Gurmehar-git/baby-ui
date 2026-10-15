import { CliError } from "../errors.ts";
import { selectTargets, type TargetFlags } from "../project/select.ts";
import {
	discoverTargets,
	findWorkspace,
	type Target,
	targetAt,
} from "../project/targets.ts";

export interface CommonOptions extends TargetFlags {
	readonly cwd: string;
}

/** Targets that have a components.json; standing in one without it points at `init`. */
export async function configuredTargets(options: CommonOptions): Promise<Target[]> {
	const workspace = await findWorkspace(options.cwd);
	const all = await discoverTargets(workspace);
	const here = targetAt(all, options.cwd);
	if (here && !here.config && !options.target?.length && !options.all) {
		throw new CliError(`${here.path} has no components.json.`, {
			hint: "Run `baby-ui init` first.",
		});
	}
	const configured = all.filter((t) => t.config);
	if (!configured.length) {
		throw new CliError("No project with a components.json found.", {
			hint: "Run `baby-ui init` in your app first.",
		});
	}
	return selectTargets(configured, options.cwd, options);
}
