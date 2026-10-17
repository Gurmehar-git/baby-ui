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
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar/react/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../collapsible/react/collapsible";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { SlotText } from "../../slot-text/react/slot-text";
import {
	addedEvents,
	announceAdded,
	createTimelineReveal,
	groupTimeline,
	moveTimelineFocus,
	type TimelineEventBase,
	type TimelineTone,
} from "../feed";
import { type TimelineVariant, timeline } from "../variants";

export type { TimelineTone, TimelineVariant };

export type TimelineEvent = TimelineEventBase & {
	/** Revealed in place when the row expands; rows without it are not interactive. */
	detail?: ReactNode;
	/** Icon for a system event, used when there is no avatar. */
	icon?: ReactNode;
};

export interface TimelineProps {
	/** Updates in any order; the newest shows first. */
	events: TimelineEvent[];
	/** Reference time in epoch ms for relative labels and day groups; pass a ticking clock to refresh them. */
	now: number;
	/** Accessible name for the feed. */
	label: string;
	/** Time zone for day groups and clock times; fixed by default so server and client agree. */
	timeZone?: string;
	locale?: string;
	/** Height of the scrolling area; without it the feed grows with the page. */
	maxHeight?: number | string;
	/** Scroll back to the top when a new update arrives while scrolled down. */
	scrollToNew?: boolean;
	/** Ids of expanded rows. */
	expanded?: string[];
	defaultExpanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	variant?: TimelineVariant;
	className?: string;
}

/**
 * A vertical activity feed grouped by day. Day labels stay pinned, the line draws as rows scroll
 * into view, rows expand in place, and new updates slide in at the top.
 */
export function Timeline({
	events,
	now,
	label,
	timeZone = "UTC",
	locale = "en-US",
	maxHeight,
	scrollToNew = true,
	expanded,
	defaultExpanded = [],
	onExpandedChange,
	headingLevel = 3,
	variant = "default",
	className,
}: TimelineProps) {
	const id = useId();
	const rootRef = useRef<HTMLElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createTimelineReveal> | null>(null);
	const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
	const open = expanded ?? ownExpanded;
	const ids = events.map((event) => event.id).join("|");
	const [known, setKnown] = useState(() => ({
		ids,
		set: new Set(events.map((event) => event.id)),
		fresh: new Set<string>(),
		announcement: "",
	}));
	if (known.ids !== ids) {
		const added = addedEvents(known.set, events);
		setKnown({
			ids,
			set: new Set(events.map((event) => event.id)),
			fresh: new Set([...known.fresh, ...added.map((event) => event.id)]),
			announcement: announceAdded(added) || known.announcement,
		});
	}
	const [initialDays] = useState(
		() => new Set(groupTimeline(events, now, timeZone, locale).map((g) => g.day)),
	);
	const groups = groupTimeline(events, now, timeZone, locale);
	const newest = groups[0]?.rows[0]?.event.id;

	useEffect(() => {
		const root = rootRef.current;
		const scroller = scrollerRef.current;
		if (!root || !scroller) return;
		engine.current = createTimelineReveal(root, scroller);
		return () => engine.current?.destroy();
	}, []);
	useLayoutEffect(() => engine.current?.scan());
	useEffect(() => {
		const scroller = scrollerRef.current;
		if (!scrollToNew || !newest || !scroller || scroller.scrollTop < 1) return;
		const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
		scroller.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
	}, [newest, scrollToNew]);

	const toggle = (rowId: string, next: boolean) => {
		const list = next ? [...open, rowId] : open.filter((item) => item !== rowId);
		if (expanded === undefined) setOwnExpanded(list);
		onExpandedChange?.(list);
	};
	const s = timeline({ variant });
	const Heading = `h${headingLevel}` as const;
	const scrolls = maxHeight !== undefined;
	const height = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

	return (
		<section
			ref={rootRef}
			aria-label={label}
			data-slot="timeline"
			className={cn(s.root(), className)}
		>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys move focus between the row buttons inside */}
			<div
				ref={scrollerRef}
				className={s.scroller()}
				data-scrolls={scrolls || undefined}
				style={scrolls ? ({ "--tl-height": height } as CSSProperties) : undefined}
				onKeyDown={(event) =>
					rootRef.current && moveTimelineFocus(rootRef.current, event.nativeEvent)
				}
			>
				<div>
					{groups.map((group) => {
						const headingId = `${id}-${group.day}`;
						return (
							<section
								key={group.day}
								aria-labelledby={headingId}
								data-fresh={!initialDays.has(group.day) || undefined}
								className={s.group()}
							>
								<div className={s.groupInner()}>
									<Heading id={headingId} className={s.day()}>
										<span>{group.label}</span>
										<span className={s.count()} aria-hidden>
											<RollingDigits value={group.rows.length} /> {group.count}
										</span>
										<span className="sr-only">{`, ${group.rows.length} ${group.count}`}</span>
									</Heading>
									<ol className={s.list()}>
										{group.rows.map((row) => {
											const { event } = row;
											const tone = event.tone ?? "neutral";
											const body = (
												<>
													<span className={s.text()}>
														<span className={s.title()}>
															{event.actor && (
																<span className={s.actor()}>{event.actor} </span>
															)}
															{event.title}
														</span>
														{event.meta && <span className={s.meta()}>{event.meta}</span>}
													</span>
													<time
														dateTime={row.iso}
														title={row.timeFull}
														className={s.time()}
													>
														<span aria-hidden>
															<SlotText value={row.timeLabel} spins={0} duration={0.4} />
														</span>
														<span className="sr-only">{row.timeFull}</span>
													</time>
												</>
											);
											return (
												<li
													key={event.id}
													data-timeline-row=""
													data-fresh={known.fresh.has(event.id) || undefined}
													className={s.item()}
												>
													<div className={s.itemInner()}>
														{event.avatar ? (
															<Avatar
																className={cn(s.marker(), "size-(--tl-marker)")}
																aria-hidden
															>
																<AvatarImage src={event.avatar} alt="" />
																<AvatarFallback>
																	{event.actor?.slice(0, 1)}
																</AvatarFallback>
															</Avatar>
														) : (
															<span
																aria-hidden
																data-tone={tone}
																className={cn(s.marker(), s.node())}
															>
																{event.icon}
															</span>
														)}
														{!row.last && <span aria-hidden className={s.segment()} />}
														{event.detail ? (
															<Collapsible
																open={open.includes(event.id)}
																onOpenChange={(next) => toggle(event.id, next)}
															>
																<CollapsibleTrigger
																	data-timeline-trigger=""
																	className={cn(s.trigger(), s.expandable())}
																>
																	{body}
																</CollapsibleTrigger>
																<CollapsibleContent className={s.detail()}>
																	{event.detail}
																</CollapsibleContent>
															</Collapsible>
														) : (
															<div className={s.trigger()}>{body}</div>
														)}
													</div>
												</li>
											);
										})}
									</ol>
								</div>
							</section>
						);
					})}
				</div>
			</div>
			<span className="sr-only" role="status">
				{known.announcement}
			</span>
		</section>
	);
}
