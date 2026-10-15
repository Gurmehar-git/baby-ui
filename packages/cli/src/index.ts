import { readFileSync } from "node:fs";
import { Command } from "commander";
import { CliError } from "./errors.ts";
import { c, log } from "./logger.ts";
import { acceptDefaults, PromptCancelled } from "./ui/core.ts";

function version(): string {
	try {
		const pkg: unknown = JSON.parse(
			readFileSync(new URL("../package.json", import.meta.url), "utf8"),
		);
		return typeof pkg === "object" && pkg && "version" in pkg
			? String(pkg.version)
			: "0.0.0";
	} catch {
		return "0.0.0";
	}
}

interface TargetedOptions {
	target: string[];
	all?: boolean;
}

interface AddFlags {
	overwrite?: boolean;
	dryRun?: boolean;
	install: boolean;
}

interface ListFlags {
	type?: string;
	json?: boolean;
}

interface DiffFlags {
	stat?: boolean;
	exitCode?: boolean;
}

interface RepairFlags {
	adopt?: boolean;
	force?: boolean;
	dryRun?: boolean;
	install: boolean;
}

interface InitFlags {
	css?: string;
	base: boolean;
	install: boolean;
	dryRun?: boolean;
	force?: boolean;
}

const collect = (value: string, previous: string[]) => [...previous, value];

function targeted(command: Command): Command {
	return command
		.option("-t, --target <name|path>", "project in a monorepo (repeatable)", collect, [])
		.option("-a, --all", "every project with a components.json");
}

const common = (cli: Command, opts: TargetedOptions) => ({
	cwd: cli.opts<{ cwd: string }>().cwd,
	target: opts.target,
	all: opts.all,
});

