<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgHairlinesMode, ogHairlines } from "./variants";

let {
	name,
	title,
	description,
	logo,
	mode = "light",
	class: className,
}: {
	/** Brand name above the title; one line. */
	name: string;
	/** Up to two lines, centred. */
	title: string;
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgHairlinesMode;
	class?: string;
} = $props();

const s = $derived(ogHairlines({ mode }));
</script>

<div data-slot="og-hairlines" class={cn(s.root(), className)}>
	<span class={s.top()}></span>
	<span class={s.bottom()}></span>
	<span class={s.left()}></span>
	<span class={s.right()}></span>
	<div class={s.brand()}>
		{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
		<span class={s.name()}>{name}</span>
	</div>
	<p class={s.title()}>{title}</p>
	{#if description}<p class={s.description()}>{description}</p>{/if}
</div>
