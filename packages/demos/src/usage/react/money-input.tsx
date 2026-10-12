"use client";

import { MoneyInput } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [cents, setCents] = useState<number | null>(null);
	return (
		<MoneyInput
			label="Budget"
			value={cents}
			onValueChange={setCents}
			max={500_000}
			name="budget"
		/>
	);
}
