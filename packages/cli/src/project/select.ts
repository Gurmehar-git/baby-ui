import { CliError } from "../errors.ts";
import { isInteractive, multiselect } from "../ui/index.ts";
import { matchTarget, type Target, targetAt } from "./targets.ts";

export interface TargetFlags {
	readonly target?: readonly string[];
	readonly all?: boolean;
}

const describe = (t: Target) => `${t.path} (${t.name ?? "unnamed"}, ${t.framework})`;

/** `--target` wins, then `--all`, then the package around `cwd`, then a prompt. */
export async function selectTargets(
	targets: readonly Target[],
	cwd: string,
	flags: TargetFlags,
): Promise<Target[]> {
	const listing = targets.map((t) => `  ${describe(t)}`).join("\n");
	if (!targets.length) {
		throw new CliError("No React or Svelte project found.", {
			hint: "Run this inside an app, or add react/svelte to its package.json first.",
		});
	}
	if (flags.target?.length) {
		return flags.target.map((query) => {
			const found = matchTarget(targets, query);
			if (!found) throw new CliError(`No target matches "${query}".`, { hint: listing });
			return found;
		});
	}
	if (flags.all) return [...targets];
	const here = targetAt(targets, cwd);
	if (here) return [here];
	const [only] = targets;
	if (only && targets.length === 1) return [only];
	if (!isInteractive()) {
		throw new CliError("Several targets found; pass --target <name|path> or --all.", {
			hint: listing,
		});
	}
	return multiselect({
		message: "Which projects?",
		options: targets.map((t) => ({ value: t, label: t.path, hint: describe(t) })),
		required: true,
	});
}
