"use client";

import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	TimelineScale,
	TimelineScaleContent,
	TimelineScaleDate,
	TimelineScaleHeader,
	TimelineScaleItem,
	TimelineScaleRail,
	TimelineScaleTick,
	TimelineScaleTrack,
	TimelineScaleViewport,
	TimelineScaleYear,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { TIMELINE_EVENTS, TIMELINE_NEXT, timelineAt } from "../data/timeline";

type Props = Record<string, unknown>;
type DemoEvent = Omit<(typeof TIMELINE_EVENTS)[number], "ago" | "icon" | "tone"> & {
	at: number;
};

const DATE = new Intl.DateTimeFormat("en", {
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
});

export function TimelineDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TimelineScale>>(props);
	const [events, setEvents] = useState<DemoEvent[]>(() =>
		TIMELINE_EVENTS.toReversed().map(({ ago, icon: _, tone: __, ...event }) => ({
			...event,
			at: timelineAt(Date.now(), ago),
		})),
	);
	const [active, setActive] = useState(TIMELINE_EVENTS[0]?.id ?? "");
	const [added, setAdded] = useState(0);
	const next = TIMELINE_NEXT[added % TIMELINE_NEXT.length];
	const selected = events.find((event) => event.id === active);
	return (
		<div className="grid w-full min-w-0 gap-3">
			<TimelineScale
				aria-label="Project history"
				orientation={p.orientation ?? "horizontal"}
				variant={p.variant ?? "default"}
				value={active}
				onValueChange={setActive}
			>
				<TimelineScaleHeader>
					<span className="font-medium text-foreground">Project history</span>
					<span aria-live="polite" className="max-w-[70%] truncate text-right">
						{selected?.title}
					</span>
				</TimelineScaleHeader>
				<TimelineScaleViewport className="max-h-96">
					<TimelineScaleTrack>
						<TimelineScaleRail />
						{events.map((event) => {
							const date = new Date(event.at);
							const label = [event.actor, event.title].filter(Boolean).join(" ");
							return (
								<TimelineScaleItem
									key={event.id}
									value={event.id}
									label={label}
									description={event.detail ?? event.meta}
								>
									<TimelineScaleTick />
									<TimelineScaleYear>{date.getFullYear()}</TimelineScaleYear>
									<TimelineScaleDate dateTime={date.toISOString()}>
										{DATE.format(date)}
									</TimelineScaleDate>
									<TimelineScaleContent>
										<Card className="h-full border-0 bg-transparent py-0 shadow-none">
											<CardHeader className="px-0">
												<CardTitle>{label}</CardTitle>
												{event.detail || event.meta ? (
													<CardDescription>{event.detail ?? event.meta}</CardDescription>
												) : null}
											</CardHeader>
										</Card>
									</TimelineScaleContent>
								</TimelineScaleItem>
							);
						})}
					</TimelineScaleTrack>
				</TimelineScaleViewport>
			</TimelineScale>
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						if (!next) return;
						const id = `n${added}`;
						const at = Date.now();
						setEvents((current) => [...current, { id, at, ...next }]);
						setActive(id);
						setAdded((current) => current + 1);
					}}
				>
					Add milestone
				</Button>
			</div>
		</div>
	);
}
