<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLUListElement> & { children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<!-- Benefit lines, each with a check; holds CtaSectionPoint items. -->
<ul data-slot="cta-section-points" {...rest} class={cn(cta.styles.points(), classProp)}>
	{@render children?.()}
</ul>
