<script lang="ts">
import { cn } from "../../lib/cn";
import { type BoldCopySize, boldCopy } from "../variants";

let {
	text,
	size = "xl",
	durationMs = 300,
	class: classProp,
}: {
	text: string;
	size?: BoldCopySize;
	/** How long the hover fill/scale takes, in ms. */
	durationMs?: number;
	class?: string;
} = $props();

const classes = $derived(boldCopy({ size }));
</script>

<div data-slot="bold-copy" class={cn(classes.root(), classProp)} style="--bc-duration: {durationMs}ms;">
	<div class={classes.background()}>{text}</div>
	<div class={classes.title()}>{text}</div>
</div>
