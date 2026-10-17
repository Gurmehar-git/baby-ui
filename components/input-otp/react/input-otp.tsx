"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/cn";
import { type InputOtpInvalidMotion, type InputOtpSize, inputOtp } from "../variants";

type StyleProps = {
	size: InputOtpSize;
	invalid: boolean;
	invalidMotion: InputOtpInvalidMotion;
};

const StyleCtx = createContext<StyleProps>({
	size: "default",
	invalid: false,
	invalidMotion: "shake",
});

// Distributes over OTPInput's children/render union; the input's numeric `size` gives way to ours.
type OTPProps =
	ComponentProps<typeof OTPInput> extends infer P
		? P extends unknown
			? Omit<P, "size">
			: never
		: never;

/** One-time-code field on `input-otp`: a single real input, so paste and autofill just work. */
export function InputOTP({
	className,
	containerClassName,
	size = "default",
	invalid = false,
	invalidMotion = "shake",
	...props
}: OTPProps & {
	containerClassName?: string;
	size?: InputOtpSize;
	/** Reds every slot; `invalidMotion` plays each time this turns on. */
	invalid?: boolean;
	invalidMotion?: InputOtpInvalidMotion;
}) {
	const s = inputOtp({ size, invalid, invalidMotion });
	return (
		<StyleCtx.Provider value={{ size, invalid, invalidMotion }}>
			<OTPInput
				data-slot="input-otp"
				aria-invalid={invalid || undefined}
				containerClassName={cn(s.root(), containerClassName)}
				spellCheck={false}
				autoComplete="one-time-code"
				className={cn(s.input(), className)}
				{...props}
			/>
		</StyleCtx.Provider>
	);
}

export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="input-otp-group"
			className={cn(inputOtp().group(), className)}
			{...props}
		/>
	);
}

export function InputOTPSlot({
	index,
	className,
	...props
}: ComponentProps<"div"> & { index: number }) {
	const s = inputOtp(useContext(StyleCtx));
	const { char, hasFakeCaret, isActive } =
		useContext(OTPInputContext)?.slots[index] ?? {};
	return (
		<div
			data-slot="input-otp-slot"
			data-active={isActive}
			className={cn(s.slot(), className)}
			{...props}
		>
			{char ? (
				<span key={char} className={s.value()}>
					{char}
				</span>
			) : null}
			{hasFakeCaret ? (
				<div className={s.caret()}>
					<div className={s.caretLine()} />
				</div>
			) : null}
		</div>
	);
}

export function InputOTPSeparator({ className, ...props }: ComponentProps<"div">) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: an <hr> cannot hold the dash icon; matches shadcn
		<div
			data-slot="input-otp-separator"
			role="separator"
			className={cn(inputOtp().separator(), className)}
			{...props}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				aria-hidden="true"
			>
				<path d="M5 12h14" />
			</svg>
		</div>
	);
}
