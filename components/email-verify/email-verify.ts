import { defineComponent } from "@baby-ui/registry-schema";

export const emailVerify = defineComponent({
	slug: "email-verify",
	name: "Verify Email",
	description:
		"Confirms a new account's email address with a one-time link and an optional code.",
	category: "emails",
	status: "beta",
	variants: { surface: ["card", "plain"] },
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
			name: "helpItems",
			type: "{ title?: string; text: string; iconUrl?: string }[]",
			description: "Ways to reach support (email, phone, hours), listed under the panel.",
			control: { kind: "none" },
		},
		{
			name: "recipientEmail",
			type: "string",
			description: "The address being confirmed, shown back to the reader.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "verifyUrl",
			type: "string",
			description: "One-time confirmation link.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "expiresIn",
			type: "string",
			description: 'Pre-formatted link lifetime, e.g. "24 hours".',
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "code",
			type: "string",
			description: "Optional code for readers who opened the email on another device.",
			control: {
				kind: "none",
			},
		},
		{
			name: "heading, intro, actionLabel, codeLabel, fallbackLabel, ignoreText",
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
			"The link is repeated as text under the button for clients that block buttons.",
			"The address is shown back so readers with several accounts know which one this is.",
			"Ships a plain-text part next to the HTML; send both.",
		],
	},
	impl: {
		react: {
			entry: "EmailVerify",
			files: [
				{
					path: "email-verify/email-verify.tsx",
					type: "registry:ui",
				},
				{ path: "email-verify/variants.ts", type: "registry:ui" },
			],
			dependencies: ["react-email", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
		svelte: {
			entry: "EmailVerify",
			files: [
				{
					path: "email-verify/email-verify.svelte",
					type: "registry:ui",
				},
				{ path: "email-verify/variants.ts", type: "registry:ui" },
			],
			dependencies: ["@better-svelte-email/components", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
	},
	keywords: ["email", "verify", "confirm", "sign up", "transactional"],
});
