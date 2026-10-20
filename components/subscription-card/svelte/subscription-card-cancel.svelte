<script lang="ts">
import type { Snippet } from "svelte";
import AlertDialog from "../../alert-dialog/svelte/alert-dialog.svelte";
import AlertDialogAction from "../../alert-dialog/svelte/alert-dialog-action.svelte";
import AlertDialogCancel from "../../alert-dialog/svelte/alert-dialog-cancel.svelte";
import AlertDialogContent from "../../alert-dialog/svelte/alert-dialog-content.svelte";
import AlertDialogDescription from "../../alert-dialog/svelte/alert-dialog-description.svelte";
import AlertDialogFooter from "../../alert-dialog/svelte/alert-dialog-footer.svelte";
import AlertDialogHeader from "../../alert-dialog/svelte/alert-dialog-header.svelte";
import AlertDialogTitle from "../../alert-dialog/svelte/alert-dialog-title.svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { formatDate } from "../subscription-core";
import { subscriptionCardState } from "./context";

let {
	onclick,
	class: classProp,
	children,
}: { onclick?: () => void; class?: string; children?: Snippet } = $props();

const ctx = subscriptionCardState("SubscriptionCardCancel");
let confirming = $state(false);
</script>

<!-- Asks first, then runs `onclick`; set `plan.status` to "canceled" when it lands. -->
{#if ctx.actions.cancel}
	<Button
		size="sm"
		variant="ghost"
		class={cn(ctx.styles.cancel(), classProp)}
		loading={ctx.pending === "cancel"}
		disabled={ctx.pending !== null && ctx.pending !== "cancel"}
		onclick={() => (confirming = true)}
	>
		{#if children}{@render children()}{:else}{ctx.labels.cancel}{/if}
	</Button>
	<AlertDialog bind:open={confirming}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{ctx.labels.cancelTitle}</AlertDialogTitle>
				<AlertDialogDescription>
					{ctx.labels.cancelBody(ctx.renewsAt ? formatDate(ctx.renewsAt, ctx.locale) : null)}
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>{ctx.labels.cancelKeep}</AlertDialogCancel>
				<!-- bits-ui's Action does not close the dialog on its own. -->
				<AlertDialogAction
					destructive
					onclick={() => {
						confirming = false;
						onclick?.();
					}}
				>
					{ctx.labels.cancelConfirm}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/if}
