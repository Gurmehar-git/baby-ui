"use client";

import {
	TimelineScale,
	TimelineScaleContent,
	TimelineScaleDate,
	TimelineScaleHeader,
	TimelineScaleItem,
	TimelineScaleRail,
	TimelineScaleTick,
	TimelineScaleTrack,
	TimelineScaleViewport,
} from "@baby-ui/react";
import { useState } from "react";

const milestones = [
	{ id: "research", date: "2026-08-04", title: "Research complete" },
	{ id: "beta", date: "2026-09-18", title: "Private beta" },
	{ id: "launch", date: "2026-10-12", title: "Version 1.0" },
];

export function Example() {
	const [active, setActive] = useState("launch");
	const selected = milestones.find((item) => item.id === active);

	return (
		<TimelineScale
			aria-label="Release history"
			variant="card"
			value={active}
			onValueChange={setActive}
		>
			<TimelineScaleHeader>
				<span>Release history</span>
				<span aria-live="polite">{selected?.title}</span>
			</TimelineScaleHeader>
			<TimelineScaleViewport>
				<TimelineScaleTrack>
					<TimelineScaleRail />
					{milestones.map((item) => (
						<TimelineScaleItem key={item.id} value={item.id} label={item.title}>
							<TimelineScaleTick />
							<TimelineScaleDate dateTime={item.date}>{item.date}</TimelineScaleDate>
							<TimelineScaleContent>{item.title}</TimelineScaleContent>
						</TimelineScaleItem>
					))}
				</TimelineScaleTrack>
			</TimelineScaleViewport>
		</TimelineScale>
	);
}
