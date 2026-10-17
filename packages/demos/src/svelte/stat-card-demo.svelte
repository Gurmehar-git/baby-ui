<script lang="ts">
import {
	Button,
	StatCard,
	StatCardChart,
	StatCardContent,
	StatCardDescription,
	StatCardEmpty,
	StatCardError,
	StatCardHeader,
	StatCardTitle,
	StatCardTrend,
	StatCardValue,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { STAT_CARD } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";
import DemoFrame from "./demo-frame.svelte";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof StatCard>>(props));
const { title, description, ...sample } = STAT_CARD;
</script>

<DemoFrame size="sm">
	<StatCard
		{...sample}
		name={title}
		positive={p.positive}
		status={p.status}
		chart={p.chart}
		size={p.size}
	>
		<StatCardHeader>
			<StatCardTitle>{title}</StatCardTitle>
			<StatCardTrend />
		</StatCardHeader>
		<StatCardContent>
			<StatCardValue />
			<StatCardDescription>{description}</StatCardDescription>
			<StatCardEmpty>No data yet</StatCardEmpty>
			<StatCardError>
				<p>Couldn't load this metric.</p>
				<Button size="sm" variant="outline">Retry</Button>
			</StatCardError>
			<StatCardChart />
		</StatCardContent>
	</StatCard>
</DemoFrame>
