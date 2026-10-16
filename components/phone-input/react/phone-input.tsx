"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from "../../combobox/react/combobox";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group/react/input-group";
import type { InputGroupSize } from "../../input-group/react/variants";
import { cn } from "../../lib/react/cn";
import {
	capDigits,
	caretAfterDigits,
	FALLBACK_COUNTRY,
	findCountry,
	flagOf,
	formatNational,
	onlyDigits,
	PHONE_COUNTRIES,
	type PhoneCountry,
	type PhoneStatus,
	parsePhoneNumber,
	phoneStatus,
	toE164,
} from "./phone";
import { type PhoneInputVariant, phoneInput } from "./variants";

export type { PhoneCountry, PhoneInputVariant, PhoneStatus };

export type PhoneInputDetails = {
	country: PhoneCountry;
	/** The number as shown, without the calling code. */
	formatted: string;
	status: PhoneStatus;
	valid: boolean;
};

export interface PhoneInputProps {
	/** Accessible name of the number field. */
	label: string;
	/** The number in E.164, such as "+14155550132"; an empty string clears it. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string, details: PhoneInputDetails) => void;
	/** ISO code of the selected country, paired with `onCountryChange`. */
	country?: string;
	defaultCountry?: string;
	onCountryChange?: (iso: string) => void;
	/** Limit the picker to these ISO codes. */
	countries?: string[];
	/** Pinned at the top of the picker. */
	preferredCountries?: string[];
	/** Show a message after blur when the number is incomplete. */
	validate?: boolean;
	/** Replaces the built-in validation message. */
	error?: string;
	/** Adds a hidden input carrying the E.164 value. */
	name?: string;
	disabled?: boolean;
	variant?: PhoneInputVariant;
	size?: InputGroupSize;
	className?: string;
}

/**
 * A phone number field: a searchable country picker, formatting as you type with the caret kept
 * in place, pasting international numbers switches country, and the value is E.164.
 */
export function PhoneInput({
	label,
	value,
	defaultValue = "",
	onValueChange,
	country: countryProp,
	defaultCountry = "US",
	onCountryChange,
	countries,
	preferredCountries = [],
	validate = true,
	error: errorProp,
	name,
	disabled = false,
	variant = "default",
	size = "default",
	className,
}: PhoneInputProps) {
	const pool = useMemo(
		() =>
			countries?.length
				? PHONE_COUNTRIES.filter((c) => countries.includes(c.iso))
				: PHONE_COUNTRIES,
		[countries],
	);
	const initial = parsePhoneNumber(value ?? defaultValue, pool);
	const [ownIso, setOwnIso] = useState(initial?.country.iso ?? defaultCountry);
	const iso = countryProp ?? ownIso;
	const entry = findCountry(iso) ?? pool[0] ?? FALLBACK_COUNTRY;
	const [ownDigits, setOwnDigits] = useState(initial?.national ?? "");
	// A controlled E.164 value decides the digits; otherwise the field keeps its own.
	const controlled = value !== undefined ? parsePhoneNumber(value, pool) : null;
	const digits = value !== undefined ? (controlled?.national ?? "") : ownDigits;
	const [open, setOpen] = useState(false);
	const [blurred, setBlurred] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const caret = useRef<number | null>(null);
	const messageId = useId();
	const formatted = formatNational(entry, digits);
	const status = phoneStatus(entry, digits);

	useLayoutEffect(() => {
		if (caret.current === null || !inputRef.current) return;
		const at = caretAfterDigits(inputRef.current.value, caret.current);
		caret.current = null;
		inputRef.current.setSelectionRange(at, at);
	});

	const emit = (next: PhoneCountry, nextDigits: string) => {
		if (value === undefined) setOwnDigits(nextDigits);
		const nextStatus = phoneStatus(next, nextDigits);
		onValueChange?.(toE164(next, nextDigits), {
			country: next,
			formatted: formatNational(next, nextDigits),
			status: nextStatus,
			valid: nextStatus === "valid",
		});
	};
	const pickCountry = (next: PhoneCountry) => {
		if (countryProp === undefined) setOwnIso(next.iso);
		onCountryChange?.(next.iso);
		emit(next, capDigits(next, digits));
	};

	const message =
		errorProp ??
		(validate && blurred && (status === "incomplete" || status === "too-long")
			? `Enter a full number for ${entry.name}.`
			: undefined);
	const s = phoneInput({ variant });
	const preferred = pool.filter((c) => preferredCountries.includes(c.iso));
	const rest = pool.filter((c) => !preferredCountries.includes(c.iso));
	const item = (c: PhoneCountry) => (
		<ComboboxItem
			key={c.iso}
			value={c.iso}
			keywords={`${c.name} +${c.dial} ${c.dial}`}
			onSelect={() => {
				pickCountry(c);
				setOpen(false);
				inputRef.current?.focus();
			}}
		>
			<span className={s.item()}>
				<span aria-hidden className={s.flag()}>
					{flagOf(c.iso)}
				</span>
				{c.name}
				<span className={s.itemDial()}>+{c.dial}</span>
			</span>
		</ComboboxItem>
	);

	return (
		<div data-slot="phone-input" className={cn(s.root(), className)}>
			<InputGroup size={size}>
				<InputGroupAddon>
					<Combobox open={open} onOpenChange={setOpen}>
						<ComboboxTrigger
							disabled={disabled}
							aria-label={`Country: ${entry.name}, +${entry.dial}`}
							className={s.trigger()}
						>
							<span aria-hidden className={s.flag()}>
								{flagOf(entry.iso)}
							</span>
							<span className={s.dial()}>+{entry.dial}</span>
						</ComboboxTrigger>
						<ComboboxContent className="w-64">
							<ComboboxInput placeholder="Search countries" />
							<ComboboxList>
								<ComboboxEmpty>No country found</ComboboxEmpty>
								{preferred.length > 0 && (
									<ComboboxGroup heading="Suggested">{preferred.map(item)}</ComboboxGroup>
								)}
								<ComboboxGroup heading={preferred.length ? "All countries" : undefined}>
									{rest.map(item)}
								</ComboboxGroup>
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</InputGroupAddon>
				<InputGroupInput
					ref={inputRef}
					type="tel"
					inputMode="tel"
					autoComplete="tel-national"
					aria-label={label}
					aria-invalid={!!message || undefined}
					aria-describedby={message ? messageId : undefined}
					placeholder={formatNational(entry, entry.example)}
					disabled={disabled}
					value={formatted}
					className={s.input()}
					onFocus={() => setBlurred(false)}
					onBlur={() => setBlurred(true)}
					onChange={(event) => {
						const raw = event.target.value;
						const at = event.target.selectionStart ?? raw.length;
						caret.current = onlyDigits(raw.slice(0, at)).length;
						// An international number switches the country to match.
						const parsed = /^\s*(\+|00)/.test(raw) ? parsePhoneNumber(raw, pool) : null;
						if (parsed) {
							if (countryProp === undefined) setOwnIso(parsed.country.iso);
							onCountryChange?.(parsed.country.iso);
							caret.current = parsed.national.length;
							emit(parsed.country, parsed.national);
							return;
						}
						emit(entry, capDigits(entry, onlyDigits(raw)));
					}}
				/>
			</InputGroup>
			{name && <input type="hidden" name={name} value={toE164(entry, digits)} />}
			{message && (
				<span id={messageId} role="alert" data-tone="error" className={s.message()}>
					{message}
				</span>
			)}
		</div>
	);
}
