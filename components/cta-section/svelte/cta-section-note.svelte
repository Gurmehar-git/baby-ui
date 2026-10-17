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

<!-- Small print under the actions, e.g. "No credit card required"; faces can go inside. -->
<div data-slot="cta-section-note" {...rest} class={cn(cta.styles.note(), classProp)}>
	{@render children?.()}
</div>
