export type MagicLinkStatus = "idle" | "sending" | "sent" | "error";

/** `Icon` is a ReactNode in React and a Snippet in Svelte. */
export type MagicLinkProvider<Icon = unknown> = {
	id: string;
	label: string;
	icon?: Icon;
};

export type MagicLinkInbox = { name: string; href: string };

export type MagicLinkLabels = {
	title: string;
	description: string;
	email: string;
	placeholder: string;
	submit: string;
	sending: string;
	invalid: string;
	or: string;
	sentTitle: string;
	/** Precedes the address: "We sent a sign-in link to name@company.com." */
	sentTo: string;
	sentBody: string;
	sentHint: string;
	resend: string;
	resendIn: string;
	announceSent: string;
	differentEmail: string;
	openInbox: string;
	continueWith: string;
};

export const MAGIC_LINK_LABELS: MagicLinkLabels = {
	title: "Sign in",
	description: "We email you a link that signs you in. No password to remember.",
	email: "Email",
	placeholder: "you@company.com",
	submit: "Email me a sign-in link",
	sending: "Sending link",
	invalid: "Enter an email address like name@company.com.",
	or: "or",
	sentTitle: "Check your inbox",
	sentTo: "We sent a sign-in link to",
	sentBody: "Open it on this device to finish signing in.",
	sentHint: "Nothing yet? Check spam, or send a new link.",
	resend: "Send a new link",
	resendIn: "Send again in",
	announceSent: "Sign-in link sent.",
	differentEmail: "Use a different email",
	openInbox: "Open",
	continueWith: "Continue with",
};

/** Trimmed and lowercased, the form a sign-in link is keyed on. */
export function normalizeEmail(raw: string): string {
	return raw.trim().toLowerCase();
}

// Pragmatic, not RFC 5322: one @, no spaces, a dotted domain. The server has the final word.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isValidEmail(email: string): boolean {
	return EMAIL.test(normalizeEmail(email));
}

const INBOXES: [domains: string[], inbox: MagicLinkInbox][] = [
	[
		["gmail.com", "googlemail.com"],
		{ name: "Gmail", href: "https://mail.google.com/mail/u/0/" },
	],
	[
		["outlook.com", "hotmail.com", "live.com", "msn.com"],
		{ name: "Outlook", href: "https://outlook.live.com/mail/0/inbox" },
	],
	[["yahoo.com", "ymail.com"], { name: "Yahoo Mail", href: "https://mail.yahoo.com" }],
	[
		["icloud.com", "me.com", "mac.com"],
		{ name: "iCloud Mail", href: "https://www.icloud.com/mail" },
	],
	[
		["proton.me", "protonmail.com", "pm.me"],
		{ name: "Proton Mail", href: "https://mail.proton.me" },
	],
	[
		["fastmail.com", "fastmail.fm"],
		{ name: "Fastmail", href: "https://app.fastmail.com" },
	],
];

/** The webmail inbox for a known consumer domain; null for anything else, so nothing is guessed. */
export function inboxFor(email: string): MagicLinkInbox | null {
	const domain = normalizeEmail(email).split("@")[1];
	if (!domain) return null;
	return INBOXES.find(([domains]) => domains.includes(domain))?.[1] ?? null;
}

/** Whole seconds until a resend is allowed; 0 when there is no cooldown. */
export function cooldownSeconds(
	resendAvailableAt: number | undefined,
	now: number,
): number {
	if (resendAvailableAt === undefined) return 0;
	return Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
}

/** 24 reads "0:24", 83 reads "1:23". */
export function formatCooldown(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
