<script lang="ts" module>
import { tv, type VariantProps } from "tailwind-variants";

const studio = tv({
	slots: {
		frame:
			"@container relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-[max-width,max-height] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		// Sized by the frame, not the window: a phone-wide frame gets phone-sized type.
		overlay:
			"pointer-events-none absolute inset-0 z-10 flex flex-col p-4 @sm:p-6 @lg:p-12",
		pill: "rounded-full border border-current/25 px-2.5 py-0.5 font-medium text-[10px] @sm:text-xs",
		title: "text-balance font-semibold tracking-tight",
		text: "mt-2 hidden max-w-md text-sm opacity-80 @sm:mt-3 @sm:block @lg:text-base",
		actions: "mt-4 flex gap-2 @sm:mt-6",
		secondary: "hidden @sm:inline-flex",
	},
	variants: {
		frame: {
			hero: { frame: "aspect-video w-full max-w-5xl" },
			full: { frame: "size-full max-w-none" },
			card: { frame: "aspect-[4/3] w-full max-w-md" },
			phone: { frame: "aspect-[390/844] h-full max-h-[44rem] w-auto" },
		},
		layout: {
			hero: {
				overlay: "items-center justify-center text-center",
				title: "mt-3 max-w-2xl text-xl @sm:mt-4 @sm:text-3xl @lg:text-6xl",
			},
			content: {
				overlay: "items-start justify-center text-left",
				title: "mt-3 max-w-lg text-lg @sm:mt-4 @sm:text-2xl @lg:text-4xl",
			},
			cta: { overlay: "justify-end", title: "text-base @sm:text-xl @lg:text-3xl" },
		},
		tone: {
			light: { overlay: "text-white" },
			dark: { overlay: "text-neutral-950" },
		},
	},
	defaultVariants: { frame: "hero", layout: "hero", tone: "light" },
});

type Frame = NonNullable<VariantProps<typeof studio>["frame"]>;
type Layout = NonNullable<VariantProps<typeof studio>["layout"]>;
type Tone = NonNullable<VariantProps<typeof studio>["tone"]>;
</script>

<script lang="ts">
import SpecDials from "@baby-ui/demos/controls";
import {
	IconAlignLeft,
	IconArrowUpRight,
	IconArrowsMaximize,
	IconCheck,
	IconCopy,
	IconDeviceDesktop,
	IconDeviceMobile,
	IconEye,
	IconEyeClosed,
	IconFileCode,
	IconLayoutRows,
	IconPhoto,
	IconRefresh,
	IconSearch,
	IconShuffle,
	IconTypography,
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
	Slider,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@baby-ui/svelte";
import { onMount } from "svelte";
import { hasProAccess } from "#lib/account.js";
import CodeBlock from "#lib/components/code-block.svelte";
import InstallCommand from "#lib/components/install-command.svelte";
import ProInstallGate from "#lib/components/pro-install-gate.svelte";
import SegmentControl, { type SegmentOption } from "#lib/components/segment-control.svelte";
import StudioAbout from "#lib/studio/studio-about.svelte";
import StudioSeo from "#lib/studio/studio-seo.svelte";
import {
	startStudioSession,
	trackStudio,
	trackStudioSettled,
} from "#lib/studio/studio-events.js";
import { STUDIOS } from "#lib/studio/studios.js";
import { backgroundCode, changedProps } from "#lib/studio/codegen.js";
import { LiveCode } from "#lib/studio/live-code.svelte.js";
import LiveComponent from "#lib/studio/live-component.svelte";
import { remix } from "#lib/studio/remix.js";
import SceneThumb from "#lib/studio/scene-thumb.svelte";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const aboutStudio = STUDIOS.find((s) => s.slug === "background");

const FRAMES: SegmentOption<Frame>[] = [
	{ id: "hero", label: "Hero", icon: IconDeviceDesktop },
	{ id: "full", label: "Full", icon: IconArrowsMaximize },
	{ id: "card", label: "Card", icon: IconPhoto },
	{ id: "phone", label: "Phone", icon: IconDeviceMobile },
];
const LAYOUTS: SegmentOption<Layout>[] = [
	{ id: "hero", label: "Hero", icon: IconTypography },
	{ id: "content", label: "Content", icon: IconAlignLeft },
	{ id: "cta", label: "CTA", icon: IconLayoutRows },
];
// Library rows are h-16 with a 4px gap; the active fill slides by this much per row.
const ROW_PX = 68;

let slug = $state("");
let values = $state<Record<string, unknown>>({});
let frame = $state<Frame>("hero");
let layout = $state<Layout>("hero");
let tone = $state<Tone>("light");
let content = $state(true);
let scrim = $state(0);
let query = $state("");
let tab = $state("background");
let codeOpen = $state(false);
let linkCopied = $state(false);
// Bumped to re-seed the dials: a new background, a reset, a remix or a restored link.
let seed = $state(0);
let restored = $state(false);

const current = $derived(
	data.backgrounds.find((b) => b.spec.slug === slug) ?? data.backgrounds[0],
);
const shown = $derived(
	data.backgrounds.filter((b) =>
		b.spec.name.toLowerCase().includes(query.trim().toLowerCase()),
	),
);
const activeRow = $derived(shown.findIndex((b) => b.spec.slug === current?.spec.slug));
const live = $derived({
	...Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined && value !== ""),
	),
	...(current?.positioned ? { position: "absolute" } : {}),
});
const changed = $derived(current ? changedProps(values, current.defaults) : {});
const locked = $derived(current?.spec.tier === "pro" && !hasProAccess());
const s = $derived(studio({ frame, layout, tone }));

