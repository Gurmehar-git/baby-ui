<script lang="ts">
import {
	IconChevronDown,
	IconChevronUp,
	IconCopy,
	IconEye,
	IconEyeClosed,
	IconFileCode,
	IconLayers,
	IconLayoutGrid,
	IconPhoto,
	IconRedo,
	IconShape,
	IconTrash,
	IconTypography,
	IconUndo,
} from "@baby-ui/icons";
import {
	Badge,
	Button,
	Input,
	NumberInput,
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
	Spinner,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/svelte";
import { onMount } from "svelte";
import { hasProAccess } from "#lib/account.js";
import CodeBlock from "#lib/components/code-block.svelte";
import ProInstallGate from "#lib/components/pro-install-gate.svelte";
import { renderOgHtml, warmOgSoon } from "#lib/preview-modes.svelte.js";
import { LiveCode } from "#lib/studio/live-code.svelte.js";
import {
	backgroundCss,
	cloneLayer,
	docCode,
	docHtml,
	isOgDoc,
	layerCss,
	newImage,
	newShape,
	newText,
	OG_ALIGNS,
	OG_EFFECTS,
	OG_FONTS,
	OG_HEIGHT,
	OG_PATTERNS,
	OG_WEIGHTS,
	OG_WIDTH,
	type OgDoc,
	type OgEffect,
	type OgFont,
	type OgLayer,
	type OgPattern,
	type OgWeight,
	SNAP_X,
	SNAP_Y,
	snapAxis,
	styleString,
} from "#lib/studio/og-canvas.js";
import { blankDoc, OG_PRESETS, type OgPreset } from "#lib/studio/og-canvas-presets.js";
import OgCanvasThumb from "#lib/studio/og-canvas-thumb.svelte";
import OgColorField from "#lib/studio/og-color-field.svelte";
import { trackStudio, trackStudioSettled } from "#lib/studio/studio-events.js";

const STORAGE_KEY = "og-studio-canvas";
const HISTORY_LIMIT = 100;
const MARK = "/email/baby-ui-mark.png";

const FONT_LABEL: Record<OgFont, string> = {
	sans: "Inter (sans)",
	heading: "Satoshi (display)",
	serif: "Newsreader (serif)",
	mono: "JetBrains Mono",
};
const WEIGHT_LABEL: Record<OgWeight, string> = {
	400: "Regular",
	500: "Medium",
	600: "Semibold",
	700: "Bold",
	800: "Extra bold",
	900: "Black",
};
const EFFECT_LABEL: Record<OgEffect, string> = {
	none: "None",
	glow: "Corner glow",
	spotlight: "Spotlight",
	diagonal: "Diagonal wash",
};
const PATTERN_LABEL: Record<OgPattern, string> = {
	none: "None",
	grid: "Grid",
	dots: "Dots",
};
const KIND_LABEL: Record<OgLayer["kind"], string> = {
	text: "Text",
	image: "Image",
	shape: "Shape",
};
const SECTION = "font-medium text-foreground text-xs";
const TAB = "gap-1.5 [&_svg]:size-3.5";
// List rows and tiles; the same treatment as the background studio's scene library.
const ROW =
	"flex w-full min-w-0 rounded-lg text-left transition-colors duration-[var(--duration-dropdown)] hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-foreground/[0.08] motion-reduce:transition-none";
const PRESET_DOCS = OG_PRESETS.map((preset) => preset.doc());

const initial = OG_PRESETS[0]?.doc() ?? blankDoc();
let doc = $state<OgDoc>(initial);
let selectedId = $state<string | null>(null);
let editingId = $state<string | null>(null);
let guides = $state<{ x: number | null; y: number | null }>({ x: null, y: null });
let heights = $state<Record<string, number>>({});
let leftTab = $state("layouts");
let lastApplied = $state<OgPreset | null>(null);
let codeOpen = $state(false);
let gateOpen = $state(false);
let pngView = $state(false);
let pngUrl = $state("");
let pngPending = $state(false);
let pngError = $state("");
let exporting = $state(false);
let fileInput: HTMLInputElement | undefined = $state();
/** The image layer an upload replaces; none adds a new layer. */
let replacing: string | null = null;

const selected = $derived(doc.layers.find((layer) => layer.id === selectedId));
const proLocked = $derived(doc.layout?.tier === "pro" && !hasProAccess());
const layoutName = $derived(
	OG_PRESETS.find((p) => p.id === doc.layout?.id)?.label ?? "This layout",
);

function layerName(layer: OgLayer): string {
	if (layer.kind === "text") return layer.text.split("\n")[0]?.trim() || "Empty text";
	if (layer.kind === "image")
		return layer.src === MARK
			? "Logo"
			: layer.src.startsWith("data:")
				? "Uploaded image"
				: "Image";
	return layer.ellipse ? "Ellipse" : "Rectangle";
}

// --- History: edits settle for 300ms before they become one undo step.
let past: string[] = [];
let future: string[] = [];
let saved = JSON.stringify(initial);
let canUndo = $state(false);
let canRedo = $state(false);

$effect(() => {
	const now = JSON.stringify(doc);
	if (now === saved) return;
	const timer = setTimeout(() => {
		past = [...past, saved].slice(-HISTORY_LIMIT);
		future = [];
		saved = now;
		canUndo = true;
		canRedo = false;
		trackStudioSettled("og-canvas-edit", "props_changed", {
			studio: "og",
			slug: "canvas",
			props: [selected?.kind ?? "background"],
		});
		try {
			localStorage.setItem(STORAGE_KEY, now);
		} catch {
			// Storage full (a large upload) or blocked: the canvas still works, it just won't persist.
		}
	}, 300);
	return () => clearTimeout(timer);
});

function restore(snapshot: string) {
	const parsed: unknown = JSON.parse(snapshot);
	if (!isOgDoc(parsed)) return;
	saved = snapshot;
	doc = parsed;
	if (selectedId && !parsed.layers.some((layer) => layer.id === selectedId))
		selectedId = null;
}

function undo(via: "button" | "shortcut") {
	const target = past.at(-1);
	if (target === undefined) return;
	past = past.slice(0, -1);
	future = [...future, JSON.stringify(doc)];
	restore(target);
	canUndo = past.length > 0;
	canRedo = true;
	trackStudio("history_used", { studio: "og", action: "undo", via });
}

function redo(via: "button" | "shortcut") {
	const target = future.at(-1);
	if (target === undefined) return;
	future = future.slice(0, -1);
	past = [...past, JSON.stringify(doc)];
	restore(target);
	canUndo = true;
	canRedo = future.length > 0;
	trackStudio("history_used", { studio: "og", action: "redo", via });
}

onMount(() => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			restore(stored);
			leftTab = "layers";
		}
	} catch {
		// Blocked storage: start from the first layout.
	}
	return warmOgSoon();
});

