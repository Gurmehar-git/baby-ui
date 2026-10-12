import { defineComponent } from "../index.ts";

const VARIANTS = ["inline", "card"];
const STATUSES = ["idle", "submitting", "success", "error"];

const files = (main: string) => [
	{ path: `newsletter-signup/${main}`, type: "registry:ui" as const },
	{ path: "newsletter-signup/signup.ts", type: "registry:ui" as const },
	{ path: "newsletter-signup/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
	{ path: "lib/image.ts", type: "registry:lib" as const },
];

const deps = ["avatar", "button", "input-group", "rolling-digits", "spinner"];

export const newsletterSignup = defineComponent({
	slug: "newsletter-signup",
	name: "Newsletter Signup",
	description:
		"An email signup framed by the newsletter itself: subscribing drops the next issue, addressed to the reader, onto a stack of recent ones.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "The heading; also names the form.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "onSubmit",
			type: "(email: string) => void",
			description:
				"Called with a valid, trimmed email. Drive `status` from your request.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Copy beside the issue stack, or a self-contained card with the stack on top.",
			default: "inline",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "status",
			type: STATUSES.map((v) => `"${v}"`).join(" | "),
			description:
				"The request's state: a spinner while submitting, the delivered issue on success, a retry on error.",
			default: "idle",
			control: { kind: "none" },
		},
		{
			name: "error",
			type: "string",
			description: "Message for the error state; the email is kept.",
			control: { kind: "none" },
		},
		{
			name: "onReset",
			type: "() => void",
			description:
				'From "Use a different email" on success; set `status` back to "idle".',
			control: { kind: "none" },
		},
		{
			name: "issues",
			type: "NewsletterIssue[]",
			description: "Recent issues, newest first; the first three make the stack.",
			control: { kind: "none" },
		},
		{
			name: "upcoming",
			type: "NewsletterIssue",
			description:
				"The next issue; it lands on the stack, addressed to the reader, on success.",
			control: { kind: "none" },
		},
		{
			name: "readers",
			type: "{ count: number; avatars?: { src: string; alt?: string }[] }",
			description: "Reader count and up to three faces; the count ticks up on success.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description: "The email. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: ["snappy"],
		reducedMotion: "Issues take their places at once; the field does not shake.",
		behaviour: [
			"On success the upcoming issue rises onto the front of the stack; older issues step back and the oldest fades.",
			"The reader count rolls up by one and ', including you' opens its own width.",
			"An invalid email or a failed request shakes the field.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter"], action: "Submit the email" }],
		notes: [
			"The message line is a polite live region and describes the field; errors set aria-invalid.",
			"Validation waits for blur or the first submit, then follows each keystroke.",
			"Focus moves to 'Use a different email' on success; only the front issue is exposed.",
		],
	},
	guidance: {
		when: [
			"A blog or publication that wants to show what readers get before they sign up.",
		],
		whenNot: [{ text: "A bare email field inside a form.", use: "input-group" }],
		responsive: [
			"Inline stacks the issue stack under the form in a container under 48rem.",
		],
		performance: [
			"Every issue stays mounted; placing them is CSS transitions on transforms.",
		],
		ai: [
			"Keep `status` in your request handler; never time it.",
			"Pass `upcoming` for the payoff on success; without it the stack stays as is.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "NewsletterSignup",
			files: files("newsletter-signup.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "NewsletterSignup",
			files: files("newsletter-signup.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["newsletter", "signup", "subscribe", "email", "form", "marketing"],
});
