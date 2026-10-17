<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import Card from "../../card/svelte/card.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import { cn } from "../../lib/cn";
import {
	clampProgress,
	FLIGHT_STATUS_LABELS,
	type FlightStatus,
	type FlightStatusLabels,
	MATRIX_DOT,
	MATRIX_HEIGHT,
	MATRIX_WIDTH,
	matrixDots,
} from "../types";
import {
	FLIGHT_STATUS_TONE,
	FLIGHT_TONE_BADGE,
	type FlightStatusDisplay,
	type FlightStatusTone,
	flightStatusCard,
} from "../variants";

let {
	departureCode,
	arrivalCode,
	departureCity,
	arrivalCity,
	departureTime,
	arrivalTime,
	status,
	progress,
	flight,
	eta,
	etaNote,
	nextEvent,
	remaining,
	tone,
	display = "matrix",
	labels,
	class: classProp,
}: {
	departureCode: string;
	arrivalCode: string;
	departureCity: string;
	arrivalCity: string;
	departureTime: string;
	arrivalTime: string;
	status: FlightStatus;
	/** Share of the route flown, 0 to 100. */
	progress: number;
	/** Flight number shown as the card title. */
	flight?: string;
	/** Headline of the side panel, e.g. an arrival estimate. */
	eta?: string;
	etaNote?: string;
	/** Accent line under the side panel, e.g. the next cabin service. */
	nextEvent?: string;
	/** Text at the right end of the progress track. */
	remaining?: string;
	/** Overrides the tone the status picks. */
	tone?: FlightStatusTone;
	display?: FlightStatusDisplay;
	labels?: Partial<FlightStatusLabels>;
	class?: string;
} = $props();

const text = $derived({ ...FLIGHT_STATUS_LABELS, ...labels });
const activeTone = $derived(tone ?? FLIGHT_STATUS_TONE[status]);
const s = $derived(flightStatusCard({ tone: activeTone, display }));
const pct = $derived(clampProgress(progress));
const panel = $derived(Boolean(eta || etaNote || nextEvent));
</script>

{#snippet code(value: string)}
	{#if display === "text"}
		<span class={s.code()} aria-hidden="true">{value}</span>
	{:else}
		<span class={s.code()} aria-hidden="true">
			{#each [...value] as char, i (`${char}-${i}`)}
				<svg
					viewBox="0 0 {MATRIX_WIDTH} {MATRIX_HEIGHT}"
					class={s.char()}
					style:--flight-status-delay="{i * 90}ms"
				>
					{#each matrixDots(char) as dot (`${dot.x}-${dot.y}`)}
						<circle
							cx={dot.x}
							cy={dot.y}
							r={MATRIX_DOT / 2}
							class={dot.on ? s.dotOn() : s.dotOff()}
						/>
					{/each}
				</svg>
			{/each}
		</span>
	{/if}
{/snippet}

<Card data-slot="flight-status-card" data-status={status} class={cn(s.root(), classProp)}>
	<CardHeader>
		{#if flight}<CardTitle class="font-mono tracking-wide">{flight}</CardTitle>{/if}
		<CardAction>
			<Badge variant={FLIGHT_TONE_BADGE[activeTone]} dot>{text[status]}</Badge>
		</CardAction>
	</CardHeader>
	<CardContent class="flex flex-col gap-5">
		<div class={s.top()}>
			<div class={s.route()}>
				<span class="sr-only">
					{`${departureCode} ${departureCity} ${text.to} ${arrivalCode} ${arrivalCity}`}
				</span>
				<div class={s.endpoint()}>
					{@render code(departureCode)}
					<span class={s.city()}>{departureCity}</span>
					<span class={s.time()}>{departureTime}</span>
				</div>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class={s.arrow()}
				>
					<path d="M5 12h14" />
					<path d="M13 18l6 -6" />
					<path d="M13 6l6 6" />
				</svg>
				<div class={cn(s.endpoint(), "items-end text-right")}>
					{@render code(arrivalCode)}
					<span class={s.city()}>{arrivalCity}</span>
					<span class={s.time()}>{arrivalTime}</span>
				</div>
			</div>
			{#if panel}
				<div class={s.eta()}>
					{#if eta}<span class={s.etaValue()}>{eta}</span>{/if}
					{#if etaNote}<span class={s.etaNote()}>{etaNote}</span>{/if}
					{#if nextEvent}<span class={s.event()}>{nextEvent}</span>{/if}
				</div>
			{/if}
		</div>
		<div
			role="progressbar"
			aria-label={text.progress}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(pct)}
			aria-valuetext={remaining}
			class={s.track()}
		>
			<div class={s.reveal()}>
				<div class={s.fill()} style:width="{pct}%">
					<span class={s.plane()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path
								d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z"
							/>
						</svg>
					</span>
				</div>
			</div>
			{#if remaining}
				<span class={s.remaining()} aria-hidden="true">{remaining}</span>
			{/if}
		</div>
	</CardContent>
</Card>