let appliedTimer: ReturnType<typeof setTimeout> | undefined;
function applyLayout(preset: OgPreset) {
	const replaced = doc.layers.length;
	doc = { ...preset.doc(), layout: { id: preset.id, tier: preset.tier } };
	selectedId = null;
	editingId = null;
	lastApplied = preset;
	clearTimeout(appliedTimer);
	appliedTimer = setTimeout(() => (lastApplied = null), 8000);
	trackStudio("layout_applied", {
		studio: "og",
		layout: preset.id,
		tier: preset.tier,
		replaced,
	});
}

// --- Layers
function add(layer: OgLayer, via: "button" | "drop" | "upload" | "duplicate") {
	doc.layers.push(layer);
	selectedId = layer.id;
	leftTab = "layers";
	trackStudio("layer_added", { studio: "og", kind: layer.kind, via });
}

function remove(id: string) {
	const layer = doc.layers.find((l) => l.id === id);
	if (!layer) return;
	doc.layers = doc.layers.filter((l) => l.id !== id);
	if (selectedId === id) selectedId = null;
	trackStudio("layer_removed", { studio: "og", kind: layer.kind });
}

function duplicate(id: string) {
	const layer = doc.layers.find((l) => l.id === id);
	if (layer) add(cloneLayer(layer), "duplicate");
}

/** Moves a layer one step towards the front (1) or the back (-1). */
function restack(id: string, step: 1 | -1) {
	const from = doc.layers.findIndex((layer) => layer.id === id);
	const to = from + step;
	if (from < 0 || to < 0 || to >= doc.layers.length) return;
	const next = [...doc.layers];
	const [layer] = next.splice(from, 1);
	if (!layer) return;
	next.splice(to, 0, layer);
	doc.layers = next;
	trackStudio("layer_restacked", {
		studio: "og",
		kind: layer.kind,
		direction: step === 1 ? "forward" : "backward",
	});
}

function readImage(file: File, via: "drop" | "upload") {
	const reader = new FileReader();
	reader.onload = () => {
		if (typeof reader.result !== "string") return;
		const src = reader.result;
		const target = replacing ? doc.layers.find((l) => l.id === replacing) : undefined;
		replacing = null;
		if (target?.kind === "image") {
			target.src = src;
			return;
		}
		const probe = new Image();
		probe.onload = () => {
			const fit = Math.min(1, 480 / Math.max(probe.naturalWidth, probe.naturalHeight));
			add(
				newImage(
					src,
					Math.round(probe.naturalWidth * fit),
					Math.round(probe.naturalHeight * fit),
				),
				via,
			);
		};
		probe.src = src;
	};
	reader.readAsDataURL(file);
}

function onFiles(files: FileList | null | undefined, via: "drop" | "upload") {
	for (const file of files ?? [])
		if (file.type.startsWith("image/")) readImage(file, via);
}

function pickImage(replace: string | null) {
	replacing = replace;
	fileInput?.click();
}

// --- Stage: the 1200x630 artboard scaled to fit the space it has.
let stageWidth = $state(0);
let stageHeight = $state(0);
const scale = $derived(
	stageWidth && stageHeight
		? Math.min(stageWidth / OG_WIDTH, stageHeight / OG_HEIGHT)
		: stageWidth / OG_WIDTH || 1,
);

