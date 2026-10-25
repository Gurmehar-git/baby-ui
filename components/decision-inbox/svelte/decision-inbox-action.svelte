<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { decisionInboxItemState, decisionInboxState } from "./context";

let {
	value,
	primary = false,
	onclick,
	class: classProp,
	children,
}: {
	value: string;
	/** The filled button: the answer most people give. */
	primary?: boolean;
	onclick?: () => void;
	class?: string;
	children?: Snippet;
} = $props();
const ctx = decisionInboxState("DecisionInboxAction");
const item = decisionInboxItemState("DecisionInboxAction");

function choose(event: MouseEvent) {
	const target = event.currentTarget;
	const root =
		target instanceof Element ? target.closest("[data-slot=decision-inbox]") : null;
	const hadFocus = target === document.activeElement;
	ctx.answer(item.value, value);
	onclick?.();
	if (!hadFocus || !root) return;
	// After the answered row turns inert, hand focus to the next decision or the status.
	requestAnimationFrame(() => {
		const next = root.querySelector<HTMLElement>(
			"[data-slot=decision-inbox-row]:not([data-answered]) button",
		);
		(
			next ?? root.querySelector<HTMLElement>("[data-slot=decision-inbox-header]")
		)?.focus();
	});
}
</script>

<!-- One answer; `value` is what the done state reads. Focus moves on to the next open decision. -->
<Button data-slot="decision-inbox-action" variant={primary ? "default" : "outline"} size="sm" class={classProp} onclick={choose}>
	{#if children}{@render children()}{:else}{value}{/if}
</Button>
