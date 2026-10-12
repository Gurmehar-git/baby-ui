<script lang="ts">
import { LogoCarousel } from "@baby-ui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import { BRANDS } from "../data/media";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof LogoCarousel>>(props));
</script>

{#snippet logo(item: unknown)}
	{@const brand = item as (typeof BRANDS)[number]}
	<span class="flex h-10 w-28 shrink-0 items-center justify-center gap-2 text-foreground">
		<img src={brand.logo} alt="" width={24} height={24} class="size-6" />
		<span class="font-medium text-sm">{brand.name}</span>
	</span>
{/snippet}

<LogoCarousel
	items={BRANDS}
	logo={logo as Snippet<[unknown]>}
	columnCount={Number(props.columnCount ?? 4)}
	direction={p.direction ?? "ltr"}
	variant={p.variant}
	tone={p.tone}
	class={p.variant === "marquee" ? "w-full max-w-lg" : "w-full max-w-lg gap-3"}
/>
