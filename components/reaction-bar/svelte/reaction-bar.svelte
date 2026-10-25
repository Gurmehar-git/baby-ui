<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type ReactionBarVariant, reactionBar } from "../variants";
import { setReactionBar } from "./context";

let {
	value = $bindable([]),
	onValueChange,
	variant = "pill",
	locale,
	"aria-label": ariaLabel = "Reactions",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** Values of the pressed reactions. Bindable. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: ReactionBarVariant;
	/** Formats counts compactly (1.2K) in this locale. */
	locale?: string;
	children?: Snippet;
} = $props();

setReactionBar({
	get pressed() {
		return value;
	},
	get variant() {
		return variant;
	},
	get locale() {
		return locale;
	},
	toggle(item) {
		value = value.includes(item) ? value.filter((v) => v !== item) : [...value, item];
		onValueChange?.(value);
	},
});
</script>

<!-- The root: a labelled group that knows which reactions you have pressed. -->
<div
	role="group"
	aria-label={ariaLabel}
	data-slot="reaction-bar"
	data-variant={variant}
	{...rest}
	class={cn(reactionBar({ variant }).root(), classProp)}
>
	{@render children?.()}
</div>
