"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "../button/button";
import { Countdown } from "../countdown/countdown";
import { cn } from "../lib/cn";
import {
	type AnnouncementAction,
	clearAnnouncementDismissal,
	createRotation,
	faceState,
	readDismissed,
	rememberDismissed,
} from "./rotation";
import { type AnnouncementBarVariant, announcementBar } from "./variants";

export type { AnnouncementAction, AnnouncementBarVariant };
export { clearAnnouncementDismissal };

export type Announcement = {
	/** Stable id, reported to callbacks. */
	id: string;
	message: ReactNode;
	action?: AnnouncementAction;
	/** Counts down to a moment inside the message, such as the end of a sale. */
	countdown?: { to: Date | string | number; label?: string };
};

export interface AnnouncementBarProps {
	messages: Announcement[];
	/** Remembers dismissal under this id; change it to show a new campaign again. */
	id?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Index of the visible message. */
	index?: number;
	onIndexChange?: (index: number) => void;
	/** Milliseconds each message stays. */
	interval?: number;
	/** Rotates while not hovered, focused, hidden or under reduced motion. */
	autoPlay?: boolean;
	/** Previous, next and a pause ring when there are several messages. */
	controls?: boolean;
	dismissible?: boolean;
	onAction?: (announcement: Announcement) => void;
	onCountdownEnd?: (announcement: Announcement) => void;
	/** Accessible name of the region. */
	label?: string;
	variant?: AnnouncementBarVariant;
	className?: string;
}

