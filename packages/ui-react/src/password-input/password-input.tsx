"use client";

import { type InputHTMLAttributes, useId, useMemo, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group/input-group";
import type { InputGroupSize } from "../input-group/variants";
import { LetterMorph } from "../letter-morph/letter-morph";
import { cn } from "../lib/cn";
import {
	DEFAULT_STRENGTH_LABELS,
	measurePassword,
	type PasswordRule,
	type PasswordStrength,
	type PasswordStrengthLabels,
	strengthLabel,
} from "./strength";
import { passwordInput } from "./variants";

export type { PasswordRule, PasswordStrength, PasswordStrengthLabels };

export interface PasswordInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "defaultValue" | "size"
	> {
	/** Accessible name of the field. */
	label: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string, strength: PasswordStrength) => void;
	/** Whether the password shows as text, paired with `onRevealedChange`. */
	revealed?: boolean;
	defaultRevealed?: boolean;
	onRevealedChange?: (revealed: boolean) => void;
	/** Rules to check; passing any shows the strength meter and checklist. `passwordRules()` gives the usual four. */
	rules?: PasswordRule[];
	/** Below this many characters the meter holds at its first step. */
	shortLength?: number;
	strengthLabels?: Partial<PasswordStrengthLabels>;
	/** Names of the reveal toggle. */
	showLabel?: string;
	hideLabel?: string;
	size?: InputGroupSize;
	className?: string;
}

/**
 * A password field with a reveal toggle whose eye a slash draws across. With `rules`, a four-step
 * meter fills and changes tone, each rule ticks off, and the strength word morphs in place.
 */
export function PasswordInput({
	label,
	value,
	defaultValue = "",
	onValueChange,
	revealed: revealedProp,
	defaultRevealed = false,
	onRevealedChange,
	rules,
	shortLength = 8,
	strengthLabels,
	showLabel = "Show password",
	hideLabel = "Hide password",
	size = "default",
	className,
	...props
}: PasswordInputProps) {
	const id = useId();
	const [own, setOwn] = useState(defaultValue);
	const text = value ?? own;
	const [ownRevealed, setOwnRevealed] = useState(defaultRevealed);
	const revealed = revealedProp ?? ownRevealed;
	const strength = useMemo(
		() => measurePassword(text, rules ?? [], shortLength),
		[text, rules, shortLength],
	);
	const labels = { ...DEFAULT_STRENGTH_LABELS, ...strengthLabels };
	const word = strengthLabel(text, strength, labels);
	const s = passwordInput({ level: strength.level });
	const maskId = `pw-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
	const rulesId = `${maskId}-rules`;

	return (
		<div data-slot="password-input" className={cn(s.root(), className)}>
			<InputGroup size={size}>
				<InputGroupInput
					{...props}
					type={revealed ? "text" : "password"}
					aria-label={label}
					aria-describedby={rules?.length ? rulesId : props["aria-describedby"]}
					autoComplete={
						props.autoComplete ?? (rules ? "new-password" : "current-password")
					}
					value={text}
					onChange={(event) => {
						const next = event.target.value;
						if (value === undefined) setOwn(next);
						onValueChange?.(next, measurePassword(next, rules ?? [], shortLength));
					}}
				/>
				<InputGroupAddon align="inline-end">
					<button
						type="button"
						aria-label={revealed ? hideLabel : showLabel}
						aria-pressed={revealed}
						data-revealed={revealed}
						className={cn("group/toggle", s.toggle())}
						onClick={() => {
							if (revealedProp === undefined) setOwnRevealed(!revealed);
							onRevealedChange?.(!revealed);
						}}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<mask
								id={maskId}
								maskUnits="userSpaceOnUse"
								x="0"
								y="0"
								width="24"
								height="24"
							>
								<rect width="24" height="24" fill="white" stroke="none" />
								<path
									d="M2 2l20 20"
									stroke="black"
									strokeWidth="5"
									pathLength={1}
									className={s.slash()}
								/>
							</mask>
							<g mask={`url(#${maskId})`}>
								<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
								<circle cx="12" cy="12" r="3" />
							</g>
							<path d="M2 2l20 20" pathLength={1} className={s.slash()} />
						</svg>
					</button>
				</InputGroupAddon>
			</InputGroup>
			{rules && rules.length > 0 && (
				<>
					<div className={s.meter()}>
						{/* biome-ignore lint/a11y/useSemanticElements: four styled segments, which a native meter cannot draw */}
						<div
							role="meter"
							aria-label="Password strength"
							aria-valuemin={0}
							aria-valuemax={4}
							aria-valuenow={strength.level}
							aria-valuetext={word}
							className={s.segments()}
						>
							{[1, 2, 3, 4].map((step) => (
								<span
									key={step}
									data-on={strength.level >= step}
									className={s.segment()}
								/>
							))}
						</div>
						<LetterMorph text={word} className={s.word()} />
					</div>
					<ul id={rulesId} aria-label="Password requirements" className={s.rules()}>
						{rules.map((rule) => {
							const met = strength.met.includes(rule.id);
							return (
								<li key={rule.id} data-met={met} className={s.rule()}>
									<svg
										viewBox="0 0 14 14"
										fill="none"
										aria-hidden
										data-on={met}
										className={s.tick()}
									>
										<path
											d="M3 7.4 5.6 10 11 4.2"
											pathLength={1}
											stroke="currentColor"
											strokeWidth="1.6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									{rule.label}
									<span className="sr-only">{met ? ", met" : ", not met"}</span>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</div>
	);
}
