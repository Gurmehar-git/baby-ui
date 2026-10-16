<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { VIDEO_ERROR_MESSAGES, type VideoPlayerErrorKind } from "./types";
import { videoPlayer } from "./variants";

let {
	messages,
	retryLabel = "Try again",
	class: classProp,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** Overrides the message for any error kind. */
	messages?: Partial<Record<VideoPlayerErrorKind, string>>;
	retryLabel?: string;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

{#if player.error}
	<div
		role="alert"
		data-slot="video-player-error"
		data-error={player.error}
		class={cn(s.error(), classProp)}
		{...rest}
	>
		<p class={s.errorMessage()}>
			{messages?.[player.error] ?? VIDEO_ERROR_MESSAGES[player.error]}
		</p>
		<button
			type="button"
			onclick={player.retry}
			class={cn(button({ variant: "outline", size: "sm" }), s.errorAction())}
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
				<path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
			</svg>
			{retryLabel}
		</button>
	</div>
{/if}
