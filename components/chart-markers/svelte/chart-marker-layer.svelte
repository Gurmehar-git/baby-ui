<script lang="ts">
import { portal } from "../../chart/svelte/context";
import type { MarkerGroup } from "../geometry";
import type { ChartMarkerAppearance, ChartMarkerSize } from "../variants";
import ChartMarkerGroup from "./chart-marker-group.svelte";
import type { ChartMarker } from "./types";

let {
	target,
	placed,
	marginLeft,
	top,
	visible,
	animate,
	size,
	appearance,
	groupLabel,
	onHoverChange,
}: {
	target: HTMLElement;
	placed: { group: MarkerGroup<ChartMarker>; x: number }[];
	marginLeft: number;
	top: number;
	visible: boolean;
	animate: boolean;
	size: ChartMarkerSize;
	appearance: ChartMarkerAppearance;
	groupLabel: (count: number, date: Date) => string;
	onHoverChange: (key: string | null) => void;
} = $props();
</script>

<div {@attach portal(target)} class="contents">
	{#each placed as { group, x }, index (group.key)}
		<ChartMarkerGroup
			{group}
			{index}
			left={marginLeft + x}
			{top}
			{visible}
			{animate}
			{size}
			{appearance}
			{groupLabel}
			{onHoverChange}
		/>
	{/each}
</div>
