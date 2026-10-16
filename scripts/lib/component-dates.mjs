import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Where component sources live in each repo; `pro` is a separate checkout with its own history.
 * `legacy` names the layout before the move into components/<slug>/, so old commits key the same.
 */
const REPOS = [
	{
		dir: ".",
		prefix: "",
		legacy: {
			"packages/ui-react/src": "react",
			"packages/ui-svelte/src/lib": "svelte",
			"packages/registry-schema/src/components": "spec",
		},
	},
	{
		dir: "pro",
		prefix: "pro/",
		legacy: {
			"packages/react/src": "react",
			"packages/svelte/src/lib": "svelte",
			"packages/schema/src/components": "spec",
		},
	},
];
const rootsOf = (repo) => ["components", ...Object.keys(repo.legacy)];

// A commit touching this share of components is a format or lint sweep, not an update.
const SWEEP_SHARE = 0.25;

const day = (iso) => iso.slice(0, 10);

/** `components/<slug>/<fw>` for a port, `components/<slug>/<slug>.ts` for a spec. */
function keyOf(path, legacy) {
	const root = rootsOf({ legacy }).find((r) => path.startsWith(`${r}/`));
	if (!root) return null;
	const [head = "", port] = path.slice(root.length + 1).split("/");
	if (head === "lib") return null;
	const was = legacy[root];
	if (was === "spec") {
		const slug = head.replace(/\.ts$/, "");
		return slug === "index" ? null : `components/${slug}/${slug}.ts`;
	}
	if (was) return port ? `components/${head}/${was}` : null;
	if (port === "react" || port === "svelte") return `components/${head}/${port}`;
	return port === `${head}.ts` ? `components/${head}/${port}` : null;
}

const nameOf = (key) =>
	key.startsWith("components/")
		? key.split("/")[1]
		: key.slice(key.lastIndexOf("/") + 1).replace(/\.ts$/, "");

function git(cwd, args) {
	return execFileSync("git", args, {
		cwd,
		encoding: "utf8",
		maxBuffer: 64 * 1024 * 1024,
	});
}

function repoDates({ dir, prefix, legacy }, cwd, today) {
	const at = join(cwd, dir);
	const roots = rootsOf({ legacy });
	if (!existsSync(join(at, ".git"))) return {};
	// A shallow clone would date every component to the clone's first commit.
	if (git(at, ["rev-parse", "--is-shallow-repository"]).trim() === "true") {
		const message = `component dates: ${dir} is a shallow clone, so no New/Updated badges`;
		// In CI that would ship a site with every badge gone; fail instead of warning.
		if (process.env.CI)
			throw Object.assign(new Error(`${message}. Check out with \`fetch-depth: 0\`.`), {
				fatal: true,
			});
		console.warn(`${message}; using spec dates only`);
		return {};
	}
	const commits = git(at, ["log", "--format=%x00%aI", "--name-only", "--", ...roots])
		.split("\0")
		.filter(Boolean)
		.map((chunk) => {
			const [date = "", ...paths] = chunk.split("\n");
			const keys = new Set(paths.map((p) => keyOf(p.trim(), legacy)).filter(Boolean));
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
		const key = keyOf(path.trim(), legacy);
		if (key) dates[prefix + key] = { added: today, updated: today };
	}
	return dates;
}

/**
 * First and last commit day (YYYY-MM-DD) per component folder or spec file, keyed by repo path.
 * Empty when git is missing or shallow (a shallow clone throws in CI); specs' own dates still apply.
 */
export function componentDates(cwd, today = day(new Date().toISOString())) {
	try {
		return Object.assign({}, ...REPOS.map((repo) => repoDates(repo, cwd, today)));
	} catch (error) {
		if (error.fatal) throw error;
		console.warn(`component dates: git unavailable (${error.message})`);
		return {};
	}
}
