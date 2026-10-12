"use client";

import { SlotText } from "@baby-ui/react";

export function Example({ revenue }: { revenue: number }) {
	return (
		<SlotText value={revenue} format={(value) => `$${value.toLocaleString("en-US")}`} />
	);
}
