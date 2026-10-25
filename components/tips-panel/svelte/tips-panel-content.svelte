<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelContent");
</script>

<div data-slot="tips-panel-content" {...rest} class={cn(ctx.styles.body(), classProp)}>
	{@render children?.()}
</div>
