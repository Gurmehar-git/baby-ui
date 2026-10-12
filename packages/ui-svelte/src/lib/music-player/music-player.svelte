<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../button/button.svelte";
import { cn } from "../lib/cn";
import type { ImageSlotProps } from "../lib/image";
import Slider from "../slider/slider.svelte";
import {
	clampUnit,
	formatTime,
	MUSIC_PLAYER_LABELS,
	type MusicPlayerLabels,
	SEEK_TOLERANCE,
} from "./types";
import { type MusicPlayerLayout, musicPlayer } from "./variants";

let {
	title,
	artist,
	cover,
	coverAlt = "",
	duration,
	src,
	playing = $bindable(false),
	onPlayingChange,
	position = $bindable(0),
	onPositionChange,
	volume = $bindable(1),
	onVolumeChange,
	onPrevious,
	onNext,
	layout = "vinyl",
	labels,
	image,
	class: classProp,
}: {
	title: string;
	artist: string;
	/** Cover art URL, shown as the record face. */
	cover: string;
	coverAlt?: string;
	/** Track length in seconds. */
	duration: number;
	/** Audio URL; when set the player drives a real `<audio>` element, otherwise it only renders. */
	src?: string;
	playing?: boolean;
	onPlayingChange?: (playing: boolean) => void;
	/** Playhead in seconds. */
	position?: number;
	onPositionChange?: (position: number) => void;
	/** 0 to 1. */
	volume?: number;
	onVolumeChange?: (volume: number) => void;
	/** Shows a previous-track button when set. */
	onPrevious?: () => void;
	/** Shows a next-track button when set. */
	onNext?: () => void;
	layout?: MusicPlayerLayout;
	labels?: Partial<MusicPlayerLabels>;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();

const text = $derived({ ...MUSIC_PLAYER_LABELS, ...labels });
const s = $derived(musicPlayer({ layout }));
const level = $derived(clampUnit(volume));
const length = $derived(Math.max(0, duration));
const at = $derived(Math.min(length, Math.max(0, position)));

let audio = $state<HTMLAudioElement>();
let lastVolume = 1;

function setPlaying(next: boolean) {
	playing = next;
	onPlayingChange?.(next);
}
function setPosition(next: number) {
	position = next;
	onPositionChange?.(next);
}
function setVolume(next: number) {
	volume = next;
	onVolumeChange?.(next);
}
function toggleMute() {
	if (level > 0) {
		lastVolume = level;
		setVolume(0);
	} else setVolume(lastVolume);
}

$effect(() => {
	const el = audio;
	if (!el) return;
	if (playing) el.play().catch(() => setPlaying(false));
	else el.pause();
});

$effect(() => {
	if (audio) audio.volume = level;
});

$effect(() => {
	const el = audio;
	if (el && Math.abs(el.currentTime - at) > SEEK_TOLERANCE) el.currentTime = at;
});
</script>

<div
	data-slot="music-player"
	data-layout={layout}
	data-playing={playing}
	class={cn(s.root(), classProp)}
>
	{#if src}
		<audio
			bind:this={audio}
			{src}
			preload="metadata"
			class="hidden"
			ontimeupdate={(e) => setPosition(e.currentTarget.currentTime)}
			onended={() => setPlaying(false)}
		></audio>
	{/if}
	<div class={s.frame()}>
		<div class={s.deck()}>
			<div class={s.disc()} data-playing={playing}>
				{#if image}{@render image({ src: cover, alt: coverAlt, className: s.cover() })}{:else}<img src={cover} alt={coverAlt} class={s.cover()} draggable="false" />{/if}
				<div aria-hidden="true" class={s.grooves()}></div>
				<div aria-hidden="true" class={s.label()}>
					<div class={s.pin()}></div>
				</div>
			</div>
			<div aria-hidden="true" class={s.sheen()}></div>
			<div aria-hidden="true" class={s.arm()} data-playing={playing}>
				<div class={s.armBase()}></div>
				<div class={s.armStick()}>
					<div class={s.needle()}></div>
				</div>
			</div>
		</div>
		<div class={s.body()}>
			<div class={s.meta()}>
				<span class={s.title()}>{title}</span>
				<span class={s.artist()}>{artist}</span>
			</div>
			<div class={s.scrub()}>
				<Slider
					size="sm"
					label={text.seek}
					min={0}
					max={length}
					step={1}
					value={at}
					onValueChange={(v) => setPosition(v as number)}
				/>
				<div class={s.times()} aria-hidden="true">
					<span>{formatTime(at)}</span>
					<span>-{formatTime(length - at)}</span>
				</div>
			</div>
			<div class={s.controls()}>
				<div class={s.transport()}>
					{#if onPrevious}
						<Button variant="ghost" size="icon" aria-label={text.previous} onclick={onPrevious}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M20 5v14l-12 -7z" />
								<path d="M4 5l0 14" />
							</svg>
						</Button>
					{/if}
					<Button
						size="icon-lg"
						class="rounded-full"
						aria-label={playing ? text.pause : text.play}
						onclick={() => setPlaying(!playing)}
					>
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							{#if playing}
								<path
									d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
								/>
								<path
									d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
								/>
							{:else}
								<path d="M7 4v16l13 -8z" />
							{/if}
						</svg>
					</Button>
					{#if onNext}
						<Button variant="ghost" size="icon" aria-label={text.next} onclick={onNext}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M4 5v14l12 -7z" />
								<path d="M20 5l0 14" />
							</svg>
						</Button>
					{/if}
				</div>
				<div class={s.volume()}>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={level > 0 ? text.mute : text.unmute}
						onclick={toggleMute}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path
								d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
							/>
							{#if level > 0}
								<path d="M15 8a5 5 0 0 1 0 8" />
								<path d="M17.7 5a9 9 0 0 1 0 14" />
							{:else}
								<path d="M16 10l4 4m0 -4l-4 4" />
							{/if}
						</svg>
					</Button>
					<Slider
						size="sm"
						label={text.volume}
						min={0}
						max={100}
						step={1}
						value={Math.round(level * 100)}
						onValueChange={(v) => setVolume((v as number) / 100)}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
