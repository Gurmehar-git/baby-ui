"use client";

import { Countdown } from "@baby-ui/react";

export function Example() {
	return (
		<Countdown
			target="2026-11-04T10:00:00"
			timeZone="America/Los_Angeles"
			label="Keynote starts in"
		/>
	);
}
