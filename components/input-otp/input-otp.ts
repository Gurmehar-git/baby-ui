import { defineComponent } from "@baby-ui/registry-schema";

export const inputOtp = defineComponent({
	slug: "input-otp",
	name: "Input OTP",
	description:
		"One-time-code field with joined slots, a drawn caret, and native paste and autofill.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "maxLength",
			type: "number",
			description: "Number of slots. `maxlength` in Svelte, as bits-ui names it.",
		},
		{
			name: "value",
			type: "string",
			description: "The code typed so far. Bindable in Svelte; `onChange` in React.",
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Slot size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "invalid",
			type: "boolean",
			description: "Reds every slot; `invalidMotion` plays each time it turns on.",
			default: "false",
			control: { kind: "none" },
		},
		{
			name: "invalidMotion",
			type: '"shake" | "pulse" | "none"',
			description:
				"How a wrong code is announced: the row shakes, each slot pulses, or nothing moves.",
			default: "shake",
			control: { kind: "select", options: ["shake", "pulse", "none"] },
		},
		{
			name: "pattern",
			type: "string",
			description: "Allowed characters, e.g. digits only for a numeric code.",
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The caret stops blinking; slot focus still shows as a border and ring.",
		behaviour: [
			"The active slot lifts its border and ring above its neighbours, so the strip reads as one field.",
			"The caret is drawn, because the real input underneath is invisible.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Backspace"], action: "Clears the previous character" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Moves between slots" },
		],
		notes: [
			"One real input holds the code, so paste, one-time-code autofill and screen readers see a single field.",
			"Set `aria-invalid` on the root and slots to show a wrong code without relying on colour alone; pair it with a message.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "InputOTP",
		},
		svelte: {
			entry: "InputOTP",
		},
	},
	keywords: ["otp", "one-time code", "2fa", "verification", "pin", "form", "auth"],
});
