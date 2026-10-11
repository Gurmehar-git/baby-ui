import { defineComponent } from "../index.ts";

export const emailPasswordReset = defineComponent({
	slug: "email-password-reset",
	name: "Password Reset",
	description:
		"Password reset link with the request's origin and a clear path for readers who didn't ask.",
	category: "emails",
	status: "beta",
	variants: {
		surface: ["card", "plain"],
	},
	props: [
		{
			name: "requestedAt",
			type: "string",
			description: "Pre-formatted time of the request, top right of the `hero` panel.",
			control: { kind: "none" },
		},
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
			name: "resetUrl",
			type: "string",
			description: "One-time reset link.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "expiresIn",
			type: "string",
			description: 'Pre-formatted lifetime, e.g. "1 hour".',
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "recipientEmail",
			type: "string",
			description: "The account's address, shown back to the reader.",
			control: {
				kind: "none",
			},
		},
		{
			name: "requestDetails",
			type: "{ label: string; value: string }[]",
			description: "Where the request came from (device, location, time).",
			control: {
				kind: "none",
			},
		},
		{
			name: "securityUrl",
			type: "string",
			description: "Account security page, linked from the warning.",
			control: {
				kind: "none",
			},
		},
		{
			name: "heading, intro, actionLabel, expiryText, fallbackLabel, detailsTitle, warningTitle, warningText, securityLabel",
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
			"States that the password is unchanged until the reader acts, which is what worried readers look for first.",
			"The raw link is repeated under the button for clients that block buttons.",
			"Ships a plain-text part next to the HTML; send both.",
		],
	},
	impl: {
		react: {
			entry: "EmailPasswordReset",
			files: [
				{
					path: "email-password-reset/email-password-reset.tsx",
					type: "registry:ui",
				},
				{ path: "email-password-reset/variants.ts", type: "registry:ui" },
			],
			dependencies: ["react-email", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
		svelte: {
			entry: "EmailPasswordReset",
			files: [
				{
					path: "email-password-reset/email-password-reset.svelte",
					type: "registry:ui",
				},
				{ path: "email-password-reset/variants.ts", type: "registry:ui" },
			],
			dependencies: ["@better-svelte-email/components", "tailwind-variants"],
			registryDependencies: ["email-kit"],
		},
	},
	keywords: ["email", "password", "reset", "forgot password", "security"],
});
