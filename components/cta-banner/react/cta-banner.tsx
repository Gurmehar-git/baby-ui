"use client";

import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	BANNER_BANDS,
	BANNER_DEFAULTS,
	BANNER_LINES,
	BANNER_NOISE,
	BANNER_RUN,
	bannerPace,
	bannerRows,
	tickerRows,
} from "../banner";
import { type CtaBannerSize, type CtaBannerVariant, ctaBanner } from "../variants";

export type { CtaBannerSize, CtaBannerVariant };

const BannerCtx = createContext<{
	variant: CtaBannerVariant;
	size: CtaBannerSize;
	titleId?: string;
}>({ variant: "grain", size: "default" });

const useStyles = () => ctaBanner(useContext(BannerCtx));

export interface CtaBannerProps extends ComponentProps<"section"> {
	/** `grain`: a noisy tinted panel; `ticker`: lit copy beside a running wordmark; `spotlight`:
	 * a dark tint-lit card whose grid and edge light up under the pointer. */
	variant?: CtaBannerVariant;
	/** Padding and headline scale. */
	size?: CtaBannerSize;
	/** Any CSS colour. Defaults to green for grain, blue for ticker and `--primary` for spotlight. */
	tint?: string;
	/** Scales every loop inside: 2 is twice as fast, 0.5 half. */
	speed?: number;
}

/** A closing call to action. Compose the surface (grain, ticker, spotlight) with the copy parts. */
export function CtaBanner({
	variant = "grain",
	size = "default",
	tint,
	speed = BANNER_DEFAULTS.speed,
	className,
	style,
	onPointerMove,
	...props
}: CtaBannerProps) {
	const titleId = useId();
	const vars = {
		...(tint ? { "--cta-banner": tint } : {}),
		"--banner-speed": speed > 0 ? speed : BANNER_DEFAULTS.speed,
		...style,
	} as CSSProperties;

	return (
		<BannerCtx.Provider value={{ variant, size, titleId }}>
			<section
				aria-labelledby={titleId}
				data-slot="cta-banner"
				data-variant={variant}
				className={cn(ctaBanner({ variant, size }).root(), className)}
				style={vars}
				onPointerMove={(event) => {
					onPointerMove?.(event);
					if (variant !== "spotlight") return;
					const box = event.currentTarget.getBoundingClientRect();
					event.currentTarget.style.setProperty("--x", `${event.clientX - box.left}px`);
					event.currentTarget.style.setProperty("--y", `${event.clientY - box.top}px`);
				}}
				{...props}
			/>
		</BannerCtx.Provider>
	);
}

export function CtaBannerContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="cta-banner-content"
			className={cn(useStyles().content(), className)}
			{...props}
		/>
	);
}

/** A tilted white tile for an icon, over the title. */
export function CtaBannerBadge({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			data-slot="cta-banner-badge"
			className={cn(useStyles().badge(), className)}
			{...props}
		/>
	);
}

export function CtaBannerEyebrow({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			data-slot="cta-banner-eyebrow"
			className={cn(useStyles().eyebrow(), className)}
			{...props}
		/>
	);
}

/** The banner's heading; the section is labelled by it. */
export function CtaBannerTitle({ className, ...props }: ComponentProps<"h2">) {
	const { titleId } = useContext(BannerCtx);
	return (
		<h2
			id={titleId}
			data-slot="cta-banner-title"
			className={cn(useStyles().title(), className)}
			{...props}
		/>
	);
}

export function CtaBannerDescription({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			data-slot="cta-banner-description"
			className={cn(useStyles().description(), className)}
			{...props}
		/>
	);
}

export function CtaBannerActions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="cta-banner-actions"
			className={cn(useStyles().actions(), className)}
			{...props}
		/>
	);
}

/** A quiet line under the actions; a `<strong>` inside becomes an emphasised second line. */
export function CtaBannerNote({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			data-slot="cta-banner-note"
			className={cn(useStyles().note(), className)}
			{...props}
		/>
	);
}

export interface CtaBannerGrainProps {
	/** Noise opacity, 0 to 1. */
	noise?: number;
	/** The hairline grid. */
	lines?: boolean;
	className?: string;
}

