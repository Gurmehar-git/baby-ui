"use client";

import { NumberField } from "@base-ui/react/number-field";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn";
import {
	LIMIT_HINT_MS,
	limitHit,
	limitMessage,
	type NumberLimitEdge,
	nudge,
} from "./limit";
import { type NumberInputSize, type NumberInputVariant, numberInput } from "./variants";

export type { NumberInputSize, NumberInputVariant, NumberLimitEdge };

export interface NumberInputProps {
	/** Controlled; `null` is an empty field. */
	value: number | null;
	onValueChange: (value: number | null) => void;
	min?: number;
	max?: number;
	step?: number;
	/** PageUp/PageDown and Shift+Arrow step. */
	largeStep?: number;
	/** Display format, e.g. `{ style: "currency", currency: "USD" }`. */
	formatOptions?: Intl.NumberFormatOptions;
	locale?: Intl.LocalesArgument;
	/** Visible label; dragging it sideways scrubs the value. */
	label?: string;
	variant?: NumberInputVariant;
	size?: NumberInputSize;
	/** Text before the value, such as "$". */
	prefix?: string;
	/** Text after the value, such as "px" or " seats". */
	suffix?: string;
	/** A short note when a key press runs into min or max; a function writes the copy, `false` hides it. */
	limitHint?: boolean | ((edge: NumberLimitEdge, limit: number) => string);
	disabled?: boolean;
	invalid?: boolean;
	name?: string;
	placeholder?: string;
	id?: string;
	"aria-label"?: string;
	className?: string;
	decrementLabel?: string;
	incrementLabel?: string;
}

export function NumberInput({
	value,
	onValueChange,
	min,
	max,
	step = 1,
	largeStep = 10,
	formatOptions,
	locale,
	label,
	variant = "default",
	size = "default",
	prefix,
	suffix,
	limitHint = true,
	disabled = false,
	invalid = false,
	name,
	placeholder,
	id: idProp,
	"aria-label": ariaLabel,
	className,
	decrementLabel = "Decrease",
	incrementLabel = "Increase",
}: NumberInputProps) {
	const s = numberInput({ variant, size });
	const fallbackId = useId();
	const id = idProp ?? fallbackId;
	const groupRef = useRef<HTMLDivElement>(null);
	const [hint, setHint] = useState("");
	useEffect(() => {
		if (!hint) return;
		const timer = setTimeout(() => setHint(""), LIMIT_HINT_MS);
		return () => clearTimeout(timer);
	}, [hint]);
	const onLimitKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const edge = limitHit(event.key, value, min, max);
		if (!edge) return;
		nudge(groupRef.current);
		const limit = edge === "max" ? max : min;
		if (!limitHint || limit === undefined) return;
		setHint(
			typeof limitHint === "function"
				? limitHint(edge, limit)
				: limitMessage(edge, new Intl.NumberFormat(locale, formatOptions).format(limit)),
		);
	};
	const input = (
		<>
			{prefix ? <span className={s.prefix()}>{prefix}</span> : null}
			<NumberField.Input
				placeholder={placeholder}
				aria-label={label ? undefined : ariaLabel}
				aria-invalid={invalid || undefined}
				className={s.input()}
				onKeyDown={onLimitKey}
			/>
			{suffix ? <span className={s.suffix()}>{suffix}</span> : null}
		</>
	);

	return (
		<NumberField.Root
			id={id}
			value={value}
			onValueChange={(next) => onValueChange(next)}
			min={min}
			max={max}
			step={step}
			largeStep={largeStep}
			format={formatOptions}
			locale={locale}
			disabled={disabled}
			name={name}
			data-slot="number-input"
			data-variant={variant}
			className={cn(s.root(), className)}
		>
			{label && variant === "default" ? (
				<NumberField.ScrubArea className={s.label()}>
					<label htmlFor={id}>{label}</label>
				</NumberField.ScrubArea>
			) : null}
			{variant === "scrub" ? (
				<NumberField.Group
					ref={groupRef}
					data-slot="number-input-group"
					className={s.group()}
				>
					{label ? (
						<NumberField.ScrubArea className={s.label()}>
							<label htmlFor={id}>{label}</label>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden className={s.grip()}>
								<path
									d="M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</NumberField.ScrubArea>
					) : null}
					{input}
				</NumberField.Group>
			) : (
				<NumberField.Group
					ref={groupRef}
					data-slot="number-input-group"
					className={s.group()}
				>
					<NumberField.Decrement aria-label={decrementLabel} className={s.button()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							aria-hidden
						>
							<path d="M5 12h14" />
						</svg>
					</NumberField.Decrement>
					{input}
					<NumberField.Increment aria-label={incrementLabel} className={s.button()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							aria-hidden
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
					</NumberField.Increment>
				</NumberField.Group>
			)}
			{limitHint ? (
				<p aria-live="polite" data-on={!!hint} className={s.hint()}>
					{hint}
				</p>
			) : null}
		</NumberField.Root>
	);
}
