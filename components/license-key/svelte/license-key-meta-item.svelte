<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let {
	label,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { label: string; children?: Snippet } = $props();
const ctx = getLicenseKey();
</script>

<div {...rest} class={cn(ctx.styles.metaItem(), classProp)}>
	<dt class={ctx.styles.metaLabel()}>{label}</dt>
	<dd class={ctx.styles.metaValue()}>{@render children?.()}</dd>
</div>
