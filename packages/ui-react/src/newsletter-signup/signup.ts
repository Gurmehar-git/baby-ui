export interface NewsletterStory {
	title: string;
	/** A small square thumbnail. */
	image: string;
	minutes: number;
}

export interface NewsletterIssue {
	number: number;
	/** Send date as it should read, e.g. "Friday, October 2". */
	date: string;
	subject: string;
	/** Up to three stories. */
	stories: NewsletterStory[];
}

export type NewsletterStatus = "idle" | "submitting" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = "Enter your email address";
const FORMAT = "Enter an email like name@company.com";
export const SIGNUP_FAILED = "That didn't go through. Your email is kept, so try again.";
export const SIGNUP_DONE = "Check your inbox to confirm.";

/** What is wrong with `value` as an email address, or null when it reads as one. */
export function emailProblem(value: string): string | null {
	const email = value.trim();
	if (!email) return EMPTY;
	if (!EMAIL.test(email)) return FORMAT;
	return null;
}

/** Every text the message line can show, so hidden copies can reserve the tallest. */
export const signupMessages = (privacy: string, error?: string) => [
	privacy,
	`${SIGNUP_DONE} Use a different email`,
	EMPTY,
	FORMAT,
	error ?? SIGNUP_FAILED,
];

/** The issues on the stack, front first: the upcoming one joins the front once delivered. */
export function stackIssues(
	recent: NewsletterIssue[],
	upcoming: NewsletterIssue | undefined,
	delivered: boolean,
) {
	const front = delivered && upcoming ? [upcoming, ...recent] : recent;
	const shown = front.slice(0, 3).map((issue, depth) => ({ issue, depth }));
	// The oldest stays mounted one step back so it fades out instead of vanishing.
	const leaving = front[3] ? [{ issue: front[3], depth: 3 }] : [];
	const waiting = upcoming && !delivered ? [{ issue: upcoming, depth: -1 }] : [];
	// A stable DOM order: moving a node would cancel its transition, so depth lives in style only.
	return [...shown, ...leaving, ...waiting].sort(
		(a, b) => a.issue.number - b.issue.number,
	);
}

/** Each issue behind the front steps up 12px and shrinks a little; the waiting one sits below, unseen. */
export function stackStyle(depth: number): Record<string, string> {
	if (depth < 0) return { translate: "0 56px", scale: "1", opacity: "0", zIndex: "4" };
	return {
		translate: `0 ${-depth * 12}px`,
		scale: String(1 - depth * 0.045),
		opacity: depth > 2 ? "0" : "1",
		zIndex: String(3 - depth),
	};
}

/** Restarts the field's shake, even when it is already playing. */
export function nudge(el: HTMLElement | null) {
	if (!el) return;
	el.dataset.nudge = "false";
	el.getBoundingClientRect();
	el.dataset.nudge = "true";
}
