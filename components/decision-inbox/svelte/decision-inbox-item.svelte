<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { decisionInboxState, setDecisionInboxItem } from "./context";

let {
	value,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { value: string; children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxItem");
const answer = $derived(ctx.answers[value]);
const collapsed = $derived(ctx.collapsed.includes(value));

setDecisionInboxItem({
	get value() {
		return value;
	},
	get answer() {
		return answer;
	},
	get collapsed() {
		return collapsed;
	},
});

// Registration reads and writes the item list, so only `value` may re-run it.
$effect.pre(() => {
	const item = value;
	return untrack(() => ctx.register(item));
});
</script>

<!-- One decision, identified by `value`. Once answered it shows the answer, then folds away. -->
<div data-slot="decision-inbox-row" data-answered={answer !== undefined || undefined} inert={answer !== undefined} class={ctx.styles.row()}>
	<div class={ctx.styles.rowClip()}>
		<div data-slot="decision-inbox-item" data-collapsed={collapsed || undefined} {...rest} class={cn(ctx.styles.item(), classProp)}>
			{@render children?.()}
		</div>
	</div>
</div>
