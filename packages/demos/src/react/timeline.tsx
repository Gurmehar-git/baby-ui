"use client";

import { Button, Timeline, type TimelineEvent } from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { controlProps } from "../data/preview-props";
import { TIMELINE_EVENTS, TIMELINE_NEXT, timelineAt } from "../data/timeline";

type Props = Record<string, unknown>;

const PATHS = {
	rocket:
		"M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2m4-3-3-3m3 3 6.5-6.5a4.9 4.9 0 0 0 1.4-4.4 4.9 4.9 0 0 0-4.4 1.4L9 12m3 3v4l3-2v-4m-6-1H5l2-3h4",
	alert:
		"M12 8v5m0 3h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
	check: "m5 12 5 5 9-10",
};
const Glyph = ({ d }: { d: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
	>
		<path d={d} />
	</svg>
);

export function TimelineDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Timeline>>(props);
	const [now, setNow] = useState(() => Date.now());
	const [events, setEvents] = useState<TimelineEvent[]>(() =>
		TIMELINE_EVENTS.map(({ ago, icon, ...event }) => ({
			...event,
			at: timelineAt(now, ago),
			icon: icon ? <Glyph d={PATHS[icon]} /> : undefined,
		})),
	);
	const [added, setAdded] = useState(0);
	// The demo's clock ticks so relative times stay fresh; the component never runs its own timer.
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 30_000);
		return () => clearInterval(timer);
	}, []);
	const next = TIMELINE_NEXT[added % TIMELINE_NEXT.length];
	return (
		<div className="grid w-full max-w-lg gap-3">
			<Timeline
				label="Project activity"
				events={events}
				now={now}
				maxHeight={360}
				variant={p.variant}
				timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
			/>
			<Button
				variant="outline"
				size="sm"
				className="justify-self-start"
				onClick={() => {
					const at = Date.now();
					setNow(at);
					setAdded(added + 1);
					if (next) setEvents([{ id: `n${added}`, at, ...next }, ...events]);
				}}
			>
				Add update
			</Button>
		</div>
	);
}
