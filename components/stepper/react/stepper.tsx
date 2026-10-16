"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { cn } from "../../lib/react/cn";
import {
	clampStep,
	moveStepFocus,
	ringDelay,
	STATUS_TEXT,
	type StepperStatus,
	type StepperStep,
	stepDelay,
	stepStatus,
} from "./steps";
import { type StepperOrientation, stepper } from "./variants";

export type { StepperOrientation, StepperStatus, StepperStep };

export interface StepperProps {
	steps: StepperStep[];
	/** Index of the step in progress; `steps.length` marks the whole flow complete. */
	current: number;
	orientation?: StepperOrientation;
	/** Called with a completed step's index when it is chosen; without it the stepper is read-only. */
	onStepSelect?: (index: number) => void;
	/** `current` shows only the active step's description; errors always show. */
	details?: "all" | "current";
	/** Markers only, with the current label underneath; horizontal steppers do this below 30rem on their own. */
	compact?: boolean;
	/** Accessible name. */
	label?: string;
	/** Announced and captioned once every step is complete. */
	completeLabel?: string;
	className?: string;
}

/**
 * A steps indicator for onboarding, checkout and setup flows: connectors fill in turn, the check
 * draws in, and the current step's ring grows once progress lands.
 */
export function Stepper({
	steps,
	current,
	orientation = "horizontal",
	onStepSelect,
	details = "all",
	compact = false,
	label = "Progress",
	completeLabel = "All steps complete",
	className,
}: StepperProps) {
	const count = steps.length;
	const active = clampStep(current, count);
	const [travel, setTravel] = useState({ to: active, from: active });
	if (travel.to !== active) setTravel({ to: active, from: travel.to });
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);
	const interactive = Boolean(onStepSelect);
	const vertical = orientation === "vertical";
	const now = active >= count ? undefined : steps[active];
	const s = stepper({ orientation });
	const Root = interactive ? "nav" : "div";
	const style = {
		"--st-cols": count > 1 ? `repeat(${count - 1}, minmax(0, 1fr)) auto` : "auto",
		"--st-ring": `${ringDelay(travel.from, active)}s`,
	} as CSSProperties;

	return (
		<Root
			aria-label={label}
			role={interactive ? undefined : "group"}
			data-slot="stepper"
			data-compact={compact || undefined}
			data-ready={ready || undefined}
			className={cn(s.root(), className)}
			style={style}
		>
			<ol
				className={s.list()}
				onKeyDown={
					interactive
						? (event) => moveStepFocus(event.currentTarget, event.nativeEvent, vertical)
						: undefined
				}
			>
				{steps.map((step, index) => {
					const status = stepStatus(step, index, active);
					const clickable = interactive && index < active;
					const detail =
						step.error ??
						(details === "all" || index === active ? step.description : undefined);
					const content: ReactNode = (
						<>
							<span aria-hidden className={s.marker()}>
								<span className={s.ring()} />
								<span className={s.disc()}>
									<span className={s.number()}>{index + 1}</span>
									<svg
										aria-hidden
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2.5}
										strokeLinecap="round"
										strokeLinejoin="round"
										className={s.check()}
									>
										<path
											pathLength={1}
											d="M5.5 12.5l4.25 4.25L18.5 8"
											className={s.draw()}
										/>
									</svg>
									<svg
										aria-hidden
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2.5}
										strokeLinecap="round"
										className={s.alert()}
									>
										<path pathLength={1} d="M12 6.75v6.5" className={s.draw()} />
										<circle cx={12} cy={17.4} r={1.4} fill="currentColor" stroke="none" />
									</svg>
								</span>
							</span>
							<span className={s.text()}>
								<span className={s.label()}>{step.label}</span>
								{STATUS_TEXT[status] && (
									<span className="sr-only">, {STATUS_TEXT[status]}</span>
								)}
								{detail && (
									<span key={detail} className={step.error ? s.error() : s.description()}>
										{detail}
									</span>
								)}
							</span>
						</>
					);
					return (
						<li
							key={step.id}
							data-status={status}
							data-current={index === active || undefined}
							data-filled={index < active || undefined}
							className={s.item()}
							style={
								{
									"--st-delay": `${stepDelay(index, travel.from, active)}s`,
								} as CSSProperties
							}
						>
							{index < count - 1 && (
								<span aria-hidden className={s.connector()}>
									<span className={s.fill()} />
								</span>
							)}
							{interactive ? (
								<button
									type="button"
									className={s.head()}
									data-clickable={clickable || undefined}
									data-reachable={index <= active || undefined}
									aria-current={index === active ? "step" : undefined}
									aria-disabled={clickable ? undefined : true}
									tabIndex={clickable ? undefined : -1}
									onClick={clickable ? () => onStepSelect?.(index) : undefined}
								>
									{content}
								</button>
							) : (
								<span
									className={s.head()}
									aria-current={index === active ? "step" : undefined}
								>
									{content}
								</span>
							)}
						</li>
					);
				})}
			</ol>
			{!vertical && (
				<span aria-hidden className={s.caption()}>
					<span key={now?.label ?? completeLabel} className={s.captionLabel()}>
						{now?.label ?? completeLabel}
					</span>
					{(now?.error ?? now?.description) && (
						<span
							key={now?.error ?? now?.description}
							className={now?.error ? s.error() : s.description()}
						>
							{now?.error ?? now?.description}
						</span>
					)}
				</span>
			)}
			<span className="sr-only" aria-live="polite">
				{now ? `Step ${active + 1} of ${count}: ${now.label}` : completeLabel}
			</span>
		</Root>
	);
}
