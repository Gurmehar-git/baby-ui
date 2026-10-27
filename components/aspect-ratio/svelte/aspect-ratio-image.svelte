<script lang="ts">
import type { HTMLImgAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type AspectRatioFit, aspectRatio } from "../variants";

let {
	alt,
	width,
	height,
	fit = "cover",
	draggable = false,
	class: classProp,
	...rest
}: Omit<HTMLImgAttributes, "alt" | "width" | "height"> & {
	alt: string;
	width: number;
	height: number;
	fit?: AspectRatioFit;
} = $props();

const dimensions = $derived.by(() => {
	if (![width, height].every((value) => Number.isFinite(value) && value > 0))
		throw new RangeError(
			"AspectRatioImage: width and height must be finite, positive numbers.",
		);
	return { width, height };
});
</script>

<img
	{...rest}
	data-slot="aspect-ratio-image"
	{alt}
	width={dimensions.width}
	height={dimensions.height}
	{draggable}
	class={cn(aspectRatio({ fit }).image(), classProp)}
/>
