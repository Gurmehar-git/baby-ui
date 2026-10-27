<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type AspectRatioMotion, aspectRatio } from "../variants";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
	children?: Snippet;
	ratio?: number;
	motion?: AspectRatioMotion;
	contentClass?: string;
};

let {
	children,
	ratio = 1,
	motion = "smooth",
	contentClass,
	class: classProp,
	...rest
}: Props = $props();

const styles = $derived(aspectRatio({ motion }));
const safeRatio = $derived.by(() => {
	if (!Number.isFinite(ratio) || ratio <= 0)
		throw new RangeError("AspectRatio: ratio must be a finite, positive number.");
	return ratio;
});
</script>

<div
	data-slot="aspect-ratio"
	data-motion={motion}
	class={cn(styles.root(), classProp)}
	style:aspect-ratio={safeRatio}
	{...rest}
>
	<div data-slot="aspect-ratio-content" class={cn(styles.content(), contentClass)}>
		{@render children?.()}
	</div>
</div>
