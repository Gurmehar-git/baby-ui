<script lang="ts">
import { cn } from "../../lib/cn";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import { faqCategory } from "../faq";
import { faqSectionState } from "./context";

let { label = "Question topics", class: classProp }: { label?: string; class?: string } =
	$props();
const faq = faqSectionState();
</script>

<!-- A topic switcher built from each item's `category`, with a count per topic. -->
<ToggleGroup
	data-slot="faq-section-topics"
	variant="segmented"
	orientation="vertical"
	{label}
	value={faq.topic}
	onValueChange={faq.setTopic}
	class={cn(faq.styles.topics(), classProp)}
>
	{#each faq.categories as entry (entry)}
		<ToggleGroupItem value={entry} class={faq.styles.topic()}>
			{entry}
			<span class={faq.styles.count()}>
				{faq.items.filter((item) => faqCategory(item) === entry).length}
			</span>
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
