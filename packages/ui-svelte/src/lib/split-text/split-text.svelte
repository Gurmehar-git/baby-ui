<script lang="ts">
import { cn } from "../lib/cn";
import { type SplitTextSize, splitText } from "./variants";

let {
	text,
	durationMs = 300,
	size = "lg",
	class: classProp,
}: {
	text: string;
	/** How long the fan-out transition takes, in ms. */
	durationMs?: number;
	size?: SplitTextSize;
	class?: string;
} = $props();

let activeIndex = $state<number | undefined>(undefined);
let timer: ReturnType<typeof setTimeout> | undefined;

function offset(index: number) {
	if (activeIndex === undefined) return 0;
	const distance = Math.abs(index - activeIndex);
	if (distance === 0) return 5;
	if (distance === 1) return 3;
	if (distance === 2) return 1;
	return 0;
}

const HALF_CLASS =
	"inline h-1/2 select-none overflow-y-hidden whitespace-pre leading-none transition-transform ease-[var(--ease-ui-out)]";
</script>

<div data-slot="split-text" class={cn(splitText({ size }), classProp)}>
	<div class="flex h-[1em]">
		{#each text.split("") as letter, index (`${letter}-${index}`)}
			{@const shift = offset(index)}
			<div
				aria-hidden="true"
				onmouseenter={() => {
					clearTimeout(timer);
					activeIndex = index;
				}}
				onmouseleave={() => {
					timer = setTimeout(() => {
						activeIndex = undefined;
					});
				}}
				class="relative inline-flex h-full flex-col leading-none"
			>
				<span
					class={HALF_CLASS}
					style="transform: translateY(-{shift * 4}px); transition-duration: {durationMs}ms"
					>{letter}</span
				>
				<span
					class={HALF_CLASS}
					style="transform: translateY({shift * 4}px); transition-duration: {durationMs}ms"
				>
					<span class="absolute -translate-y-1/2 leading-none">{letter}</span>
				</span>
			</div>
		{/each}
	</div>
	<span class="sr-only">{text}</span>
</div>
