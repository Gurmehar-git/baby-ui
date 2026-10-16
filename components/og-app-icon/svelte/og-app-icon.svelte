<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	OG_APP_ICON_DOODLES,
	type OgAppIconMode,
	ogAppIcon,
	ogAppIconDoodle,
} from "./variants";

let {
	logo,
	color,
	mode = "light",
	class: className,
}: {
	/** Glyph image URL; a white glyph reads best on the tile. */
	logo: string;
	/** Tile fill, any CSS colour; the brand colour reads best. */
	color: string;
	mode?: OgAppIconMode;
	class?: string;
} = $props();

const s = $derived(ogAppIcon({ mode }));
</script>

<div data-slot="og-app-icon" class={cn(s.root(), className)}>
	{#each OG_APP_ICON_DOODLES as d (`${d.left}-${d.top}`)}
		<span
			class={cn(s.doodle(), ogAppIconDoodle({ shape: d.shape }))}
			style:left="{d.left}px"
			style:top="{d.top}px"
			style:width="{d.size}px"
			style:height="{d.size}px"
			style:transform="rotate({d.turn}deg)"
		></span>
	{/each}
	<div class={s.tile()} style:background-color={color}>
		<span class={s.sheen()}></span>
		<img src={logo} alt="" class={s.logo()} />
	</div>
</div>
