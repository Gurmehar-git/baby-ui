<script lang="ts">
import type { Snippet } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarGroup from "../../avatar/svelte/avatar-group.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/svelte/cn";
import type { CtaAction } from "./types";
import { type CtaSectionVariant, ctaSection } from "./variants";

let {
	title,
	primaryAction,
	variant = "centered",
	description,
	secondaryAction,
	note,
	avatars = [],
	points = [],
	visual,
	dismissible = false,
	open = $bindable(),
	onOpenChange,
	class: className,
}: {
	title: string;
	primaryAction: CtaAction;
	/** `centered` closes a page, `split` sits beside a visual, `banner` is one line. */
	variant?: CtaSectionVariant;
	description?: string;
	/** Not shown in the banner. */
	secondaryAction?: CtaAction;
	/** Small print under the actions in the centered variant. */
	note?: string;
	/** Faces beside the note in the centered variant; four at most. */
	avatars?: { src: string; alt?: string }[];
	/** Short benefit lines in the split variant. */
	points?: string[];
	/** The split variant's right-hand side, e.g. a product shot. */
	visual?: Snippet;
	/** Banner: shows a dismiss button. */
	dismissible?: boolean;
	/** Banner: whether it is shown; folds closed when false. Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(ctaSection({ variant }));
let ownOpen = $state(true);
const shown = $derived(open ?? ownOpen);
function close() {
	if (open === undefined) ownOpen = false;
	else open = false;
	onOpenChange?.(false);
}
const ARROW = "M3 8h10M9 4l4 4-4 4";
const CHECK = "M3.5 8.5 6.5 11.5 12.5 4.5";
</script>

{#snippet glyph(d: string, klass?: string)}
	<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class={klass}>
		<path {d} stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet action(item: CtaAction, primary: boolean, size: "sm" | "lg")}
	<Button
		{size}
		variant={primary ? "default" : "outline"}
		href={item.href}
		onclick={item.onClick}
		class={size === "sm" ? undefined : s.action()}
	>
		{item.label}
		{#if primary}{@render glyph(ARROW, s.arrow())}{/if}
	</Button>
{/snippet}

<section
	data-slot="cta-section"
	data-variant={variant}
	aria-labelledby="{uid}-title"
	class={cn(s.root(), className)}
>
	{#if variant === "banner"}
		<div data-open={shown} inert={!shown} class={s.collapse()}>
			<div class={s.collapseInner()}>
				<div class={s.wrap()}>
					<div class={s.banner()}>
						<p class={s.bannerText()}>
							<strong id="{uid}-title" class={s.bannerTitle()}>{title}</strong>
							{#if description}<span class={s.bannerDescription()}>{description}</span>{/if}
						</p>
						<div class={s.bannerActions()}>
							{@render action(primaryAction, true, "sm")}
							{#if dismissible}
								<Button size="icon-sm" variant="ghost" aria-label="Dismiss" onclick={close}>
									{@render glyph("M4 4l8 8M12 4l-8 8")}
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class={s.wrap()}>
			<div class={s.panel()}>
				<div class={s.copy()}>
					<h2 id="{uid}-title" class={s.title()}>{title}</h2>
					{#if description}<p class={s.description()}>{description}</p>{/if}
					{#if variant === "split" && points.length}
						<ul class={s.points()}>
							{#each points as point (point)}
								<li class={s.point()}>{@render glyph(CHECK)}{point}</li>
							{/each}
						</ul>
					{/if}
					<div class={s.actions()}>
						{@render action(primaryAction, true, "lg")}
						{#if secondaryAction}{@render action(secondaryAction, false, "lg")}{/if}
					</div>
					{#if variant === "centered" && (note || avatars.length)}
						<div class={s.note()}>
							{#if avatars.length}
								<AvatarGroup aria-hidden="true">
									{#each avatars.slice(0, 4) as face (face.src)}
										<Avatar size="sm" class="size-6.5">
											<AvatarImage src={face.src} alt={face.alt ?? ""} />
											<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
										</Avatar>
									{/each}
								</AvatarGroup>
							{/if}
							{note}
						</div>
					{/if}
				</div>
				{#if variant === "split" && visual}
					<div class={s.stage()}>{@render visual()}</div>
				{/if}
			</div>
		</div>
	{/if}
</section>