function pick(next: string, via: "list" | "select" | "shuffle" = "list") {
	if (next === current?.spec.slug) return;
	slug = next;
	values = {};
	seed++;
	const tier = data.backgrounds.find((b) => b.spec.slug === next)?.spec.tier ?? "free";
	trackStudio("item_picked", { studio: "background", slug: next, tier, via });
}

function shuffle() {
	const others = data.backgrounds.filter((b) => b.spec.slug !== current?.spec.slug);
	const next = others[Math.floor(Math.random() * others.length)];
	if (next) pick(next.spec.slug, "shuffle");
}

function remixCurrent() {
	if (!current) return;
	values = remix(current.spec, values);
	seed++;
	trackStudio("remixed", { studio: "background", slug: current.spec.slug });
}

function reset() {
	values = {};
	scrim = 0;
	seed++;
	if (current) trackStudio("reset", { studio: "background", slug: current.spec.slug });
}

function openCode() {
	codeOpen = true;
	if (current)
		trackStudio("code_opened", { studio: "background", slug: current.spec.slug, locked });
}

onMount(() => startStudioSession("background"));
$effect(() => {
	const target = current;
	const names = Object.keys(changed);
	if (!target || !names.length) return;
	trackStudioSettled("bg-props", "props_changed", {
		studio: "background",
		slug: target.spec.slug,
		props: names,
	});
});

const isFrame = (value: string | null): value is Frame => FRAMES.some((f) => f.id === value);
const isLayout = (value: string | null): value is Layout =>
	LAYOUTS.some((l) => l.id === value);

// A shared link restores the background, its props and the preview settings.
onMount(() => {
	const params = page.url.searchParams;
	const bg = params.get("bg");
	if (bg && data.backgrounds.some((b) => b.spec.slug === bg)) slug = bg;
	try {
		const parsed: unknown = JSON.parse(params.get("p") ?? "{}");
		if (parsed && typeof parsed === "object") values = { ...parsed };
	} catch {
		values = {};
	}
	const f = params.get("frame");
	if (isFrame(f)) frame = f;
	else if (matchMedia("(max-width: 639px)").matches) frame = "full";
	const l = params.get("layout");
	if (isLayout(l)) layout = l;
	if (params.get("tone") === "dark") tone = "dark";
	content = params.get("content") !== "0";
	scrim = Math.min(80, Math.max(0, Number(params.get("scrim") ?? 0) || 0));
	seed++;
	restored = true;
});

