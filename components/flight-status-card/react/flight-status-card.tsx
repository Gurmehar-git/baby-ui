import type { CSSProperties } from "react";
import { Badge } from "../../badge/react/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../card/react/card";
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

export type { FlightStatus, FlightStatusDisplay, FlightStatusLabels, FlightStatusTone };

export interface FlightStatusCardProps {
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
	className?: string;
}

type Styles = ReturnType<typeof flightStatusCard>;

function Code({
	code,
	display,
	s,
}: {
	code: string;
	display: FlightStatusDisplay;
	s: Styles;
}) {
	if (display === "text") {
		return (
			<span className={s.code()} aria-hidden>
				{code}
			</span>
		);
	}
	return (
		<span className={s.code()} aria-hidden>
			{[...code].map((char, i) => (
				<svg
					// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
					key={`${char}-${i}`}
					aria-hidden
					viewBox={`0 0 ${MATRIX_WIDTH} ${MATRIX_HEIGHT}`}
					className={s.char()}
					style={{ "--flight-status-delay": `${i * 90}ms` } as CSSProperties}
				>
					{matrixDots(char).map((dot) => (
						<circle
							key={`${dot.x}-${dot.y}`}
							cx={dot.x}
							cy={dot.y}
							r={MATRIX_DOT / 2}
							className={dot.on ? s.dotOn() : s.dotOff()}
						/>
					))}
				</svg>
			))}
		</span>
	);
}

/** Flight route, status and progress; every value is a prop the caller keeps current. */
export function FlightStatusCard({
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
	className,
}: FlightStatusCardProps) {
	const text = { ...FLIGHT_STATUS_LABELS, ...labels };
	const activeTone = tone ?? FLIGHT_STATUS_TONE[status];
	const s = flightStatusCard({ tone: activeTone, display });
	const pct = clampProgress(progress);
	const panel = eta || etaNote || nextEvent;

	return (
		<Card
			data-slot="flight-status-card"
			data-status={status}
			className={cn(s.root(), className)}
		>
			<CardHeader>
				{flight ? (
					<CardTitle className="font-mono tracking-wide">{flight}</CardTitle>
				) : null}
				<CardAction>
					<Badge variant={FLIGHT_TONE_BADGE[activeTone]} dot>
						{text[status]}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<div className={s.top()}>
					<div className={s.route()}>
						<span className="sr-only">
							{`${departureCode} ${departureCity} ${text.to} ${arrivalCode} ${arrivalCity}`}
						</span>
						<div className={s.endpoint()}>
							<Code code={departureCode} display={display} s={s} />
							<span className={s.city()}>{departureCity}</span>
							<span className={s.time()}>{departureTime}</span>
						</div>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
							className={s.arrow()}
						>
							<path d="M5 12h14" />
							<path d="M13 18l6 -6" />
							<path d="M13 6l6 6" />
						</svg>
						<div className={cn(s.endpoint(), "items-end text-right")}>
							<Code code={arrivalCode} display={display} s={s} />
							<span className={s.city()}>{arrivalCity}</span>
							<span className={s.time()}>{arrivalTime}</span>
						</div>
					</div>
					{panel ? (
						<div className={s.eta()}>
							{eta ? <span className={s.etaValue()}>{eta}</span> : null}
							{etaNote ? <span className={s.etaNote()}>{etaNote}</span> : null}
							{nextEvent ? <span className={s.event()}>{nextEvent}</span> : null}
						</div>
					) : null}
				</div>
				<div
					role="progressbar"
					aria-label={text.progress}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(pct)}
					aria-valuetext={remaining}
					className={s.track()}
				>
					<div className={s.reveal()}>
						<div className={s.fill()} style={{ width: `${pct}%` }}>
							<span className={s.plane()}>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
								>
									<path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
								</svg>
							</span>
						</div>
					</div>
					{remaining ? (
						<span className={s.remaining()} aria-hidden>
							{remaining}
						</span>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
