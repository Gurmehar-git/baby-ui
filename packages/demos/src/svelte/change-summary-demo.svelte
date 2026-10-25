<script lang="ts">
import {
	ChangeSummary,
	ChangeSummaryChange,
	ChangeSummaryHeader,
	ChangeSummaryItem,
	ChangeSummaryLabel,
	ChangeSummaryList,
	ChangeSummaryPeriod,
	ChangeSummaryTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CHANGE_SUMMARY_CHANGES } from "../data/change-summary";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ChangeSummary>>(props));
</script>

<ChangeSummary variant={p.variant}>
	<ChangeSummaryHeader>
		<ChangeSummaryTitle>What's changed</ChangeSummaryTitle>
		<ChangeSummaryPeriod>This week</ChangeSummaryPeriod>
	</ChangeSummaryHeader>
	<ChangeSummaryList>
		{#each CHANGE_SUMMARY_CHANGES as c (c.label)}
			<ChangeSummaryItem tone={c.tone} direction={c.direction}>
				<ChangeSummaryLabel>{c.label}</ChangeSummaryLabel>
				<ChangeSummaryChange>{c.change}</ChangeSummaryChange>
			</ChangeSummaryItem>
		{/each}
	</ChangeSummaryList>
</ChangeSummary>
