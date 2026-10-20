<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { paymentMethodCardState } from "./context";

let {
	onclick,
	class: classProp,
	children,
}: { onclick?: () => void; class?: string; children?: Snippet } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardAction");
</script>

<!-- Add or update through the provider's portal; filled when the card needs attention. -->
<Button
	size="sm"
	variant={ctx.method && ctx.expiry === "ok" ? "outline" : "default"}
	class={cn(ctx.styles.action(), classProp)}
	loading={ctx.status === "redirecting"}
	loadingLabel={ctx.labels.redirecting}
	{onclick}
>
	{#if children}{@render children()}{:else}{ctx.method ? ctx.labels.update : ctx.labels.add}{/if}
</Button>
