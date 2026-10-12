<script lang="ts">
import type { Snippet } from "svelte";
import Badge from "../badge/badge.svelte";
import Button from "../button/button.svelte";
import { cn } from "../lib/cn";
import type { ImageSlotProps } from "../lib/image";
import {
	clampIndex,
	DEFAULT_ORBIT_LABELS,
	type GridFit,
	gridFit,
	initialsFor,
	nextIndex,
	type OrbitCardStackLabels,
	type OrbitCardStackLayout,
	type OrbitCardStackSize,
	type OrbitStackItem,
	orbitCardStack,
	orbitTransform,
} from "./variants";

let {
	items,
	value = $bindable(),
	defaultValue,
	onValueChange,
	open = $bindable(),
	defaultOpen = false,
	onOpenChange,
	spread = 168,
	lift = 34,
	size,
	layout = "arc",
	labels,
	image,
	class: className,
}: {
	items: readonly OrbitStackItem[];
	/** Controlled index of the active (front) card. */
	value?: number;
	/** Front card before any interaction; defaults to the middle one. */
	defaultValue?: number;
	onValueChange?: (index: number) => void;
	/** Controlled fan state: true spreads the cards out. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Largest gap between open cards in px; shrinks to fit the stage. */
	spread?: number;
	/** How far the active open card rises, in px. */
	lift?: number;
	size?: OrbitCardStackSize;
	layout?: OrbitCardStackLayout;
	labels?: Partial<OrbitCardStackLabels>;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();

let stage = $state<HTMLUListElement>();
const count = $derived(items.length);
const active = $derived(
	clampIndex(value ?? defaultValue ?? Math.floor((count - 1) / 2), count),
);
const isOpen = $derived(open ?? defaultOpen);
const l = $derived({ ...DEFAULT_ORBIT_LABELS, ...labels });
const s = $derived(orbitCardStack({ size, layout }));
let fit = $state<GridFit>();

$effect(() => {
	const el = stage;
	const total = count;
	if (layout !== "grid" || !el) return;
	const measure = () => {
		const card = el.querySelector<HTMLElement>("[data-orbit-card]");
		if (card)
			fit = gridFit(
				el.clientWidth,
				el.clientHeight,
				card.offsetWidth,
				card.offsetHeight,
				total,
			);
	};
	measure();
	const resize = new ResizeObserver(measure);
	resize.observe(el);
	return () => resize.disconnect();
});

function setOpen(next: boolean) {
	if (next === isOpen) return;
	open = next;
	onOpenChange?.(next);
}
function activate(index: number) {
	setOpen(true);
	if (index === active) return;
	value = index;
	onValueChange?.(index);
}

function onkeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		(document.activeElement as HTMLElement | null)?.blur();
		return setOpen(false);
	}
	const next = nextIndex(event.key, active, count);
	if (next === undefined) return;
	event.preventDefault();
	activate(next);
	stage?.querySelectorAll<HTMLElement>("[data-orbit-card]")[next]?.focus();
}
</script>

<div data-slot="orbit-card-stack" class={cn(s.root(), className)}>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul
		bind:this={stage}
		aria-label={l.group}
		data-state={isOpen ? "open" : "closed"}
		class={s.stage()}
		onmouseleave={() => setOpen(false)}
		onfocusout={(event) => {
			if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
		}}
		{onkeydown}
	>
		{#each items as item, i (`${item.name}-${i}`)}
			{@const current = i === active}
			{@const initials = initialsFor(item)}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<li
				data-orbit-card=""
				tabindex={current ? 0 : -1}
				aria-current={current ? "true" : undefined}
				class={s.card()}
				style="z-index: {current ? 80 : 50 - Math.abs(i - active)}; transform: {orbitTransform(i, count, active, isOpen, layout, spread, lift, fit)}"
				onmouseenter={() => activate(i)}
				onfocus={() => activate(i)}
			>
				<div class={s.portrait()}>
					{#if item.image}
						{#if image}{@render image({ src: item.image, alt: "", className: s.portraitImage() })}{:else}<img src={item.image} alt="" class={s.portraitImage()} />{/if}
					{:else}
						<span aria-hidden="true" class={s.monogram()}>{initials}</span>
					{/if}
					<Badge variant="default" class={s.initials()}>{initials}</Badge>
				</div>
				{#if item.href}
					<Button
						href={item.href}
						size="icon-lg"
						aria-label="{l.link} {item.name}"
						tabindex={current ? 0 : -1}
						class={s.link()}
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
							<path d="M17 7l-10 10" />
							<path d="M8 7l9 0l0 9" />
						</svg>
					</Button>
				{/if}
				<div class={s.body()}>
					{#if item.role}<p class={s.role()}>{item.role}</p>{/if}
					<h3 class={s.name()}>{item.name}</h3>
					{#if item.description}<p class={s.description()}>{item.description}</p>{/if}
					{#if item.stat}<div class={s.stat()}>{item.stat}</div>{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>
