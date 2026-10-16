<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { getConversation } from "./context";

let {
	label = "Scroll to latest message",
	class: classProp,
	onclick,
	...rest
}: {
	label?: string;
	class?: string;
	onclick?: () => void;
} & Record<string, unknown> = $props();

const conversation = getConversation();
const visible = $derived(!conversation.follow && !conversation.atBottom);
const labelId = $props.id();

function scrollToBottom() {
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	conversation.scrollToBottom(reducedMotion ? "auto" : "smooth");
}
</script>

<div class="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-4">
	<button
		{...rest}
		type="button"
		data-slot="conversation-scroll-button"
		data-state={visible ? "visible" : "hidden"}
		aria-labelledby={labelId}
		aria-hidden={!visible}
		disabled={!visible}
		tabindex={visible ? undefined : -1}
		class={cn(
			"pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-border bg-popover text-foreground shadow-lg transition-[opacity,translate] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] hover:bg-accent motion-reduce:transition-none",
			visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1.5 opacity-0",
			classProp,
		)}
		onclick={() => {
			scrollToBottom();
			onclick?.();
		}}
	>
		<span id={labelId} class="sr-only">{label}</span>
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
			<path d="M8 3.5V13M4 9l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</button>
</div>
