import { CliError } from "../errors.ts";
import { c } from "../logger.ts";
import { confirm, intro, isInteractive, message, note, outro } from "../ui/index.ts";
import {
	conflicts,
	type Journal,
	listJournals,
	readJournal,
	revert,
} from "../write/tx.ts";
import { type CommonOptions, configuredTargets } from "./shared.ts";

export interface RevertOptions extends CommonOptions {
	readonly id?: string;
	readonly force?: boolean;
}

function describe(j: Journal): string {
	const files = j.ops.map((op) => op.path).filter((p) => !p.startsWith(".baby-ui/"));
	const state = j.revertedBy ? c.dim(` reverted by ${j.revertedBy}`) : "";
	return `${c.bold(j.id)}  ${j.command}${state}\n${c.dim(files.join(", ") || "no files")}`;
}

export async function history(options: CommonOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro("baby-ui history");
	for (const target of targets) {
		const journals = await listJournals(target.root);
		note(
			journals.length ? journals.map(describe).join("\n") : c.dim("nothing yet"),
			target.path,
		);
	}
	outro("Revert one with `baby-ui revert <id>`");
}

async function pick(root: string, id: string | undefined): Promise<Journal> {
	if (id) {
		const journal = await readJournal(root, id);
		if (!journal)
			throw new CliError(`No transaction ${id}.`, { hint: "See `baby-ui history`." });
		return journal;
	}
	// Undo skips transactions already reverted and the reverts themselves, like an editor's undo.
	const latest = (await listJournals(root)).find((j) => !j.revertedBy && !j.revertOf);
	if (!latest) throw new CliError("Nothing to undo.");
	return latest;
}

export async function revertCommand(options: RevertOptions): Promise<void> {
	const targets = await configuredTargets(options);
	intro(options.id ? `baby-ui revert ${options.id}` : "baby-ui undo");
	for (const target of targets) {
		const journal = await pick(target.root, options.id);
		if (journal.revertedBy && !options.force) {
			throw new CliError(`${journal.id} was already reverted by ${journal.revertedBy}.`, {
				hint: `Revert ${journal.revertedBy} to redo it.`,
			});
		}
		const edited = await conflicts(target.root, journal);
		if (edited.length && !options.force) {
			const list = edited.map((e) => `${e.path} (${e.reason})`).join("\n");
			note(list, "Changed since then");
			const go =
				isInteractive() &&
				(await confirm({ message: "Discard those changes too?", initialValue: false }));
			if (!go)
				throw new CliError("Revert cancelled.", {
					hint: "Pass --force to discard them.",
				});
		}
		const result = await revert(target.root, journal);
		message(`${c.green("reverted")} ${journal.id} (${journal.command})`);
		message(c.dim(`Redo with \`baby-ui revert ${result.id}\``));
	}
	outro("Done");
}
