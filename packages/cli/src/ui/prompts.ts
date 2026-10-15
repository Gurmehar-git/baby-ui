import { c } from "../logger.ts";
import { isInteractive, type Key, runPrompt } from "./core.ts";
import { bar, cursor, head, S, type StepStatus, summary } from "./theme.ts";

const out = process.stdout;

// Every block ends with an empty rail segment and none starts with one, so they stack evenly.
export function intro(title: string): void {
	out.write(`\n${c.brand(S.barStart)}  ${title}\n${bar()}\n`);
}

export function outro(message: string): void {
	out.write(`${c.brand(S.barEnd)}  ${message}\n\n`);
}

export function cancelOutro(message = "Cancelled"): void {
	out.write(`${c.red(S.barEnd)}  ${c.red(message)}\n\n`);
}

export function note(body: string, title?: string): void {
	const lines: string[] = [];
	if (title) lines.push(`${c.green(S.submit)}  ${c.bold(title)}`);
	for (const line of body.split("\n")) lines.push(bar(line));
	lines.push(bar());
	out.write(`${lines.join("\n")}\n`);
}

export function message(text: string): void {
	out.write(`${bar(text)}\n`);
}

const closer = (error: string) =>
	error ? `${c.red(S.barEnd)}  ${c.red(error)}` : c.gray(S.barEnd);

export interface TextOptions {
	message: string;
	placeholder?: string;
	/** Used when submitted empty and on non-interactive runs. */
	defaultValue?: string;
	initialValue?: string;
	/** Return an error string to reject the value. */
	validate?: (value: string) => string | undefined;
	/** Render dots instead of the typed value (secrets). */
	mask?: boolean;
}

function withCaret(value: string, pos: number, placeholder?: string): string {
	if (value === "") {
		const ph = placeholder ?? "";
		return c.inverse(ph.charAt(0) || " ") + c.dim(ph.slice(1));
	}
	return value.slice(0, pos) + c.inverse(value.charAt(pos) || " ") + value.slice(pos + 1);
}

export async function text(opts: TextOptions): Promise<string> {
	if (!isInteractive()) return opts.defaultValue ?? opts.initialValue ?? "";

	let value = opts.initialValue ?? "";
	let caret = value.length;
	let error = "";
	const shown = () => (opts.mask ? "•".repeat(value.length) : value);

	await runPrompt({
		frame: (status) =>
			status === "active"
				? [
						head("active", opts.message),
						bar(withCaret(shown(), caret, opts.placeholder)),
						closer(error),
					].join("\n")
				: summary(status, opts.message, shown() || opts.defaultValue || ""),
		onKey: (key: Key, ctx) => {
			if (key.name === "return") {
				if (value === "" && opts.defaultValue !== undefined) value = opts.defaultValue;
				const err = opts.validate?.(value);
				if (err) error = err;
				else ctx.submit();
				return;
			}
			error = "";
			if (key.name === "backspace" && caret > 0) {
				value = value.slice(0, caret - 1) + value.slice(caret);
				caret--;
			} else if (key.name === "left") caret = Math.max(0, caret - 1);
			else if (key.name === "right") caret = Math.min(value.length, caret + 1);
			else if (key.name === "home") caret = 0;
			else if (key.name === "end") caret = value.length;
			else {
				const ch = key.sequence;
				if (ch && ch.length === 1 && ch >= " " && !key.ctrl && !key.meta) {
					value = value.slice(0, caret) + ch + value.slice(caret);
					caret++;
				}
			}
		},
	});

	return value || opts.defaultValue || "";
}

export interface SelectOption<T> {
	value: T;
	label: string;
	hint?: string;
}

export interface SelectOptions<T> {
	message: string;
	options: Array<SelectOption<T>>;
	initialValue?: T;
}

const step = (key: Key, index: number, n: number) => {
	if (key.name === "up" || key.name === "k") return (index - 1 + n) % n;
	if (key.name === "down" || key.name === "j") return (index + 1) % n;
	return index;
};

export async function select<T>(opts: SelectOptions<T>): Promise<T> {
	const first = opts.options[0];
	if (!first) throw new Error("select requires at least one option");

	let index = Math.max(
		0,
		opts.options.findIndex((o) => o.value === opts.initialValue),
	);
	if (!isInteractive()) return (opts.options[index] ?? first).value;

	const frame = (status: StepStatus): string => {
		if (status !== "active") {
			return summary(status, opts.message, (opts.options[index] ?? first).label);
		}
		const lines = [head("active", opts.message)];
		opts.options.forEach((o, i) => {
			const on = i === index;
			const dot = on ? c.green(S.radioOn) : c.gray(S.radioOff);
			const hint = on && o.hint ? c.dim(`  ${o.hint}`) : "";
			lines.push(bar(`${dot} ${on ? c.white(o.label) : c.dim(o.label)}${hint}`));
		});
		lines.push(c.gray(S.barEnd));
		return lines.join("\n");
	};

	await runPrompt({
		frame,
		onKey: (key, ctx) => {
			if (key.name === "return") ctx.submit();
			else index = step(key, index, opts.options.length);
		},
	});

	return (opts.options[index] ?? first).value;
}

