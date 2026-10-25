<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelHeader");
</script>

<header data-slot="tips-panel-header" {...rest} class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</header>
