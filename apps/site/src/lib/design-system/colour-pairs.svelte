<script lang="ts">
import { Badge } from "@baby-ui/svelte";
import { contrast, tokenColor, watchLayout } from "./measure";

type Pair = {
	label: string;
	fg: string;
	bg: string;
	floor: number | null;
	note?: string;
};

const SURFACES = ["--background", "--card", "--popover", "--muted"];

// Floors are WCAG: 4.5 text, 3 for a control's edge or focus ring; null marks a hairline.
const PAIRS: Pair[] = [
	{ label: "Body text", fg: "--foreground", bg: "--background", floor: 4.5 },
	{ label: "Secondary text", fg: "--muted-foreground", bg: "--background", floor: 4.5 },
	{ label: "Secondary text on card", fg: "--muted-foreground", bg: "--card", floor: 4.5 },
	{ label: "Primary label", fg: "--primary-foreground", bg: "--primary", floor: 4.5 },
	{
		label: "Destructive label",
		fg: "--destructive-foreground",
		bg: "--destructive",
		floor: 4.5,
	},
	{ label: "Success label", fg: "--success-foreground", bg: "--success", floor: 4.5 },
	{ label: "Warning label", fg: "--warning-foreground", bg: "--warning", floor: 4.5 },
	{ label: "Info label", fg: "--info-foreground", bg: "--info", floor: 4.5 },
	{
		label: "Soft destructive text",
		fg: "--destructive-strong",
		bg: "--background",
		floor: 4.5,
	},
	{ label: "Soft success text", fg: "--success-strong", bg: "--background", floor: 4.5 },
	{ label: "Soft warning text", fg: "--warning-strong", bg: "--background", floor: 4.5 },
	{ label: "Focus ring", fg: "--ring", bg: "--background", floor: 3 },
	{
		label: "Field edge",
		fg: "--input",
		bg: "--background",
		floor: null,
		note: "Hairline at rest; hover and the focus ring carry the edge.",
	},
	{ label: "Divider", fg: "--border", bg: "--background", floor: null },
	{ label: "Strong divider", fg: "--border-strong", bg: "--background", floor: null },
];

let ratios = $state<number[]>([]);
let values = $state<Record<string, string>>({});

function read(host: HTMLElement) {
	return watchLayout(host, () => {
		const resolved: Record<string, string> = {};
		for (const name of [...SURFACES, ...PAIRS.flatMap((p) => [p.fg, p.bg])]) {
			resolved[name] ??= tokenColor(name, host);
		}
		values = resolved;
		ratios = PAIRS.map((p) => contrast(resolved[p.fg] ?? "", resolved[p.bg] ?? ""));
	});
}
</script>

<div {@attach read}>
	<h3 class="font-medium text-foreground text-sm">Surface ladder</h3>
	<p class="mt-1 text-muted-foreground text-sm">Each surface is its own step, so nesting reads without a border.</p>
	<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each SURFACES as name (name)}
			<div class="overflow-hidden rounded-xl border border-border">
				<div class="h-20 border-border border-b" style:background="var({name})"></div>
				<div class="px-3 py-2.5">
					<p class="font-mono text-foreground text-xs">{name}</p>
					<p class="mt-0.5 truncate font-mono text-muted-foreground text-xs">{values[name] ?? ""}</p>
				</div>
			</div>
		{/each}
	</div>

	<h3 class="mt-10 font-medium text-foreground text-sm">Pairs, measured in this theme</h3>
	<p class="mt-1 text-muted-foreground text-sm">Switch the theme and every ratio is measured again.</p>
	<div class="mt-4 overflow-hidden rounded-2xl border border-border">
		<ul class="divide-y divide-border">
			{#each PAIRS as pair, i (pair.label)}
				{@const ratio = ratios[i] ?? 0}
				<li class="flex items-center gap-4 px-4 py-3">
					<span
						class="grid h-9 w-14 shrink-0 place-items-center rounded-lg border border-border font-medium text-sm"
						style:background="var({pair.bg})"
						style:color="var({pair.fg})"
					>
						{#if pair.floor === null}
							<span class="block h-px w-8" style:background="var({pair.fg})"></span>
						{:else}
							Aa
						{/if}
					</span>
					<div class="min-w-0 flex-1">
						<p class="text-foreground text-sm">{pair.label}</p>
						<p class="truncate font-mono text-muted-foreground text-xs">
							{pair.fg} on {pair.bg}{#if pair.note} · {pair.note}{/if}
						</p>
					</div>
					<span class="font-mono text-foreground text-sm tabular-nums">{ratio.toFixed(2)}:1</span>
					{#if pair.floor === null}
						<Badge variant="outline" size="sm">hairline</Badge>
					{:else if ratio >= pair.floor}
						<Badge variant="success" size="sm">≥ {pair.floor}</Badge>
					{:else}
						<Badge variant="destructive" size="sm">&lt; {pair.floor}</Badge>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
