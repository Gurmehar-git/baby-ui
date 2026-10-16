<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	type OgEditorialBioMode,
	type OgEditorialBioTone,
	ogEditorialBio,
} from "./variants";

let {
	name,
	lines,
	mode = "light",
	tone = "chart",
	class: className,
}: {
	/** First line, flush left. */
	name: string;
	/** The bio, one entry per line; every other line indents. Five fit under the name. */
	lines: string[];
	mode?: OgEditorialBioMode;
	tone?: OgEditorialBioTone;
	class?: string;
} = $props();

const s = $derived(ogEditorialBio({ mode, tone }));
const shown = $derived([name, ...lines].filter(Boolean).slice(0, 6));
</script>

<div data-slot="og-editorial-bio" class={cn(s.root(), className)}>
	<div class={s.circle()}></div>
	<div class={s.crossX()}></div>
	<div class={s.crossY()}></div>
	<div class={s.lines()}>
		{#each shown as line, i (`${i}-${line}`)}
			<span class={cn(s.line(), i % 2 === 1 && s.indent())}>{line}</span>
		{/each}
	</div>
</div>
