<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	type OgPodcastEpisodeLayout,
	type OgPodcastEpisodeMode,
	type OgPodcastEpisodeTone,
	ogPodcastEpisode,
} from "./variants";
import { OG_PODCAST_WAVE, waveBarHeights } from "./waveform";

let {
	title,
	show,
	cover,
	episode,
	guest,
	duration,
	peaks,
	mode = "light",
	tone = "neutral",
	layout = "left",
	class: className,
}: {
	title: string;
	/** Show name, top of the text column. */
	show: string;
	/** Cover art URL; a mic mark fills the sleeve when omitted. */
	cover?: string;
	/** Pre-formatted, e.g. "EP 142". */
	episode?: string;
	guest?: { name: string; avatar?: string };
	/** Pre-formatted, e.g. "48:12". */
	duration?: string;
	/** Waveform bar heights from 0 to 1; a static motif is drawn when omitted. */
	peaks?: number[];
	mode?: OgPodcastEpisodeMode;
	tone?: OgPodcastEpisodeTone;
	layout?: OgPodcastEpisodeLayout;
	class?: string;
} = $props();

const s = $derived(ogPodcastEpisode({ mode, tone, layout }));
const bars = $derived(waveBarHeights(peaks?.length ? peaks : OG_PODCAST_WAVE));
</script>

<div data-slot="og-podcast-episode" class={cn(s.root(), className)}>
	<div class={s.dots()}></div>
	<div class={s.glow()}></div>
	<div class={s.art()}>
		<div class={s.disc()}>
			<div class={s.discRing()}>
				<div class={s.discLabel()}></div>
			</div>
		</div>
		<div class={s.cover()}>
			{#if cover}
				<img src={cover} alt="" class={s.coverImage()} />
			{:else}
				<div class={s.coverFallback()}>
					<svg
						aria-hidden="true"
						width="160"
						height="160"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -6 0z" />
						<path d="M5 10a7 7 0 0 0 14 0" />
						<path d="M8 21h8" />
						<path d="M12 17v4" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
	<div class={s.content()}>
		<div class={s.header()}>
			<span class={s.show()}>{show}</span>
			{#if episode}<span class={s.episode()}>{episode}</span>{/if}
		</div>
		<div class={s.body()}>
			<h1 class={s.title()}>{title}</h1>
			{#if guest}
				<div class={s.guest()}>
					{#if guest.avatar}<img src={guest.avatar} alt="" class={s.guestAvatar()} />{/if}
					<span>with</span>
					<span class={s.guestName()}>{guest.name}</span>
				</div>
			{/if}
		</div>
		<div class={s.player()}>
			<div class={s.play()}>
				<svg
					aria-hidden="true"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="2"
					stroke-linejoin="round"
				>
					<path d="M7 4v16l13 -8z" />
				</svg>
			</div>
			<div class={s.wave()}>
				{#each bars as h, i (i)}
					<div class={s.bar()} style="height: {h}px"></div>
				{/each}
			</div>
			{#if duration}<span class={s.duration()}>{duration}</span>{/if}
		</div>
	</div>
</div>
