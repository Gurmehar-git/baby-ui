"use client";

import { Badge } from "../../badge/react/badge";
import { LetterMorph } from "../../letter-morph/react/letter-morph";
import { cn } from "../../lib/cn";
import { SlotText } from "../../slot-text/react/slot-text";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import type {
	ToggleGroupSize,
	ToggleGroupVariant,
} from "../../toggle-group/react/variants";
import { billingToggle } from "../variants";

export type BillingToggleOption = {
	value: string;
	label: string;
	/** A short note beside the label, e.g. "Save 20%". */
	badge?: string;
};

const DEFAULT_OPTIONS: BillingToggleOption[] = [
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly" },
];

export interface BillingToggleProps {
	value: string;
	onValueChange: (value: string) => void;
	options?: BillingToggleOption[];
	/** Accessible name of the group. */
	label?: string;
	variant?: ToggleGroupVariant;
	size?: ToggleGroupSize;
	className?: string;
}

/** A billing period switch built on ToggleGroup, with an optional savings badge on an option. */
export function BillingToggle({
	value,
	onValueChange,
	options = DEFAULT_OPTIONS,
	label = "Billing period",
	variant = "default",
	size = "default",
	className,
}: BillingToggleProps) {
	const s = billingToggle();
	return (
		<ToggleGroup
			type="single"
			label={label}
			value={value}
			// A single-select group can be pressed off; billing always has a period.
			onValueChange={(next) => {
				if (typeof next === "string" && next) onValueChange(next);
			}}
			variant={variant}
			size={size}
			data-slot="billing-toggle"
			className={className}
		>
			{options.map((option) => (
				<ToggleGroupItem key={option.value} value={option.value} className={s.item()}>
					{option.label}
					{option.badge && (
						<Badge variant="success" size="sm" className={s.badge()}>
							{option.badge}
						</Badge>
					)}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export interface BillingPriceProps {
	/** Price in major units, e.g. 24 for $24. */
	amount: number;
	currency?: string;
	/** After the price, e.g. "per month"; morphs in place when it changes. */
	period?: string;
	/** Previous price, struck through when higher than `amount`. */
	was?: number;
	/** Decimal places shown. */
	decimals?: number;
	locale?: string;
	className?: string;
}

/** A price whose digits roll to the new amount and whose period morphs, for plan cards. */
export function BillingPrice({
	amount,
	currency = "USD",
	period,
	was,
	decimals = 0,
	locale = "en-US",
	className,
}: BillingPriceProps) {
	const s = billingToggle();
	const format = (value: number) =>
		new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}).format(value);
	return (
		<span data-slot="billing-price" className={cn(s.price(), className)}>
			<SlotText
				value={amount}
				format={format}
				spins={0}
				className={s.amount()}
				announce
			/>
			{was !== undefined && was > amount && (
				<span className={s.was()}>{format(was)}</span>
			)}
			{period && <LetterMorph text={period} className={s.period()} />}
		</span>
	);
}
