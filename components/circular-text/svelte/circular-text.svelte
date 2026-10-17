<script lang="ts">
import { cn } from "../../lib/cn";
import { type CircularTextDirection, circularText } from "../variants";

let {
	text,
	spinSeconds = 30,
	radius = 80,
	direction = "clockwise",
	as = "div",
	class: classProp,
}: {
	text: string;
	spinSeconds?: number;
	radius?: number;
	direction?: CircularTextDirection;
	as?: string;
	class?: string;
} = $props();

const characters = $derived([...text]);
const size = $derived(`${radius * 2 + 40}px`);
</script>

<svelte:element
	this={as}
	data-slot="circular-text"
	data-direction={direction}
	class={cn(circularText({ direction }), classProp)}
	style="--ct-duration: {spinSeconds}s; width: {size}; height: {size};"
>
	{#each characters as char, index (`${index}-${char}`)}
		{@const angle = (360 / characters.length) * index}
		<span
			class="absolute inset-0 flex items-center justify-center font-medium"
			style="transform: rotate({angle}deg) translateY(-{radius}px)"
		>
			{char}
		</span>
	{/each}
</svelte:element>
