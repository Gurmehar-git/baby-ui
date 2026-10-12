"use client";

import { BillingPrice, BillingToggle } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const OPTIONS = [
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly", badge: "Save 20%" },
];

export function BillingToggleDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof BillingToggle>>(props);
	const [period, setPeriod] = useState("monthly");
	const yearly = period === "yearly";
	return (
		<div className="flex flex-col items-center gap-6">
			<BillingToggle
				value={period}
				onValueChange={setPeriod}
				options={OPTIONS}
				variant={p.variant}
				size={p.size}
			/>
			<BillingPrice
				amount={yearly ? 19 : 24}
				was={yearly ? 24 : undefined}
				period={yearly ? "per month, billed yearly" : "per month"}
			/>
		</div>
	);
}
