import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { licenseKey as licenseKeyVariants } from "./variants";

const none = { kind: "none" } as const;

export const licenseKey = defineComponent({
	slug: "license-key",
	name: "License Key",
	description:
		"A registry token built from parts: a masked key that rolls in on reveal and shimmers while rotating, copy, seats and dates, a confirmed regenerate, and numbered setup steps.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(licenseKeyVariants, ["variant"]),
	props: [
		{
			name: "licenseKey",
			type: "string",
			description:
				"The token, shared with every part. LicenseKeyValue masks it to its prefix and last 4 characters until revealed; copy always copies the real key.",
			required: true,
			control: none,
		},
		{
			name: "status",
			type: '"idle" | "confirming" | "rotating" | "error"',
			description:
				'Controlled. Bindable in Svelte; React pairs it with onStatusChange. LicenseKeyRotate asks for "confirming"; anything but "idle" opens LicenseKeyConfirm.',
			required: true,
			control: { kind: "select", options: ["idle", "confirming", "rotating", "error"] },
		},
		{
			name: "onRotate",
			type: "() => void",
			description:
				'Fires from LicenseKeyConfirm. Set "rotating", then "idle" with the new key.',
			required: true,
			control: none,
		},
		{
			name: "revealed",
			type: "boolean",
			description:
				"Shows the full key. Bindable in Svelte; React pairs it with onRevealedChange, or takes defaultRevealed.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"card" | "inline"',
			description:
				"`card` wraps the key in a bordered panel. `inline` keeps the same parts on the page surface, for a settings page.",
			default: "card",
			control: { kind: "select", options: ["card", "inline"] },
		},
		{
			name: "children",
			type: "Snippet | ReactNode",
			description:
				"The parts: Header, Heading, Title, Description, Rotate, Pass, PassHeader, Brand, Plan, Value, Meta, MetaItem, Seats, Confirm, Setup, Step and Code. Helpers registrySnippet, envLine and installCommand build the setup text.",
			control: none,
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Chips swap in place; no flip, wave, pulse, ring, ping, spin or pip growth; the confirm step snaps.",
		behaviour: [
			"The key shows as chips of four. Revealing or hiding flips each chip down from its top edge over 360ms, 50ms apart; the eye's slash draws in over 200ms.",
			"While rotating the chips pulse in sequence and the Regenerate icon spins; the new key flips in and each chip rings once in success.",
			"Copying sends a 2px lift across the chips, 50ms apart, their borders tinting toward primary.",
			"Seat pips grow in from the left on first paint, 45ms apart; the plan's live dot pings once.",
			"The confirm step opens with grid-template-rows over 200ms and closes over 120ms.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action:
					"Reaches reveal, copy, regenerate and each copy button in the setup steps",
			},
			{ keys: ["Escape"], action: "Leaves the confirm step" },
		],
		notes: [
			"LicenseKeyRotate is aria-expanded and controls the confirm step; focus moves to Cancel and back.",
			"The reveal toggle is a pressed button with a label that says what it will do.",
			"Copy always copies the real key, even while it is masked on screen.",
			"Rotating and a new key are announced through a polite live region; errors use role=alert.",
			"Setup steps are an ordered list; the numbers are CSS counters, hidden from screen readers.",
		],
	},
	impl: {
		react: {
			entry: "LicenseKey",
		},
		svelte: {
			entry: "LicenseKey",
		},
	},
	keywords: [
		"license",
		"api key",
		"token",
		"registry",
		"shadcn",
		"credentials",
		"settings",
	],
});
