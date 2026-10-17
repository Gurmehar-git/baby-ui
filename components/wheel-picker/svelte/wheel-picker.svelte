<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { type WheelPickerRows, wheelPicker } from "../variants";
import { setWheelContext } from "./context";

let {
	children,
	itemHeight = 44,
	rows = "5",
	lens = true,
	"aria-label": ariaLabel,
	class: classProp,
}: {
	children?: Snippet;
	/** Row height in px. */
	itemHeight?: number;
	/** Rows visible at once. */
	rows?: WheelPickerRows;
	/** Tint behind the selected row. */
	lens?: boolean;
	"aria-label"?: string;
	class?: string;
} = $props();

setWheelContext({
	get itemHeight() {
		return itemHeight;
	},
	get rows() {
		return rows;
	},
	get lens() {
		return lens;
	},
});
</script>

<div
	role="group"
	aria-label={ariaLabel}
	data-slot="wheel-picker"
	class={cn(wheelPicker({ rows }).root(), classProp)}
	style:--wheel-h="{itemHeight}px"
>
	{@render children?.()}
</div>
