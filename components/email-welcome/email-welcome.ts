import { defineComponent } from "@baby-ui/registry-schema";

const DENSITIES = ["comfortable", "compact"];

export const emailWelcome = defineComponent({
	slug: "email-welcome",
	name: "Welcome Email",
	description:
		"Sent right after sign-up: greets the user, lists their first few actions and links to the product.",
	category: "emails",
	status: "beta",
	variants: { density: DENSITIES },
	props: [
		{
			name: "heroImageUrl, heroImageAlt",
			type: "string",
			description:
				"Absolute URL of a wide illustration or product shot above the heading, with alt text.",
			control: { kind: "none" },
		},
		{
			name: "productName",
			type: "string",
			description: "Shown in the header, heading and preview line.",
			required: true,
			default: "Acme",
			control: { kind: "text" },
		},
		{
			name: "recipientName",
			type: "string",
			description: "First name; the heading drops it when omitted.",
			default: "Ada",
			control: { kind: "text" },
		},
		{
			name: "actionUrl",
			type: "string",
			description: "Where the button lands: usually the dashboard or first setup screen.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "actionLabel",
			type: "string",
			description: "Button text; name the destination.",
			default: "Get started",
			control: { kind: "text" },
		},
		{
			name: "steps",
			type: "{ title: string; description: string; href?: string; actionLabel?: string }[]",
			description:
				"Two to four first actions, each with an optional deep link; an empty list hides the section.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "companyLines",
			type: "string[]",
			description: "Sender name and postal address, one line each, in the footer.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "logoUrl",
			type: "string",
			description:
				"Absolute PNG URL of a square mark, set beside the product name in the header and footer.",
			control: { kind: "none" },
		},
		{
			name: "resources",
			type: "{ title: string; description: string; href: string }[]",
			description:
				"Docs, templates or community links, each a titled row in its own card.",
			control: { kind: "none" },
		},
		{
			name: "note",
			type: "{ name: string; message: string; role?: string; avatarUrl?: string }",
			description: "A short signed note, e.g. from a founder; the help line joins it.",
			control: { kind: "none" },
		},
		{
			name: "supportEmail",
			type: "string",
			description: "Adds a help line with a mailto link.",
			control: { kind: "none" },
		},
		{
			name: "footerLinks",
			type: "{ label: string; href: string }[]",
			description: "Footer links such as notification settings or the privacy policy.",
			control: { kind: "none" },
		},
		{
			name: "preview",
			type: "string",
			description: "Inbox preview line; defaults to one built from `productName`.",
			control: { kind: "none" },
		},
		{
			name: "heading",
			type: "string",
			description:
				"Defaults to `Welcome, {recipientName}` or `Welcome to {productName}`.",
			control: { kind: "none" },
		},
		{
			name: "intro",
			type: "string",
			description: "Sentence under the heading that leads into the steps.",
			control: { kind: "none" },
		},
		{
			name: "supportLabel",
			type: "string",
			description: "Lead-in before the support address.",
			default: "Questions? Reply to this email or write to",
			control: { kind: "none" },
		},
		{
			name: "density",
			type: DENSITIES.map((v) => `"${v}"`).join(" | "),
			description: "Spacing between the steps.",
			default: "comfortable",
			control: { kind: "select", options: DENSITIES },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"Steps are numbered in text, not by colour, and read in order without the table layout.",
			"Ships a plain-text part next to the HTML; send both.",
		],
	},
	impl: {
		react: {
			entry: "EmailWelcome",
			files: [
				{ path: "email-welcome/email-welcome.tsx", type: "registry:ui" },
				{ path: "email-welcome/variants.ts", type: "registry:ui" },
			],
			dependencies: ["react-email", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
		svelte: {
			entry: "EmailWelcome",
			files: [
				{ path: "email-welcome/email-welcome.svelte", type: "registry:ui" },
				{ path: "email-welcome/variants.ts", type: "registry:ui" },
			],
			dependencies: ["@better-svelte-email/components", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
	},
	keywords: ["email", "welcome", "onboarding", "sign up", "transactional"],
});
