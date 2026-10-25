<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { EMAIL_DRAFT_ICONS } from "../icons";
import { emailDraftState } from "./context";

let {
	name,
	attached = $bindable(true),
	onAttachedChange,
	class: classProp,
}: {
	name: string;
	/** Bindable. */
	attached?: boolean;
	onAttachedChange?: (attached: boolean) => void;
	class?: string;
} = $props();
const ctx = emailDraftState("EmailDraftAttachment");
let root = $state<HTMLDivElement>();

function toggle(next: boolean) {
	attached = next;
	onAttachedChange?.(next);
	// The button swaps for its opposite; keep focus on whichever is now there.
	requestAnimationFrame(() => root?.querySelector("button")?.focus());
}
</script>

<!-- The attached file, removable; once removed it offers to attach the file again. -->
<div bind:this={root} data-slot="email-draft-attachment" class={cn(ctx.styles.attachment(), classProp)}>
	{#if attached}
		<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={EMAIL_DRAFT_ICONS.clip} /></svg>
		<span class={ctx.styles.attachmentName()}>{name}</span>
		<Button variant="ghost" size="icon-xs" aria-label={`Remove ${name}`} onclick={() => toggle(false)}>
			<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={EMAIL_DRAFT_ICONS.close} /></svg>
		</Button>
	{:else}
		<Button variant="ghost" size="sm" onclick={() => toggle(true)}>
			<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={EMAIL_DRAFT_ICONS.plus} /></svg>
			<span class={ctx.styles.attachmentName()}>Attach {name}</span>
		</Button>
	{/if}
</div>
