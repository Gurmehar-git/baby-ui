<script lang="ts">
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Accordion>>(props));

const FAQ = [
	{
		id: "install",
		title: "How do I install a component?",
		content:
			"Run the CLI command on the Install tab. It copies the source into your project.",
	},
	{
		id: "own",
		title: "Do I own the code?",
		content:
			"Yes. Nothing is imported from a package at runtime, so you can edit any file freely.",
	},
	{
		id: "update",
		title: "How do updates work?",
		content: "Re-run the add command. The CLI will show you a diff before overwriting.",
	},
];

const type = $derived(p.type ?? "single");
let value = $state<string | string[]>("install");

// Switching modes changes the value's shape, so it is reseeded rather than coerced.
$effect(() => {
	value = type === "multiple" ? ["install"] : "install";
});
</script>

<div class="w-full max-w-96">
	<Accordion {type} motion={p.motion} collapsible={p.collapsible !== false} bind:value>
		{#each FAQ as item (item.id)}
			<AccordionItem value={item.id}>
				<AccordionTrigger>{item.title}</AccordionTrigger>
				<AccordionContent>{item.content}</AccordionContent>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
