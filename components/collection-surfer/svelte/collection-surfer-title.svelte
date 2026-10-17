<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { collectionSurferState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const surfer = collectionSurferState();
</script>

<!-- Overlay heading; the item count follows it. -->
<h2 data-slot="collection-surfer-title" {...rest} class={cn(surfer.styles.title(), classProp)}>
	{@render children?.()}<span class={surfer.styles.count()}>({surfer.items.length})</span>
</h2>
