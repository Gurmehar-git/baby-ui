import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["card", "plain"];

const files = (main: string) => [
	{ path: `auth-form/${main}`, type: "registry:ui" as const },
	{ path: "auth-form/auth.ts", type: "registry:ui" as const },
	{ path: "auth-form/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const deps = ["button", "checkbox", "field", "input", "input-otp", "password-input"];

export const authForm = defineComponent({
	slug: "auth-form",
	name: "Auth Form",
	description:
		"Sign in or sign up with providers, a passkey, or email and a one-time code; every step and status comes from your props.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "onSubmit",
			type: "(details: AuthDetails) => void",
			description:
				"Called with valid details: the email, plus name, password and updates when signing up.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "On a bordered card, or straight on the page.",
			default: "card",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "mode",
			type: '"sign-in" | "sign-up"',
			description:
				"Sign-up opens name, password and an updates checkbox; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "step",
			type: '"details" | "code"',
			description: "Move to `code` once your server has sent one.",
			default: "details",
			control: { kind: "none" },
		},
		{
			name: "status",
			type: '"idle" | "submitting" | "error"',
			description:
				"Drives the button spinners and the error line; the code field shakes on error.",
			default: "idle",
			control: { kind: "none" },
		},
		{
			name: "onCode",
			type: "(code: string) => void",
			description: "Called once every digit is in.",
			control: { kind: "none" },
		},
		{
			name: "resendAt",
			type: "number",
			description: "Epoch ms when Resend opens; the countdown shows until then.",
			control: { kind: "none" },
		},
		{
			name: "providers",
			type: "{ id: string; label: string; icon?: ReactNode | Snippet }[]",
			description:
				"Single sign-on buttons; `pendingProvider` spins one while the others wait.",
			control: { kind: "none" },
		},
		{
			name: "onPasskey",
			type: "() => void",
			description: "Adds a passkey button in sign-in mode.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Steps and sign-up fields swap without folding.",
		behaviour: [
			"Switching to sign-up unfolds name, password and updates; the card eases to its new height.",
			"The code step folds in over the details step in the same cell.",
			"A wrong code shakes the slots.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter"], action: "Submit the current step" }],
		notes: [
			"Validation waits for the first submit; each field's message is linked as an alert.",
			"Folded fields and the inactive step are inert.",
			"The code field is one real input, so paste and one-time-code autofill work.",
		],
	},
	guidance: {
		when: ["A sign-in or sign-up page with email codes, providers or passkeys."],
		whenNot: [{ text: "Email magic links only.", use: "email-magic-link" }],
		responsive: ["One column; the card keeps a 25rem measure."],
		performance: ["No timers except a one-second clock while a resend countdown runs."],
		ai: [
			"Drive `step` and `status` from your auth calls; never fake them with timeouts.",
			"Pass provider icons yourself; the component ships no brand marks.",
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
			entry: "AuthForm",
			files: files("auth-form.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "AuthForm",
			files: files("auth-form.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["auth", "sign in", "sign up", "login", "otp", "passkey", "sso", "form"],
});
