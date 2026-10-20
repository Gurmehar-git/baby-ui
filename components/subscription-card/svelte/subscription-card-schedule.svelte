<script lang="ts">
import { cn } from "../../lib/cn";
import { subscriptionCardState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = subscriptionCardState("SubscriptionCardSchedule");
</script>

<!-- What happens next: renewal, trial end or access end. Renders nothing when nothing does. -->
{#if ctx.schedule}
	<p data-slot="subscription-card-schedule" class={cn(ctx.styles.schedule(), classProp)}>
		{ctx.schedule}
	</p>
{/if}
