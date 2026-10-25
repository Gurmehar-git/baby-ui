<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelTipTitle");
</script>

<p data-slot="tips-panel-tip-title" {...rest} class={cn(ctx.styles.tipTitle(), classProp)}>
	{@render children?.()}
</p>
