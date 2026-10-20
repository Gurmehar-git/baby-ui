<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { STATUS_TONE } from "../subscription-core";
import { subscriptionCardState } from "./context";

let {
	headingLevel = 3,
	class: classProp,
}: { headingLevel?: 2 | 3 | 4 | 5 | 6; class?: string } = $props();

const ctx = subscriptionCardState("SubscriptionCardTitle");
</script>

<!-- The plan name with its status badge; `headingLevel` matches the page outline. -->
<div data-slot="subscription-card-title" class={cn(ctx.styles.titleRow(), classProp)}>
	<svelte:element this={`h${headingLevel}`} id={`${ctx.id}-name`} class={ctx.styles.title()}>
		{ctx.plan.name}
	</svelte:element>
	<Badge variant={STATUS_TONE[ctx.plan.status]} size="sm">
		{ctx.labels.status[ctx.plan.status]}
	</Badge>
</div>
