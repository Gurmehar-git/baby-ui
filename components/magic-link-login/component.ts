import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { magicLinkLogin as magicLinkLoginVariants } from "./variants";

const none = { kind: "none" } as const;

export const magicLinkLogin = defineComponent({
	slug: "magic-link-login",
	name: "Magic Link Login",
	description:
		"Composable passwordless sign-in: an email form, optional OAuth buttons, then a check-your-inbox view with a resend countdown.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(magicLinkLoginVariants, ["variant", "layout"]),
	props: [
		{
			name: "status",
			type: '"idle" | "sending" | "sent" | "error"',
			description:
				'MagicLinkLogin: controlled. "sent" shows the inbox view; "sending" and "error" stay on whichever view is showing.',
			required: true,
			control: { kind: "select", options: ["idle", "sending", "sent", "error"] },
		},
		{
			name: "email",
			type: "string",
			description:
				"MagicLinkLogin: bindable in Svelte; in React, controlled with onEmailChange or left uncontrolled.",
			control: none,
		},
		{
			name: "error",
			type: "string",
			description:
				'MagicLinkLogin: server message for the "error" status; folds open under the field or the resend hint.',
			control: none,
		},
		{
			name: "resendAvailableAt",
			type: "number",
			description:
				'MagicLinkLogin: epoch ms when resending unlocks. The button reads "Send again in 0:24" until then.',
			control: none,
		},
		{
			name: "now",
			type: "number",
			description:
				"MagicLinkLogin: current epoch ms, ticked by the parent. The cooldown is derived from it.",
			control: none,
		},
		{
			name: "variant",
			type: '"card" | "plain"',
			description:
				"MagicLinkLogin: a bordered card, or no frame for pages that supply their own.",
			default: "card",
			control: { kind: "select", options: ["card", "plain"] },
		},
		{
			name: "layout",
			type: '"centered" | "split"',
			description:
				"MagicLinkLogin: a single column, or the panel beside MagicLinkLoginAside from md up.",
			default: "centered",
			control: { kind: "select", options: ["centered", "split"] },
		},
		{
			name: "labels",
			type: "Partial<MagicLinkLabels>",
			description: "MagicLinkLogin: overrides for every visible string.",
			control: none,
		},
		{
			name: "onSubmit",
			type: "(email: string) => void",
			description:
				"MagicLinkLoginEmail: fires with the trimmed, lowercased address once it passes validation.",
			required: true,
			control: none,
		},
		{
			name: "providers / onProvider / pending",
			type: "{ id: string; label: string; icon?: ReactNode | Snippet }[]",
			description:
				'MagicLinkLoginProviders: OAuth buttons above an "or" divider; the pending one spins, the others disable.',
			control: none,
		},
		{
			name: "onResend / onBack",
			type: "() => void",
			description:
				'MagicLinkLoginResend: resend once the cooldown is over; onBack adds "Use a different email" (set status to "idle" there).',
			control: none,
		},
		{
			name: "headingLevel",
			type: "1 | 2 | 3 | 4 | 5 | 6",
			description:
				"MagicLinkLoginHeader and MagicLinkLoginSentHeader: use 1 on a dedicated sign-in page.",
			default: 2,
			control: none,
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The form and inbox views swap instantly; messages fold without moving.",
		behaviour: [
			"The form and inbox views share one grid cell, so the height never jumps when they swap.",
			"The incoming view fades and rises on the dropdown duration; the outgoing one leaves on the exit duration.",
			"A bad address or server error folds open under the field, and shut once you type.",
			"Legal links firm their underline on hover.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter"], action: "Submits the form" },
			{ keys: ["Tab"], action: "Reaches providers, the field and every inbox action" },
		],
		notes: [
			"A real form with a labelled email input: autocomplete=email, inputmode=email.",
			"Errors set aria-invalid and are linked with aria-describedby.",
			"Focus moves to the Check your inbox heading on send, and back to the field on Use a different email.",
			"Sending, sent and errors are announced through a polite live region.",
			"The resend button says how long is left instead of sitting disabled without a reason.",
		],
	},
	impl: {
		react: {
			entry: "MagicLinkLogin",
		},
		svelte: {
			entry: "MagicLinkLogin",
		},
	},
	keywords: ["login", "sign in", "magic link", "passwordless", "auth", "email", "oauth"],
});
