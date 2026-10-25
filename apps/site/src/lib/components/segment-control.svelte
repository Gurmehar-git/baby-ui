<script lang="ts" module>
import type { Icon } from "@baby-ui/icons";

export type SegmentOption<T extends string = string> = {
	id: T;
	label: string;
	icon: Icon;
	iconClass?: string;
};
</script>

<script lang="ts" generics="T extends string">
import { ToggleGroup, ToggleGroupItem, type ToggleGroupSize } from "@baby-ui/svelte";

let {
	options,
	current,
	onPick,
	label = "Options",
	size = "default",
}: {
	options: SegmentOption<T>[];
	current: T;
	onPick: (id: T) => void;
	label?: string;
	size?: ToggleGroupSize;
} = $props();

// Resolving through `options` narrows the group's string back to T without a cast.
function pick(next: string | string[]) {
	const hit = options.find((option) => option.id === next);
	if (hit) onPick(hit.id);
}
</script>

<!-- Clicking the pressed item clears a single group; a segment always keeps one choice. -->
<ToggleGroup bind:value={() => current, pick} {label} {size}>
	{#each options as option (option.id)}
		{@const Glyph = option.icon}
		<ToggleGroupItem value={option.id} class="pointer-coarse:h-8">
			<Glyph class={option.iconClass} />
			{option.label}
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
