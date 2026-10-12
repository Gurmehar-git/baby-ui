"use client";

import { formatMoney, MoneyInput } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function MoneyInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MoneyInput>>(props);
	const [amount, setAmount] = useState<number | null>(2500);
	const [currency, setCurrency] = useState("USD");
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<MoneyInput
				label={p.label || "Amount"}
				value={amount}
				onValueChange={setAmount}
				currency={currency}
				onCurrencyChange={setCurrency}
				currencies={["USD", "EUR", "GBP", "JPY"]}
				min={100}
				max={1_000_000}
				quickAdd={[10, 50, 100]}
				variant={p.variant}
				size={p.size}
			/>
			<p className="h-4 text-muted-foreground text-xs tabular-nums">
				{amount === null
					? "Empty"
					: `${amount} minor units, ${formatMoney(amount, currency)}`}
			</p>
		</div>
	);
}
