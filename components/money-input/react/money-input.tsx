"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../button/react/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group/react/input-group";
import type { InputGroupSize } from "../../input-group/react/variants";
import { cn } from "../../lib/react/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select/react/select";
import {
	caretAfter,
	cleanAmount,
	currencyInfo,
	formatMoney,
	fromMinor,
	groupAmount,
	significantBefore,
	toMinor,
} from "./money";
import { type MoneyInputVariant, moneyInput } from "./variants";

export type { MoneyInputVariant };

export type MoneyInputDetails = {
	currency: string;
	/** The amount as typed, without the symbol. */
	formatted: string;
};

export interface MoneyInputProps {
	/** Accessible name of the amount field. */
	label: string;
	/** Amount in minor units (cents for USD, yen for JPY); `null` is empty. */
	value?: number | null;
	defaultValue?: number | null;
	onValueChange?: (value: number | null, details: MoneyInputDetails) => void;
	/** ISO 4217 code, paired with `onCurrencyChange`. */
	currency?: string;
	defaultCurrency?: string;
	onCurrencyChange?: (currency: string) => void;
	/** Codes offered by the currency menu; one code hides the menu. */
	currencies?: string[];
	/** Lowest amount in minor units, checked on blur. */
	min?: number;
	/** Highest amount in minor units; typing past it is refused with a nudge. */
	max?: number;
	/** Quick-add chips in major units; an empty array hides them. */
	quickAdd?: number[];
	/** Arrow keys move by this many minor units (Shift for ten times); one major unit by default. */
	step?: number;
	/** Formatting locale, fixed by default so server and client agree. */
	locale?: string;
	/** Replaces the built-in range message. */
	error?: string;
	/** Adds a hidden input carrying the amount in minor units. */
	name?: string;
	disabled?: boolean;
	variant?: MoneyInputVariant;
	size?: InputGroupSize;
	className?: string;
}

/**
 * An amount field that groups digits as you type, keeps the caret in place, stores minor units,
 * refuses amounts past `max`, steps with the arrow keys and offers quick-add chips.
 */
export function MoneyInput({
	label,
	value,
	defaultValue = null,
	onValueChange,
	currency: currencyProp,
	defaultCurrency = "USD",
	onCurrencyChange,
	currencies,
	min,
	max,
	quickAdd = [],
	step,
	locale = "en-US",
	error: errorProp,
	name,
	disabled = false,
	variant = "default",
	size = "default",
	className,
}: MoneyInputProps) {
	const [ownCurrency, setOwnCurrency] = useState(defaultCurrency);
	const code = currencyProp ?? ownCurrency;
	const info = useMemo(() => currencyInfo(code, locale), [code, locale]);
	const [own, setOwn] = useState(defaultValue);
	const amount = value !== undefined ? value : own;
	const [focused, setFocused] = useState(false);
	const [draft, setDraft] = useState("");
	const [blurred, setBlurred] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const caret = useRef<number | null>(null);
	const messageId = useId();
	const unit = step ?? 10 ** info.digits;
	const text = focused
		? groupAmount(draft, info)
		: groupAmount(fromMinor(amount, info), info);

	useLayoutEffect(() => {
		if (caret.current === null || !inputRef.current) return;
		const at = caretAfter(inputRef.current.value, caret.current, info);
		caret.current = null;
		inputRef.current.setSelectionRange(at, at);
	});

	const emit = (next: number | null, clean: string, nextInfo = info) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next, {
			currency: nextInfo.code,
			formatted: groupAmount(clean, nextInfo),
		});
	};
	const setAmount = (next: number) => {
		const bounded = Math.max(min ?? 0, max === undefined ? next : Math.min(max, next));
		const clean = fromMinor(bounded, info);
		setDraft(clean);
		emit(bounded, clean);
	};

	const tooLow = amount !== null && min !== undefined && amount < min;
	const message =
		errorProp ??
		(blurred && tooLow && min !== undefined
			? `Enter at least ${formatMoney(min, code, locale)}.`
			: undefined);
	const s = moneyInput({ variant });
	const menu = (currencies?.length ?? 0) > 1;

	return (
		<div data-slot="money-input" className={cn(s.root(), className)}>
			<InputGroup size={size}>
				<InputGroupAddon>
					{menu ? (
						<Select
							value={code}
							onValueChange={(next) => {
								if (!next) return;
								if (currencyProp === undefined) setOwnCurrency(next);
								onCurrencyChange?.(next);
								const nextInfo = currencyInfo(next, locale);
								const clean = cleanAmount(fromMinor(amount, info), nextInfo);
								setDraft(clean);
								emit(toMinor(clean, nextInfo), clean, nextInfo);
							}}
							items={(currencies ?? []).map((c) => ({ value: c, label: c }))}
						>
							<SelectTrigger
								aria-label="Currency"
								disabled={disabled}
								className={s.currency()}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{(currencies ?? []).map((c) => (
									<SelectItem key={c} value={c}>
										{c}{" "}
										<span className="text-muted-foreground">
											{currencyInfo(c, locale).symbol}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<span className={s.symbol()}>{info.symbol}</span>
					)}
				</InputGroupAddon>
				<InputGroupInput
					ref={inputRef}
					inputMode={info.digits ? "decimal" : "numeric"}
					autoComplete="off"
					aria-label={`${label}, ${code}`}
					aria-invalid={!!message || undefined}
					aria-describedby={message ? messageId : undefined}
					placeholder={groupAmount(fromMinor(0, info), info)}
					disabled={disabled}
					value={text}
					className={s.input()}
					onFocus={() => {
						// Same text as at rest, so a select-all on focus survives.
						setDraft(amount === null ? "" : cleanAmount(fromMinor(amount, info), info));
						setFocused(true);
						setBlurred(false);
					}}
					onBlur={() => {
						setFocused(false);
						setBlurred(true);
					}}
					onKeyDown={(event) => {
						if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
						event.preventDefault();
						const delta =
							(event.key === "ArrowUp" ? 1 : -1) * unit * (event.shiftKey ? 10 : 1);
						setAmount((amount ?? 0) + delta);
					}}
					onChange={(event) => {
						const raw = event.target.value;
						const clean = cleanAmount(raw, info);
						const next = toMinor(clean, info);
						if (max !== undefined && next !== null && next > max) {
							// Restart the shake on every refusal.
							const el = event.target;
							el.dataset.nudge = "false";
							el.getBoundingClientRect();
							el.dataset.nudge = "true";
							return;
						}
						caret.current = significantBefore(
							raw,
							event.target.selectionStart ?? raw.length,
							info,
						);
						setDraft(clean);
						emit(next, clean);
					}}
				/>
				<InputGroupAddon align="inline-end">
					<span className={s.symbol()}>{code}</span>
				</InputGroupAddon>
			</InputGroup>
			{quickAdd.length > 0 && (
				<div className={s.chips()}>
					{quickAdd.map((major) => (
						<Button
							key={major}
							type="button"
							variant="outline"
							size="xs"
							disabled={disabled}
							onClick={() => setAmount((amount ?? 0) + major * 10 ** info.digits)}
						>
							+{info.symbol}
							{major.toLocaleString(locale)}
						</Button>
					))}
				</div>
			)}
			{name && <input type="hidden" name={name} value={amount ?? ""} />}
			{message && (
				<span id={messageId} role="alert" data-tone="error" className={s.message()}>
					{message}
				</span>
			)}
		</div>
	);
}
