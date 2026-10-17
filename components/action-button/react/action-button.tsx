"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "../../button/react/button";
import type { ButtonSize, ButtonVariant } from "../../button/variants";
import { cn } from "../../lib/cn";
import { morph, trackActiveWidth } from "../../lib/morph";
import { actionButton } from "../variants";

export type ActionButtonState = "idle" | "pending" | "success";

export interface ActionButtonProps
	extends Omit<
		Extract<ButtonProps, { href?: undefined }>,
		"onClick" | "children" | "loading"
	> {
	label: string;
	/** Shown with a drawn tick after the action succeeds. */
	successLabel?: string;
	/** Beside the spinner while a returned promise runs. */
	pendingLabel?: string;
	/** Runs on click. Return a promise to show the pending state. */
	onAction: () => unknown;
	/** How long the success state stays, in ms. */
	resetAfterMs?: number;
	onActionError?: (error: unknown) => void;
	icon?: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
}

/**
 * A button that runs its own async action: a spinner while it works, then a drawn tick and a
 * past-tense label that morph in place before it resets.
 */
export function ActionButton({
	label,
	successLabel = "Done",
	pendingLabel = "Working…",
	onAction,
	resetAfterMs = 1800,
	onActionError,
	icon,
	className,
	disabled,
	...props
}: ActionButtonProps) {
	const [state, setState] = useState<ActionButtonState>("idle");
	const frameRef = useRef<HTMLSpanElement>(null);
	const timer = useRef(0);
	const alive = useRef(true);
	useEffect(() => {
		alive.current = true;
		const frame = frameRef.current;
		const stop = frame ? trackActiveWidth(frame) : undefined;
		return () => {
			alive.current = false;
			clearTimeout(timer.current);
			stop?.();
		};
	}, []);

	const run = async () => {
		if (state !== "idle") return;
		try {
			const result = onAction();
			if (result instanceof Promise) {
				setState("pending");
				await result;
			}
			if (!alive.current) return;
			setState("success");
			clearTimeout(timer.current);
			timer.current = window.setTimeout(() => setState("idle"), resetAfterMs);
		} catch (error) {
			if (!alive.current) return;
			setState("idle");
			onActionError?.(error);
		}
	};

	const s = actionButton();
	const m = morph();
	const done = state === "success";
	return (
		<>
			<Button
				{...props}
				data-slot="action-button"
				data-state={state}
				disabled={disabled}
				loading={state === "pending"}
				loadingLabel={pendingLabel}
				className={cn("group/action", className)}
				onClick={run}
			>
				<span className={s.face()}>
					{/* Without an icon the slot stays mounted at zero width, so the tick can still draw in. */}
					<span aria-hidden data-empty={!icon} className={s.icon()}>
						{icon && (
							<span data-on={!done} className={m.icon()}>
								{icon}
							</span>
						)}
						<span data-on={done} className={m.icon()}>
							<svg viewBox="0 0 24 24" fill="none" aria-hidden>
								<path
									d="M4 12.5l5 5L20 6.5"
									pathLength={1}
									stroke="currentColor"
									strokeWidth="2.25"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={s.tick()}
								/>
							</svg>
						</span>
					</span>
					<span ref={frameRef} className={m.frame()}>
						<span data-on={!done} className={m.face()}>
							{label}
						</span>
						<span data-on={done} className={m.face()}>
							{successLabel}
						</span>
					</span>
				</span>
			</Button>
			<span className="sr-only" role="status">
				{done ? successLabel : ""}
			</span>
		</>
	);
}
