<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let {
	level = 2,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { level?: 2 | 3 | 4 | 5 | 6 } = $props();
const ctx = getLicenseKey();
</script>

<svelte:element this={`h${level}`} {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</svelte:element>