type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type Drag = {
	id: string;
	handle: Handle | "move";
	px: number;
	py: number;
	x: number;
	y: number;
	w: number;
	h: number;
};
let drag: Drag | null = null;

const heightOf = (layer: OgLayer) =>
	layer.kind === "text" ? (heights[layer.id] ?? 0) : layer.h;

function begin(
	event: PointerEvent & { currentTarget: HTMLElement },
	layer: OgLayer,
	handle: Drag["handle"],
) {
	if (editingId === layer.id || event.button !== 0) return;
	event.preventDefault();
	event.stopPropagation();
	selectedId = layer.id;
	event.currentTarget.setPointerCapture(event.pointerId);
	drag = {
		id: layer.id,
		handle,
		px: event.clientX,
		py: event.clientY,
		x: layer.x,
		y: layer.y,
		w: layer.w,
		h: heightOf(layer),
	};
}

function move(event: PointerEvent) {
	if (!drag) return;
	const id = drag.id;
	const layer = doc.layers.find((l) => l.id === id);
	if (!layer) return;
	const dx = (event.clientX - drag.px) / scale;
	const dy = (event.clientY - drag.py) / scale;
	if (drag.handle === "move") {
		const others = doc.layers.filter((l) => l.id !== layer.id && !l.hidden);
		const sx = snapAxis(
			Math.round(drag.x + dx),
			drag.w,
			event.altKey
				? []
				: [...SNAP_X, ...others.flatMap((o) => [o.x, o.x + o.w / 2, o.x + o.w])],
		);
		const sy = snapAxis(
			Math.round(drag.y + dy),
			drag.h,
			event.altKey
				? []
				: [
						...SNAP_Y,
						...others.flatMap((o) => [o.y, o.y + heightOf(o) / 2, o.y + heightOf(o)]),
					],
		);
		layer.x = sx.start;
		layer.y = sy.start;
		guides = { x: sx.guide, y: sy.guide };
		return;
	}
	const h = drag.handle;
	let { x, y, w } = drag;
	let height = drag.h;
	if (h.includes("e")) w = drag.w + dx;
	if (h.includes("w")) {
		w = drag.w - dx;
		x = drag.x + dx;
	}
	if (h.includes("s")) height = drag.h + dy;
	if (h.includes("n")) {
		height = drag.h - dy;
		y = drag.y + dy;
	}
	// Shift keeps an image's proportions from its corner handles.
	if (event.shiftKey && layer.kind === "image" && h.length === 2 && drag.h > 0) {
		height = w / (drag.w / drag.h);
		if (h.includes("n")) y = drag.y + drag.h - height;
	}
	layer.x = Math.round(Math.min(x, drag.x + drag.w - 8));
	layer.y = Math.round(Math.min(y, drag.y + drag.h - 8));
	layer.w = Math.round(Math.max(8, w));
	if (layer.kind !== "text") layer.h = Math.round(Math.max(8, height));
}

function end() {
	drag = null;
	guides = { x: null, y: null };
}

const HANDLES: Record<"text" | "box", Handle[]> = {
	text: ["w", "e"],
	box: ["nw", "n", "ne", "e", "se", "s", "sw", "w"],
};

const HANDLE_AT: Record<Handle, string> = {
	n: "left:50%;top:0;cursor:ns-resize",
	s: "left:50%;top:100%;cursor:ns-resize",
	e: "left:100%;top:50%;cursor:ew-resize",
	w: "left:0;top:50%;cursor:ew-resize",
	ne: "left:100%;top:0;cursor:nesw-resize",
	nw: "left:0;top:0;cursor:nwse-resize",
	se: "left:100%;top:100%;cursor:nwse-resize",
	sw: "left:0;top:100%;cursor:nesw-resize",
};

// --- Inline text editing
function editText(node: HTMLElement, text: string) {
	node.textContent = text;
	node.focus();
	const range = document.createRange();
	range.selectNodeContents(node);
	const selection = getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
}

function commitText(event: FocusEvent & { currentTarget: HTMLElement }, layer: OgLayer) {
	if (layer.kind === "text") {
		const next = event.currentTarget.innerText.replace(/\n$/, "");
		if (next !== layer.text) trackStudio("text_edited", { studio: "og", via: "canvas" });
		layer.text = next;
	}
	editingId = null;
}

// --- Keyboard: canvas shortcuts unless a field has focus.
function typing(target: EventTarget | null) {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
	);
}

function shortcut(key: string) {
	trackStudioSettled(`og-key-${key}`, "shortcut_used", { studio: "og", key }, 800);
}

