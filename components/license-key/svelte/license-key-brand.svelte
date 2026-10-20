<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> = $props();
const ctx = getLicenseKey();
</script>

<p {...rest} class={cn(ctx.styles.brand(), classProp)}>
	<span aria-hidden="true" class={ctx.styles.glyph()}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="7.5" cy="15.5" r="4.5" />
			<path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2" />
		</svg>
	</span>
	<span class="truncate">{@render children?.()}</span>
</p>