/** Light bands, film grain and hairline rules laid over the tint. */
export function CtaBannerGrain({
	noise = BANNER_DEFAULTS.noise,
	lines = true,
	className,
}: CtaBannerGrainProps) {
	const s = useStyles();
	return (
		<span aria-hidden data-slot="cta-banner-grain" className={cn(s.layer(), className)}>
			<span className={s.layer()} style={{ backgroundImage: BANNER_BANDS }} />
			<span
				className={cn(s.layer(), "mix-blend-overlay")}
				style={{ backgroundImage: BANNER_NOISE, opacity: noise }}
			/>
			{lines
				? BANNER_LINES.x.map((x) => (
						<span
							key={`x${x}`}
							className={cn(s.line(), "inset-y-0 w-px")}
							style={{ left: `${x}%` }}
						/>
					))
				: null}
			{lines
				? BANNER_LINES.y.map((y) => (
						<span
							key={`y${y}`}
							className={cn(s.line(), "inset-x-0 h-px")}
							style={{ top: `${y}%` }}
						/>
					))
				: null}
		</span>
	);
}

export interface CtaBannerFloaterProps {
	/** Left edge, any CSS length. */
	x: string;
	/** Top edge, any CSS length. */
	y: string;
	/** Seconds before this floater's loop starts. */
	delay?: number;
	/** Loop length in seconds, before `speed` scales it. */
	duration?: number;
	className?: string;
	children: ReactNode;
}

/** An icon that drifts and breathes behind the copy, on its own loop. */
export function CtaBannerFloater({
	x,
	y,
	delay = 0,
	duration = 6,
	className,
	children,
}: CtaBannerFloaterProps) {
	return (
		<span
			aria-hidden
			data-slot="cta-banner-floater"
			className={cn(useStyles().floater(), className)}
			style={{
				left: x,
				top: y,
				animationDuration: bannerPace(duration),
				animationDelay: `${delay}s`,
			}}
		>
			{children}
		</span>
	);
}

export interface CtaBannerTickerProps {
	/** The word that runs in rows. */
	word: string;
	/** A mark set between repetitions of the word. */
	mark?: ReactNode;
	/** The rows' angle in degrees. */
	angle?: number;
	/** How many rows run, 4 to 48. */
	rows?: number;
	/** Blur the rows where they pass behind the copy. */
	veil?: boolean;
	className?: string;
}

/** Inclined rows of a running word, beside the copy from a 56rem container. */
export function CtaBannerTicker({
	word,
	mark,
	angle = BANNER_DEFAULTS.angle,
	rows = BANNER_DEFAULTS.rows,
	veil = true,
	className,
}: CtaBannerTickerProps) {
	const s = useStyles();
	const field = useRef<HTMLDivElement>(null);
	const [seen, setSeen] = useState(false);

	// Rows only run while the field is on screen.
	useEffect(() => {
		if (!field.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setSeen(Boolean(entry?.isIntersecting)),
		);
		observer.observe(field.current);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<div
				ref={field}
				aria-hidden
				data-slot="cta-banner-ticker"
				className={cn(s.tickerField(), className)}
			>
				<div className={s.tickerRows()} style={{ rotate: `${angle}deg` }}>
					{tickerRows(bannerRows(rows)).map((start, row) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: rows are a fixed stack.
						<div key={row} className={s.tickerRow()}>
							<div
								className={s.tickerRun()}
								style={{
									marginLeft: `${-start}em`,
									animationDirection: row % 2 ? "reverse" : "normal",
									animationDuration: bannerPace(160),
									animationPlayState: seen ? "running" : "paused",
								}}
							>
								{BANNER_RUN.map((key) => (
									<span key={key} className={s.tickerWord()}>
										<span>{word}</span>
										{mark}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			{veil ? <span aria-hidden className={s.tickerVeil()} /> : null}
		</>
	);
}

export interface CtaBannerSpotlightProps {
	/** The light's radius in pixels. */
	radius?: number;
	/** The grid the light reveals. */
	grid?: boolean;
	/** A highlight that sweeps along the top edge. */
	sweep?: boolean;
	className?: string;
}

/** A lit edge, tinted surface, orb and grid that follow the pointer across the root. */
export function CtaBannerSpotlight({
	radius = BANNER_DEFAULTS.radius,
	grid = true,
	sweep = true,
	className,
}: CtaBannerSpotlightProps) {
	const s = useStyles();
	return (
		<span
			aria-hidden
			data-slot="cta-banner-spotlight"
			className={cn(s.layer(), "rounded-[inherit]", className)}
			style={{ "--r": `${radius}px` } as CSSProperties}
		>
			<span className={s.spotEdge()} />
			<span className={s.spotSurface()} />
			<span className={s.spotOrb()} />
			{grid ? <span className={s.spotGrid()} /> : null}
			{grid ? <span className={s.spotReveal()} /> : null}
			<span className={s.spotLight()} />
			{sweep ? (
				<span className={s.spotSweep()} style={{ animationDuration: bannerPace(6) }} />
			) : null}
		</span>
	);
}
