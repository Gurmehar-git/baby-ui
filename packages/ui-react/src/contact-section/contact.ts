export interface ContactMessage {
	name: string;
	email: string;
	topic: string;
	message: string;
}

export type ContactStatus = "idle" | "submitting" | "success" | "error";

export interface ContactChannelEntry {
	value: string;
	label: string;
	/** One line under the label, e.g. a response time. */
	meta?: string;
}

export interface ContactOffice {
	city: string;
	/** IANA time zone, for the live local time and open status. */
	timeZone: string;
	address: string[];
	email?: string;
	/** Opening hours in local 24-hour time; defaults to 9 to 18. */
	hours?: [number, number];
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function contactProblems(message: ContactMessage) {
	const problems: Partial<Record<keyof ContactMessage, string>> = {};
	if (message.name.trim().length < 2) problems.name = "Enter your name.";
	if (!EMAIL.test(message.email.trim()))
		problems.email = "Enter a full address, like name@example.com.";
	if (message.message.trim().length < 10) problems.message = "Add a little more detail.";
	return problems;
}

/** The office's local time and whether it is inside opening hours on a weekday. */
export function officeClock(office: ContactOffice, now: Date, locale?: string) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: office.timeZone,
		hour: "numeric",
		hourCycle: "h23",
		weekday: "short",
	}).formatToParts(now);
	const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
	const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
	const [open, close] = office.hours ?? [9, 18];
	const time = new Intl.DateTimeFormat(locale, {
		timeZone: office.timeZone,
		hour: "numeric",
		minute: "2-digit",
	}).format(now);
	return {
		time,
		open: weekday !== "Sat" && weekday !== "Sun" && hour >= open && hour < close,
	};
}
