<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgHaloMode, type OgHaloTone, ogHalo } from "./variants";

let {
	logo,
	mode = "dark",
	tone = "neutral",
	class: className,
}: {
	/** Mark image URL, centred over the halo; a dark mark on the dark card reads as a silhouette. */
	logo: string;
	mode?: OgHaloMode;
	tone?: OgHaloTone;
	class?: string;
} = $props();

const s = $derived(ogHalo({ mode, tone }));
</script>

<div data-slot="og-halo" class={cn(s.root(), className)}>
	<span class={s.halo()}></span>
	<img src={logo} alt="" class={s.logo()} />
</div>
