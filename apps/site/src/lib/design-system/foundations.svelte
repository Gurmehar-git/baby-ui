<script lang="ts">
import { Button, type ButtonSize } from "@baby-ui/svelte";
import { watchLayout } from "./measure";

// Literal class names, so Tailwind sees each one.
const RADII = [
	{ r: "sm", cls: "rounded-sm" },
	{ r: "md", cls: "rounded-md" },
	{ r: "lg", cls: "rounded-lg" },
	{ r: "xl", cls: "rounded-xl" },
	{ r: "2xl", cls: "rounded-2xl" },
	{ r: "3xl", cls: "rounded-3xl" },
];
const TYPE = [
	{ cls: "text-xs", role: "Meta, badges, key caps" },
	{ cls: "text-sm", role: "Controls, rows, component body" },
	{ cls: "text-base", role: "Reading text" },
	{ cls: "text-lg", role: "Panel titles" },
	{ cls: "text-2xl", role: "Display" },
	{ cls: "text-4xl", role: "Display" },
];
const SHADOWS = [
	{ name: "--surface-shadow", role: "Raised body inside a rim" },
	{ name: "--overlay-shadow", role: "Popovers, menus, dialogs" },
	{ name: "--thumb-shadow", role: "Switch and slider thumbs" },
];
const SPEEDS = [
	{ name: "--duration-instant", role: "Every exit, colour" },
	{ name: "--duration-fast", role: "Press, dropdown, tooltip" },
	{ name: "--duration-base", role: "Collapse, panel exit" },
	{ name: "--duration-slow", role: "Overlay entrance, indicators" },
];
const PRESS: { size: ButtonSize; token: string }[] = [
	{ size: "sm", token: "--press-scale-sm" },
	{ size: "default", token: "--press-scale" },
	{ size: "lg", token: "--press-scale-lg" },
	{ size: "icon-sm", token: "--press-scale-icon" },
];

let read = $state<Record<string, string>>({});

function tokens(host: HTMLElement) {
	return watchLayout(host, () => {
		const style = getComputedStyle(host);
		const next: Record<string, string> = {};
		for (const s of SPEEDS) next[s.name] = style.getPropertyValue(s.name).trim();
		for (const p of PRESS) next[p.token] = style.getPropertyValue(p.token).trim();
		for (const el of host.querySelectorAll<HTMLElement>("[data-type]")) {
			const t = getComputedStyle(el);
			next[el.dataset.type ?? ""] =
				`${Number.parseFloat(t.fontSize)}/${Number.parseFloat(t.lineHeight)}`;
		}
		for (const el of host.querySelectorAll<HTMLElement>("[data-radius]")) {
			next[`px-${el.dataset.radius}`] =
				`${Number.parseFloat(getComputedStyle(el).borderTopLeftRadius)}px`;
		}
		read = next;
	});
}

let playing = $state(false);
</script>

