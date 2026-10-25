<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type ReactionBarTone, reactionBar } from "../variants";
import { reactionBarState, setReactionBarItem } from "./context";

let {
	value,
	count = 0,
	label,
	tone = "default",
	onclick,
	class: classProp,
	children,
	...rest
}: Omit<HTMLButtonAttributes, "value"> & {
	value: string;
	count?: number;
	/** The action's name, e.g. "Like"; the count is appended for screen readers. */
	label: string;
	tone?: ReactionBarTone;
	children?: Snippet;
} = $props();
const ctx = reactionBarState("ReactionBarItem");
const pressed = $derived(ctx.pressed.includes(value));
const total = $derived(Math.max(0, count + (pressed ? 1 : 0)));

setReactionBarItem({
	get pressed() {
		return pressed;
	},
	get total() {
		return total;
	},
});
</script>

<!-- One reaction. `count` is everyone else's; your own press adds one while it is held. -->
<button
	type="button"
	data-slot="reaction-bar-item"
	aria-pressed={pressed}
	aria-label={total > 0 ? `${label}, ${total}` : label}
	{...rest}
	class={cn(reactionBar({ variant: ctx.variant, tone }).item(), classProp)}
	onclick={(event) => {
		ctx.toggle(value);
		onclick?.(event);
	}}
>
	{@render children?.()}
</button>
