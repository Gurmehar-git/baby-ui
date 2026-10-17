<script lang="ts">
import { cn } from "../../lib/cn";
import {
	OG_CHANGELOG_ICONS,
	type OgChangelogKind,
	type OgChangelogMode,
	type OgChangelogTone,
	ogChangelog,
	ogChangelogMarker,
} from "../variants";

let {
	version,
	headline,
	site,
	logo,
	date,
	highlights,
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	/** Release version, e.g. "v2.4.0"; also drawn as the background numeral. */
	version: string;
	headline: string;
	/** Product name shown top left. */
	site: string;
	logo?: string;
	/** Pre-formatted release date. */
	date?: string;
	/** Up to three entries; `label` defaults to the capitalised kind. */
	highlights?: { kind: OgChangelogKind; text: string; label?: string }[];
	mode?: OgChangelogMode;
	tone?: OgChangelogTone;
	class?: string;
} = $props();

const s = $derived(ogChangelog({ mode, tone }));
const items = $derived(highlights?.slice(0, 3) ?? []);
</script>

<div data-slot="og-changelog" class={cn(s.root(), className)}>
	<div class={s.ghost()}>{version}</div>
	<div class={s.stub()}>
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.site()}>{site}</span>
		</div>
		<div class={s.pill()}>
			<span class={s.pillText()}>{version}</span>
		</div>
		{#if date}<div class={s.date()}>{date}</div>{/if}
		<div class={s.rail()}>
			<span class={s.railHead()}></span>
			<span class={s.railLine()}></span>
			<span class={s.railDot()}></span>
			<span class={s.railLine()}></span>
			<span class={s.railDot()}></span>
			<span class={s.railLine()}></span>
			<span class={s.railDot()}></span>
		</div>
	</div>
	<div class={cn(s.notch(), "-top-7")}></div>
	<div class={cn(s.notch(), "-bottom-7")}></div>
	<div class={s.main()}>
		<h1 class={s.headline()}>{headline}</h1>
		{#if items.length}
			<div class={s.list()}>
				{#each items as item, i (`${i}-${item.text}`)}
					{@const m = ogChangelogMarker({ kind: item.kind })}
					<div class={s.item()}>
						<span class={m.marker()}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class={m.icon()}
								aria-hidden="true"
							>
								{#each OG_CHANGELOG_ICONS[item.kind] as d (d)}<path {d} />{/each}
							</svg>{item.label ?? item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}</span>
						<span class={s.text()}>{item.text}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
