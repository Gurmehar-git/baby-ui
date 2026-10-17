<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLLiAttributes & { children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<li data-slot="cta-section-point" {...rest} class={cn(cta.styles.point(), classProp)}>
	<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
		<path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
	{@render children?.()}
</li>
