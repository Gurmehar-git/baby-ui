<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgAppTileMode, type OgAppTileTone, ogAppTile } from "../variants";

let {
	name,
	logo,
	description,
	mode = "light",
	tone = "chart",
	class: className,
}: {
	/** App or product name; one line. */
	name: string;
	/** Logo image URL, set inside the tile. */
	logo: string;
	description?: string;
	mode?: OgAppTileMode;
	tone?: OgAppTileTone;
	class?: string;
} = $props();

const s = $derived(ogAppTile({ mode, tone }));
</script>

<div data-slot="og-app-tile" class={cn(s.root(), className)}>
	<span class={s.glow()}></span>
	<div class={s.tile()}>
		<img src={logo} alt="" class={s.logo()} />
	</div>
	<div class={s.body()}>
		<p class={s.title()}>{name}</p>
		{#if description}<p class={s.description()}>{description}</p>{/if}
	</div>
</div>