function onKey(event: KeyboardEvent) {
	if (typing(event.target)) {
		if (event.key === "Escape" && editingId && event.target instanceof HTMLElement)
			event.target.blur();
		return;
	}
	const mod = event.metaKey || event.ctrlKey;
	const key = event.key.toLowerCase();
	if (mod && key === "z") {
		event.preventDefault();
		if (event.shiftKey) redo("shortcut");
		else undo("shortcut");
		return;
	}
	if (mod && key === "y") {
		event.preventDefault();
		redo("shortcut");
		return;
	}
	if (!selected) return;
	if (mod && key === "d") {
		event.preventDefault();
		duplicate(selected.id);
		shortcut("duplicate");
		return;
	}
	if (event.key === "Delete" || event.key === "Backspace") {
		event.preventDefault();
		remove(selected.id);
		shortcut("delete");
		return;
	}
	if (event.key === "Escape") {
		selectedId = null;
		return;
	}
	if (event.key === "Enter" && selected.kind === "text") {
		event.preventDefault();
		editingId = selected.id;
		shortcut("edit");
		return;
	}
	const step = event.shiftKey ? 10 : 1;
	const nudge: Record<string, [number, number]> = {
		ArrowLeft: [-step, 0],
		ArrowRight: [step, 0],
		ArrowUp: [0, -step],
		ArrowDown: [0, step],
	};
	const delta = nudge[event.key];
	if (!delta) return;
	event.preventDefault();
	selected.x += delta[0];
	selected.y += delta[1];
	shortcut("nudge");
}

// --- PNG: the takumi render, shown in place of the editor or downloaded.
$effect(() => {
	if (!pngView) return;
	const html = docHtml(doc);
	let cancelled = false;
	const timer = setTimeout(async () => {
		pngPending = true;
		try {
			const url = await renderOgHtml(html);
			if (!cancelled) {
				pngUrl = url;
				pngError = "";
			}
		} catch (cause) {
			if (!cancelled) pngError = cause instanceof Error ? cause.message : String(cause);
		} finally {
			if (!cancelled) pngPending = false;
		}
	}, 300);
	return () => {
		cancelled = true;
		clearTimeout(timer);
	};
});

function gate(action: "download" | "code") {
	gateOpen = true;
	trackStudio("pro_gate_shown", {
		studio: "og",
		slug: doc.layout?.id ?? "canvas",
		action,
	});
}

async function download() {
	if (proLocked) return gate("download");
	exporting = true;
	const started = performance.now();
	const slug = doc.layout?.id ?? "canvas";
	try {
		const url = await renderOgHtml(docHtml(doc));
		const link = document.createElement("a");
		link.href = url;
		link.download = "og-image.png";
		link.click();
		trackStudio("png_downloaded", {
			studio: "og",
			slug,
			ms: Math.round(performance.now() - started),
		});
	} catch (cause) {
		pngError = cause instanceof Error ? cause.message : String(cause);
		trackStudio("png_failed", { studio: "og", slug, message: pngError });
	} finally {
		exporting = false;
	}
}

function openCode() {
	if (proLocked) return gate("code");
	codeOpen = true;
	trackStudio("code_opened", {
		studio: "og",
		slug: doc.layout?.id ?? "canvas",
		locked: false,
	});
}

const code = new LiveCode(() => ({
	open: codeOpen,
	panels: (["react", "svelte"] as const).map((framework) => ({
		id: framework,
		label: framework === "react" ? "React" : "Svelte",
		lang: framework === "react" ? "tsx" : "svelte",
		code: docCode(doc, framework),
	})),
}));

const pickFrom = <T extends string | number>(
	values: readonly T[],
	next: string | string[],
) => values.find((v) => String(v) === next);
const orNumber = (next: number | null, fallback: number) => next ?? fallback;
</script>

<svelte:window onkeydown={onKey} />

