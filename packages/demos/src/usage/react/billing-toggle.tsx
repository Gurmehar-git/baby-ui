"use client";

import { BillingPrice, BillingToggle } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [period, setPeriod] = useState("monthly");
	return (
		<>
			<BillingToggle value={period} onValueChange={setPeriod} />
			<BillingPrice amount={period === "yearly" ? 19 : 24} period="per month" />
		</>
	);
}
