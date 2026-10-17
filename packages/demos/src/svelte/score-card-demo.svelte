<script lang="ts">
import {
	ScoreCard,
	ScoreCardContent,
	ScoreCardDescription,
	ScoreCardGauge,
	ScoreCardHeader,
	ScoreCardTitle,
	ScoreCardTrend,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ScoreCard>>(props));
const gauge = $derived(controlProps<ComponentProps<typeof ScoreCardGauge>>(props));
</script>

<div class="w-full max-w-xs">
	<ScoreCard size={p.size ?? "default"}>
		<ScoreCardHeader>
			<ScoreCardTitle>Performance</ScoreCardTitle>
			<ScoreCardDescription>Lighthouse, last deploy</ScoreCardDescription>
			<ScoreCardTrend value={4} />
		</ScoreCardHeader>
		<ScoreCardContent>
			<ScoreCardGauge
				value={87}
				min={Number(props.min ?? 0)}
				max={Number(props.max ?? 100)}
				label="Performance"
				tone={gauge.tone ?? "primary"}
				layout={gauge.layout ?? "arc"}
			/>
		</ScoreCardContent>
	</ScoreCard>
</div>
