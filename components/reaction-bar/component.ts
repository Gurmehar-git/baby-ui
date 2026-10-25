import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { reactionBar as reactionBarVariants } from "./variants";

const VARIANTS = ["pill", "chips"];

export const reactionBar = defineComponent({
	slug: "reaction-bar",
	name: "Reaction Bar",
	description:
		"Like, comment, repost and share in one row: a pressed icon fills and pops, and its count rolls in.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(reactionBarVariants, ["variant", "tone"]),
	props: [
		{
			name: "value",
			type: "string[]",
			description:
				"ReactionBar: values of the pressed reactions. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"ReactionBar: every action in one raised pill, or each as its own quiet chip that tints while pressed.",
			default: "pill",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "locale",
			type: "string",
			description: "ReactionBar: formats counts compactly (1.2K) in this locale.",
			control: { kind: "none" },
		},
		{
			name: "count",
			type: "number",
			description:
				"ReactionBarItem: everyone else's reactions. Your own press adds one while it is held, so the count stays honest without a round trip.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description:
				'ReactionBarItem: the action\'s name, e.g. "Like"; screen readers hear it with the count.',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: '"default" | "primary" | "destructive" | "violet"',
			description: "ReactionBarItem: the colour the icon and count take while pressed.",
			default: "default",
			control: { kind: "none" },
		},
		{
			name: "icon",
			type: '"like" | "comment" | "repost" | "share"',
			description:
				"ReactionBarIcon: a built-in icon; like and comment fill while pressed. Pass your own as children instead.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"ReactionBar: ReactionBarItem (value, label, count, tone), each holding ReactionBarIcon and ReactionBarCount.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The icon fills without the squish and the count changes in place.",
		behaviour: [
			"Holding a press squishes the icon to 75%; release springs it back with a slight overshoot. It is a transition, so quick taps retarget instead of restarting.",
			"Fillable icons fill with the tone; the count's digits roll and its column folds open from zero on grid columns.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Toggle the focused reaction" }],
		notes: [
			"A labelled group of toggle buttons with aria-pressed.",
			'Each button is named by its label and count ("Like, 128"); the visible count is hidden from screen readers.',
		],
	},
	guidance: {
		when: ["Engagement actions under a post, comment or shared item."],
		whenNot: [{ text: "Feedback on an AI answer.", use: "message" }],
		ai: [
			"Keep the order like, comment, repost, share; drop the ones your product lacks.",
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "ReactionBar" },
		svelte: { entry: "ReactionBar" },
	},
	keywords: ["reactions", "like", "comment", "share", "repost", "social", "engagement"],
});
