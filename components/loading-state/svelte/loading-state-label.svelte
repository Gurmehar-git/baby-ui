<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { loadingStateState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const loader = loadingStateState();
</script>

<span data-slot="loading-state-label" {...rest} class={cn(loader.styles.label(), classProp)}>
	{@render children?.()}
</span>
