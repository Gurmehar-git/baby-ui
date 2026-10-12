export type StepperStatus = "complete" | "current" | "upcoming" | "error";

export type StepperStep = {
	/** Stable key, so each step keeps its own motion when the list changes. */
	id: string;
	label: string;
	/** A short hint under the label. */
	description?: string;
	/** Marks the step failed: the marker turns to an alert and this replaces the description. */
	error?: string;
};

const GAP = 0.09;

export const clampStep = (current: number, count: number) =>
	Math.min(Math.max(Math.round(current), 0), count);

export function stepStatus(
	step: StepperStep,
	index: number,
	active: number,
): StepperStatus {
	if (step.error) return "error";
	if (index < active) return "complete";
	return index === active ? "current" : "upcoming";
}

/** Seconds each connector waits, so a jump across several steps fills or drains them in turn. */
export function stepDelay(index: number, from: number, active: number) {
	if (active > from) return index >= from && index < active ? (index - from) * GAP : 0;
	return index >= active && index < from ? (from - 1 - index) * GAP : 0;
}

/** The current step's ring grows once the last connector has filled. */
export const ringDelay = (from: number, active: number) =>
	Math.max(0, Math.abs(active - from) - 1) * GAP + 0.12;

/** Arrow keys move between reachable steps; Home and End jump to the first and the current one. */
export function moveStepFocus(
	list: HTMLElement,
	event: KeyboardEvent,
	vertical: boolean,
) {
	const rtl = !vertical && getComputedStyle(list).direction === "rtl";
	const back = ["ArrowUp", rtl ? "ArrowRight" : "ArrowLeft"];
	const ahead = ["ArrowDown", rtl ? "ArrowLeft" : "ArrowRight"];
	if (![...back, ...ahead, "Home", "End"].includes(event.key)) return;
	const targets = [...list.querySelectorAll<HTMLButtonElement>("button[data-reachable]")];
	const target = event.target;
	const at = target instanceof HTMLButtonElement ? targets.indexOf(target) : -1;
	if (at < 0) return;
	event.preventDefault();
	const last = targets.length - 1;
	const next =
		event.key === "Home"
			? 0
			: event.key === "End"
				? last
				: back.includes(event.key)
					? Math.max(0, at - 1)
					: Math.min(last, at + 1);
	targets[next]?.focus();
}

export const STATUS_TEXT: Record<StepperStatus, string> = {
	complete: "Completed",
	current: "",
	upcoming: "Not started",
	error: "Error",
};
