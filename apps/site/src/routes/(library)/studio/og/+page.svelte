<script lang="ts">
import SpecDials from "@baby-ui/demos/controls";
import { previewProps } from "@baby-ui/demos/preview-props";
import {
	IconFileCode,
	IconLayoutGrid,
	IconPhoto,
	IconRefresh,
	IconSearch,
	IconShuffle,
	IconSparkles,
} from "@baby-ui/icons";
import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	Spinner,
	Switch,
} from "@baby-ui/svelte";
import { onMount } from "svelte";
import { hasProAccess } from "#lib/account.js";
import CodeBlock from "#lib/components/code-block.svelte";
import InstallCommand from "#lib/components/install-command.svelte";
import ProInstallGate from "#lib/components/pro-install-gate.svelte";
import SegmentControl, {
	type SegmentOption,
} from "#lib/components/segment-control.svelte";
import { OgPngPreview, renderOgHtml } from "#lib/preview-modes.svelte.js";
import { proOgSample } from "#lib/pro.js";
import { specHref } from "#lib/registry.js";
import { changedProps, ogTemplateCode } from "#lib/studio/codegen.js";
import { LiveCode } from "#lib/studio/live-code.svelte.js";
import LiveComponent from "#lib/studio/live-component.svelte";
import { OG_HEIGHT, OG_WIDTH } from "#lib/studio/og-canvas.js";
import OgCanvasEditor from "#lib/studio/og-canvas-editor.svelte";
import StudioAbout from "#lib/studio/studio-about.svelte";
import {
	startStudioSession,
	trackStudio,
	trackStudioSettled,
} from "#lib/studio/studio-events.js";
import StudioSeo from "#lib/studio/studio-seo.svelte";
import { STUDIOS } from "#lib/studio/studios.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const aboutStudio = STUDIOS.find((s) => s.slug === "og");

type Mode = "templates" | "canvas";
const MODES: SegmentOption<Mode>[] = [
	{ id: "templates", label: "Templates", icon: IconLayoutGrid },
	{ id: "canvas", label: "Canvas", icon: IconSparkles },
];

let mode = $state<Mode>("templates");
let slug = $state("");
let values = $state<Record<string, unknown>>({});
let query = $state("");
let seed = $state(0);
let pngView = $state(false);
let codeOpen = $state(false);
let exporting = $state(false);
let sample = $state<Record<string, unknown> | undefined>(undefined);

const current = $derived(
	data.templates.find((t) => t.spec.slug === slug) ?? data.templates[0],
);
const shown = $derived(
	data.templates.filter((t) =>
		t.spec.name.toLowerCase().includes(query.trim().toLowerCase()),
	),
);
const controls = $derived(current ? { ...current.defaults, ...values } : {});
const live = $derived(current ? previewProps(current.spec.slug, controls, sample) : {});
const changed = $derived(current ? changedProps(values, current.defaults) : {});
const locked = $derived(current?.spec.tier === "pro" && !hasProAccess());

// Pro samples live in the Pro checkout; public ones resolve inside previewProps.
$effect(() => {
	const target = current;
	if (!target) return;
	let cancelled = false;
	sample = undefined;
	if (target.spec.tier === "pro")
		void proOgSample(target.spec.slug).then((next) => {
			if (!cancelled) sample = next;
		});
	return () => {
		cancelled = true;
	};
});

const png = new OgPngPreview(() =>
	current && mode === "templates"
		? { slug: current.spec.slug, entry: current.entry, controls, active: pngView }
		: null,
);

function pick(next: string, via: "list" | "select" | "shuffle" = "list") {
	if (next === current?.spec.slug) return;
	slug = next;
	values = {};
	seed++;
	const tier = data.templates.find((t) => t.spec.slug === next)?.spec.tier ?? "free";
	trackStudio("item_picked", { studio: "og", slug: next, tier, via });
}

function shuffle() {
	const others = data.templates.filter((t) => t.spec.slug !== current?.spec.slug);
	const next = others[Math.floor(Math.random() * others.length)];
	if (next) pick(next.spec.slug, "shuffle");
}

function reset() {
	values = {};
	seed++;
	if (current) trackStudio("reset", { studio: "og", slug: current.spec.slug });
}

function switchMode(next: Mode) {
	mode = next;
	trackStudio("mode_switched", { studio: "og", mode: next });
}

