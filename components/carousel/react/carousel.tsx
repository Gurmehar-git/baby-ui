"use client";

import {
	Children,
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { createCarouselTrack } from "../track";
import {
	type CarouselControls,
	type CarouselSize,
	type CarouselVariant,
	carousel,
} from "../variants";

export type { CarouselControls, CarouselSize, CarouselVariant };

export interface CarouselProps {
	/** Names the carousel for assistive technology, e.g. "From the Harbour suites". */
	label: string;
	/** One CarouselItem per slide. */
	children: ReactNode;
	/** Controlled active slide; pair with `onIndexChange`. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** `default` scales and dims neighbours, `flat` is a plain row, `inset` floats the controls over the slide. */
	variant?: CarouselVariant;
	/** Slide width preset; `slideSize` overrides it. */
	size?: CarouselSize;
	/** Which controls render; `full` adds play when `interval` is set. */
	controls?: CarouselControls;
	/** Arrows and keys wrap from the last slide to the first. */
	loop?: boolean;
	/** Width of one slide as a CSS length; `cqw` is a share of the carousel width. */
	slideSize?: string;
	/** Names each slide and its indicator. Defaults to "2 of 5". */
	slideLabel?: (index: number, count: number) => string;
	/** Milliseconds per slide. Adds a play control; rotation pauses on hover, focus and drag, and never runs under reduced motion. */
	interval?: number;
	/** Starts rotating on mount. Off by default, so motion begins with the viewer. */
	autoplay?: boolean;
	className?: string;
}

type SlideContext = { index: number; active: boolean; label: string; id: string };
const SlideCtx = createContext<SlideContext | null>(null);

const defaultSlideLabel = (index: number, count: number) => `${index + 1} of ${count}`;
const subscribeNothing = () => () => {};
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
	const query = matchMedia(reducedQuery);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
};

/** A slide; inert unless it is the active one, so focus never lands off-screen. */
export function CarouselItem({ className, children, ...props }: ComponentProps<"div">) {
	const slide = useContext(SlideCtx);
	if (!slide) throw new Error("CarouselItem must be a child of Carousel");
	const { slide: slideClass } = carousel();
	return (
		<div
			{...props}
			id={slide.id}
			data-slot="carousel-item"
			data-carousel-slide=""
			role="tabpanel"
			aria-roledescription="slide"
			aria-label={slide.label}
			inert={!slide.active}
			className={cn(slideClass(), className)}
		>
			{children}
		</div>
	);
}

function PlayIcon({ on, className }: { on: boolean; className: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="currentColor"
			aria-hidden
			data-on={on}
			className={className}
		>
			<path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" />
		</svg>
	);
}

function PauseIcon({ on, className }: { on: boolean; className: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="currentColor"
			aria-hidden
			data-on={on}
			className={className}
		>
			<rect x="3.5" y="3" width="3" height="10" rx="0.8" />
			<rect x="9.5" y="3" width="3" height="10" rx="0.8" />
		</svg>
	);
}

/**
 * A centred row of slides browsed by drag, flick, trackpad swipe, arrow keys or the controls.
 * Neighbours shrink and dim with distance; the indicator stretches into a pill that travels with them.
 */
