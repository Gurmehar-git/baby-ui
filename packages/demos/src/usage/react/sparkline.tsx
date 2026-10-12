"use client";

import { Sparkline } from "@baby-ui/react";

export function Example() {
	return (
		<Sparkline
			label="Visitors"
			data={[12, 18, 15, 22, 27, 25, 31]}
			value="31k"
			change="+12%"
		/>
	);
}