function openCode() {
	if (!current) return;
	codeOpen = true;
	const slug = current.spec.slug;
	if (locked) trackStudio("pro_gate_shown", { studio: "og", slug, action: "code" });
	else trackStudio("code_opened", { studio: "og", slug, locked: false });
}

async function download() {
	if (!current) return;
	const slug = current.spec.slug;
	// Pro templates show their gate instead of a PNG.
	if (locked) {
		codeOpen = true;
		trackStudio("pro_gate_shown", { studio: "og", slug, action: "download" });
		return;
	}
	exporting = true;
	const started = performance.now();
	try {
		const { ogMarkup } = await import("#lib/og/markup.js");
		const url = await renderOgHtml(await ogMarkup(slug, current.entry, controls));
		const link = document.createElement("a");
		link.href = url;
		link.download = `${slug}.png`;
		link.click();
		trackStudio("png_downloaded", {
			studio: "og",
			slug,
			ms: Math.round(performance.now() - started),
		});
	} catch (cause) {
		const message = cause instanceof Error ? cause.message : String(cause);
		trackStudio("png_failed", { studio: "og", slug, message });
	} finally {
		exporting = false;
	}
}

onMount(() => startStudioSession("og", mode));

// A dial drag sends one event once it settles, naming the props that differ from the defaults.
$effect(() => {
	const target = current;
	const names = Object.keys(changed);
	if (!target || !names.length) return;
	trackStudioSettled("og-template-props", "props_changed", {
		studio: "og",
		slug: target.spec.slug,
		props: names,
	});
});

// The live card is a fixed 1200x630 canvas scaled to the stage.
let stageWidth = $state(0);
let stageHeight = $state(0);
const scale = $derived(
	stageWidth && stageHeight
		? Math.min(stageWidth / OG_WIDTH, stageHeight / OG_HEIGHT)
		: 0.5,
);

const code = new LiveCode(() => ({
	open: codeOpen,
	panels: current
		? (["react", "svelte"] as const).map((framework) => ({
				id: framework,
				label: framework === "react" ? "React" : "Svelte",
				lang: framework === "react" ? "tsx" : "svelte",
				code: ogTemplateCode({
					framework,
					entry: current.entry,
					importLine: current.imports[framework],
					props: changed,
				}),
			}))
		: [],
}));
</script>

<StudioSeo slug="og" crumb="OG images" />

