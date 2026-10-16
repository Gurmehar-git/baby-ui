<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";

let {
	children,
	class: classProp,
	inset = false,
	...rest
}: {
	children?: Snippet;
	class?: string;
	inset?: boolean;
} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	{...rest}
	data-slot="context-menu-label"
	data-inset={inset || undefined}
	class={cn("px-2.5 py-1.5 font-medium text-muted-foreground text-xs data-[inset]:pl-8", classProp)}
>
	{@render children?.()}
</div>