// The address bar always holds a shareable link to the current state.
$effect(() => {
	if (!restored || !current) return;
	const url = new URL(page.url.href);
	url.search = "";
	url.searchParams.set("bg", current.spec.slug);
	if (Object.keys(changed).length) url.searchParams.set("p", JSON.stringify(changed));
	if (frame !== "hero") url.searchParams.set("frame", frame);
	if (layout !== "hero") url.searchParams.set("layout", layout);
	if (tone !== "light") url.searchParams.set("tone", tone);
	if (!content) url.searchParams.set("content", "0");
	if (scrim) url.searchParams.set("scrim", String(scrim));
	const timer = setTimeout(() => replaceState(url, {}), 250);
	return () => clearTimeout(timer);
});

let copyTimer: ReturnType<typeof setTimeout>;
async function copyLink() {
	await navigator.clipboard.writeText(window.location.href);
	linkCopied = true;
	if (current) trackStudio("link_copied", { studio: "background", slug: current.spec.slug });
	clearTimeout(copyTimer);
	copyTimer = setTimeout(() => (linkCopied = false), 1600);
}

const code = new LiveCode(() => ({
	open: codeOpen,
	panels: current
		? (["react", "svelte"] as const).map((framework) => ({
				id: framework,
				label: framework === "react" ? "React" : "Svelte",
				lang: framework === "react" ? "tsx" : "svelte",
				code: backgroundCode({
					framework,
					entry: current.entry,
					importLine: current.imports[framework],
					props: { ...(current.positioned ? { position: "absolute" } : {}), ...changed },
				}),
			}))
		: [],
}));
</script>

<StudioSeo slug="background" crumb="Background" />

