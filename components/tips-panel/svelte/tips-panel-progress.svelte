<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	label = (done: number, total: number) => `${done}/${total} done`,
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
	label?: (done: number, total: number) => string;
} = $props();
const ctx = tipsPanelState("TipsPanelProgress");
const count = $derived(ctx.tips.filter((t) => ctx.done.includes(t)).length);
</script>

<!-- How many tips are done, announced politely as it changes. -->
<span data-slot="tips-panel-progress" aria-live="polite" {...rest} class={cn(ctx.styles.progress(), classProp)}>
	{label(count, ctx.tips.length)}
</span>
