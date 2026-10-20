<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { paymentMethodCardState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardError");
const open = $derived(ctx.status === "error");
</script>

<!-- Folds open while `status` is "error"; children replace the default message. -->
<div data-slot="payment-method-card-error" data-open={open} class={ctx.styles.errorFold()}>
	<p role={open ? "alert" : undefined} aria-hidden={!open} class={ctx.styles.errorClip()}>
		<span class={cn(ctx.styles.error(), classProp)}>
			{#if children}{@render children()}{:else}{ctx.labels.error}{/if}
		</span>
	</p>
</div>
