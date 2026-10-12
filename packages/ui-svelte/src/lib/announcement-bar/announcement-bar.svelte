<script lang="ts" module>
import type { Snippet } from "svelte";
import type { AnnouncementAction } from "./rotation";

export type Announcement = {
	/** Stable id, reported to callbacks. */
	id: string;
	message: string | Snippet;
	action?: AnnouncementAction;
	/** Counts down to a moment inside the message, such as the end of a sale. */
	countdown?: { to: Date | string | number; label?: string };
};
</script>

<script lang="ts">
import Button from "../button/button.svelte";
import Countdown from "../countdown/countdown.svelte";
import { cn } from "../lib/cn";
import { createRotation, faceState, readDismissed, rememberDismissed } from "./rotation";
import { type AnnouncementBarVariant, announcementBar } from "./variants";

let {
	messages,
	id,
	open = $bindable(),
	onOpenChange,
	index = $bindable(),
	onIndexChange,
	interval = 6000,
	autoPlay = true,
	controls = false,
	dismissible = true,
	onAction,
	onCountdownEnd,
	label = "Announcements",
	variant = "default",
	class: classProp,
}: {
	messages: Announcement[];
	/** Remembers dismissal under this id; change it to show a new campaign again. */
	id?: string;
	/** Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Index of the visible message. Bindable. */
	index?: number;
	onIndexChange?: (index: number) => void;
	/** Milliseconds each message stays. */
	interval?: number;
	/** Rotates while not hovered, focused, hidden or under reduced motion. */
	autoPlay?: boolean;
	/** Previous, next and a pause ring when there are several messages. */
	controls?: boolean;
	dismissible?: boolean;
	onAction?: (announcement: Announcement) => void;
	onCountdownEnd?: (announcement: Announcement) => void;
	/** Accessible name of the region. */
	label?: string;
	variant?: AnnouncementBarVariant;
	class?: string;
} = $props();

const uid = $props.id();
const total = $derived(messages.length);
let ownOpen = $state(true);
let remembered = $state(false);
$effect.pre(() => {
	remembered = readDismissed(id);
});
const isOpen = $derived(open ?? (ownOpen && !remembered));
let ownIndex = $state(0);
const current = $derived(total ? (((index ?? ownIndex) % total) + total) % total : 0);
let previous = $state<number | null>(null);
let dir = $state(1);
let paused = $state(false);
let hovered = $state(false);
let focused = $state(false);
let hidden = $state(false);
let reduced = $state(false);
let ring = $state<SVGCircleElement>();

function go(step: number) {
	if (total < 2) return;
	const next = (((current + step) % total) + total) % total;
	dir = step > 0 ? 1 : -1;
	previous = current;
	if (index === undefined) ownIndex = next;
	else index = next;
	onIndexChange?.(next);
}
function dismiss() {
	rememberDismissed(id);
	if (open === undefined) ownOpen = false;
	else open = false;
	onOpenChange?.(false);
}

$effect(() => {
	const read = () => (hidden = document.visibilityState === "hidden");
	reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
	document.addEventListener("visibilitychange", read);
	return () => document.removeEventListener("visibilitychange", read);
});
let rotation: ReturnType<typeof createRotation> | undefined;
$effect(() => {
	rotation = createRotation(ring ?? null, interval, () => go(1));
	return () => rotation?.destroy();
});
const rotating = $derived(autoPlay && !reduced && total > 1);
const running = $derived(rotating && isOpen && !paused && !hovered && !focused && !hidden);
$effect(() => {
	void current;
	rotation?.reset();
});
$effect(() => {
	rotation?.setRunning(running);
});

const s = $derived(announcementBar({ variant }));
const navigable = $derived(controls && total > 1);
const count = $derived((navigable ? 2 + (rotating ? 1 : 0) : 0) + (dismissible ? 1 : 0));
const side = $derived(`calc(${count} * 2rem + ${Math.max(count - 1, 0)} * 0.125rem)`);
</script>

