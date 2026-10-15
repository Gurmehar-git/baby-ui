import { c } from "../logger.ts";

export type StepStatus = "active" | "submit" | "cancel";

export const S = {
	bar: "│",
	barStart: "┌",
	barEnd: "└",
	active: "◆",
	submit: "◇",
	cancel: "■",
	radioOn: "●",
	radioOff: "○",
	checkOn: "◼",
	checkOff: "◻",
	pointer: "›",
	spinner: ["◒", "◐", "◓", "◑"],
} as const;

export const cursor = { hide: "\x1b[?25l", show: "\x1b[?25h" } as const;

/** A gray rail segment, optionally carrying content: `│  text`. */
export function bar(text = ""): string {
	return text ? `${c.gray(S.bar)}  ${text}` : c.gray(S.bar);
}

function stepGlyph(status: StepStatus): string {
	if (status === "submit") return c.green(S.submit);
	if (status === "cancel") return c.red(S.cancel);
	return c.brand(S.active);
}

export function head(status: StepStatus, message: string): string {
	return `${stepGlyph(status)}  ${message}`;
}

/** The collapsed `◇  Message  ›  value` line a prompt leaves behind, plus a rail gap. */
export function summary(status: StepStatus, message: string, value: string): string {
	const shown = status === "cancel" ? c.dim(value) : c.brand(value);
	return `${head(status, message)}  ${c.dim(S.pointer)} ${shown}\n${bar()}`;
}
