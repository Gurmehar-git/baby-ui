<script lang="ts">
import type { ComponentProps } from "svelte";
import Card from "../../card/svelte/card.svelte";
import { cn } from "../../lib/cn";
import { type ScoreCardSize, scoreCard } from "../variants";
import { setScoreCard } from "./context";

let {
	size = "default",
	class: className,
	children,
	...rest
}: ComponentProps<typeof Card> & { size?: ScoreCardSize } = $props();

const styles = $derived(scoreCard({ size }));
setScoreCard({
	get styles() {
		return styles;
	},
});
</script>

<!-- A headline metric on a dial: ScoreCardHeader, then ScoreCardContent with ScoreCardGauge. -->
<Card data-slot="score-card" {...rest} class={cn(styles.root(), className)}>
	{@render children?.()}
</Card>
