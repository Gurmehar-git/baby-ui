<script lang="ts">
import type { Snippet } from "svelte";
import { subscriptionCardState } from "./context";
import SubscriptionCardAction from "./subscription-card-action.svelte";

let {
	onclick,
	class: classProp,
	children,
}: { onclick?: () => void; class?: string; children?: Snippet } = $props();

const ctx = subscriptionCardState("SubscriptionCardChangePlan");
</script>

<SubscriptionCardAction kind="change" class={classProp} {onclick}>
	{#if children}{@render children()}{:else}{ctx.labels.changePlan}{/if}
</SubscriptionCardAction>