<main class="flex flex-col gap-3 p-3 xl:h-[calc(100dvh-var(--header-h))]">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<h1 class="font-medium text-foreground text-sm">OG image studio</h1>
		<SegmentControl size="sm" label="Studio mode" options={MODES} current={mode} onPick={switchMode} />
	</div>

	{#if mode === "canvas"}
		<OgCanvasEditor />
	{:else if current}
		<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[20rem_minmax(0,1fr)] xl:grid-rows-2 xl:gap-y-0">
			<nav aria-label="OG templates" class="hidden min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-1 xl:flex xl:rounded-b-none xl:border-b-0">
				<div class="relative px-1 pt-1 pb-2">
					<IconSearch size={14} class="pointer-events-none absolute top-1/2 left-3.5 -mt-0.5 -translate-y-1/2 text-muted-foreground" />
					<Input size="sm" bind:value={query} placeholder="Filter" aria-label="Filter templates" class="pl-8" />
				</div>
				<ul class="scrollbar-hide flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto rounded-[7px] bg-background p-1">
					{#each shown as template (template.spec.slug)}
						{@const active = template.spec.slug === current.spec.slug}
						<li>
							<Button
								size="sm"
								variant="ghost"
								aria-current={active ? "true" : undefined}
								class="w-full justify-between aria-[current=true]:bg-foreground/[0.08]"
								onclick={() => pick(template.spec.slug)}
							>
								<span class="truncate">{template.spec.name.replace(/^OG /, "")}</span>
								{#if template.spec.tier === "pro"}
									<span class="rounded-full bg-foreground px-1.5 py-px font-medium text-[10px] text-background">Pro</span>
								{/if}
							</Button>
						</li>
					{:else}
						<li class="px-2.5 py-2 text-muted-foreground text-sm">No template matches.</li>
					{/each}
				</ul>
			</nav>

			<section aria-label="Preview" class="flex min-h-[24rem] min-w-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-2 xl:row-span-2 xl:row-start-1">
				<div class="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 pb-2">
					<div class="flex items-center gap-2">
						<div class="xl:hidden">
							<Select
								items={data.templates.map((t) => ({ value: t.spec.slug, label: t.spec.name }))}
								bind:value={() => current.spec.slug, (next) => pick(next, "select")}
							>
								<SelectTrigger size="sm" aria-label="Template" class="w-44"><SelectValue /></SelectTrigger>
								<SelectContent size="sm">
									{#each data.templates as template (template.spec.slug)}
										<SelectItem value={template.spec.slug} label={template.spec.name}>{template.spec.name}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						</div>
						<label class="flex items-center gap-2 text-muted-foreground text-xs">
							<Switch size="sm" bind:checked={() => pngView, (on) => { pngView = on; trackStudio("png_toggled", { studio: "og", on }); }} />
							Show exact PNG
						</label>
					</div>
					<div class="flex items-center gap-1">
						<Button size="icon-sm" variant="ghost" aria-label="Another template" onclick={shuffle}>
							<IconShuffle />
						</Button>
						<Button size="sm" variant="ghost" onclick={download} loading={exporting} loadingLabel="Rendering…">
							<IconPhoto />
							Download PNG
						</Button>
						<Button size="sm" onclick={openCode}>
							<IconFileCode />
							Get code
						</Button>
					</div>
				</div>
				<div class="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[7px] bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-3 sm:p-6">
					<div bind:clientWidth={stageWidth} bind:clientHeight={stageHeight} class="absolute inset-3 sm:inset-6"></div>
					<div
						class="relative shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-border"
						style:width="{OG_WIDTH * scale}px"
						style:height="{OG_HEIGHT * scale}px"
					>
						{#if pngView}
							{#if png.shown}
								<img src={png.shown} alt="The rendered card" class="size-full" />
							{/if}
							{#if png.pending || png.error}
								<div class="absolute inset-0 grid place-items-center bg-background/40 text-muted-foreground text-xs">
									{#if png.error}{png.error}{:else}<Spinner size="sm" label="Rendering" />{/if}
								</div>
							{/if}
						{:else}
							<div class="absolute top-0 left-0 origin-top-left" style:width="{OG_WIDTH}px" style:height="{OG_HEIGHT}px" style:scale={scale}>
								{#key current.spec.slug}
									<LiveComponent slug={current.spec.slug} entry={current.entry} props={live} />
								{/key}
							</div>
						{/if}
					</div>
				</div>
				<div class="flex items-center justify-between gap-3 px-2 pt-2 pb-1">
					<div class="min-w-0">
						<p class="truncate font-medium text-foreground text-sm">{current.spec.name}</p>
						<p class="truncate text-muted-foreground text-xs">{current.spec.description}</p>
					</div>
					<Button size="sm" variant="outline" onclick={() => switchMode("canvas")}>Start from scratch</Button>
				</div>
			</section>

			<aside aria-label="Edit the card" class="flex min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-2 xl:rounded-t-none">
				<div class="flex shrink-0 items-start justify-between gap-2 px-2.5 pt-2 pb-1">
					<div>
						<p class="font-medium text-foreground text-sm">Edit the card</p>
						<p class="text-muted-foreground text-xs">Every control is a real prop.</p>
					</div>
					<Button variant="ghost" size="icon-sm" aria-label="Reset" onclick={reset}>
						<IconRefresh />
					</Button>
				</div>
				<div class="scrollbar-hide mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background py-2">
					{#key `${current.spec.slug}:${seed}`}
						<SpecDials spec={current.spec} bind:values />
					{/key}
				</div>
			</aside>
		</div>

		<Sheet bind:open={codeOpen}>
			<SheetContent side="right" variant="framed" class="w-[min(36rem,100vw)]">
				<SheetHeader>
					<SheetTitle>{current.spec.name}</SheetTitle>
					<SheetClose />
				</SheetHeader>
				{#if locked}
					<ProInstallGate name={current.spec.name} />
				{:else}
					<InstallCommand slug={current.spec.slug} />
					<CodeBlock panels={code.panels} maxHeight="none" />
					<p class="text-muted-foreground text-xs">
						Only the props you changed are written out. <a
							href={specHref(current.spec)}
							class="font-medium text-foreground underline underline-offset-4">Render it to a PNG</a
						>.
					</p>
				{/if}
			</SheetContent>
		</Sheet>
	{:else}
		<div class="grid flex-1 place-items-center text-muted-foreground text-sm">
			<Spinner size="sm" label="Loading templates" />
		</div>
	{/if}
</main>

{#if aboutStudio}<StudioAbout studio={aboutStudio} />{/if}
