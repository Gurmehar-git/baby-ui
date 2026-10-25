<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { EMAIL_DRAFT_ICONS } from "../icons";
import { emailDraftState, isFolded } from "./context";

let {
	undoLabel = "Undo",
	class: classProp,
	children,
}: {
	undoLabel?: string;
	class?: string;
	/** What happened, e.g. "Sent to <b>Jonas</b>". Defaults to the status. */
	children?: Snippet;
} = $props();
const ctx = emailDraftState("EmailDraftReceipt");
const shown = $derived(isFolded(ctx.status));
let root = $state<HTMLDivElement>();

$effect(() => {
	if (!shown || ctx.pendingFocus.current !== "receipt") return;
	ctx.pendingFocus.current = null;
	root?.querySelector("button")?.focus();
});
</script>

<!-- The one-line note that replaces the email once sent or discarded, with Undo. -->
<div bind:this={root} data-slot="email-draft-receipt" data-shown={shown || undefined} inert={!shown} class={cn(ctx.styles.receipt(), classProp)}>
	<div class={ctx.styles.receiptClip()}>
		<div class={ctx.styles.receiptBody()}>
			<span aria-hidden="true" data-tone={ctx.status === "sent" ? "success" : undefined} class={ctx.styles.receiptIcon()}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}>
					<path d={ctx.status === "sent" ? EMAIL_DRAFT_ICONS.check : EMAIL_DRAFT_ICONS.close} />
				</svg>
			</span>
			<span role="status" class={ctx.styles.receiptText()}>
				{#if shown}
					{#if children}{@render children()}{:else}{ctx.status === "sent" ? "Sent" : "Draft discarded"}{/if}
				{/if}
			</span>
			<Button variant="ghost" size="sm" onclick={() => ctx.undo()}>{undoLabel}</Button>
		</div>
	</div>
</div>
