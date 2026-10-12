"use client";

import {
	type ButtonHTMLAttributes,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "../lib/cn";
import { morph, trackActiveWidth } from "../lib/morph";
import { createHold } from "./hold";
import {
	type HoldToConfirmSize,
	type HoldToConfirmVariant,
	holdToConfirm,
} from "./variants";

export type { HoldToConfirmSize, HoldToConfirmVariant };

export interface HoldToConfirmProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
	/** The instruction and the action, e.g. "Hold to delete project". */
	label: string;
	/** Shown once the hold completes, e.g. "Deleted". */
	confirmedLabel?: string;
	/** Called once when the hold completes. */
	onConfirm: () => void;
	/** Hold length in milliseconds. */
	duration?: number;
	icon?: ReactNode;
	variant?: HoldToConfirmVariant;
	size?: HoldToConfirmSize;
	/** The done state. Set it back to false to reset; leave it unset to let the button own it. */
	confirmed?: boolean;
	/** Reports when a hold starts and ends, for hints such as "Keep holding". */
	onHoldChange?: (holding: boolean) => void;
}

const TrashIcon = (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden>
		<path
			d="M2.5 4h11M6.5 4V2.8h3V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

function Face({
	icon,
	label,
	confirmedLabel,
	done,
}: {
	icon: ReactNode;
	label: string;
	confirmedLabel: string;
	done: boolean;
}) {
	const s = holdToConfirm();
	const m = morph();
	const frameRef = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		if (frameRef.current) return trackActiveWidth(frameRef.current);
	}, []);
	return (
		<span className={s.face()}>
			<span className={s.icon()}>
				<span data-on={!done} className={m.icon()}>
					{icon}
				</span>
				<span data-on={done} className={m.icon()}>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden>
						<path
							d="M4 12.5l5 5L20 6.5"
							pathLength={1}
							className={s.check()}
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</span>
			<span ref={frameRef} className={m.frame()}>
				<span data-on={!done} className={m.face()}>
					{label}
				</span>
				<span data-on={done} className={m.face()}>
					{confirmedLabel}
				</span>
			</span>
		</span>
	);
}

/**
 * A button that commits only after it is held, for destructive or hard-to-undo actions where a
 * stray tap must not count. Letting go early rewinds the fill; finishing morphs into a done state.
 */
export function HoldToConfirm({
	label,
	confirmedLabel = "Done",
	onConfirm,
	duration = 1200,
	icon = TrashIcon,
	variant = "default",
	size = "default",
	confirmed,
	onHoldChange,
	className,
	disabled = false,
	...props
}: HoldToConfirmProps) {
	const hintId = useId();
	const [ownDone, setOwnDone] = useState(false);
	const [holding, setHolding] = useState(false);
	const done = confirmed ?? ownDone;
	// Server and first paint only; after that the engine owns the fill's clip.
	const [initialDone] = useState(done);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const engine = useRef<ReturnType<typeof createHold> | null>(null);
	const options = {
		duration,
		done,
		disabled,
		onComplete: () => {
			setOwnDone(true);
			onConfirm();
		},
		onHoldChange: (value: boolean) => {
			setHolding(value);
			onHoldChange?.(value);
		},
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useEffect(() => {
		if (!buttonRef.current) return;
		engine.current = createHold(buttonRef.current, optionsRef.current);
		return () => {
			engine.current?.destroy();
			engine.current = null;
		};
	}, []);
	useEffect(() => {
		engine.current?.update(options);
	});

	const s = holdToConfirm({ variant, size });
	const seconds = (duration / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 });
	return (
		<>
			<button
				{...props}
				ref={buttonRef}
				type="button"
				data-slot="hold-to-confirm"
				data-state={done ? "done" : holding ? "holding" : "idle"}
				disabled={disabled}
				aria-disabled={done || undefined}
				aria-label={done ? confirmedLabel : label}
				aria-describedby={done ? undefined : hintId}
				className={cn(s.root(), className)}
			>
				<Face icon={icon} label={label} confirmedLabel={confirmedLabel} done={done} />
				<span
					data-hold-fill=""
					className={s.fill()}
					style={{ clipPath: initialDone ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
					aria-hidden
				>
					<Face icon={icon} label={label} confirmedLabel={confirmedLabel} done={done} />
				</span>
			</button>
			<span id={hintId} className="sr-only">
				{`Press and hold for ${seconds} seconds to confirm. With a keyboard, hold Space or Enter.`}
			</span>
			<span className="sr-only" role="status">
				{done ? confirmedLabel : ""}
			</span>
		</>
	);
}
