import { tv, type VariantProps } from "tailwind-variants";

/** Separate filled slots; the active one takes the focus ring, a typed digit rises in. */
export const inputOtp = tv({
	slots: {
		root: "flex items-center gap-2 has-disabled:opacity-50",
		input: "disabled:cursor-not-allowed",
		group: "flex items-center gap-2",
		slot: [
			"relative flex items-center justify-center rounded-lg border border-input bg-background font-medium tabular-nums",
			"outline-none transition-[box-shadow,border-color] duration-(--duration-fast) ease-[var(--ease-smooth)]",
			"data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30",
			"aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/25",
			"motion-reduce:transition-none",
		],
		value: "otp-value",
		caret: "pointer-events-none absolute inset-0 flex items-center justify-center",
		caretLine: "otp-caret h-4 w-px bg-foreground",
		separator: "flex items-center text-muted-foreground [&_svg]:size-4",
	},
	variants: {
		size: {
			sm: { slot: "size-8 text-sm" },
			md: { slot: "size-10 text-base" },
			lg: { slot: "size-12 text-lg" },
		},
		invalid: {
			true: {
				slot: "border-destructive data-[active=true]:border-destructive data-[active=true]:ring-destructive/25",
			},
			false: {},
		},
		/** Plays once each time `invalid` turns on. */
		invalidMotion: { shake: {}, pulse: {}, none: {} },
	},
	compoundVariants: [
		{
			invalid: true,
			invalidMotion: "shake",
			class: {
				root: "animate-[otp-shake_400ms_var(--ease-ui-out)] motion-reduce:animate-none",
			},
		},
		{
			invalid: true,
			invalidMotion: "pulse",
			class: {
				slot: "animate-[otp-pulse_360ms_var(--ease-ui-out)] motion-reduce:animate-none",
			},
		},
	],
	defaultVariants: { size: "md", invalid: false, invalidMotion: "shake" },
});

export type InputOtpSize = NonNullable<VariantProps<typeof inputOtp>["size"]>;
export type InputOtpInvalidMotion = NonNullable<
	VariantProps<typeof inputOtp>["invalidMotion"]
>;
