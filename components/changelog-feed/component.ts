import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { changelogFeed as changelogFeedVariants } from "./variants";

const VARIANTS = ["list", "timeline"];

export const changelogFeed = defineComponent({
	slug: "changelog-feed",
	name: "Changelog Feed",
	description:
		"Release notes by month with kind filters and counts, sticky month headings, and entries that open into details, a photo or a code snippet.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(changelogFeedVariants, ["variant"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "entries",
			type: "ChangelogEntry[]",
			description:
				"Each with id, ISO date, version, kind (new, improved or fixed), title, summary, optional details and media.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Plain rows, or entries threaded on a rail with a dot that lights when open.",
			default: "list",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "actions",
			type: "ReactNode | Snippet",
			description: "Beside the title, such as a subscribe button.",
			control: { kind: "none" },
		},
		{
			name: "kinds",
			type: "ChangelogKind[]",
			description:
				"Kinds shown; empty shows all. Controlled with onKindsChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string[]",
			description:
				"Open entry ids; defaults to the newest. Controlled with onValueChange.",
			control: { kind: "none" },
		},
		{
			name: "endNote",
			type: "string",
			description: "A closing line after the last entry.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Entries and months appear and disappear without folding.",
		behaviour: [
			"Filtered-out entries fold away; a month folds once none of its entries remain.",
			"The update count rolls to the new total.",
			"Entries open on grid rows, as in the accordion.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between entries" },
			{ keys: ["Enter", "Space"], action: "Open or close an entry" },
		],
		notes: [
			"Kind filters are toggle buttons with their counts; the update total is a polite live region.",
			"Each entry pairs its colour badge with the kind's name.",
			"Folded entries and months are inert.",
		],
	},
	guidance: {
		when: ["A product's public release notes."],
		whenNot: [{ text: "An activity log of user events.", use: "timeline" }],
		responsive: ["The date column moves above the title in a container under 36rem."],
		performance: ["Every entry stays mounted; filtering toggles attributes."],
		ai: [
			"One entry per change; keep summaries to one sentence and details to a few bullets.",
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
			entry: "ChangelogFeed",
		},
		svelte: {
			entry: "ChangelogFeed",
		},
	},
	keywords: ["changelog", "release notes", "updates", "versions", "feed", "timeline"],
});
