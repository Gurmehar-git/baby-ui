import { spawn } from "node:child_process";
import { CliError } from "../errors.ts";
import type { Project } from "../project/detect.ts";
import type { PackageManager } from "../project/pm.ts";

// npm names plus a simple range; no spaces, pipes or angle brackets, so the shell sees no syntax.
const SPEC = /^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*(@[\w.^~*+-]+)?$/i;

/** `@scope/pkg@^1` -> `@scope/pkg`. */
export const packageName = (spec: string) => spec.replace(/(?!^)@.*$/, "");

export function missingPackages(project: Project, specs: Iterable<string>): string[] {
	const wanted = new Map<string, string>();
	for (const spec of specs) {
		if (!SPEC.test(spec))
			throw new CliError(`Refusing to install "${spec}": not a package name.`);
		const name = packageName(spec);
		if (!project.dependencies.has(name)) wanted.set(name, spec);
	}
	return [...wanted.values()].sort();
}

export function installArgs(
	pm: PackageManager,
	packages: readonly string[],
	dev: boolean,
) {
	const verb = pm === "npm" ? "install" : "add";
	return [verb, ...(dev ? [pm === "bun" ? "--dev" : "-D"] : []), ...packages];
}

export function installCommand(
	pm: PackageManager,
	packages: readonly string[],
	dev: boolean,
) {
	return [pm, ...installArgs(pm, packages, dev)].join(" ");
}

/** Runs the project's package manager; specs were validated by `missingPackages`. */
export function install(
	project: Project,
	packages: readonly string[],
	dev: boolean,
): Promise<void> {
	if (!packages.length) return Promise.resolve();
	return new Promise((resolve, reject) => {
		// Windows package managers are .cmd shims, which only start through a shell.
		const child = spawn(project.pm, installArgs(project.pm, packages, dev), {
			cwd: project.root,
			stdio: "inherit",
			shell: process.platform === "win32",
		});
		child.on("error", reject);
		child.on("exit", (code) =>
			code === 0
				? resolve()
				: reject(
						new CliError(
							`${installCommand(project.pm, packages, dev)} exited with ${code}.`,
							{
								hint: "Files were written; run the install yourself or `baby-ui undo`.",
							},
						),
					),
		);
	});
}
