<script lang="ts">
import {
	Badge,
	Button,
	Checkbox,
	Input,
	Progress,
	Separator,
	Slider,
	Switch,
} from "@baby-ui/svelte";
import { watchLayout } from "./measure";
import type { Token, TokenGroup } from "./tokens";

let { groups }: { groups: TokenGroup[] } = $props();

let live = $state<Record<string, string>>({});
let dark = $state(false);
let playing = $state<Record<string, boolean>>({});

function read(host: HTMLElement) {
	return watchLayout(host, () => {
		const style = getComputedStyle(host);
		const next: Record<string, string> = {};
		for (const g of groups)
			for (const t of g.tokens) next[t.name] = style.getPropertyValue(t.name).trim();
		live = next;
		dark = document.documentElement.classList.contains("dark");
	});
}

const source = (t: Token) => (dark ? (t.dark ?? t.light) : t.light);
const SERIES = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];
const RAMP = [
	"--chart-scale-1",
	"--chart-scale-2",
	"--chart-scale-3",
	"--chart-scale-4",
	"--chart-scale-5",
];
</script>

{#snippet preview(t: Token, group: string)}
	{#if t.kind === "colour"}
		<span
			class="block size-8 rounded-md bg-[conic-gradient(var(--border)_25%,transparent_0_50%,var(--border)_0_75%,transparent_0)] bg-[length:8px_8px] shadow-[inset_0_0_0_1px_var(--border)]"
		>
			<span class="block size-full rounded-md" style:background="var({t.name})"></span>
		</span>
	{:else if t.kind === "gradient"}
		<span class="block size-8 rounded-md" style:background-image="var({t.name})"></span>
	{:else if t.kind === "shadow"}
		<span class="block size-8 rounded-md bg-popover" style:box-shadow="var({t.name})"></span>
	{:else if t.kind === "font"}
		<span class="grid size-8 place-items-center text-foreground text-lg" style:font-family="var({t.name})">Aa</span>
	{:else if t.kind === "length"}
		<span
			class="block size-8 border border-border bg-card"
			style:border-radius={t.name === "--radius" ? `var(${t.name})` : "6px"}
			style:translate={t.name === "--radius" ? undefined : `0 calc(var(${t.name}) * -1)`}
		></span>
	{:else if t.kind === "scale"}
		<span class="grid size-8 place-items-center rounded-md border border-dashed border-border">
			<span class="block size-6 rounded-[5px] bg-primary/80" style:scale="var({t.name})"></span>
		</span>
	{:else}
		<!-- Easing and duration rows play on their group's button. -->
		<span class="relative block h-8 w-16 overflow-hidden">
			<span class="absolute inset-x-0 top-1/2 h-px bg-border"></span>
			<span
				class="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary transition-[left] motion-reduce:transition-none"
				style:left={playing[group] ? "calc(100% - 0.625rem)" : "0"}
				style:transition-duration={t.kind === "easing" ? "700ms" : `var(${t.name})`}
				style:transition-timing-function={t.kind === "easing" ? `var(${t.name})` : "var(--ease-ui-out)"}
			></span>
		</span>
	{/if}
{/snippet}

{#snippet specimen(id: string)}
	{#if id === "surfaces"}
		<div class="rounded-xl border border-border bg-background p-3">
			<p class="px-1 pb-2 font-mono text-muted-foreground text-xs">--background</p>
			<div class="rounded-xl bg-card p-3">
				<p class="pb-3 font-mono text-muted-foreground text-xs">--card</p>
				<div class="w-full max-w-64 rounded-xl bg-popover p-1 shadow-(--overlay-shadow)">
					<div class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-foreground text-sm">
						Rename <span class="rounded-sm bg-muted px-1.5 font-mono text-muted-foreground text-xs">R</span>
					</div>
					<div class="flex items-center justify-between rounded-lg bg-accent px-2.5 py-1.5 text-foreground text-sm">
						Duplicate <Badge variant="secondary" size="sm">New</Badge>
					</div>
					<div class="rounded-lg px-2.5 py-1.5 text-muted-foreground text-sm">Archived items</div>
					<div class="flex gap-1.5 px-1.5 pt-1 pb-1.5">
						<Button size="xs" variant="secondary">Share</Button>
						<Button size="xs" variant="ghost">Cancel</Button>
					</div>
				</div>
				<p class="pt-3 text-muted-foreground text-xs">
					--popover over --card, a --muted key cap and a --secondary button inside it.
				</p>
			</div>
		</div>
	{:else if id === "brand"}
		<div class="flex flex-wrap items-center gap-3">
			<Button>Primary</Button>
			<Button class="bg-primary-hover">Hovered</Button>
			<Button variant="outline" class="ring-3 ring-ring/40 border-ring">Focused</Button>
			<Checkbox checked aria-label="Checked" />
			<Switch checked aria-label="On" />
		</div>
	{:else if id === "status"}
		<div class="flex flex-col gap-3">
			<div class="flex flex-wrap gap-2">
				<Badge variant="success">Paid</Badge>
				<Badge variant="warning">Pending</Badge>
				<Badge variant="destructive">Failed</Badge>
				<Badge variant="info">Draft</Badge>
			</div>
			<div class="flex flex-wrap gap-2">
				<Button size="sm" variant="destructive">Delete</Button>
				<Button size="sm" variant="success">Approve</Button>
				<Button size="sm" variant="warning">Retry</Button>
				<Button size="sm" variant="info">Learn more</Button>
			</div>
		</div>
	{:else if id === "edges"}
		<div class="grid max-w-md gap-3">
			<Input placeholder="Field on --field, edged by --input" aria-label="Example field" />
			<div class="flex items-center gap-4">
				<Switch aria-label="Off" />
				<div class="min-w-0 flex-1"><Slider value={40} label="Example slider" /></div>
			</div>
			<Separator />
			<Progress value={64} label="Example progress" />
		</div>
	{:else if id === "charts"}
		<div class="grid gap-3">
			<div class="flex h-20 items-end gap-2">
				{#each SERIES as name, i (name)}
					<span class="w-8 rounded-t-md" style:height="{40 + i * 12}%" style:background="var({name})"></span>
				{/each}
				<span class="mx-2 h-full w-px bg-border"></span>
				<span class="w-8 rounded-t-md" style:height="70%" style:background="var(--chart-positive)"></span>
				<span class="w-8 rounded-t-md" style:height="45%" style:background="var(--chart-negative)"></span>
			</div>
			<div class="flex h-3 max-w-xs overflow-hidden rounded-full">
				{#each RAMP as name (name)}
					<span class="flex-1" style:background="var({name})"></span>
				{/each}
			</div>
		</div>
	{:else if id === "effects"}
		<div class="relative grid h-28 place-items-center overflow-hidden rounded-xl bg-brand-accent">
			<div class="rounded-xl border border-(--glass-border) bg-(--glass-bg) px-4 py-2.5 text-foreground text-sm backdrop-blur-md">
				Glass over the brand gradient
			</div>
		</div>
	{:else if id === "elevation"}
		<div class="grid gap-3 rounded-xl bg-card p-4 sm:grid-cols-3">
			<div class="rounded-lg bg-background p-3 text-xs shadow-(--surface-shadow)">Raised body</div>
			<div class="rounded-xl bg-popover p-3 text-xs shadow-(--overlay-shadow)">Popover</div>
			<div class="flex items-center gap-2 p-3 text-xs"><Switch checked aria-label="Thumb" /> Thumb</div>
		</div>
	{:else if id === "shape"}
		<div class="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-foreground">
			<span class="font-heading text-2xl">Satoshi heading</span>
			<span class="font-sans text-base">Inter body</span>
			<span class="font-mono text-sm">JetBrains Mono</span>
			<span class="font-serif text-lg italic">Newsreader serif</span>
		</div>
	{:else if id === "scale"}
		<div class="flex flex-wrap items-center gap-3">
			<Button size="sm" variant="secondary">Press sm</Button>
			<Button variant="secondary">Press</Button>
			<Button size="lg" variant="secondary">Press lg</Button>
		</div>
	{/if}
{/snippet}

<div {@attach read} class="flex flex-col gap-6">
	{#each groups as g (g.id)}
		{@const motion = g.id === "easing" || g.id === "duration"}
		<article id="tokens-{g.id}" class="scroll-mt-24 overflow-hidden rounded-2xl border border-border">
			<header class="flex items-start justify-between gap-4 px-4 pt-4">
				<div>
					<h3 class="font-medium text-foreground text-sm">{g.title}</h3>
					<p class="mt-0.5 text-muted-foreground text-xs">{g.note} {g.tokens.length} variables.</p>
				</div>
				{#if motion}
					<Button
						size="xs"
						variant="outline"
						onclick={() => (playing = { ...playing, [g.id]: !playing[g.id] })}
					>
						{playing[g.id] ? "Reset" : "Play"}
					</Button>
				{/if}
			</header>
			{#if !motion}
				<div class="px-4 pt-4">{@render specimen(g.id)}</div>
			{/if}
			<ul class="mt-4 divide-y divide-border border-border border-t">
				{#each g.tokens as t (t.name)}
					<li class="flex items-center gap-3 px-4 py-2">
						<span class="flex w-16 shrink-0 justify-center">{@render preview(t, g.id)}</span>
						<code class="w-44 shrink-0 truncate font-mono text-foreground text-xs sm:w-52">{t.name}</code>
						<code class="min-w-0 flex-1 truncate font-mono text-muted-foreground text-xs" title={live[t.name]}>
							{source(t)}
						</code>
						{#if t.dark}
							<Badge variant="outline" size="sm" class="hidden sm:inline-flex">per mode</Badge>
						{/if}
					</li>
				{/each}
			</ul>
		</article>
	{/each}
</div>
