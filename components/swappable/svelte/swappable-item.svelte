<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getSwappable } from "./context";
import { swappable } from "./variants";

let {
	id,
	class: classProp,
	children,
	...rest
}: {
	id: string;
	class?: string;
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, "id" | "class" | "children"> = $props();

const shared = $derived(getSwappable());
</script>

<!-- Focusable for the Alt+arrow keyboard path; mark inner controls `data-swapy-no-drag`. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	tabindex="0"
	aria-describedby={shared.hintId || undefined}
	{...rest}
	data-swapy-item={id}
	data-slot="swappable-item"
	class={cn(swappable({ variant: shared.variant }).item(), classProp)}
>
	{@render children?.()}
</div>