export interface MultiSelectOptions<T> {
	message: string;
	options: Array<SelectOption<T>>;
	initialValues?: T[];
	required?: boolean;
}

export async function multiselect<T>(opts: MultiSelectOptions<T>): Promise<T[]> {
	const selected = new Set<number>();
	opts.options.forEach((o, i) => {
		if (opts.initialValues?.includes(o.value)) selected.add(i);
	});
	const values = (): T[] =>
		opts.options.filter((_, i) => selected.has(i)).map((o) => o.value);

	if (!isInteractive()) return values();

	let index = 0;
	let error = "";

	const frame = (status: StepStatus): string => {
		if (status !== "active") {
			const labels = opts.options.filter((_, i) => selected.has(i)).map((o) => o.label);
			return summary(status, opts.message, labels.join(", ") || "none");
		}
		const lines = [
			`${head("active", opts.message)}  ${c.dim("(space toggles, a for all)")}`,
		];
		opts.options.forEach((o, i) => {
			const on = i === index;
			const picked = selected.has(i);
			const box = picked
				? c.green(S.checkOn)
				: on
					? c.white(S.checkOff)
					: c.gray(S.checkOff);
			const label = on ? c.white(o.label) : picked ? o.label : c.dim(o.label);
			const hint = on && o.hint ? c.dim(`  ${o.hint}`) : "";
			lines.push(bar(`${box} ${label}${hint}`));
		});
		lines.push(closer(error));
		return lines.join("\n");
	};

	await runPrompt({
		frame,
		onKey: (key, ctx) => {
			const n = opts.options.length;
			if (key.name === "space") {
				error = "";
				if (selected.has(index)) selected.delete(index);
				else selected.add(index);
			} else if (key.name === "a") {
				error = "";
				if (selected.size === n) selected.clear();
				else for (let i = 0; i < n; i++) selected.add(i);
			} else if (key.name === "return") {
				if (opts.required && selected.size === 0) error = "Select at least one option.";
				else ctx.submit();
			} else index = step(key, index, n);
		},
	});

	return values();
}

export interface ConfirmOptions {
	message: string;
	initialValue?: boolean;
}

export async function confirm(opts: ConfirmOptions): Promise<boolean> {
	let value = opts.initialValue ?? true;
	if (!isInteractive()) return value;

	const choice = (label: string, on: boolean) =>
		on
			? `${c.green(S.radioOn)} ${c.white(label)}`
			: `${c.gray(S.radioOff)} ${c.dim(label)}`;

	await runPrompt({
		frame: (status) =>
			status === "active"
				? [
						head("active", opts.message),
						bar(`${choice("Yes", value)}   ${choice("No", !value)}`),
						c.gray(S.barEnd),
					].join("\n")
				: summary(status, opts.message, value ? "Yes" : "No"),
		onKey: (key, ctx) => {
			if (["left", "right", "h", "l", "tab"].includes(key.name ?? "")) value = !value;
			else if (key.name === "y") value = true;
			else if (key.name === "n") value = false;
			else if (key.name === "return") ctx.submit();
		},
	});

	return value;
}

export interface Spinner {
	start(message: string): void;
	update(message: string): void;
	stop(message?: string, ok?: boolean): void;
}

/** One-line spinner; non-interactive streams get plain before/after lines. */
export function spinner(): Spinner {
	let timer: ReturnType<typeof setInterval> | undefined;
	let frame = 0;
	let label = "";
	const interactive = isInteractive();

	return {
		start(msg) {
			label = msg;
			if (!interactive) {
				out.write(`${bar(label)}\n`);
				return;
			}
			out.write(cursor.hide);
			timer = setInterval(() => {
				frame = (frame + 1) % S.spinner.length;
				out.write(`\r${c.brand(S.spinner[frame] ?? "")}  ${label}\x1b[0K`);
			}, 120);
		},
		update(msg) {
			label = msg;
		},
		stop(msg, ok = true) {
			clearInterval(timer);
			timer = undefined;
			if (!interactive) {
				if (msg) out.write(`${bar(msg)}\n`);
				return;
			}
			const glyph = ok ? c.green(S.submit) : c.red(S.cancel);
			out.write(`\r${glyph}  ${msg ?? label}\x1b[0K\n${bar()}\n${cursor.show}`);
		},
	};
}