{#if current}
	<main class="flex flex-col p-3 xl:h-[calc(100dvh-var(--header-h))]">
		<h1 class="sr-only">Background studio</h1>
		<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[20rem_minmax(0,1fr)] xl:grid-rows-2 xl:gap-y-0">
			<!-- Library: the content layout to preview with, then every background as a live row. -->
			<nav aria-label="Backgrounds" class="hidden min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-1 xl:flex xl:rounded-b-none xl:border-b-0">
				<div class="px-2.5 pt-2 pb-3">
					<p class="font-medium text-foreground text-sm">Scene library</p>
					<p class="text-muted-foreground text-xs">Every background you can tune here.</p>
				</div>
				<div class="px-1 pb-2">
					<SegmentControl size="sm" label="Sample layout" options={LAYOUTS} current={layout} onPick={(id) => (layout = id)} />
				</div>
				<div class="relative px-1 pb-2">
					<IconSearch size={14} class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 -mt-1 text-muted-foreground" />
					<Input size="sm" bind:value={query} placeholder="Filter" aria-label="Filter backgrounds" class="pl-8" />
				</div>
				<div class="scrollbar-hide relative min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background p-1">
					{#if activeRow >= 0}
						<span
							aria-hidden="true"
							class="absolute inset-x-1 top-1 h-16 rounded-lg bg-foreground transition-transform duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none"
							style:transform="translateY({activeRow * ROW_PX}px)"
						></span>
					{/if}
					<ul class="relative flex flex-col gap-1">
						{#each shown as item (item.spec.slug)}
							{@const active = item.spec.slug === current.spec.slug}
							<li>
								<button
									type="button"
									onclick={() => pick(item.spec.slug)}
									aria-current={active ? "true" : undefined}
									class="group/scene flex h-16 w-full items-center gap-3 rounded-lg p-1.5 text-left transition-[color,scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] not-aria-[current=true]:hover:bg-foreground/[0.06] active:scale-[0.98] motion-reduce:transition-none"
								>
									<SceneThumb slug={item.spec.slug} entry={item.entry} props={item.thumb} class="h-full w-16 shrink-0 rounded-md" />
									<span class="min-w-0 flex-1">
										<span class="flex items-center gap-1.5">
											<span class="truncate font-medium text-foreground text-sm transition-colors group-aria-[current=true]/scene:text-background">
												{item.spec.name}
											</span>
											{#if item.spec.tier === "pro"}
												<span class="rounded-full bg-foreground px-1.5 py-px font-medium text-[10px] text-background group-aria-[current=true]/scene:bg-background group-aria-[current=true]/scene:text-foreground">Pro</span>
											{/if}
										</span>
										<span class="line-clamp-2 text-muted-foreground text-xs transition-colors group-aria-[current=true]/scene:text-background/70">
											{item.spec.description}
										</span>
									</span>
								</button>
							</li>
						{:else}
							<li class="px-2.5 py-2 text-muted-foreground text-sm">No background matches.</li>
						{/each}
					</ul>
				</div>
			</nav>

			<!-- Stage: description and size switch above, the framed preview, then name and remix below. -->
			<section aria-label="Preview" class="flex min-h-[30rem] min-w-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-2 xl:row-span-2 xl:row-start-1">
				<div class="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 pb-2">
					<div class="flex min-w-0 flex-wrap items-center gap-2">
						<div class="xl:hidden">
							<Select
								items={data.backgrounds.map((b) => ({ value: b.spec.slug, label: b.spec.name }))}
								bind:value={() => current.spec.slug, (next) => pick(next, "select")}
							>
								<SelectTrigger size="sm" aria-label="Background" class="w-44">
									<SelectValue />
								</SelectTrigger>
								<SelectContent size="sm">
									{#each data.backgrounds as item (item.spec.slug)}
										<SelectItem value={item.spec.slug} label={item.spec.name}>{item.spec.name}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						</div>
						<!-- On a phone the stage is already phone-wide, so the size switch only shows from sm. -->
						<div class="hidden sm:block">
							<SegmentControl size="sm" label="Preview size" options={FRAMES} current={frame} onPick={(id) => (frame = id)} />
						</div>
					</div>
					<div class="flex items-center gap-1">
						<Button
							size="icon-sm"
							variant="ghost"
							aria-label={content ? "Hide sample content" : "Show sample content"}
							aria-pressed={!content}
							onclick={() => (content = !content)}
						>
							{#if content}<IconEye />{:else}<IconEyeClosed />{/if}
						</Button>
						<Button size="icon-sm" variant="ghost" aria-label="Another background" onclick={shuffle}>
							<IconShuffle />
						</Button>
						<Button size="sm" variant="ghost" aria-label={linkCopied ? "Link copied" : "Copy link"} onclick={copyLink}>
							{#if linkCopied}<IconCheck />{:else}<IconCopy />{/if}
							<span class="hidden sm:inline">{linkCopied ? "Link copied" : "Copy link"}</span>
						</Button>
						<Button size="sm" onclick={openCode}>
							<IconFileCode />
							Get code
						</Button>
					</div>
				</div>
				<div class="grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[7px] bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-2 sm:p-8">
					<div class={s.frame()}>
						{#key current.spec.slug}
							<LiveComponent slug={current.spec.slug} entry={current.entry} props={live} />
						{/key}
						{#if scrim}
							<div
								aria-hidden="true"
								class="pointer-events-none absolute inset-0 z-[5]"
								style:background-color={tone === "light" ? `rgb(0 0 0 / ${scrim}%)` : `rgb(255 255 255 / ${scrim}%)`}
							></div>
						{/if}
						{#if content}
							<!-- A stand-in page section to judge legibility; inert, so it never takes a click. -->
							<div class={s.overlay()} inert>
								{#if layout === "cta"}
									<div class="flex flex-wrap items-end justify-between gap-4">
										<div>
											<p class={s.title()}>Ready when you are</p>
											<p class="mt-1 text-sm opacity-80">Start free, upgrade when the team grows.</p>
										</div>
										<Button size="sm">Start building <IconArrowUpRight /></Button>
									</div>
								{:else}
									<span class={s.pill()}>New in Studio</span>
									<p class={s.title()}>Make the first frame impossible to ignore</p>
									<p class={s.text()}>
										Tune it here, ship it there. Every control is a real prop.
									</p>
									{#if layout === "hero"}
										<div class={s.actions()}>
											<Button size="sm">Start building <IconArrowUpRight /></Button>
											<Button size="sm" variant="outline" class={s.secondary()}>See the system</Button>
										</div>
									{/if}
								{/if}
							</div>
						{/if}
					</div>
				</div>
				<div class="flex items-center justify-between gap-3 px-2 pt-2 pb-1">
					<div class="min-w-0">
						<p class="truncate font-medium text-foreground text-sm">{current.spec.name}</p>
						<p class="truncate text-muted-foreground text-xs">{current.spec.description}</p>
					</div>
					<Button size="sm" variant="outline" onclick={remixCurrent}>
						<IconShuffle />
						Remix
					</Button>
				</div>
			</section>

			<!-- Tune: the background's own dials, and the compose settings for the preview. -->
			<aside aria-label="Tune the scene" class="flex min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-2 xl:rounded-t-none">
				<div class="flex shrink-0 items-start justify-between gap-2 px-2.5 pt-2 pb-1">
					<div>
						<p class="font-medium text-foreground text-sm">Tune the scene</p>
						<p class="text-muted-foreground text-xs">Only the controls this background has.</p>
					</div>
					<Button variant="ghost" size="icon-sm" aria-label="Reset" onclick={reset}>
						<IconRefresh />
					</Button>
				</div>
				<Tabs bind:value={tab} variant="underline" size="sm" class="flex min-h-0 flex-1 flex-col">
					<TabsList class="shrink-0 px-2.5">
						<TabsTrigger value="background">Background</TabsTrigger>
						<TabsTrigger value="compose">Compose</TabsTrigger>
					</TabsList>
					<TabsContent value="background" class="scrollbar-hide mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background py-2">
						{#key `${current.spec.slug}:${seed}`}
							<SpecDials spec={current.spec} bind:values />
						{/key}
					</TabsContent>
					<TabsContent value="compose" class="scrollbar-hide mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background px-3 py-2">
						<label class="flex min-h-8 items-center justify-between gap-3">
							<span class="font-medium text-muted-foreground text-xs">Sample content</span>
							<Switch size="sm" bind:checked={content} />
						</label>
						<label class="flex min-h-8 items-center justify-between gap-3">
							<span class="font-medium text-muted-foreground text-xs">Dark text</span>
							<Switch
								size="sm"
								bind:checked={() => tone === "dark", (dark) => (tone = dark ? "dark" : "light")}
							/>
						</label>
						<div class="flex min-h-8 items-center justify-between gap-3">
							<span class="font-medium text-muted-foreground text-xs">Scrim</span>
							<div class="flex w-32 items-center gap-2">
								<Slider label="Scrim" min={0} max={80} step={5} bind:value={scrim} />
								<span class="w-8 shrink-0 text-right text-muted-foreground text-xs tabular-nums">{scrim}%</span>
							</div>
						</div>
						<div class="mt-2 xl:hidden">
							<SegmentControl size="sm" label="Sample layout" options={LAYOUTS} current={layout} onPick={(id) => (layout = id)} />
						</div>
					</TabsContent>
				</Tabs>
			</aside>
		</div>
	</main>

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
				<p class="text-muted-foreground text-xs">Only the props you changed are written out.</p>
			{/if}
		</SheetContent>
	</Sheet>
{/if}

{#if aboutStudio}<StudioAbout studio={aboutStudio} />{/if}