// Commands are imported on use so `--help` never pays for parsers or the registry client.
function program(): Command {
	const cli = new Command()
		.name("baby-ui")
		.description(
			"Add Baby UI and shadcn registry components to React and Svelte projects",
		)
		.version(version(), "-v, --version")
		.option("--cwd <dir>", "working directory", process.cwd())
		.option("-y, --yes", "take every prompt's default (also when not a TTY or CI is set)")
		.hook("preAction", () => {
			if (cli.opts<{ yes?: boolean }>().yes) acceptDefaults();
		});

	targeted(cli.command("init"))
		.description("set up components.json, utils and the Baby UI theme")
		.option("--css <path>", "global stylesheet, relative to the project")
		.option("--no-base", "skip the theme and tokens")
		.option("--no-install", "skip installing npm dependencies")
		.option("--dry-run", "show what would change and write nothing")
		.option("-f, --force", "rewrite an existing components.json")
		.action(async (opts: TargetedOptions & InitFlags) => {
			const { init } = await import("./commands/init.ts");
			await init({ ...common(cli, opts), ...opts }, version());
		});

	cli
		.command("info")
		.description("show detected projects, frameworks, aliases and package managers")
		.option("--json", "machine-readable output")
		.action(async (opts: { json?: boolean }) => {
			const { info } = await import("./commands/info.ts");
			await info({ cwd: cli.opts<{ cwd: string }>().cwd, ...opts });
		});

	targeted(cli.command("add"))
		.description("add components from Baby UI, a URL, or a components.json registry")
		.argument("<items...>", "names, @namespace/name, URLs or local .json files")
		.option("-o, --overwrite", "replace files that differ without asking")
		.option("--dry-run", "show what would change and write nothing")
		.option("--no-install", "skip installing npm dependencies")
		.action(async (items: string[], opts: TargetedOptions & AddFlags) => {
			const { add } = await import("./commands/add.ts");
			await add({ ...common(cli, opts), ...opts, items });
		});

	cli
		.command("login")
		.description("save a Pro licence key (or set BABY_UI_TOKEN)")
		.option("--token <key>", "licence key, for scripts")
		.action(async (opts: { token?: string }) => {
			const { login } = await import("./commands/auth.ts");
			await login(opts);
		});

	cli
		.command("logout")
		.description("remove the saved licence key")
		.action(async () => {
			const { logout } = await import("./commands/auth.ts");
			await logout();
		});

	cli
		.command("whoami")
		.description("show which licence key is in use")
		.action(async () => {
			const { whoami } = await import("./commands/auth.ts");
			await whoami();
		});

	targeted(cli.command("list"))
		.alias("search")
		.description("browse the Baby UI registry; installed items are marked")
		.argument("[query]", "filter by name, title or description")
		.option("--type <type>", "ui, block, lib, style, theme...")
		.option("--json", "machine-readable output")
		.action(async (query: string | undefined, opts: TargetedOptions & ListFlags) => {
			const { list } = await import("./commands/list.ts");
			await list({ ...common(cli, opts), ...opts, query });
		});

	targeted(cli.command("diff"))
		.description("compare installed components with the registry")
		.argument("[items...]", "installed item names (default: all)")
		.option("--stat", "file names only, no line diff")
		.option("--exit-code", "exit 1 when anything differs (CI)")
		.action(async (items: string[], opts: TargetedOptions & DiffFlags) => {
			const { diff } = await import("./commands/maintain.ts");
			await diff({ ...common(cli, opts), ...opts, items });
		});

	targeted(cli.command("update"))
		.description("pull registry changes into installed components, keeping local edits")
		.argument("[items...]", "installed item names (default: all)")
		.option("-o, --overwrite", "replace locally edited files without asking")
		.option("--dry-run", "show what would change and write nothing")
		.option("--no-install", "skip installing npm dependencies")
		.action(async (items: string[], opts: TargetedOptions & AddFlags) => {
			const { update } = await import("./commands/maintain.ts");
			await update({ ...common(cli, opts), ...opts, items });
		});

	targeted(cli.command("repair"))
		.description("restore missing files, broken imports, CSS and packages")
		.argument("[items...]", "installed item names (default: all)")
		.option("--adopt", "record components the stock shadcn CLI installed")
		.option("-f, --force", "also reset locally edited files to the registry version")
		.option("--dry-run", "show what would change and write nothing")
		.option("--no-install", "skip installing npm dependencies")
		.action(async (items: string[], opts: TargetedOptions & RepairFlags) => {
			const { repair } = await import("./commands/maintain.ts");
			await repair({ ...common(cli, opts), ...opts, items });
		});

	targeted(cli.command("doctor"))
		.description("check config, aliases, stylesheet, files and packages (read-only)")
		.action(async (opts: TargetedOptions) => {
			const { doctor } = await import("./commands/maintain.ts");
			await doctor(common(cli, opts));
		});

	targeted(cli.command("undo"))
		.description("revert the last change baby-ui made")
		.option("-f, --force", "discard edits made since that change")
		.action(async (opts: TargetedOptions & { force?: boolean }) => {
			const { revertCommand } = await import("./commands/history.ts");
			await revertCommand({ ...common(cli, opts), force: opts.force });
		});

	targeted(cli.command("revert"))
		.description("revert a specific change from `baby-ui history`")
		.argument("<id>", "transaction id")
		.option("-f, --force", "discard edits made since that change")
		.action(async (id: string, opts: TargetedOptions & { force?: boolean }) => {
			const { revertCommand } = await import("./commands/history.ts");
			await revertCommand({ ...common(cli, opts), id, force: opts.force });
		});

	targeted(cli.command("history"))
		.description("list recent changes that can be reverted")
		.action(async (opts: TargetedOptions) => {
			const { history } = await import("./commands/history.ts");
			await history(common(cli, opts));
		});

	return cli;
}

export async function run(argv: string[]): Promise<void> {
	try {
		await program().parseAsync(argv);
	} catch (error) {
		if (error instanceof PromptCancelled) {
			process.exitCode = 130;
			return;
		}
		if (error instanceof CliError) {
			log.error(error.message);
			if (error.hint) console.error(c.dim(error.hint));
			process.exitCode = error.code;
			return;
		}
		throw error;
	}
}
