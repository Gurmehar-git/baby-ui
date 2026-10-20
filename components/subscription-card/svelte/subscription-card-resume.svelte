<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { subscriptionCardState } from "./context";
import SubscriptionCardAction from "./subscription-card-action.svelte";

let {
	onclick,
	class: classProp,
	children,
}: { onclick?: () => void; class?: string; children?: Snippet } = $props();

const ctx = subscriptionCardState("SubscriptionCardResume");
</script>

<!-- Offered only while a canceled plan still runs. -->
{#if ctx.actions.resume}
	<SubscriptionCardAction
		kind="resume"
		variant="default"
		class={cn(ctx.styles.resume(), classProp)}
		{onclick}
	>
		{#if children}{@render children()}{:else}{ctx.labels.resume}{/if}
	</SubscriptionCardAction>
{/if}
