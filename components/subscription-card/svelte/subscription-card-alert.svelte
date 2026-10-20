<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { subscriptionCardState } from "./context";

let {
	onUpdatePayment,
	class: classProp,
}: { onUpdatePayment?: () => void; class?: string } = $props();

const ctx = subscriptionCardState("SubscriptionCardAlert");
const open = $derived(ctx.actions.updatePayment);
</script>

<!-- The failed-payment notice; folds open while the plan is past due. -->
<div data-slot="subscription-card-alert" data-open={open} class={ctx.styles.alertFold()}>
	<div class={ctx.styles.clip()} inert={!open}>
		<div class={ctx.styles.alertSpace()}>
			<div role={open ? "alert" : undefined} class={cn(ctx.styles.alert(), classProp)}>
				<p class={ctx.styles.alertText()}>{ctx.labels.pastDue}</p>
				{#if onUpdatePayment}
					<Button
						size="sm"
						variant="destructive"
						loading={ctx.pending === "payment"}
						disabled={ctx.pending !== null && ctx.pending !== "payment"}
						onclick={onUpdatePayment}
					>
						{ctx.labels.updatePayment}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