const Glyph = ({ d }: { d: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		className="size-4"
	>
		<path d={d} />
	</svg>
);

/** A slim bar for the top of a page: rotating messages with a call to action, a countdown and a smooth dismiss. */
export function AnnouncementBar({
	messages,
	id,
	open,
	onOpenChange,
	index,
	onIndexChange,
	interval = 6000,
	autoPlay = true,
	controls = false,
	dismissible = true,
	onAction,
	onCountdownEnd,
	label = "Announcements",
	variant = "default",
	className,
}: AnnouncementBarProps) {
	const uid = useId();
	const total = messages.length;
	const [ownOpen, setOwnOpen] = useState(true);
	const [remembered, setRemembered] = useState(false);
	useLayoutEffect(() => setRemembered(readDismissed(id)), [id]);
	const isOpen = open ?? (ownOpen && !remembered);
	const [ownIndex, setOwnIndex] = useState(0);
	const current = total ? (((index ?? ownIndex) % total) + total) % total : 0;
	const [previous, setPrevious] = useState<number | null>(null);
	const [dir, setDir] = useState(1);
	const [paused, setPaused] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [reduced, setReduced] = useState(false);
	const ringRef = useRef<SVGCircleElement>(null);
	const rotation = useRef<ReturnType<typeof createRotation> | null>(null);
	const goRef = useRef<(step: number) => void>(() => {});

	const go = (step: number) => {
		if (total < 2) return;
		const next = (((current + step) % total) + total) % total;
		setDir(step > 0 ? 1 : -1);
		setPrevious(current);
		if (index === undefined) setOwnIndex(next);
		onIndexChange?.(next);
	};
	goRef.current = go;
	const dismiss = () => {
		rememberDismissed(id);
		if (open === undefined) setOwnOpen(false);
		onOpenChange?.(false);
	};

	useEffect(() => {
		const read = () => setHidden(document.visibilityState === "hidden");
		const motion = matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(motion.matches);
		document.addEventListener("visibilitychange", read);
		return () => document.removeEventListener("visibilitychange", read);
	}, []);
	useEffect(() => {
		rotation.current = createRotation(ringRef.current, interval, () => goRef.current(1));
		return () => rotation.current?.destroy();
	}, [interval]);
	const rotating = autoPlay && !reduced && total > 1;
	const running = rotating && isOpen && !paused && !hovered && !focused && !hidden;
	// biome-ignore lint/correctness/useExhaustiveDependencies: a new message restarts the clock
	useEffect(() => rotation.current?.reset(), [current]);
	useEffect(() => rotation.current?.setRunning(running), [running]);

	const s = announcementBar({ variant });
	const navigable = controls && total > 1;
	const count = (navigable ? 2 + (rotating ? 1 : 0) : 0) + (dismissible ? 1 : 0);
	const side = `calc(${count} * 2rem + ${Math.max(count - 1, 0)} * 0.125rem)`;

	return (
		<section
			aria-label={label}
			aria-roledescription={total > 1 ? "carousel" : undefined}
			data-slot="announcement-bar"
			data-open={isOpen}
			inert={!isOpen}
			className={cn(s.collapse(), className)}
			onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={(event) => {
				if (
					!(
						event.relatedTarget instanceof Node &&
						event.currentTarget.contains(event.relatedTarget)
					)
				)
					setFocused(false);
			}}
		>
			<div className={s.clip()}>
				<div
					className={s.bar()}
					style={{ "--ab-side": side, "--ab-dir": dir } as CSSProperties}
				>
					<div aria-hidden />
					<div
						id={`${uid}-slides`}
						aria-live={running ? "off" : "polite"}
						className={s.viewport()}
					>
						{messages.map((announcement, position) => {
							const state = faceState(position, current, previous);
							const { action, countdown } = announcement;
							const select = () => {
								action?.onClick?.();
								onAction?.(announcement);
							};
							const arrow = <Glyph d="M5 12h14m-6-6 6 6-6 6" />;
							return (
								// biome-ignore lint/a11y/useSemanticElements: a carousel slide is a group, not a form fieldset
								<div
									key={announcement.id}
									data-face={state}
									inert={state !== "shown"}
									aria-hidden={state !== "shown" || undefined}
									role="group"
									aria-roledescription={total > 1 ? "slide" : undefined}
									aria-label={total > 1 ? `${position + 1} of ${total}` : undefined}
									className={s.face()}
								>
									<p className={s.message()}>
										<span className="min-w-0">{announcement.message}</span>
										{countdown && (
											<span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
												{countdown.label && (
													<span className={s.countdownLabel()}>{countdown.label}</span>
												)}
												<Countdown
													variant="inline"
													target={countdown.to}
													units={["days", "hours", "minutes", "seconds"]}
													label={countdown.label ?? "Time remaining"}
													onComplete={() => onCountdownEnd?.(announcement)}
												/>
											</span>
										)}
										{action &&
											(action.href ? (
												<a href={action.href} className={s.cta()} onClick={select}>
													{action.label}
													{arrow}
												</a>
											) : (
												<button type="button" className={s.cta()} onClick={select}>
													{action.label}
													{arrow}
												</button>
											))}
									</p>
								</div>
							);
						})}
					</div>
					<div className={s.controls()}>
						{navigable && (
							<>
								<Button
									size="icon-sm"
									variant="ghost"
									aria-label="Previous announcement"
									aria-controls={`${uid}-slides`}
									className={s.icon()}
									onClick={() => go(-1)}
								>
									<Glyph d="m18 15-6-6-6 6" />
								</Button>
								{rotating && (
									<Button
										size="icon-sm"
										variant="ghost"
										aria-label={paused ? "Resume announcements" : "Pause announcements"}
										aria-pressed={paused}
										className={cn(s.icon(), "relative")}
										onClick={() => setPaused(!paused)}
									>
										<svg viewBox="0 0 20 20" aria-hidden className={s.ring()}>
											<circle cx="10" cy="10" r="8" className={s.ringTrack()} />
											<circle
												ref={ringRef}
												cx="10"
												cy="10"
												r="8"
												pathLength={1}
												className={s.ringFill()}
											/>
										</svg>
										<svg
											viewBox="0 0 24 24"
											aria-hidden
											className="absolute size-2.5 fill-current"
										>
											<path d={paused ? "M7 4v16l13-8Z" : "M6 4h4v16H6zM14 4h4v16h-4z"} />
										</svg>
									</Button>
								)}
								<Button
									size="icon-sm"
									variant="ghost"
									aria-label="Next announcement"
									aria-controls={`${uid}-slides`}
									className={s.icon()}
									onClick={() => go(1)}
								>
									<Glyph d="m6 9 6 6 6-6" />
								</Button>
							</>
						)}
						{dismissible && (
							<Button
								size="icon-sm"
								variant="ghost"
								aria-label="Dismiss"
								className={s.icon()}
								onClick={dismiss}
							>
								<Glyph d="M18 6 6 18M6 6l12 12" />
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
