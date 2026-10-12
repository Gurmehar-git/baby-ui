<script lang="ts">
import {
	type StreamingSource,
	StreamingText,
	type StreamingToken,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof StreamingText>>(props));

const SOURCE_IMAGES = {
	scoop:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f7a5f'/%3E%3Cpath d='M20 36c0 7 5.4 12 12 12s12-5 12-12H20Z' fill='%23fff'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23bff3dd'/%3E%3C/svg%3E",
	trends:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%232f6fec'/%3E%3Cpath d='M15 43 27 31l8 7 14-18' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
	market:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23e56d24'/%3E%3Cpath d='M17 45V25h8v20h-8Zm11 0V16h8v29h-8Zm11 0V30h8v15h-8Z' fill='%23fff'/%3E%3C/svg%3E",
};

const SOURCES: StreamingSource[] = [
	{
		name: "Scoop Data",
		domain: "scoopdata.io",
		href: "https://scoopdata.io/",
		image: SOURCE_IMAGES.scoop,
	},
	{
		name: "Trends Index",
		domain: "trends.google.com",
		href: "https://trends.google.com/trends/",
		image: SOURCE_IMAGES.trends,
	},
	{
		name: "Market Basket",
		domain: "marketbasket.io",
		href: "https://marketbasket.io/",
		image: SOURCE_IMAGES.market,
	},
];

const CONTENT: StreamingToken[] = [
	..."Pistachio is your fastest-growing flavor, sales are up 23% this month and margins beat vanilla by 8 points."
		.split(" ")
		.map((text) => ({ text })),
	{ text: "", cite: 0 },
	..."Stone-fruit flavors are trending in the same range."
		.split(" ")
		.map((text) => ({ text })),
];

const FOLLOW_UPS = [
	"Which flavors sell best in winter",
	"Compare gelato and soft serve margins",
];

const MARKDOWN_ANSWER = [
	"**Pistachio** is your fastest-growing flavor:",
	"",
	"- Sales are up `23%` this month",
	"- Margins beat vanilla by 8 points",
	"",
	"Stone-fruit flavors are trending in the same range.",
].join("\n");
// Whitespace stays on the chunk before it, so the joined text is the answer verbatim.
const MARKDOWN_CHUNKS = MARKDOWN_ANSWER.split(/(?<=\s)/);

const layout = $derived(p.layout ?? "inline");
const markdown = $derived(p.markdown ?? false);
let count = $state(0);

// Markdown mode is controlled, so the demo scripts the chunks a model would send.
$effect(() => {
	void layout;
	void props.actions;
	count = 0;
	if (!markdown) return;
	const timer = setInterval(() => {
		count += 1;
		if (count >= MARKDOWN_CHUNKS.length) clearInterval(timer);
	}, 40);
	return () => clearInterval(timer);
});
</script>

{#key `${layout}-${String(props.actions)}-${markdown}`}
	<div class="w-full max-w-96">
		<StreamingText
			{layout}
			size={p.size ?? "default"}
			caret={p.caret ?? true}
			actions={p.actions ?? true}
			{markdown}
			streaming={markdown ? count < MARKDOWN_CHUNKS.length : undefined}
			content={markdown ? MARKDOWN_CHUNKS.slice(0, count).join("") : CONTENT}
			sources={SOURCES}
			followUps={FOLLOW_UPS}
			onFollowUp={() => {}}
			onRetry={() => {}}
			onFeedback={() => {}}
		/>
	</div>
{/key}
