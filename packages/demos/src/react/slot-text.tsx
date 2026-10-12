"use client";

import { Button, SlotText } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const PRICES = [12480, 9875, 128430, 1004, 56210];
const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export function SlotTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SlotText>>(props);
	const [step, setStep] = useState(0);
	return (
		<div className="flex flex-col items-center gap-4">
			<SlotText
				value={PRICES[step % PRICES.length] ?? 0}
				format={money}
				variant={p.variant}
				size={p.size ?? "default"}
				duration={p.duration}
				spins={p.spins}
				className="font-semibold"
			/>
			<Button variant="outline" size="sm" onClick={() => setStep((value) => value + 1)}>
				Next price
			</Button>
		</div>
	);
}
