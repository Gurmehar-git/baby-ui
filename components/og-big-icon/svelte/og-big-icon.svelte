<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgBigIconMode, ogBigIcon } from "./variants";

let {
	name,
	title,
	icon,
	label,
	description,
	logo,
	pattern = [],
	mode = "light",
	class: className,
}: {
	/** Brand name top left; one line. */
	name: string;
	/** Up to two lines. */
	title: string;
	/** One large icon image URL, cropped by the right edge. */
	icon: string;
	/** Small caps label under the name, e.g. "Icons". */
	label?: string;
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	/** Icon image URLs tiled faintly behind everything; cycles to fill the card. */
	pattern?: string[];
	mode?: OgBigIconMode;
	class?: string;
} = $props();

const PATTERN_SLOTS = 96;
const s = $derived(ogBigIcon({ mode }));
</script>

<div data-slot="og-big-icon" class={cn(s.root(), className)}>
	{#if pattern.length > 0}
		<div class={s.pattern()}>
			{#each { length: PATTERN_SLOTS }, i (i)}
				<img src={pattern[i % pattern.length]} alt="" class={s.patternIcon()} />
			{/each}
		</div>
	{/if}
	<img src={icon} alt="" class={s.icon()} />
	<div class={s.brand()}>
		{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
		<div class={s.names()}>
			<span class={s.name()}>{name}</span>
			{#if label}<span class={s.label()}>{label}</span>{/if}
		</div>
	</div>
	<div class={s.body()}>
		<p class={s.title()}>{title}</p>
		{#if description}<p class={s.description()}>{description}</p>{/if}
	</div>
</div>
