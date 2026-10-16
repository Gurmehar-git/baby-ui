import { defineComponent } from "@baby-ui/registry-schema";

export const emailMagicLink = defineComponent({
	slug: "email-magic-link",
	name: "Magic Link",
	description:
		"Passwordless sign-in with a one-time link, an optional code and the request's origin.",
	category: "emails",
	status: "beta",
	variants: {
		surface: ["card", "plain"],
	},
	props: [
		{
			name: "productName",
			type: "string",
			description: "Shown in the header, heading and preview line.",
			control: {
				kind: "text",
			},
			required: true,
			default: "Acme",
		},
		{
			name: "signInUrl",
			type: "string",
			description: "One-time sign-in link.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "expiresIn",
			type: "string",
			description: 'Pre-formatted lifetime, e.g. "10 minutes".',
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "code",
			type: "string",
			description:
				"One-time code; when set it leads and the button becomes the alternative.",
			control: {
				kind: "none",
			},
		},
		{
			name: "requestDetails",
			type: "{ label: string; value: string }[]",
			description:
				"Where the request came from (device, location, time), so a stranger's attempt stands out.",
			control: {
				kind: "none",
			},
		},
		{
			name: "heading, intro, actionLabel, codeLabel, expiryText, detailsTitle, warningTitle, warningText",
			type: "string",
			description: "Copy overrides for translation or tone.",
			control: {
				kind: "none",
			},
		},
		{
			name: "companyLines",
			type: "string[]",
			description: "Sender name and postal address, one line each, in the footer.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "logoUrl",
			type: "string",
			description:
				"Absolute PNG URL of a square mark, set beside the product name in the header and footer.",
			control: {
				kind: "none",
			},
		},
		{
			name: "footerLinks",
			type: "{ label: string; href: string }[]",
			description: "Footer links such as notification settings or the privacy policy.",
			control: {
				kind: "none",
			},
		},
		{
			name: "reason",
			type: "string",
			description: "Footer line saying why the email arrived.",
			control: {
				kind: "none",
			},
		},
		{
			name: "preview",
			type: "string",
			description: "Inbox preview line; the default is built from the other props.",
			control: {
				kind: "none",
			},
		},
		{
			name: "surface",
			type: '"card" | "plain"',
			description: "A bordered card on a quiet page, or content straight on the page.",
			control: {
				kind: "select",
				options: ["card", "plain"],
			},
			default: "card",
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"The warning says what to do if the reader didn't ask, without alarming language.",
			"Put the code in the preview line only if your threat model allows it; override `preview` otherwise.",
			"Ships a plain-text part next to the HTML; send both.",
		],
	},
	impl: {
		react: {
			entry: "EmailMagicLink",
			files: [
				{
					path: "email-magic-link/email-magic-link.tsx",
					type: "registry:ui",
				},
				{ path: "email-magic-link/variants.ts", type: "registry:ui" },
			],
			dependencies: ["react-email", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
		svelte: {
			entry: "EmailMagicLink",
			files: [
				{
					path: "email-magic-link/email-magic-link.svelte",
					type: "registry:ui",
				},
				{ path: "email-magic-link/variants.ts", type: "registry:ui" },
			],
			dependencies: ["@better-svelte-email/components", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
	},
	keywords: ["email", "magic link", "otp", "sign in", "passwordless", "security"],
});
