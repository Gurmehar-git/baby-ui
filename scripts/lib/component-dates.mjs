import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Where component sources live in each repo; `pro` is a separate checkout with its own history. */
const REPOS = [
	{
		dir: ".",
		prefix: "",
		roots: [
			"packages/ui-react/src",
			"packages/ui-svelte/src/lib",
			"packages/registry-schema/src/components",
		],
	},
	{
		dir: "pro",
		prefix: "pro/",
		roots: [
			"packages/react/src",
			"packages/svelte/src/lib",
			"packages/schema/src/components",
		],
	},
];

// A commit touching this share of components is a format or lint sweep, not an update.
const SWEEP_SHARE = 0.25;

const day = (iso) => iso.slice(0, 10);

/** `root/<folder>` for component sources, `root/<file>` for specs; null for shared `lib/`. */
function keyOf(path, roots) {
	const root = roots.find((r) => path.startsWith(`${r}/`));
	if (!root) return null;
	const head = path.slice(root.length + 1).split("/")[0];
	return head === "lib" ? null : `${root}/${head}`;
}

const nameOf = (key) => key.slice(key.lastIndexOf("/") + 1).replace(/\.ts$/, "");

function git(cwd, args) {
	return execFileSync("git", args, {
		cwd,
		encoding: "utf8",
		maxBuffer: 64 * 1024 * 1024,
	});
}

function repoDates({ dir, prefix, roots }, cwd, today) {
	const at = join(cwd, dir);
	if (!existsSync(join(at, ".git"))) return {};
	// A shallow clone would date every component to the clone's first commit.
	if (git(at, ["rev-parse", "--is-shallow-repository"]).trim() === "true") {
		console.warn(`component dates: ${dir} is a shallow clone, using spec dates only`);
		return {};
	}
	const commits = git(at, ["log", "--format=%x00%aI", "--name-only", "--", ...roots])
		.split("\0")
		.filter(Boolean)
		.map((chunk) => {
			const [date = "", ...paths] = chunk.split("\n");
			const keys = new Set(paths.map((p) => keyOf(p.trim(), roots)).filter(Boolean));
			return { date: day(date), keys, names: new Set([...keys].map(nameOf)) };
		});
	const all = new Set(commits.flatMap((c) => [...c.names]));
	const sweep = Math.max(8, all.size * SWEEP_SHARE);
	const dates = {};
	// Newest first: the last write wins `added`, the first non-sweep write wins `updated`.
	for (const { date, keys, names } of commits) {
		for (const key of keys) {
			dates[prefix + key] ??= {};
			const entry = dates[prefix + key];
			entry.added = date;
			if (!entry.updated && names.size < sweep) entry.updated = date;
		}
	}
	const untracked = git(at, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"--",
		...roots,
	]);
	for (const path of untracked.split("\n")) {
		const key = keyOf(path.trim(), roots);
		if (key) dates[prefix + key] = { added: today, updated: today };
	}
	return dates;
}

/**
 * First and last commit day (YYYY-MM-DD) per component folder or spec file, keyed by repo path.
 * Empty when git is missing or shallow; callers fall back to the specs' own `added`/`updated`.
 */
export function componentDates(cwd, today = day(new Date().toISOString())) {
	try {
		return Object.assign({}, ...REPOS.map((repo) => repoDates(repo, cwd, today)));
	} catch (error) {
		console.warn(`component dates: git unavailable (${error.message})`);
		return {};
	}
}
