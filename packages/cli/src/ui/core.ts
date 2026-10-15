import { emitKeypressEvents } from "node:readline";
import { cursor, type StepStatus } from "./theme.ts";

export interface Key {
	name?: string;
	ctrl?: boolean;
	meta?: boolean;
	shift?: boolean;
	sequence?: string;
}

export class PromptCancelled extends Error {
	constructor() {
		super("Prompt cancelled");
		this.name = "PromptCancelled";
	}
}

let assumeDefaults = false;

/** `--yes`: every prompt takes its default, as on a non-interactive stream. */
export function acceptDefaults(): void {
	assumeDefaults = true;
}

/** True when both ends are a TTY outside CI; prompts return their defaults otherwise. */
export function isInteractive(): boolean {
	return (
		!assumeDefaults &&
		process.stdin.isTTY === true &&
		process.stdout.isTTY === true &&
		!process.env.CI
	);
}

export interface PromptActions {
	submit(): void;
	cancel(): void;
}

export interface PromptSpec {
	frame(status: StepStatus): string;
	onKey(key: Key, ctx: PromptActions): void;
}

// Redraw moves up by the last frame's line count, so frames must never soft-wrap.
export function runPrompt(spec: PromptSpec): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const input = process.stdin;
		const out = process.stdout;

		emitKeypressEvents(input);
		const wasRaw = input.isRaw === true;
		if (input.isTTY) input.setRawMode(true);
		input.resume();
		out.write(cursor.hide);

		let status: StepStatus = "active";
		let prevLines = 0;
		let settled = false;

		const paint = (): void => {
			const frame = spec.frame(status);
			if (prevLines > 0) out.write(`\x1b[${prevLines}A`);
			out.write("\x1b[0J");
			out.write(`${frame}\n`);
			prevLines = frame.split("\n").length;
		};

		const teardown = (): void => {
			input.off("keypress", onKeypress);
			if (input.isTTY) input.setRawMode(wasRaw);
			input.pause();
			out.write(cursor.show);
		};

		const finish = (next: StepStatus, done: () => void): void => {
			if (settled) return;
			settled = true;
			status = next;
			paint();
			teardown();
			done();
		};

		const ctx: PromptActions = {
			submit: () => finish("submit", resolve),
			cancel: () => finish("cancel", () => reject(new PromptCancelled())),
		};

		const onKeypress = (_str: string | undefined, key: Key = {}): void => {
			if ((key.ctrl && key.name === "c") || key.name === "escape") {
				ctx.cancel();
				return;
			}
			spec.onKey(key, ctx);
			if (!settled) paint();
		};

		input.on("keypress", onKeypress);
		paint();
	});
}
