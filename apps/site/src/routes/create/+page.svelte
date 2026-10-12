<script lang="ts">
import { IconCheck, IconCopy } from "@baby-ui/icons";
import {
	Button,
	type InputSize,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/svelte";
import { mode } from "mode-watcher";
import Seo from "#lib/components/seo.svelte";
import Preview from "#lib/create/preview.svelte";
import {
	FONTS,
	type FontId,
	previewVars,
	RADII,
	type Radius,
	type ThemeChoice,
	themeCss,
} from "#lib/create/theme.js";
import { THEMES, type ThemeId } from "#lib/preferences.svelte.js";
import { breadcrumbLd } from "#lib/seo.js";

const SIZES: InputSize[] = ["xs", "sm", "default", "lg", "xl"];
const FONT_ITEMS = Object.entries(FONTS).map(([value, f]) => ({ value, label: f.label }));

let accent = $state<ThemeId>("default");
let radius = $state<Radius>(0.625);
let font = $state<FontId>("inter");
let size = $state<InputSize>("default");
let copied = $state(false);
let timer: ReturnType<typeof setTimeout>;

const choice = $derived<ThemeChoice>({ accent, radius, font });
const vars = $derived(previewVars(choice, mode.current !== "light"));
const style = $derived(
	Object.entries(vars)
		.map(([k, v]) => `${k}: ${v}`)
		.join("; "),
);
const css = $derived(themeCss(choice));

async function copy() {
	await navigator.clipboard.writeText(css);
	copied = true;
	clearTimeout(timer);
	timer = setTimeout(() => (copied = false), 1600);
}
</script>

<Seo
	title="Create a theme: accent, radius and type, previewed live"
	description="Build a Baby UI theme: pick an accent, a corner radius, a font and a control size, see real components update, then copy the CSS."
	tag="Create"
	keywords={["theme builder", "shadcn theme", "design tokens", "tailwind theme generator"]}
	jsonLd={[breadcrumbLd([{ name: "Create", path: "/create" }])]}
/>

<main class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
	<header class="max-w-2xl">
		<p class="font-medium text-muted-foreground text-xs uppercase tracking-wider">Create</p>
		<h1 class="mt-2 font-semibold text-3xl text-foreground tracking-tight">Make it yours</h1>
		<p class="mt-3 text-muted-foreground">
			Pick an accent, a radius and a font. The components below are the real ones, so what you
			see is what ships. Switch the site theme to check dark mode.
		</p>
	</header>

	<div class="mt-10 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
		<aside class="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
			<section class="flex flex-col gap-2.5">
				<h2 class="font-medium text-muted-foreground text-xs uppercase tracking-wider">Accent</h2>
				<div role="radiogroup" aria-label="Accent" class="grid grid-cols-6 gap-1.5">
					{#each THEMES as t (t.id)}
						<Button
							variant="ghost"
							size="icon"
							role="radio"
							aria-checked={accent === t.id}
							aria-label={t.name}
							title={t.name}
							onclick={() => (accent = t.id)}
							class="aria-checked:bg-accent aria-checked:ring-2 aria-checked:ring-ring"
						>
							<span class="size-4 rounded-full" style:background={t.swatch}></span>
						</Button>
					{/each}
				</div>
			</section>

			<section class="flex flex-col gap-2.5">
				<h2 class="font-medium text-muted-foreground text-xs uppercase tracking-wider">Radius</h2>
				<ToggleGroup
					type="single"
					size="sm"
					label="Radius"
					value={String(radius)}
					onValueChange={(v) => {
						const next = RADII.find((r) => String(r) === v);
						if (next !== undefined) radius = next;
					}}
					class="w-fit"
				>
					{#each RADII as r (r)}
						<ToggleGroupItem value={String(r)} class="tabular-nums">{r}</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</section>

			<section class="flex flex-col gap-2.5">
				<h2 class="font-medium text-muted-foreground text-xs uppercase tracking-wider">Font</h2>
				<Select type="single" bind:value={font} items={FONT_ITEMS}>
					<SelectTrigger size="sm" aria-label="Font"><SelectValue /></SelectTrigger>
					<SelectContent size="sm">
						{#each FONT_ITEMS as f (f.value)}
							<SelectItem value={f.value} label={f.label}>{f.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</section>

			<section class="flex flex-col gap-2.5">
				<h2 class="font-medium text-muted-foreground text-xs uppercase tracking-wider">
					Control size
				</h2>
				<ToggleGroup
					type="single"
					size="sm"
					label="Control size"
					value={size}
					onValueChange={(v) => {
						const next = SIZES.find((s) => s === v);
						if (next) size = next;
					}}
					class="w-fit"
				>
					{#each SIZES as s (s)}
						<ToggleGroupItem value={s}>{s}</ToggleGroupItem>
					{/each}
				</ToggleGroup>
			</section>

			<section class="flex flex-col gap-2.5">
				<div class="flex items-center justify-between">
					<h2 class="font-medium text-muted-foreground text-xs uppercase tracking-wider">CSS</h2>
					<Button variant="outline" size="xs" onclick={copy}>
						{#if copied}<IconCheck size={12} />{:else}<IconCopy size={12} />{/if}
						<span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
					</Button>
				</div>
				<pre
					class="max-h-72 overflow-auto rounded-xl border border-border bg-card p-3 font-mono text-muted-foreground text-xs leading-relaxed">{css}</pre>
				<p class="text-muted-foreground text-xs">Paste after the theme import; it overrides the tokens.</p>
			</section>
		</aside>

		<section aria-label="Preview" {style} class="min-w-0 font-sans">
			<Preview {size} />
		</section>
	</div>
</main>
