<script lang="ts">
import Button from "../button/button.svelte";
import { button } from "../button/variants";
import Dialog from "../dialog/dialog.svelte";
import DialogClose from "../dialog/dialog-close.svelte";
import DialogContent from "../dialog/dialog-content.svelte";
import { cn } from "../lib/cn";
import Spinner from "../spinner/spinner.svelte";
import { type AgentScreenSize, agentScreen } from "./variants";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;

function fmt(total: number) {
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

let {
	agentName = "Agent",
	streamSrc,
	loading = false,
	size = "default",
	open = $bindable(false),
	class: classProp,
}: {
	agentName?: string;
	streamSrc?: string;
	loading?: boolean;
	size?: AgentScreenSize;
	open?: boolean;
	class?: string;
} = $props();

let recording = $state(false);
let secs = $state(0);
let cursorPos = $state<{ x: number; y: number } | null>(null);
let tick: ReturnType<typeof setInterval> | undefined;

const classes = $derived(agentScreen({ size }));

function startRecording() {
	secs = 0;
	recording = true;
	clearInterval(tick);
	tick = setInterval(() => {
		secs += 1;
	}, 1000);
}

function endRecording() {
	recording = false;
	secs = 0;
	clearInterval(tick);
}
</script>

{#snippet cursorIcon(style: string, klass = "")}
	<svg
		viewBox="0 0 24 24"
		stroke-width="1.4"
		stroke-linejoin="round"
		aria-hidden="true"
		width="26"
		height="26"
		class={cn("fill-foreground stroke-background", klass)}
		{style}
	>
		<path
			d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
		/>
	</svg>
{/snippet}

{#snippet connectingScreen()}
	<div class="absolute inset-0 grid place-items-center bg-black">
		<div class="flex flex-col items-center gap-3">
			<Spinner size="lg" class="text-white" label="Connecting to agent's screen" />
			<span class="text-xs text-white/70 font-medium">
				Connecting to agent's screen
			</span>
		</div>
	</div>
{/snippet}

<div data-slot="agent-screen" class={cn(classes.root(), classProp)}>
	<button
		type="button"
		disabled={loading}
		onclick={() => (open = true)}
		class={cn(
			"group/screen relative aspect-[2964/1856] w-full overflow-hidden rounded-2xl bg-muted text-left shadow-sm transition-shadow duration-(--duration-fast)",
			!loading && "cursor-pointer hover:shadow-md",
		)}
	>
		{#if loading}
			{@render connectingScreen()}
		{:else}
			<div class="absolute inset-0 overflow-hidden bg-muted">
				{#if streamSrc}
					{#if VIDEO_EXT.test(streamSrc)}
						<video
							src={streamSrc}
							autoplay
							muted
							loop
							playsinline
							class="absolute inset-0 size-full object-cover"
						></video>
					{:else}
						<img src={streamSrc} alt="" class="absolute inset-0 size-full object-cover" />
					{/if}
					{@render cursorIcon("left: 42%; top: 53%;", "pointer-events-none absolute")}
				{:else}
					<div class="absolute inset-0 grid place-items-center bg-muted text-muted-foreground text-xs">
						Screen unavailable
					</div>
				{/if}
			</div>
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-(--duration-fast) group-hover/screen:bg-black/20"
			>
				<span
					aria-hidden="true"
					class={cn(
						button({ variant: "default", size: "sm" }),
						"translate-y-1 opacity-0 transition duration-(--duration-fast) group-hover/screen:translate-y-0 group-hover/screen:opacity-100",
					)}
				>
					Open
				</span>
			</div>
		{/if}
	</button>

	<p class="mt-2.5 truncate px-0.5 font-medium text-sm text-foreground">
		{agentName}'s screen
	</p>

	<Dialog bind:open>
		<DialogContent
			class="flex max-h-[90vh] w-[min(960px,92vw)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl bg-card p-2 pt-0"
		>
			<div class="flex h-11 shrink-0 items-center justify-between gap-3 px-1.5">
				<div class="flex min-w-0 items-center gap-2">
					<span class="truncate font-semibold text-sm text-foreground">{agentName}</span>
					{#if recording}
						<span
							class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 py-0.5 pr-2 pl-1.5 font-medium text-xs text-destructive-strong tabular-nums"
						>
							<span class="size-2 animate-pulse rounded-full bg-destructive"></span>
							{fmt(secs)}
						</span>
					{/if}
				</div>
				<div class="flex shrink-0 items-center gap-1.5">
					{#if recording}
						<Button variant="destructive" size="sm" class="gap-1.5 rounded-full" onclick={endRecording}>
							<span class="size-2.5 rounded-[2px] bg-current"></span>
							End
						</Button>
					{:else}
						<Button variant="secondary" size="sm" onclick={startRecording}>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
								<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" />
								<circle cx="8" cy="8" r="2.4" fill="currentColor" />
							</svg>
							Teach a task
						</Button>
					{/if}
					<DialogClose
						class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
							<path
								d="M3 9h4v4M13 7H9V3M9 7l5-5M7 9l-5 5"
								stroke="currentColor"
								stroke-width="1.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span class="sr-only">Collapse</span>
					</DialogClose>
				</div>
			</div>

			<!-- svelte-ignore a11y_no_static_element_interactions -- decorative cursor-follow overlay, not a real control -->
			<div
				class="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-muted [cursor:none]"
				onmousemove={(event) => {
					const rect = event.currentTarget.getBoundingClientRect();
					cursorPos = { x: event.clientX - rect.left, y: event.clientY - rect.top };
				}}
				onmouseleave={() => (cursorPos = null)}
			>
				{#if loading}
					{@render connectingScreen()}
				{:else}
					<div class="flex h-full items-center justify-center">
						{#if streamSrc}
							{#if VIDEO_EXT.test(streamSrc)}
								<video
									src={streamSrc}
									autoplay
									muted
									loop
									playsinline
									class="block h-auto w-auto object-contain"
									style="max-height: calc(100vh - 150px); max-width: min(960px, 90vw);"
								></video>
							{:else}
								<img
									src={streamSrc}
									alt=""
									class="block h-auto w-auto object-contain"
									style="max-height: calc(100vh - 150px); max-width: min(960px, 90vw);"
								/>
							{/if}
						{:else}
							<div class="grid h-[40vh] w-[min(720px,90vw)] place-items-center text-muted-foreground text-sm">
								Screen unavailable
							</div>
						{/if}
					</div>
				{/if}
				{#if !loading && cursorPos}
					{@render cursorIcon(
						`left: ${cursorPos.x}px; top: ${cursorPos.y}px;`,
						"pointer-events-none absolute z-10 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]",
					)}
				{/if}
			</div>
		</DialogContent>
	</Dialog>
</div>
