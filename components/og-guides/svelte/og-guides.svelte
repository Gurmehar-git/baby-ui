<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgGuidesMode, ogGuides } from "./variants";

let {
	title,
	description,
	logo,
	mode = "dark",
	class: className,
}: {
	/** Up to two lines, top left. */
	title: string;
	/** Up to four lines under the title. */
	description?: string;
	/** Mark image URL, bottom right inside the guides. */
	logo?: string;
	mode?: OgGuidesMode;
	class?: string;
} = $props();

const s = $derived(ogGuides({ mode }));
</script>

<div data-slot="og-guides" class={cn(s.root(), className)}>
	<span class={s.top()}></span>
	<span class={s.bottom()}></span>
	<span class={s.left()}></span>
	<span class={s.right()}></span>
	<p class={s.title()}>{title}</p>
	{#if description}<p class={s.description()}>{description}</p>{/if}
	{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
</div>
