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
const ctx = tipsPanelState("TipsPanelTipDescription");
</script>

<p data-slot="tips-panel-tip-description" {...rest} class={cn(ctx.styles.tipDescription(), classProp)}>
	{@render children?.()}
</p>
