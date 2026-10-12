<script lang="ts">
import {
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyIllustration,
	EmptyMedia,
	EmptyTitle,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { EMPTY_SCENES, ILLUSTRATION_SCENES, isEmptyScene } from "../data/empty";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Empty>>(props));
const media = $derived(controlProps<ComponentProps<typeof EmptyMedia>>(props));
const scene = $derived(EMPTY_SCENES[isEmptyScene(props.scene) ? props.scene : "search"]);

let index = $state(0);
let phase =
	$state<NonNullable<ComponentProps<typeof EmptyIllustration>["phase"]>>("idle");
let timer: ReturnType<typeof setTimeout> | undefined;
$effect(() => () => clearTimeout(timer));
const art = $derived(ILLUSTRATION_SCENES[index] ?? ILLUSTRATION_SCENES[0]);
const copy = $derived(phase === "done" ? art.done : art.idle);
// The demo stands in for real work: actions with a pending line wait a beat, then resolve.
function act() {
	if (phase === "loading") return;
	if (phase === "done" || !art.loading) {
		phase = phase === "done" ? "idle" : "done";
		return;
	}
	phase = "loading";
	timer = setTimeout(() => (phase = "done"), 1200);
}
function choose(next: string | string[]) {
	const at = ILLUSTRATION_SCENES.findIndex((item) => item.id === next);
	if (at < 0) return;
	clearTimeout(timer);
	index = at;
	phase = "idle";
}
</script>

{#if props.media === "illustration"}
	<Empty variant={p.variant ?? "outline"} size={p.size ?? "default"} class="max-w-xl">
		<ToggleGroup variant="segmented" size="sm" label="Empty state" value={art.id} onValueChange={choose}>
			{#each ILLUSTRATION_SCENES as item (item.id)}
				<ToggleGroupItem value={item.id}>{item.tab}</ToggleGroupItem>
			{/each}
		</ToggleGroup>
		<EmptyHeader>
			<EmptyIllustration scene={art.id} {phase} />
			<EmptyTitle>{copy.title}</EmptyTitle>
			<EmptyDescription aria-live="polite">{phase === "loading" ? art.loading : copy.line}</EmptyDescription>
		</EmptyHeader>
		<EmptyContent>
			<Button size="sm" variant="outline" loading={phase === "loading"} onclick={act}>{copy.action}</Button>
		</EmptyContent>
	</Empty>
{:else}
	<Empty variant={p.variant ?? "outline"} layout={p.layout ?? "vertical"} size={p.size ?? "default"} class="max-w-xl">
		<EmptyHeader>
			<EmptyMedia variant="icon" tone={media.tone ?? scene.tone}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d={scene.icon} />
				</svg>
			</EmptyMedia>
			<EmptyTitle>{scene.title}</EmptyTitle>
			<EmptyDescription>{scene.description}</EmptyDescription>
		</EmptyHeader>
		<EmptyContent>
			<Button size="sm" variant={scene.tone === "primary" ? "default" : "outline"}>{scene.action}</Button>
		</EmptyContent>
	</Empty>
{/if}
