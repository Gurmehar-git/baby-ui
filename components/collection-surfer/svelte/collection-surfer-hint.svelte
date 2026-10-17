<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { collectionSurferState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const surfer = collectionSurferState();
</script>

<!-- A corner hint, e.g. "Scroll to surf". -->
<p data-slot="collection-surfer-hint" {...rest} class={cn(surfer.styles.hint(), classProp)}>
	{@render children?.()}
</p>