<div {@attach tokens} class="flex flex-col gap-16">
	<section id="radius" class="scroll-mt-24">
		<h2 class="font-semibold text-foreground text-xl tracking-tight">Radius</h2>
		<p class="mt-1 max-w-2xl text-muted-foreground text-sm">
			One knob, <code class="font-mono text-xs">--radius</code>, sets every step. Nested corners are
			concentric: the inner radius is the outer one minus the inset.
		</p>
		<div class="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
			{#each RADII as { r, cls } (r)}
				<div class="flex flex-col items-center gap-2">
					<div data-radius={r} class="aspect-square w-full border border-border bg-card {cls}"></div>
					<p class="font-mono text-foreground text-xs">{cls}</p>
					<p class="font-mono text-muted-foreground text-xs tabular-nums">{read[`px-${r}`] ?? ""}</p>
				</div>
			{/each}
		</div>
		<div class="mt-6 grid gap-3 sm:grid-cols-2">
			<div class="rounded-2xl border border-border bg-card p-1">
				<div class="rounded-[11px] border border-border bg-background px-4 py-5 text-sm">
					<p class="font-medium text-foreground">Framed body</p>
					<p class="mt-1 text-muted-foreground">16 outer, 4 padding, 1 border: 11 inner.</p>
				</div>
			</div>
			<div class="rounded-xl bg-popover p-1 shadow-(--overlay-shadow)">
				{#each ["Rename", "Duplicate", "Archive"] as item, i (item)}
					<div class="rounded-lg px-2.5 py-1.5 text-foreground text-sm" class:bg-accent={i === 0}>{item}</div>
				{/each}
				<p class="px-2.5 pt-1 pb-1.5 text-muted-foreground text-xs">Menu: 14 outer, 4 padding, rows 10.</p>
			</div>
		</div>
	</section>

	<section id="type" class="scroll-mt-24">
		<h2 class="font-semibold text-foreground text-xl tracking-tight">Type</h2>
		<p class="mt-1 max-w-2xl text-muted-foreground text-sm">
			Four UI sizes and a display ladder. No arbitrary sizes in components.
		</p>
		<ul class="mt-6 divide-y divide-border rounded-2xl border border-border">
			{#each TYPE as t (t.cls)}
				<li class="flex items-baseline gap-4 px-4 py-3">
					<span class="w-20 shrink-0 font-mono text-muted-foreground text-xs">{t.cls}</span>
					<span data-type={t.cls} class="min-w-0 flex-1 truncate text-foreground {t.cls}">Ship it calmly</span>
					<span class="hidden font-mono text-muted-foreground text-xs tabular-nums sm:inline">{read[t.cls] ?? ""}</span>
					<span class="hidden w-48 text-right text-muted-foreground text-xs md:inline">{t.role}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section id="elevation" class="scroll-mt-24">
		<h2 class="font-semibold text-foreground text-xl tracking-tight">Elevation</h2>
		<p class="mt-1 max-w-2xl text-muted-foreground text-sm">
			Three shadows. Overlays carry no CSS border; the shadow's ring is their edge.
		</p>
		<div class="mt-6 grid gap-4 rounded-2xl bg-card p-6 sm:grid-cols-3">
			{#each SHADOWS as s (s.name)}
				<div class="rounded-xl bg-background p-4" style:box-shadow="var({s.name})">
					<p class="font-mono text-foreground text-xs">{s.name}</p>
					<p class="mt-1 text-muted-foreground text-xs">{s.role}</p>
				</div>
			{/each}
		</div>
	</section>

	<section id="motion" class="scroll-mt-24">
		<h2 class="font-semibold text-foreground text-xl tracking-tight">Motion</h2>
		<p class="mt-1 max-w-2xl text-muted-foreground text-sm">
			Four speeds only. Exits undercut entrances; reduced motion keeps opacity and drops travel.
		</p>
		<div class="mt-6 rounded-2xl border border-border">
			<div class="flex items-center justify-between border-border border-b px-4 py-2.5">
				<span class="text-muted-foreground text-xs">Durations on <code class="font-mono">--ease-ui-out</code></span>
				<Button size="xs" variant="outline" onclick={() => (playing = !playing)}>
					{playing ? "Reset" : "Play"}
				</Button>
			</div>
			<ul class="divide-y divide-border">
				{#each SPEEDS as s (s.name)}
					<li class="flex items-center gap-4 px-4 py-3">
						<span class="w-36 shrink-0 font-mono text-foreground text-xs">{s.name}</span>
						<span class="w-14 shrink-0 font-mono text-muted-foreground text-xs tabular-nums">{read[s.name] ?? ""}</span>
						<div class="relative h-1.5 min-w-0 flex-1 rounded-full bg-muted">
							<span
								class="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full bg-primary transition-[left] ease-(--ease-ui-out) motion-reduce:transition-none"
								style:transition-duration="var({s.name})"
								style:left={playing ? "calc(100% - 0.75rem)" : "0"}
							></span>
						</div>
						<span class="hidden w-48 text-right text-muted-foreground text-xs md:inline">{s.role}</span>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-4 rounded-2xl border border-border px-4 py-4">
			<p class="text-muted-foreground text-xs">
				Press scale: a ratio moves a big control more pixels, so larger controls give a smaller ratio. Press each.
			</p>
			<div class="mt-3 flex flex-wrap items-center gap-3">
				{#each PRESS as p (p.token)}
					<div class="flex items-center gap-2">
						<Button size={p.size} variant="secondary" aria-label={p.size.startsWith("icon") ? "Press" : undefined}>
							{#if p.size.startsWith("icon")}
								<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
							{:else}
								Press
							{/if}
						</Button>
						<span class="font-mono text-muted-foreground text-xs tabular-nums">{read[p.token] ?? ""}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
