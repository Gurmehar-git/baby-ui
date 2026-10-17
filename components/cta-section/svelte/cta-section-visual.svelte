<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<!-- The split variant's right-hand side, e.g. a product shot. -->
<div data-slot="cta-section-visual" {...rest} class={cn(cta.styles.stage(), classProp)}>
	{@render children?.()}
</div>
