<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLUListElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelGrid");
</script>

<ul data-slot="tips-panel-grid" {...rest} class={cn(ctx.styles.grid(), classProp)}>
	{@render children?.()}
</ul>