export function Carousel({
	label,
	children,
	index: controlledIndex,
	defaultIndex = 0,
	onIndexChange,
	variant = "default",
	size = "default",
	controls = "full",
	loop = false,
	slideSize,
	slideLabel = defaultSlideLabel,
	interval,
	autoplay = false,
	className,
}: CarouselProps) {
	const slides = Children.toArray(children);
	const count = slides.length;
	const last = Math.max(0, count - 1);
	const id = useId();
	const hydrated = useSyncExternalStore(
		subscribeNothing,
		() => true,
		() => false,
	);
	const reduced = useSyncExternalStore(
		subscribeReduced,
		() => matchMedia(reducedQuery).matches,
		() => false,
	);
	const clampIndex = (i: number) => Math.min(last, Math.max(0, i));
	const [ownIndex, setOwnIndex] = useState(() => clampIndex(defaultIndex));
	const index = clampIndex(controlledIndex ?? ownIndex);
	const [startIndex] = useState(index);
	const [playing, setPlaying] = useState(autoplay);
	const [hovered, setHovered] = useState(false);
	const [focusPaused, setFocusPaused] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [inView, setInView] = useState(true);
	const [pageVisible, setPageVisible] = useState(true);
	const [announcement, setAnnouncement] = useState("");
	const rootRef = useRef<HTMLElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createCarouselTrack> | null>(null);
	const latest = useRef({ controlledIndex, onIndexChange, slideLabel, count });
	latest.current = { controlledIndex, onIndexChange, slideLabel, count };

	const canRotate = Boolean(interval) && count > 1 && !(hydrated && reduced);
	const running =
		canRotate &&
		playing &&
		!hovered &&
		!focusPaused &&
		!dragging &&
		inView &&
		pageVisible;
	const options = {
		running,
		interval: interval ?? 0,
		onSelect: (next: number, announce: boolean) => {
			const { controlledIndex, onIndexChange, slideLabel, count } = latest.current;
			if (controlledIndex === undefined) setOwnIndex(next);
			onIndexChange?.(next);
			if (announce) setAnnouncement(slideLabel(next, count));
		},
		onDragChange: setDragging,
		flat: variant === "flat",
		loop,
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	// biome-ignore lint/correctness/useExhaustiveDependencies: the engine is created once; options flow in through update.
	useEffect(() => {
		const root = rootRef.current;
		const viewport = viewportRef.current;
		const track = trackRef.current;
		if (!root || !viewport || !track) return;
		engine.current = createCarouselTrack(
			root,
			viewport,
			track,
			index,
			optionsRef.current,
		);
		return () => {
			engine.current?.destroy();
			engine.current = null;
		};
	}, []);

	useEffect(() => {
		engine.current?.update(options);
	});

	useEffect(() => {
		engine.current?.go(index);
	}, [index]);

	useEffect(() => {
		const root = rootRef.current;
		if (!interval || !root) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry) setInView(entry.isIntersecting);
		});
		observer.observe(root);
		const onVisibility = () => setPageVisible(document.visibilityState !== "hidden");
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [interval]);

	const toggleRotation = () => {
		if (!playing) return setPlaying(true);
		setPlaying(false);
		engine.current?.resetDrain();
	};

	// Arrows wrap with `loop`; otherwise they stop at either end.
	const step = (delta: number) => {
		const next = index + delta;
		if (loop) engine.current?.go((next + count) % count);
		else if (next >= 0 && next <= last) engine.current?.go(next);
	};

	const s = carousel({ variant, size });
	const rootStyle = {
		"--carousel-start": startIndex,
		...(slideSize ? { "--carousel-slide": slideSize } : {}),
	} as CSSProperties;

	return (
		<section
			ref={rootRef}
			data-slot="carousel"
			aria-roledescription="carousel"
			aria-label={label}
			className={cn(s.root(), className)}
			style={rootStyle}
			onFocus={(event) =>
				setFocusPaused(
					!event.target.closest("[data-carousel-play]") &&
						event.target.matches(":focus-visible"),
				)
			}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null))
					setFocusPaused(false);
			}}
		>
			{/* biome-ignore lint/a11y/useSemanticElements: a fieldset would imply form controls; this groups slides. */}
			<div
				ref={viewportRef}
				role="group"
				aria-label="Slides"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: the slide group takes focus so arrow keys move the track.
				tabIndex={0}
				data-dragging={dragging || undefined}
				className={s.viewport()}
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse") setHovered(true);
				}}
				onPointerLeave={() => setHovered(false)}
			>
				<div ref={trackRef} className={s.track()}>
					{slides.map((slide, i) => (
						<SlideCtx.Provider
							// biome-ignore lint/suspicious/noArrayIndexKey: slides are positional; their order is the identity.
							key={i}
							value={{
								index: i,
								active: i === index,
								label: slideLabel(i, count),
								id: `${id}-slide-${i}`,
							}}
						>
							{slide}
						</SlideCtx.Provider>
					))}
				</div>
			</div>
			{count > 1 ? (
				<div className={s.controls()}>
					{canRotate && controls === "full" ? (
						<Button
							data-carousel-play=""
							variant="outline"
							size="icon-sm"
							className={cn(s.control(), s.play())}
							aria-label={playing ? "Pause slide rotation" : "Start slide rotation"}
							onClick={toggleRotation}
						>
							<span className={s.iconStack()}>
								<PauseIcon on={playing} className={s.icon()} />
								<PlayIcon on={!playing} className={s.icon()} />
							</span>
						</Button>
					) : null}
					<div
						className={cn(
							s.tabs(),
							(controls === "arrows" || controls === "none") && "sr-only",
						)}
						role="tablist"
						aria-label="Choose a slide"
					>
						{slides.map((_, i) => (
							<button
								// biome-ignore lint/suspicious/noArrayIndexKey: one indicator per slide position.
								key={i}
								type="button"
								role="tab"
								data-carousel-dot=""
								aria-selected={i === index}
								aria-controls={`${id}-slide-${i}`}
								aria-label={slideLabel(i, count)}
								tabIndex={i === index ? 0 : -1}
								className={s.tab()}
								style={{ "--emphasis": i === startIndex ? 1 : 0 } as CSSProperties}
								onClick={() => engine.current?.go(i)}
							>
								<span className={s.dot()} aria-hidden>
									<span className={s.dotFill()} />
									<span className={s.dotDrain()} />
								</span>
							</button>
						))}
					</div>
					{controls === "full" || controls === "arrows" ? (
						<div className={s.arrows()}>
							<Button
								variant="outline"
								size="icon-sm"
								className={s.control()}
								aria-label="Previous slide"
								aria-disabled={!loop && index === 0}
								onClick={() => step(-1)}
							>
								<svg viewBox="0 0 16 16" fill="none" aria-hidden>
									<path
										d="M10 3.5 5.5 8l4.5 4.5"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								className={s.control()}
								aria-label="Next slide"
								aria-disabled={!loop && index === last}
								onClick={() => step(1)}
							>
								<svg viewBox="0 0 16 16" fill="none" aria-hidden>
									<path
										d="m6 3.5 4.5 4.5L6 12.5"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Button>
						</div>
					) : null}
				</div>
			) : null}
			<span className="sr-only" aria-live="polite" aria-atomic="true">
				{announcement}
			</span>
		</section>
	);
}
