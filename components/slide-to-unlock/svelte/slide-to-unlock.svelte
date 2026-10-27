<script lang="ts">
import { Slider as SliderPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	type SlideToUnlockSize,
	type SlideToUnlockVariant,
	slideToUnlock,
} from "../variants";
import { setSlideToUnlock } from "./context";

let {
	children,
	label,
	defaultValue = 0,
	value = $bindable(defaultValue),
	onValueChange,
	onComplete,
	threshold = 90,
	variant = "default",
	size = "xl",
	handleSize,
	loading = false,
	disabled,
	class: classProp,
	style,
	onkeydown,
	onpointerdown,
	...rest
}: Omit<
	SliderPrimitive.RootProps,
	"type" | "value" | "children" | "onValueChange" | "onValueCommit"
> & {
	children: Snippet;
	label: string;
	value?: number;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	onComplete?: () => void;
	threshold?: number;
	variant?: SlideToUnlockVariant;
	/** Outer height on the Button ladder; the handle and text scale with it. */
	size?: SlideToUnlockSize;
	/** Overrides the size's handle diameter, as pixels or a CSS length. */
	handleSize?: number | string;
	/** The caller's action is running: the handle shows a spinner and stops responding. */
	loading?: boolean;
} = $props();

// Keyboard steps commit one at a time, so only a released drag springs back below the threshold.
let keyed = false;

const current = $derived(Math.min(100, Math.max(0, value)));
const handle = $derived(typeof handleSize === "number" ? `${handleSize}px` : handleSize);
const s = $derived(slideToUnlock({ variant, size }));

function change(next: number) {
	value = next;
	onValueChange?.(next);
}

setSlideToUnlock({
	get value() {
		return current;
	},
	get variant() {
		return variant;
	},
	get size() {
		return size;
	},
	get label() {
		return label;
	},
	get loading() {
		return loading;
	},
});
</script>

<SliderPrimitive.Root
	type="single"
	value={current}
	min={0}
	max={100}
	step={1}
	disabled={disabled || loading}
	onkeydown={(event) => {
		keyed = true;
		onkeydown?.(event);
	}}
	onpointerdown={(event) => {
		keyed = false;
		onpointerdown?.(event);
	}}
	onValueChange={change}
	onValueCommit={(next) => {
		if (next >= threshold) {
			change(100);
			onComplete?.();
		} else if (!keyed) change(0);
	}}
	data-slot="slide-to-unlock"
	data-loading={loading || undefined}
	aria-busy={loading || undefined}
	class={cn(s.root(), classProp)}
	style={handle ? `--slide-handle: ${handle};${style ?? ""}` : style}
	thumbPositioning="contain"
	{...rest}
>
	{@render children()}
</SliderPrimitive.Root>
