<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { stackLayout } from "../patterns";
import { type NotificationStackVariant, notificationStack } from "../variants";
import { type StackLayout, setNotificationStack } from "./context";

let {
	value = $bindable([]),
	onValueChange,
	variant = "elevated",
	"aria-label": ariaLabel = "Notifications",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Dismissed notices, by value. Bindable. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: NotificationStackVariant;
	children?: Snippet;
} = $props();

const ITEMS = ":scope > [data-slot=notification-stack-item]";
const styles = $derived(notificationStack({ variant }));
let root = $state<HTMLElement>();
let layout = $state<StackLayout | null>(null);
const anyShown = $derived(
	layout ? Object.values(layout.places).some((p) => p.depth >= 0) : true,
);

function measure() {
	if (!root) return;
	const cards = [...root.querySelectorAll<HTMLElement>(ITEMS)];
	const order = cards.map((card) => card.dataset.value ?? "");
	const heights = Object.fromEntries(
		cards.map((card) => [card.dataset.value, card.offsetHeight]),
	);
	const next = stackLayout(order, value, heights);
	if (JSON.stringify(next) !== JSON.stringify(layout)) layout = next;
}

$effect(() => {
	void value;
	measure();
});

$effect(() => {
	const el = root;
	if (!el) return;
	const resize = new ResizeObserver(() => measure());
	const watch = () => {
		resize.disconnect();
		for (const card of el.querySelectorAll(ITEMS)) resize.observe(card);
		measure();
	};
	const kids = new MutationObserver(watch);
	kids.observe(el, { childList: true });
	watch();
	return () => {
		resize.disconnect();
		kids.disconnect();
	};
});

setNotificationStack({
	get dismissed() {
		return value;
	},
	get layout() {
		return layout;
	},
	get styles() {
		return styles;
	},
	dismiss(item, from) {
		const hadFocus = from === document.activeElement;
		if (!value.includes(item)) value = [...value, item];
		onValueChange?.(value);
		if (!hadFocus) return;
		// The next card comes to the front; its dismiss button takes focus, or the stack does.
		requestAnimationFrame(() => {
			const front = root?.querySelector<HTMLElement>(
				"[data-slot=notification-stack-item]:not([data-behind]):not([data-leaving]) [data-slot=notification-stack-dismiss]",
			);
			(front ?? root)?.focus();
		});
	},
});
</script>

<!-- The root: which notices are dismissed, and where each card sits in the stack. -->
<section
	bind:this={root}
	data-slot="notification-stack"
	data-variant={variant}
	aria-label={ariaLabel}
	tabindex="-1"
	{...rest}
	class={cn(styles.root(), classProp)}
	style:height={layout && anyShown ? `${layout.height}px` : undefined}
>
	{@render children?.()}
</section>
