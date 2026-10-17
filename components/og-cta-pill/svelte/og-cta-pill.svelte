<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgCtaPillMode, type OgCtaPillTone, ogCtaPill } from "../variants";

let {
	label,
	logo,
	mode = "light",
	tone = "chart",
	class: className,
}: {
	/** The call to action inside the pill; one short line. */
	label: string;
	/** Logo image URL above the pill; a white mark reads best on the field. */
	logo?: string;
	mode?: OgCtaPillMode;
	tone?: OgCtaPillTone;
	class?: string;
} = $props();

const s = $derived(ogCtaPill({ mode, tone }));
</script>

<div data-slot="og-cta-pill" class={cn(s.root(), className)}>
	<span class={s.texture()}></span>
	<span class={s.glow()}></span>
	{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
	<div class={s.pill()}>
		<span class={s.label()}>{label}</span>
	</div>
</div>
