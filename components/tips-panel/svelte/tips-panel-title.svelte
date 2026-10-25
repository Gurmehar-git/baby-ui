<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelTitle");
</script>

<h2 data-slot="tips-panel-title" id={ctx.titleId} {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</h2>