{#snippet numberField(label: string, value: number, set: (next: number) => void, suffix = "", step = 1)}
	<NumberInput
		variant="scrub"
		size="sm"
		{label}
		{suffix}
		{step}
		class="w-full"
		bind:value={() => value, (next) => set(orNumber(next, value))}
	/>
{/snippet}

{#snippet field(label: string)}
	<span class="font-medium text-muted-foreground text-xs">{label}</span>
{/snippet}

<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[20rem_minmax(0,1fr)] xl:grid-rows-2 xl:gap-y-0">
	<!-- Left: pick a starting layout, or add and order the elements on the card. -->
	<nav aria-label="Layouts and layers" class="flex min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-1 xl:rounded-b-none xl:border-b-0">
		<Tabs
			bind:value={() => leftTab, (next) => {
				leftTab = next;
				trackStudio("panel_tab", { studio: "og", panel: "left", tab: next });
			}}
			variant="underline"
			size="sm"
			class="flex min-h-0 flex-1 flex-col"
		>
			<TabsList class="shrink-0 px-2">
				<TabsTrigger value="layouts" class={TAB}><IconLayoutGrid />Layouts</TabsTrigger>
				<TabsTrigger value="layers" class={TAB}>
					<IconLayers />Layers
					<span class="text-muted-foreground tabular-nums">{doc.layers.length}</span>
				</TabsTrigger>
			</TabsList>

			<TabsContent value="layouts" class="scrollbar-hide mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background p-2">
				<p class="px-1 pb-2 text-muted-foreground text-xs">
					Pick a starting point. Everything in it stays editable, and Undo brings your card back.
				</p>
				{#if lastApplied}
					<div class="mb-2 flex items-center justify-between gap-2 rounded-lg bg-muted px-2.5 py-1.5 text-xs">
						<span class="truncate">Started from {lastApplied.label}</span>
						<Button size="xs" variant="ghost" onclick={() => undo("button")}>Undo</Button>
					</div>
				{/if}
				<ul class="grid grid-cols-2 gap-1.5">
					{#each OG_PRESETS as preset, i (preset.id)}
						<li class="min-w-0">
							<!-- A library tile, like the background studio's scene rows: thumbnail over its name. -->
							<button
								type="button"
								class="{ROW} flex-col items-stretch gap-1.5 p-1.5"
								aria-current={doc.layout?.id === preset.id ? "true" : undefined}
								title={preset.description}
								onclick={() => applyLayout(preset)}
							>
								<OgCanvasThumb doc={PRESET_DOCS[i] ?? blankDoc()} />
								<span class="flex min-w-0 items-center justify-between gap-1">
									<span class="truncate font-medium text-xs">{preset.label}</span>
									{#if preset.tier === "pro"}<Badge size="sm" variant="gold">Pro</Badge>{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</TabsContent>

			<TabsContent value="layers" class="mt-1 flex min-h-0 flex-1 flex-col gap-2 rounded-[7px] bg-background p-2">
				<div class="flex flex-col gap-1.5">
					<h3 class="px-1 {SECTION}">Add to the card</h3>
					<div class="grid grid-cols-3 gap-1.5">
						<Button size="sm" variant="outline" class="px-2" onclick={() => add(newText(), "button")}>
							<IconTypography />Text
						</Button>
						<Button size="sm" variant="outline" class="px-2" onclick={() => add(newShape(), "button")}>
							<IconShape />Shape
						</Button>
						<Button size="sm" variant="outline" class="px-2" onclick={() => pickImage(null)}>
							<IconPhoto />Image
						</Button>
					</div>
					<p class="px-1 text-muted-foreground text-xs">Or drop an image on the card.</p>
				</div>
				<div class="flex min-h-0 flex-1 flex-col gap-1.5 border-border border-t pt-2">
					<h3 class="px-1 {SECTION}">On the card <span class="font-normal text-muted-foreground">(top is in front)</span></h3>
				<ul class="scrollbar-hide flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
					{#each [...doc.layers].reverse() as layer (layer.id)}
						{@const active = layer.id === selectedId}
						<li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-0.5">
							<button
								type="button"
								aria-current={active ? "true" : undefined}
								class="{ROW} h-8 items-center gap-2 px-2 text-sm"
								onclick={() => (selectedId = layer.id)}
							>
								{#if layer.kind === "text"}<IconTypography size={14} class="shrink-0 text-muted-foreground" />{:else if layer.kind === "image"}<IconPhoto size={14} class="shrink-0 text-muted-foreground" />{:else}<IconShape size={14} class="shrink-0 text-muted-foreground" />{/if}
								<span class={["min-w-0 truncate", layer.hidden && "opacity-50"]}>{layerName(layer)}</span>
							</button>
							<Button
								size="icon-sm"
								variant="ghost"
								aria-label={layer.hidden ? `Show ${layerName(layer)}` : `Hide ${layerName(layer)}`}
								aria-pressed={layer.hidden ?? false}
								onclick={() => (layer.hidden = !layer.hidden)}
							>
								{#if layer.hidden}<IconEyeClosed />{:else}<IconEye />{/if}
							</Button>
						</li>
					{:else}
						<li class="rounded-lg border border-border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
							The card is empty. Add text, a shape or an image above, or pick a layout.
						</li>
					{/each}
				</ul>
				</div>
			</TabsContent>
		</Tabs>
		<input
			bind:this={fileInput}
			type="file"
			accept="image/*"
			class="hidden"
			onchange={(event) => {
				onFiles(event.currentTarget.files, "upload");
				event.currentTarget.value = "";
			}}
		/>
	</nav>

	<!-- Stage: the card being edited, or its rendered PNG. -->
	<section aria-label="Card" class="flex min-h-[24rem] min-w-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-2 xl:row-span-2 xl:row-start-1">
		<div class="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 pb-2">
			<div class="flex items-center gap-1">
				<Button size="sm" variant="ghost" disabled={!canUndo} onclick={() => undo("button")}>
					<IconUndo />Undo
				</Button>
				<Button size="sm" variant="ghost" disabled={!canRedo} onclick={() => redo("button")}>
					<IconRedo />Redo
				</Button>
				<label class="ml-2 flex items-center gap-2 text-muted-foreground text-xs">
					<Switch
						size="sm"
						bind:checked={() => pngView, (on) => {
							pngView = on;
							trackStudio("png_toggled", { studio: "og", on });
						}}
					/>
					Show exact PNG
				</label>
			</div>
			<div class="flex items-center gap-1">
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
		<div
			role="presentation"
			class="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[7px] bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-3 sm:p-6"
			ondragover={(event) => event.preventDefault()}
			ondrop={(event) => {
				event.preventDefault();
				onFiles(event.dataTransfer?.files, "drop");
			}}
		>
			<div bind:clientWidth={stageWidth} bind:clientHeight={stageHeight} class="absolute inset-3 sm:inset-6"></div>
			<div
				class="relative shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-border"
				style:width="{OG_WIDTH * scale}px"
				style:height="{OG_HEIGHT * scale}px"
			>
				{#if pngView}
					{#if pngUrl}
						<img src={pngUrl} alt="The rendered card" class="size-full" />
					{/if}
					{#if pngPending || pngError}
						<div class="absolute inset-0 grid place-items-center bg-background/40 text-muted-foreground text-xs">
							{#if pngError}{pngError}{:else}<Spinner size="sm" label="Rendering" />{/if}
						</div>
					{/if}
				{:else}
					<!-- The artboard, in canvas pixels; a click on empty space clears the selection. -->
					<div
						role="presentation"
						class={["absolute top-0 left-0 origin-top-left text-foreground", doc.background.dark && "dark"]}
						style="width:{OG_WIDTH}px;height:{OG_HEIGHT}px;scale:{scale};{styleString(backgroundCss(doc.background))}"
						onpointerdown={() => {
							selectedId = null;
							editingId = null;
						}}
						onpointermove={move}
						onpointerup={end}
						onpointercancel={end}
					>
						{#each doc.layers as layer (layer.id)}
							{#if !layer.hidden}
								{#if layer.kind === "text"}
									{#if editingId === layer.id}
										<div
											contenteditable="plaintext-only"
											role="textbox"
											tabindex="0"
											aria-label="Edit text"
											aria-multiline="true"
											class="cursor-text outline-none"
											style={styleString(layerCss(layer))}
											use:editText={layer.text}
											onblur={(event) => commitText(event, layer)}
											onpointerdown={(event) => event.stopPropagation()}
										></div>
									{:else}
										<p
											role="presentation"
											class="cursor-move select-none"
											style={styleString(layerCss(layer))}
											bind:offsetHeight={heights[layer.id]}
											onpointerdown={(event) => begin(event, layer, "move")}
											ondblclick={() => (editingId = layer.id)}
										>{layer.text}</p>
									{/if}
								{:else if layer.kind === "image"}
									<img
										src={layer.src}
										alt=""
										draggable="false"
										class="cursor-move select-none"
										style={styleString(layerCss(layer))}
										onpointerdown={(event) => begin(event, layer, "move")}
									/>
								{:else}
									<div
										role="presentation"
										class="cursor-move"
										style={styleString(layerCss(layer))}
										onpointerdown={(event) => begin(event, layer, "move")}
									></div>
								{/if}
							{/if}
						{/each}

						{#if selected && !selected.hidden && editingId !== selected.id}
							{@const box = selected}
							<div
								class="pointer-events-none absolute outline-primary"
								style="left:{box.x}px;top:{box.y}px;width:{box.w}px;height:{heightOf(box)}px;outline-width:{2 / scale}px;outline-style:solid;{box.rotate ? `transform:rotate(${box.rotate}deg)` : ''}"
							>
								{#each HANDLES[box.kind === "text" ? "text" : "box"] as handle (handle)}
									<span
										role="presentation"
										class="pointer-events-auto absolute -translate-1/2 rounded-full border-primary bg-background"
										style="{HANDLE_AT[handle]};width:{12 / scale}px;height:{12 / scale}px;border-width:{2 / scale}px"
										onpointerdown={(event) => begin(event, box, handle)}
									></span>
								{/each}
							</div>
						{/if}

						{#if guides.x !== null}
							<span class="pointer-events-none absolute inset-y-0 bg-chart-2" style="left:{guides.x}px;width:{1 / scale}px"></span>
						{/if}
						{#if guides.y !== null}
							<span class="pointer-events-none absolute inset-x-0 bg-chart-2" style="top:{guides.y}px;height:{1 / scale}px"></span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
		<p class="px-2 pt-2 pb-1 text-muted-foreground text-xs">
			Click an element to select it, drag to move, pull a handle to resize. Double-click text to
			type. Shift keeps an image's shape, Alt skips snapping, arrows nudge.
		</p>
	</section>

	<!-- Right: the selected element's settings, or the card's own when nothing is selected. -->
	<aside aria-label="Settings" class="flex min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-2 xl:rounded-t-none">
		<div class="flex shrink-0 items-center justify-between gap-2 px-2.5 pt-2 pb-1.5">
			<div class="min-w-0">
				<p class="truncate font-medium text-foreground text-sm">
					{selected ? `${KIND_LABEL[selected.kind]}: ${layerName(selected)}` : "Card"}
				</p>
				<p class="text-muted-foreground text-xs">
					{selected ? "Editing the selected element." : "Select an element on the card to edit it."}
				</p>
			</div>
			{#if selected}
				<Button size="sm" variant="ghost" onclick={() => (selectedId = null)}>Done</Button>
			{/if}
		</div>
		<div class="scrollbar-hide flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto rounded-[7px] bg-background p-3">
			{#if selected}
				{@const layer = selected}
				{#if layer.kind === "text"}
					<div class="flex flex-col gap-2">
						<h3 class={SECTION}>Text</h3>
						<Textarea
							size="sm"
							aria-label="Text"
							autoGrow
							bind:value={() => layer.text, (next) => {
								layer.text = next;
								trackStudioSettled("og-text-panel", "text_edited", { studio: "og", via: "panel" });
							}}
						/>
					</div>
					<div class="flex flex-col gap-2">
						<h3 class={SECTION}>Typography</h3>
						<div class="grid grid-cols-2 gap-2">
							<Select
								items={OG_FONTS.map((f) => ({ value: f, label: FONT_LABEL[f] }))}
								bind:value={() => layer.font, (next) => {
									const font = pickFrom(OG_FONTS, next);
									if (font) layer.font = font;
								}}
							>
								<SelectTrigger size="sm" aria-label="Font"><SelectValue /></SelectTrigger>
								<SelectContent size="sm">
									{#each OG_FONTS as font (font)}
										<SelectItem value={font} label={FONT_LABEL[font]}>{FONT_LABEL[font]}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							<Select
								items={OG_WEIGHTS.map((w) => ({ value: String(w), label: WEIGHT_LABEL[w] }))}
								bind:value={() => String(layer.weight), (next) => {
									const weight = pickFrom(OG_WEIGHTS, next);
									if (weight) layer.weight = weight;
								}}
							>
								<SelectTrigger size="sm" aria-label="Weight"><SelectValue /></SelectTrigger>
								<SelectContent size="sm">
									{#each OG_WEIGHTS as weight (weight)}
										<SelectItem value={String(weight)} label={WEIGHT_LABEL[weight]}>{WEIGHT_LABEL[weight]}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							{@render numberField("Size", layer.size, (v) => (layer.size = Math.max(8, v)), "px")}
							{@render numberField("Line height", layer.leading, (v) => (layer.leading = Math.max(0.6, v)), "", 0.05)}
						</div>
						{@render numberField("Letter spacing", layer.tracking, (v) => (layer.tracking = v), "%")}
						{@render field("Alignment")}
						<ToggleGroup
							size="sm"
							variant="outline"
							label="Alignment"
							class="w-full"
							bind:value={() => layer.align, (next) => {
								const align = pickFrom(OG_ALIGNS, next);
								if (align) layer.align = align;
							}}
						>
							{#each OG_ALIGNS as align (align)}
								<ToggleGroupItem value={align} class="flex-1 text-xs capitalize">{align}</ToggleGroupItem>
							{/each}
						</ToggleGroup>
					</div>
					<OgColorField label="Text colour" value={layer.color} dark={doc.background.dark} onchange={(c) => (layer.color = c)} />
				{:else if layer.kind === "image"}
					<div class="flex flex-col gap-2">
						<h3 class={SECTION}>Image</h3>
						<Button size="sm" variant="outline" onclick={() => pickImage(layer.id)}>
							<IconPhoto />Replace image…
						</Button>
						<Input size="sm" aria-label="Image URL" placeholder="Or paste an image URL" bind:value={layer.src} />
						{@render field("Fit")}
						<ToggleGroup
							size="sm"
							variant="outline"
							label="Fit"
							class="w-full"
							bind:value={() => layer.fit, (next) => {
								if (next === "cover" || next === "contain") layer.fit = next;
							}}
						>
							<ToggleGroupItem value="cover" class="flex-1 text-xs">Fill the frame</ToggleGroupItem>
							<ToggleGroupItem value="contain" class="flex-1 text-xs">Fit inside</ToggleGroupItem>
						</ToggleGroup>
						{@render numberField("Corner radius", layer.radius, (v) => (layer.radius = Math.max(0, v)), "px")}
						<label class="flex items-center justify-between gap-3 text-muted-foreground text-xs">
							Invert colours (a dark logo on a dark card)
							<Switch size="sm" bind:checked={() => layer.invert ?? false, (on) => (layer.invert = on)} />
						</label>
					</div>
				{:else}
					<div class="flex flex-col gap-2">
						<h3 class={SECTION}>Shape</h3>
						<ToggleGroup
							size="sm"
							variant="outline"
							label="Shape"
							class="w-full"
							bind:value={() => (layer.ellipse ? "ellipse" : "rectangle"), (next) => {
								if (next === "ellipse" || next === "rectangle") layer.ellipse = next === "ellipse";
							}}
						>
							<ToggleGroupItem value="rectangle" class="flex-1 text-xs">Rectangle</ToggleGroupItem>
							<ToggleGroupItem value="ellipse" class="flex-1 text-xs">Ellipse</ToggleGroupItem>
						</ToggleGroup>
						{#if !layer.ellipse}
							{@render numberField("Corner radius", layer.radius, (v) => (layer.radius = Math.max(0, v)), "px")}
						{/if}
					</div>
					<OgColorField label="Fill" value={layer.fill} dark={doc.background.dark} onchange={(c) => (layer.fill = c)} />
					<div class="flex flex-col gap-2">
						{@render numberField("Border width", layer.strokeWidth, (v) => (layer.strokeWidth = Math.max(0, v)), "px")}
						{#if layer.strokeWidth}
							<OgColorField label="Border colour" value={layer.stroke} dark={doc.background.dark} onchange={(c) => (layer.stroke = c)} />
						{/if}
					</div>
				{/if}

				<div class="flex flex-col gap-2 border-border border-t pt-4">
					<h3 class={SECTION}>Position and size</h3>
					<div class="grid grid-cols-2 gap-2">
						{@render numberField("X", layer.x, (v) => (layer.x = v), "px")}
						{@render numberField("Y", layer.y, (v) => (layer.y = v), "px")}
						{@render numberField("Width", layer.w, (v) => (layer.w = Math.max(8, v)), "px")}
						{#if layer.kind !== "text"}
							{@render numberField("Height", layer.h, (v) => (layer.h = Math.max(8, v)), "px")}
						{/if}
					</div>
					{@render numberField("Rotation", layer.rotate, (v) => (layer.rotate = v), "°")}
					<div class="flex items-center gap-3">
						<span class="w-14 shrink-0 font-medium text-muted-foreground text-xs">Opacity</span>
						<Slider label="Opacity" min={0} max={100} step={5} bind:value={layer.opacity} />
						<span class="w-9 shrink-0 text-right text-muted-foreground text-xs tabular-nums">{layer.opacity}%</span>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2 border-border border-t pt-4">
					<Button size="sm" variant="outline" onclick={() => restack(layer.id, 1)}>
						<IconChevronUp />Bring forward
					</Button>
					<Button size="sm" variant="outline" onclick={() => restack(layer.id, -1)}>
						<IconChevronDown />Send back
					</Button>
					<Button size="sm" variant="outline" onclick={() => duplicate(layer.id)}>
						<IconCopy />Duplicate
					</Button>
					<Button size="sm" variant="destructive_soft" onclick={() => remove(layer.id)}>
						<IconTrash />Delete
					</Button>
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					<h3 class={SECTION}>Theme</h3>
					<ToggleGroup
						size="sm"
						variant="outline"
						label="Card theme"
						class="w-full"
						bind:value={() => (doc.background.dark ? "dark" : "light"), (next) => {
							if (next === "dark" || next === "light") doc.background.dark = next === "dark";
						}}
					>
						<ToggleGroupItem value="light" class="flex-1 text-xs">Light</ToggleGroupItem>
						<ToggleGroupItem value="dark" class="flex-1 text-xs">Dark</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<OgColorField label="Background" value={doc.background.fill} dark={doc.background.dark} onchange={(c) => (doc.background.fill = c)} />
				<div class="flex flex-col gap-2">
					<h3 class={SECTION}>Light effect</h3>
					<Select
						items={OG_EFFECTS.map((e) => ({ value: e, label: EFFECT_LABEL[e] }))}
						bind:value={() => doc.background.effect, (next) => {
							const effect = pickFrom(OG_EFFECTS, next);
							if (effect) doc.background.effect = effect;
						}}
					>
						<SelectTrigger size="sm" aria-label="Light effect"><SelectValue /></SelectTrigger>
						<SelectContent size="sm">
							{#each OG_EFFECTS as effect (effect)}
								<SelectItem value={effect} label={EFFECT_LABEL[effect]}>{EFFECT_LABEL[effect]}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
					{#if doc.background.effect !== "none"}
						<OgColorField label="Effect colour" value={doc.background.accent} dark={doc.background.dark} onchange={(c) => (doc.background.accent = c)} />
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					<h3 class={SECTION}>Texture</h3>
					<ToggleGroup
						size="sm"
						variant="outline"
						label="Texture"
						class="w-full"
						bind:value={() => doc.background.pattern, (next) => {
							const pattern = pickFrom(OG_PATTERNS, next);
							if (pattern) doc.background.pattern = pattern;
						}}
					>
						{#each OG_PATTERNS as pattern (pattern)}
							<ToggleGroupItem value={pattern} class="flex-1 text-xs">{PATTERN_LABEL[pattern]}</ToggleGroupItem>
						{/each}
					</ToggleGroup>
				</div>
				<p class="text-muted-foreground text-xs">
					Theme colours follow your palette in the exported code; custom colours stay fixed.
				</p>
			{/if}
		</div>
	</aside>
</div>

<Sheet bind:open={codeOpen}>
	<SheetContent side="right" variant="framed" class="w-[min(40rem,100vw)]">
		<SheetHeader>
			<SheetTitle>Your card</SheetTitle>
			<SheetClose />
		</SheetHeader>
		<CodeBlock panels={code.panels} maxHeight="none" />
		<p class="text-muted-foreground text-xs">
			Tailwind classes only. Render it to a PNG with takumi like any OG template.
		</p>
	</SheetContent>
</Sheet>

<Sheet bind:open={gateOpen}>
	<SheetContent side="right" variant="framed" class="w-[min(32rem,100vw)]">
		<SheetHeader>
			<SheetTitle>{layoutName} layout</SheetTitle>
			<SheetClose />
		</SheetHeader>
		<ProInstallGate name="The {layoutName} layout" />
		<p class="text-muted-foreground text-xs">
			You can keep editing it here. Downloading the PNG and copying the code need Pro.
		</p>
	</SheetContent>
</Sheet>
