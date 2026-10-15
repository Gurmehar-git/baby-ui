import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SEVERITY = { blocker: 4, high: 2, medium: 1, low: 0.5 };

/** True when the module at `url` is the script node was started with. */
export const isMain = (url) =>
	Boolean(process.argv[1]) && resolve(process.argv[1]) === fileURLToPath(url);

/** One finding: a rule ID from references/rules.md, where it is, what was measured, the fix. */
export const finding = (rule, severity, where, measured, fix) => ({
	rule,
	severity,
	where,
	measured,
	fix,
});

export function args(argv) {
	const flags = new Set();
	const options = {};
	const positional = [];
	for (const arg of argv) {
		const m = arg.match(/^--([\w-]+)(?:=(.*))?$/);
		if (!m) positional.push(arg);
		else if (m[2] === undefined) flags.add(m[1]);
		else options[m[1]] = m[2];
	}
	return { flags, options, positional };
}

/** Prints findings as a table, or JSON with --json; exits 1 when any blocker is present. */
export function report(title, findings, { json = false } = {}) {
	if (json) console.log(JSON.stringify({ title, findings }, null, "\t"));
	else {
		console.log(`${title}: ${findings.length} finding(s)`);
		for (const f of findings)
			console.log(
				`  ${f.severity.padEnd(7)} ${f.rule.padEnd(11)} ${f.where}  ${f.measured}  -> ${f.fix}`,
			);
	}
	if (findings.some((f) => f.severity === "blocker")) process.exitCode = 1;
}
