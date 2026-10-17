import { defineComponent } from "@baby-ui/registry-schema";

export const emailKit = defineComponent({
	slug: "email-kit",
	name: "Email Kit",
	description:
		"Shell, header, heading, text, button, callout, divider, footer, code and key-value parts for transactional email, themed from your tokens as hex.",
	category: "emails",
	status: "beta",
	variants: {
		surface: ["card", "plain", "stacked"],
		variant: ["lockup", "logo"],
		tone: ["neutral", "info", "success", "warning", "destructive"],
	},
	props: [
		{
			name: "preview",
			type: "string",
			description:
				"EmailShell: inbox preview line after the subject; keep it under ~90 characters.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "surface",
			type: '"card" | "plain" | "stacked"',
			description:
				"EmailShell: a 600px bordered card, content straight on the page, or EmailSection cards.",
			default: "card",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"lockup" | "logo"',
			description:
				"EmailHeader: a square mark beside the product name, or a wordmark image on its own.",
			default: "lockup",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: '"neutral" | "info" | "success" | "warning" | "destructive"',
			description:
				"EmailCallout: soft fill for notices; the text still says what happened.",
			default: "neutral",
			control: { kind: "none" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"EmailShell sets `lang` and the preview line; every image needs meaningful `alt`.",
			"Colour never carries meaning alone: callout tones pair with text that states the outcome.",
		],
	},
	impl: {
		react: {
			entry: "EmailShell",
		},
		svelte: {
			entry: "EmailShell",
			// The consumer's renderer takes this Tailwind config; no kit file imports it.
			files: [{ path: "lib/email-theme.ts", type: "registry:lib" }],
		},
	},
	installDir: "emails/ui",
	keywords: [
		"email",
		"react email",
		"better svelte email",
		"transactional",
		"newsletter",
	],
});
