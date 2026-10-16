import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["xs", "sm", "default", "lg", "xl"];

export const passwordInput = defineComponent({
	slug: "password-input",
	name: "Password Input",
	description:
		"A password field with a reveal toggle whose eye a slash draws across, and an optional strength meter with a rule checklist.",
	category: "base",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: "Accessible name of the field.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "string",
			description:
				"The password, paired with `onValueChange(value, strength)`; bindable in Svelte. `defaultValue` seeds it.",
			control: { kind: "none" },
		},
		{
			name: "revealed",
			type: "boolean",
			description:
				"Whether it shows as text, paired with `onRevealedChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "rules",
			type: "PasswordRule[]",
			description:
				"Rules `{ id, label, test }`; passing any shows the meter and checklist. `passwordRules(minLength)` gives length, case, number and symbol.",
			control: { kind: "none" },
		},
		{
			name: "shortLength",
			type: "number",
			description:
				'Below this many characters the meter holds at its first step and reads "Too short".',
			default: 8,
			control: { kind: "none" },
		},
		{
			name: "strengthLabels, showLabel, hideLabel",
			type: "Partial<PasswordStrengthLabels>, string, string",
			description: "Copy for the strength words and the toggle's names, for translation.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Field height on the control ladder.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The slash, segments and ticks change without drawing or easing.",
		behaviour: [
			"Revealing draws a slash across the eye, cutting the outline beneath it, instead of swapping two icons.",
			"Four segments fill and take the tone of the step; each met rule's tick draws itself; the strength word morphs in place.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Toggle reveal on the eye button" }],
		notes: [
			"The reveal is a pressed toggle with a name that says what it will do.",
			"The meter is role=meter with the strength word as its value text; the rule list describes the field and reads met or not met per rule.",
			"Scoring happens on the device; nothing is sent anywhere.",
		],
	},
	guidance: {
		when: ["Sign in (without rules) and creating or changing a password (with rules)."],
		whenNot: [
			{ text: "One-time codes.", use: "input-otp" },
			{ text: "Any text that is not secret.", use: "input" },
		],
		responsive: ["Fills its container; the checklist wraps under the field."],
		performance: [
			"Rules run on every keystroke; keep tests cheap and avoid network checks here.",
		],
		ai: [
			"Pass `rules={passwordRules(12)}` on sign-up forms and nothing on sign-in forms.",
			"Match the rules to what your server enforces, and translate `strengthLabels` with the rest of the form.",
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
			entry: "PasswordInput",
		},
		svelte: {
			entry: "PasswordInput",
		},
	},
	keywords: ["password", "input", "strength", "reveal", "sign up", "form"],
});
