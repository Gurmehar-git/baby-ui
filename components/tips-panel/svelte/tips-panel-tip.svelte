<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { setTip, tipsPanelState } from "./context";

let {
	value,
	class: classProp,
	children,
	...rest
}: HTMLLiAttributes & { value: string; children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelTip");

setTip({
	get value() {
		return value;
	},
});

// Registration reads and writes the tip list, so only `value` may re-run it.
$effect.pre(() => {
	const tip = value;
	return untrack(() => ctx.register(tip));
});
</script>

<!-- One tip, identified by `value`; it counts toward the progress while mounted. -->
<li
	data-slot="tips-panel-tip"
	data-done={ctx.done.includes(value) || undefined}
	{...rest}
	class={cn(ctx.styles.tip(), classProp)}
>
	{@render children?.()}
</li>
