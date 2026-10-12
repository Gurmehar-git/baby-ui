<script lang="ts">
import { Slider, sliderLayout } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { SLIDER_MARKS, SLIDER_PRESETS } from "../data/slider";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Slider>>(props));

let variant = $derived(p.variant ?? "default");
let preset = $derived(SLIDER_PRESETS[variant] ?? SLIDER_PRESETS.default);
let range = $derived(Boolean(props.range));
let orientation = $derived(
	sliderLayout(variant, p.orientation ?? "horizontal", range).orientation,
);
let value = $state<number | number[]>(50);

$effect(() => {
	value = range ? [25, 75] : Number(props.value ?? 50);
});
</script>

<div
	class={orientation === "vertical"
		? "flex h-56"
		: variant === "default"
			? "w-72"
			: "w-full max-w-sm"}
>
	<Slider
		bind:value
		{variant}
		{orientation}
		min={Number(props.min ?? 0)}
		max={Number(props.max ?? 100)}
		step={Number(props.step ?? 1)}
		disabled={p.disabled ?? false}
		label={preset?.label}
		formatValue={preset?.format}
		size={p.size ?? "default"}
		showValue={p.showValue ?? false}
		marks={variant === "default" ? SLIDER_MARKS : undefined}
		elastic={p.elastic ?? false}
	/>
</div>
