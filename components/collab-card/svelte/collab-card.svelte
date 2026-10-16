<script lang="ts">
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import { cn } from "../../lib/svelte/cn";
import type { CollabCardCollaborator } from "./types";
import { type CollabCardTone, collabCard } from "./variants";

let {
	collaborators,
	presenceColors,
	presenceAvatars = [],
	extraCount = 0,
	greeting,
	eyebrow,
	intro,
	conjunction = "&",
	trailing = "",
	liveLabel,
	backgroundUrl,
	tone = "inverted",
	class: className,
}: {
	collaborators: [CollabCardCollaborator, CollabCardCollaborator];
	presenceColors: string[];
	/** Avatar image URLs, matched to `presenceColors` by index; the colour shows until each loads. */
	presenceAvatars?: string[];
	extraCount?: number;
	greeting: string;
	eyebrow: string;
	intro: string;
	conjunction?: string;
	trailing?: string;
	liveLabel?: string;
	backgroundUrl?: string;
	tone?: CollabCardTone;
	class?: string;
} = $props();

const first = $derived(collaborators[0]);
const second = $derived(collaborators[1]);
const editing = $derived(
	liveLabel ?? `Live · ${presenceColors.length + extraCount} editing`,
);
const styles = $derived(collabCard({ tone }));

const OVERLAP = "-ml-[1.08cqi]";
const CORNERS = [
	"-left-[0.9cqi] -top-[0.9cqi]",
	"-right-[0.9cqi] -top-[0.9cqi]",
	"-left-[0.9cqi] -bottom-[0.9cqi]",
	"-right-[0.9cqi] -bottom-[0.9cqi]",
];
</script>

{#snippet cursor(cls?: string)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class={cn(styles.cursor(), cls)}>
		<path d="M4 3.2 L4 19.4 L8.6 15.2 L11.4 21.2 L14 20 L11.2 14 L17.2 13.6 Z" fill="currentColor" />
	</svg>
{/snippet}

{#snippet clickBurst(cls: string)}
	<span
		data-burst=""
		aria-hidden="true"
		class={cn(
			"pointer-events-none absolute inline-block h-[3cqi] w-[3cqi]",
			"before:absolute before:inset-[35%] before:rounded-full before:bg-current",
			"after:absolute after:inset-0 after:rounded-full",
			"after:bg-[conic-gradient(from_0deg,transparent_0_8%,currentColor_8%_12%,transparent_12%_33%,currentColor_33%_37%,transparent_37%_58%,currentColor_58%_62%,transparent_62%_83%,currentColor_83%_87%,transparent_87%)]",
			"after:mask-[radial-gradient(circle,transparent_38%,black_40%,black_60%,transparent_62%)]",
			cls,
		)}
	></span>
{/snippet}

<div
	data-slot="collab-card"
	data-tone={tone}
	class={cn(styles.root(), className)}
	style={backgroundUrl ? `background-image:url(${backgroundUrl});background-size:cover;background-position:center;` : undefined}
>
	{#if !backgroundUrl}
		<div aria-hidden="true" class={styles.backdrop()}></div>
	{/if}
	<div aria-hidden="true" class={styles.glow()}></div>
	<div aria-hidden="true" class={styles.dots()}></div>

	<header class="absolute inset-x-[5cqi] top-[4cqi] z-10 flex items-center justify-between gap-[2cqi]">
		<span class={styles.status()}>
			<span class="relative inline-flex h-[1.7cqi] w-[1.7cqi] shrink-0">
				<span class={styles.livePing()}></span>
				<span class={styles.liveDot()}></span>
			</span>
			<span class="truncate tabular-nums leading-snug">{editing}</span>
		</span>
		<ul class="m-0 flex list-none items-center p-0" aria-hidden="true">
			{#each presenceColors as color, index (index)}
				<li class={cn("relative size-[3.25cqi] shrink-0", index > 0 && OVERLAP)} style="z-index:{index + 1}">
					<Avatar class={styles.swatch()} style="background-color:{color}">
						<AvatarImage src={presenceAvatars[index]} alt="" />
					</Avatar>
				</li>
			{/each}
			{#if extraCount > 0}
				<li class={cn("relative size-[3.25cqi] shrink-0", OVERLAP)} style="z-index:{presenceColors.length + 1}">
					<span class={styles.extra()}>+{extraCount}</span>
				</li>
			{/if}
		</ul>
	</header>

	<div class="relative flex h-full w-full flex-col items-center justify-center gap-[3.2cqi] px-[5.5cqi] pt-[9cqi] pb-[5cqi]">
		<p class={styles.eyebrow()}>{eyebrow}</p>

		<div class="relative w-[80%] max-w-full">
			<div class={styles.frame()}>
				{#each CORNERS as pos (pos)}
					<span aria-hidden="true" class={cn(styles.handle(), pos)}></span>
				{/each}
				<h2 class="font-(family-name:--font-heading) font-medium text-[17.5cqi] leading-[0.92] tracking-tight">
					{greeting}
				</h2>
			</div>

			<span aria-hidden="true" class="collab-cursor collab-cursor--host pointer-events-none absolute top-[-3.6cqi] left-[-2.8cqi]">
				{@render cursor()}
			</span>
		</div>

		<p class={styles.line()}>
			<span class={styles.muted()}>{intro}</span>

			<span class="relative inline-flex items-center">
				<span class={cn(styles.pill(), first.pill, first.pillText)}>{first.name}</span>
				<span aria-hidden="true" class={cn("collab-cursor collab-cursor--first pointer-events-none absolute right-[-1.8cqi] bottom-[-2.9cqi]", first.cursor)}>
					{@render cursor("-scale-x-100")}
					{@render clickBurst("top-[-0.7cqi] right-[-0.7cqi]")}
				</span>
			</span>

			<span class={styles.faint()}>{conjunction}</span>

			<span class="relative inline-flex items-center">
				<span class={cn(styles.pill(), second.pill, second.pillText)}>{second.name}</span>
				<span aria-hidden="true" class={cn("collab-cursor collab-cursor--second pointer-events-none absolute top-[-3.2cqi] right-[-2.8cqi]", second.cursor)}>
					{@render cursor()}
					{@render clickBurst("bottom-[-0.7cqi] left-[-0.7cqi]")}
				</span>
			</span>

			{#if trailing}
				<span class={styles.muted()}>{trailing}</span>
			{/if}
		</p>
	</div>
</div>