{#snippet glyph(d: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="size-4"><path {d} /></svg
	>
{/snippet}

<section
	aria-label={label}
	aria-roledescription={total > 1 ? "carousel" : undefined}
	data-slot="announcement-bar"
	data-open={isOpen}
	inert={!isOpen}
	class={cn(s.collapse(), classProp)}
	onpointerenter={(event) => event.pointerType === "mouse" && (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={(event) => {
		if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) focused = false;
	}}
>
	<div class={s.clip()}>
		<div class={s.bar()} style:--ab-side={side} style:--ab-dir={dir}>
			<div aria-hidden="true"></div>
			<div id="{uid}-slides" aria-live={running ? "off" : "polite"} class={s.viewport()}>
				{#each messages as announcement, position (announcement.id)}
					{@const state = faceState(position, current, previous)}
					{@const select = () => {
						announcement.action?.onClick?.();
						onAction?.(announcement);
					}}
					<div
						data-face={state}
						inert={state !== "shown"}
						aria-hidden={state !== "shown" || undefined}
						role="group"
						aria-roledescription={total > 1 ? "slide" : undefined}
						aria-label={total > 1 ? `${position + 1} of ${total}` : undefined}
						class={s.face()}
					>
						<p class={s.message()}>
							<span class="min-w-0"
								>{#if typeof announcement.message === "string"}{announcement.message}{:else}{@render announcement.message()}{/if}</span
							>
							{#if announcement.countdown}
								{@const countdown = announcement.countdown}
								<span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
									{#if countdown.label}<span class={s.countdownLabel()}>{countdown.label}</span>{/if}
									<Countdown
										variant="inline"
										target={countdown.to}
										label={countdown.label ?? "Time remaining"}
										onComplete={() => onCountdownEnd?.(announcement)}
									/>
								</span>
							{/if}
							{#if announcement.action}
								{#if announcement.action.href}
									<a href={announcement.action.href} class={s.cta()} onclick={select}
										>{announcement.action.label}{@render glyph("M5 12h14m-6-6 6 6-6 6")}</a
									>
								{:else}
									<button type="button" class={s.cta()} onclick={select}
										>{announcement.action.label}{@render glyph("M5 12h14m-6-6 6 6-6 6")}</button
									>
								{/if}
							{/if}
						</p>
					</div>
				{/each}
			</div>
			<div class={s.controls()}>
				{#if navigable}
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label="Previous announcement"
						aria-controls="{uid}-slides"
						class={s.icon()}
						onclick={() => go(-1)}>{@render glyph("m18 15-6-6-6 6")}</Button
					>
					{#if rotating}
						<Button
							size="icon-sm"
							variant="ghost"
							aria-label={paused ? "Resume announcements" : "Pause announcements"}
							aria-pressed={paused}
							class={cn(s.icon(), "relative")}
							onclick={() => (paused = !paused)}
						>
							<svg viewBox="0 0 20 20" aria-hidden="true" class={s.ring()}>
								<circle cx="10" cy="10" r="8" class={s.ringTrack()} />
								<circle bind:this={ring} cx="10" cy="10" r="8" pathLength="1" class={s.ringFill()} />
							</svg>
							<svg viewBox="0 0 24 24" aria-hidden="true" class="absolute size-2.5 fill-current"
								><path d={paused ? "M7 4v16l13-8Z" : "M6 4h4v16H6zM14 4h4v16h-4z"} /></svg
							>
						</Button>
					{/if}
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label="Next announcement"
						aria-controls="{uid}-slides"
						class={s.icon()}
						onclick={() => go(1)}>{@render glyph("m6 9 6 6 6-6")}</Button
					>
				{/if}
				{#if dismissible}
					<Button size="icon-sm" variant="ghost" aria-label="Dismiss" class={s.icon()} onclick={dismiss}
						>{@render glyph("M18 6 6 18M6 6l12 12")}</Button
					>
				{/if}
			</div>
		</div>
	</div>
</section>
