<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { messageActionsState } from "./context";

let {
	"aria-label": ariaLabel = "Message actions",
	onkeydown,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = messageActionsState("MessageActionsBar");
const STEPS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

function move(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
	onkeydown?.(event);
	const step = STEPS[event.key];
	if (!step) return;
	const buttons = [
		...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
	];
	const at = buttons.findIndex((b) => b.contains(document.activeElement));
	if (at < 0) return;
	event.preventDefault();
	buttons[(at + step + buttons.length) % buttons.length]?.focus();
}
</script>

<!-- The toolbar row; arrow keys move between its buttons. -->
<div role="toolbar" tabindex="-1" aria-label={ariaLabel} data-slot="message-actions-bar" {...rest} class={cn(ctx.styles.bar(), classProp)} onkeydown={move}>
	{@render children?.()}
</div>
