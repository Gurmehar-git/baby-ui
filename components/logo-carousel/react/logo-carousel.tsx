"use client";

import {
	Children,
	type CSSProperties,
	memo,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { DraggableMarquee } from "../../draggable-marquee/react/draggable-marquee";
import { cn } from "../../lib/react/cn";
import {
	type LogoCarouselTone,
	type LogoCarouselVariant,
	logoCarousel,
} from "./variants";

export type { LogoCarouselTone, LogoCarouselVariant };

const CYCLE_INTERVAL_MS = 1600;
const STAGGER_MS = 125;

export interface LogoCarouselProps {
	/** Each child is one logo; distributed round-robin across `columnCount` columns. */
	children: ReactNode;
	columnCount?: number;
	/** Which edge the per-column stagger counts from. */
	direction?: "ltr" | "rtl";
	/** `columns` cycles logos in place; `marquee` drifts them past in one strip. */
	variant?: LogoCarouselVariant;
	tone?: LogoCarouselTone;
	/** Holds the motion still. */
	paused?: boolean;
	onPausedChange?: (paused: boolean) => void;
	/** A Pause / Play button under the logos; on by default for the marquee. */
	pauseControl?: boolean;
	/** Accessible name of the marquee strip. */
	label?: string;
	className?: string;
}

function distribute(logos: ReactNode[], count: number): ReactNode[][] {
	const n = Math.min(count, logos.length);
	const columns: ReactNode[][] = Array.from({ length: n }, () => []);
	logos.forEach((logo, index) => {
		columns[index % n]?.push(logo);
	});
	return columns;
}

function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const onChange = () => setReduced(query.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

function usePageVisible(): boolean {
	const [visible, setVisible] = useState(
		() => typeof document === "undefined" || document.visibilityState === "visible",
	);
	useEffect(() => {
		const onChange = () => setVisible(document.visibilityState === "visible");
		document.addEventListener("visibilitychange", onChange);
		return () => document.removeEventListener("visibilitychange", onChange);
	}, []);
	return visible;
}

export function LogoCarousel({
	children,
	columnCount = 4,
	direction = "ltr",
	variant = "columns",
	tone = "color",
	paused: pausedProp,
	onPausedChange,
	pauseControl = variant === "marquee",
	label = "Logos",
	className,
}: LogoCarouselProps) {
	const s = logoCarousel({ variant, tone });
	const [ownPaused, setOwnPaused] = useState(false);
	const paused = pausedProp ?? ownPaused;
	const togglePaused = () => {
		if (pausedProp === undefined) setOwnPaused(!paused);
		onPausedChange?.(!paused);
	};
	const logos = useMemo(() => Children.toArray(children), [children]);
	const columns = useMemo(() => distribute(logos, columnCount), [logos, columnCount]);

	const containerRef = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: the columns grid only exists in that variant, so a switch re-observes it.
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry?.isIntersecting ?? false),
			{ rootMargin: "100px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [variant]);

	const reduced = useReducedMotion();
	const pageVisible = usePageVisible();
	const shouldPlay = inView && pageVisible && !reduced && !paused;

	const [indices, setIndices] = useState<number[]>(() => columns.map(() => 0));
	const columnsRef = useRef(columns);
	columnsRef.current = columns;

	useEffect(() => {
		if (!shouldPlay) return;
		const id = setInterval(() => {
			setIndices((prev) =>
				columnsRef.current.map(
					(col, i) => ((prev[i] ?? 0) + 1) % Math.max(1, col.length),
				),
			);
		}, CYCLE_INTERVAL_MS);
		return () => clearInterval(id);
	}, [shouldPlay]);

	const body =
		variant === "marquee" ? (
			<DraggableMarquee
				speed={paused ? 0 : 0.5}
				gap="lg"
				pauseOnHover
				label={label}
				className={cn(s.strip(), className)}
			>
				{logos}
			</DraggableMarquee>
		) : (
			<div
				ref={containerRef}
				data-slot="logo-carousel"
				className={cn(s.columns(), className)}
				style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
			>
				{columns.map((col, i) => (
					<LogoColumn
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={i}
						logos={col}
						activeIndex={col.length > 0 ? (indices[i] ?? 0) % col.length : 0}
						delayMs={
							reduced
								? 0
								: (direction === "rtl" ? columns.length - 1 - i : i) * STAGGER_MS
						}
						reduced={reduced}
					/>
				))}
			</div>
		);
	if (!pauseControl) return body;
	return (
		<div data-slot="logo-carousel-root" className={s.root()}>
			{body}
			<div className={s.footer()}>
				<Button
					variant="ghost"
					size="sm"
					aria-pressed={paused}
					className={s.pause()}
					onClick={togglePaused}
				>
					<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
						<path d={paused ? "M5 3.5v9l7-4.5z" : "M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z"} />
					</svg>
					{paused ? "Play" : "Pause"}
				</Button>
			</div>
		</div>
	);
}

const LogoColumn = memo(function LogoColumn({
	logos,
	activeIndex,
	delayMs,
	reduced,
}: {
	logos: ReactNode[];
	activeIndex: number;
	delayMs: number;
	reduced: boolean;
}) {
	const [state, setState] = useState(() => ({
		activeIndex,
		prevIndex: null as number | null,
	}));
	if (state.activeIndex !== activeIndex) {
		setState({ activeIndex, prevIndex: reduced ? null : state.activeIndex });
	}
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const style = { "--lc-delay": `${delayMs}ms` } as CSSProperties;

	return (
		<div className="relative overflow-hidden" data-slot="logo-carousel-column">
			{/* Invisible spacer: holds the column's natural height so the absolutely
			    positioned logo below doesn't collapse the grid cell. */}
			<div aria-hidden className="pointer-events-none invisible select-none">
				{logos[0]}
			</div>
			{state.prevIndex !== null ? (
				<span
					key={`exit-${state.prevIndex}`}
					className="logo-carousel-exit absolute inset-0 flex items-center justify-center"
					style={style}
					onAnimationEnd={() =>
						setState((s) =>
							s.prevIndex === state.prevIndex ? { ...s, prevIndex: null } : s,
						)
					}
				>
					{logos[state.prevIndex]}
				</span>
			) : null}
			<span
				key={`enter-${activeIndex}`}
				data-slot="logo-carousel-logo"
				className={cn(
					"absolute inset-0 flex items-center justify-center",
					mounted && "logo-carousel-enter",
				)}
				style={style}
			>
				{logos[activeIndex]}
			</span>
		</div>
	);
});
