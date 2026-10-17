"use client";

import {
	type HTMLAttributes,
	type KeyboardEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../tooltip/react/tooltip";
import {
	BAR_WIDTH,
	formatTimestamp,
	nextIndex,
	STATUS_ICON,
	STATUS_MONITOR_LABELS,
	type StatusMonitorItem,
	type StatusMonitorLabels,
	type StatusMonitorUnit,
	slotsForWidth,
	timelineWidth,
	uptimePercent,
	visibleItems,
} from "../timeline";
import {
	type StatusMonitorSize,
	type StatusMonitorStatus,
	statusMonitor,
	statusTone,
} from "../variants";

export type {
	StatusMonitorItem,
	StatusMonitorLabels,
	StatusMonitorSize,
	StatusMonitorStatus,
	StatusMonitorUnit,
};

export interface StatusMonitorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	/** One entry per period, oldest first; the newest 90 are kept. */
	statuses: StatusMonitorItem[];
	unit?: StatusMonitorUnit;
	title?: string;
	showUptime?: boolean;
	size?: StatusMonitorSize;
	labels?: Partial<StatusMonitorLabels>;
	/** Formats Date timestamps; the runtime's locale when omitted. */
	locale?: string;
}

function StatusIcon({ status }: { status: StatusMonitorStatus }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className="size-4 shrink-0"
		>
			{STATUS_ICON[status].map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

export function StatusMonitor({
	statuses,
	unit = "days",
	title,
	showUptime = true,
	size = "default",
	labels,
	locale,
	className,
	...props
}: StatusMonitorProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const barsRef = useRef<HTMLDivElement>(null);
	const [slots, setSlots] = useState(30);
	const [focusIndex, setFocusIndex] = useState<number | null>(null);
	const l = { ...STATUS_MONITOR_LABELS, ...labels };
	const s = statusMonitor({ size });

	const items = useMemo(() => visibleItems(statuses, slots), [statuses, slots]);
	const uptime = useMemo(() => uptimePercent(statuses), [statuses]);
	const active = Math.min(focusIndex ?? items.length - 1, items.length - 1);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const measure = () => setSlots(slotsForWidth(root.getBoundingClientRect().width));
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(root);
		return () => observer.disconnect();
	}, []);

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const next = nextIndex(event.key, active, items.length);
		if (next === null) return;
		event.preventDefault();
		setFocusIndex(next);
		barsRef.current?.querySelectorAll<HTMLElement>("[data-bar]")[next]?.focus();
	}

	return (
		<div
			ref={rootRef}
			data-slot="status-monitor"
			className={cn(s.root(), className)}
			{...props}
		>
			<div className={s.inner()} style={{ width: timelineWidth(slots) }}>
				<div className={s.header()}>
					<span className={s.title()}>{title ?? l.title}</span>
					{showUptime ? (
						<span className={s.uptime()}>
							{uptime}% {l.uptime}
						</span>
					) : null}
				</div>
				<TooltipProvider>
					<div
						ref={barsRef}
						role="toolbar"
						tabIndex={-1}
						aria-label={title ?? l.title}
						onKeyDown={onKeyDown}
						className={s.bars()}
						style={{ gridTemplateColumns: `repeat(${slots}, ${BAR_WIDTH}px)` }}
					>
						{items.map((item, i) => {
							const tone = statusTone({ status: item.status });
							const when = formatTimestamp(item.timestamp, locale);
							const name = l[item.status];
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								<Tooltip key={i} delay={150}>
									<TooltipTrigger
										data-bar=""
										tabIndex={i === active ? 0 : -1}
										aria-label={when ? `${when}: ${name}` : name}
										onFocus={() => setFocusIndex(i)}
										className={cn(s.bar(), tone.bar())}
									/>
									<TooltipContent side="bottom" sideOffset={8}>
										<div className={s.tip()}>
											<div className={cn(s.tipHead(), tone.text())}>
												<StatusIcon status={item.status} />
												{name}
											</div>
											{when ? <div className={s.tipMeta()}>{when}</div> : null}
											<div className={s.tipInfo()}>
												{item.info ?? l[`${item.status}Info`]}
											</div>
										</div>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</TooltipProvider>
				<div className={s.footer()}>
					<span>
						{slots} {l[unit]} {l.ago}
					</span>
					<span>{l.current}</span>
				</div>
			</div>
		</div>
	);
}
