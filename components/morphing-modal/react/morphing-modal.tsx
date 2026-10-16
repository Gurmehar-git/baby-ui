"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/react/cn";
import { invert, MORPH_EASE, MORPH_MS, type MorphSpring } from "./use-morph";
import { type MorphingModalSize, morphingModal } from "./variants";

export type { MorphingModalSize };

export interface MorphingModalProps {
	trigger: ReactNode;
	children: ReactNode;
	title: string;
	className?: string;
	spring?: MorphSpring;
	size?: MorphingModalSize;
	dismissOnBackdrop?: boolean;
	backdropBlur?: number;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const reduced = () =>
	typeof matchMedia === "function" &&
	matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MorphingModal({
	trigger,
	children,
	title,
	className,
	spring = "gentle",
	size = "default",
	dismissOnBackdrop = true,
	backdropBlur = 8,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
}: MorphingModalProps) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const [hidden, setHidden] = useState(false);
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isOpen = openProp ?? internalOpen;
	const wasOpen = useRef(false);
	const titleId = useId();
	const styles = morphingModal({ size });

	async function animateMorph(reverse: boolean) {
		const from = triggerRef.current?.getBoundingClientRect();
		const to = panelRef.current?.getBoundingClientRect();
		if (!from || !to || !panelRef.current || reduced()) return;

		const collapsed = invert(from, to);
		const frames = reverse
			? [
					{ transform: "none", opacity: 1 },
					{ transform: collapsed, opacity: 0 },
				]
			: [
					{ transform: collapsed, opacity: 0 },
					{ transform: "none", opacity: 1 },
				];

		// Closing is faster: the user has already decided.
		await panelRef.current.animate(frames, {
			duration: MORPH_MS[spring] * (reverse ? 0.7 : 1),
			easing: MORPH_EASE[spring],
			fill: "both",
		}).finished;
	}

	async function runOpen() {
		dialogRef.current?.showModal();
		setHidden(true);
		await animateMorph(false);
	}

	async function runClose() {
		await animateMorph(true);
		setHidden(false);
		dialogRef.current?.close();
		triggerRef.current?.focus();
	}

	// A controlled `open` and the trigger/close clicks all drive the dialog and FLIP from here.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runClose, runOpen left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (isOpen === wasOpen.current) return;
		wasOpen.current = isOpen;
		if (isOpen) void runOpen();
		else void runClose();
	}, [isOpen]);

	function setOpen(next: boolean) {
		if (openProp === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	}

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				style={{ opacity: hidden ? 0 : 1 }}
				className={styles.trigger()}
			>
				{trigger}
			</button>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog natively */}
			<dialog
				ref={dialogRef}
				aria-labelledby={titleId}
				onCancel={(e) => {
					e.preventDefault();
					setOpen(false);
				}}
				onClick={(e) => {
					if (dismissOnBackdrop && e.target === dialogRef.current) setOpen(false);
				}}
				style={{ ["--morph-blur" as string]: `${backdropBlur}px` }}
				className={styles.dialog()}
			>
				<div
					ref={panelRef}
					data-slot="morphing-modal"
					className={cn(styles.panel(), className)}
				>
					<div className={styles.header()}>
						<h2 id={titleId} className={styles.title()}>
							{title}
						</h2>
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Close"
							className={styles.close()}
						>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
								<path
									d="m4 4 8 8M12 4l-8 8"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					<div className={styles.body()}>{children}</div>
				</div>
			</dialog>
		</>
	);
}
