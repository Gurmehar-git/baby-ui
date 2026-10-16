"use client";

import { type ReactNode, useState } from "react";
import { Badge } from "../../badge/react/badge";
import { cn } from "../../lib/react/cn";
import { type TaskStatus, type TaskStep, taskStepRows } from "./variants";

function StepRing({ active, children }: { active: boolean; children?: number }) {
	const c = 2 * Math.PI * 11;
	return (
		<span className="relative inline-flex size-6 shrink-0 items-center justify-center">
			<svg
				viewBox="0 0 24 24"
				aria-hidden
				className={cn("absolute inset-0", active && "spinner")}
			>
				<circle
					cx={12}
					cy={12}
					r={11}
					fill="none"
					stroke="var(--border)"
					strokeWidth={2}
				/>
				{active ? (
					<circle
						cx={12}
						cy={12}
						r={11}
						fill="none"
						stroke="var(--muted-foreground)"
						strokeWidth={2}
						strokeLinecap="round"
						strokeDasharray={`${c * 0.28} ${c * 0.72}`}
					/>
				) : null}
			</svg>
			<span className="relative font-semibold text-foreground text-xs tabular-nums">
				{children}
			</span>
		</span>
	);
}

function Glyph({ d, width = 3.5 }: { d: string; width?: number }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={width}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className="size-3"
		>
			<path d={d} />
		</svg>
	);
}

const CHECK = "M20 6L9 17l-5-5";
const CROSS = "M18 6L6 18M6 6l12 12";
const RETRY = "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6";

/** TaskSteps' capsules and list layouts: expandable rows whose status comes from `steps`. */
export function TaskStepRows({
	steps,
	variant,
	labels,
	onToggle,
	onRetry,
	className,
}: {
	steps: TaskStep[];
	variant: "capsules" | "list";
	labels: Record<TaskStatus, string>;
	onToggle?: (id: string, open: boolean) => void;
	onRetry?: (id: string) => void;
	className?: string;
}) {
	const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
	const s = taskStepRows({ variant });

	const badge = (step: TaskStep): ReactNode => {
		if (step.status === "done")
			return (
				<span className={taskStepRows({ tone: "success" }).statusDot()}>
					<Glyph d={CHECK} />
				</span>
			);
		if (step.status === "failed")
			return (
				<span className={taskStepRows({ tone: "destructive" }).statusDot()}>
					<Glyph d={CROSS} />
				</span>
			);
		return <StepRing active={step.status === "active"}>{step.step}</StepRing>;
	};

	return (
		<ol aria-live="polite" data-slot="task-steps" className={cn(s.root(), className)}>
			{steps.map((step, i) => {
				const open = openRows[step.id] ?? false;
				return (
					<li
						key={step.id}
						className={taskStepRows({ variant, open }).item()}
						style={{ animationDelay: `${i * 80}ms` }}
					>
						<div className="flex items-center pr-1">
							<button
								type="button"
								aria-expanded={open}
								onClick={() => {
									setOpenRows((current) => ({ ...current, [step.id]: !open }));
									onToggle?.(step.id, !open);
								}}
								className={s.trigger()}
							>
								<span className={s.badge()}>{badge(step)}</span>
								<span className={s.label()}>{step.label}</span>
								<span className="sr-only">{labels[step.status]}</span>
								{step.meta ? <span className={s.meta()}>{step.meta}</span> : null}
								{step.status === "done" ? (
									<Badge variant="success" size="sm">
										{labels.done}
									</Badge>
								) : null}
								{step.status === "failed" ? (
									<Badge variant="destructive" size="sm">
										{labels.failed}
									</Badge>
								) : null}
								<span aria-hidden className={s.chevron()}>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden
										style={{ transform: open ? "rotate(180deg)" : undefined }}
										className="size-3.5 transition-transform duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</span>
							</button>
							{step.status === "failed" && onRetry ? (
								<button
									type="button"
									aria-label={`Retry ${step.label}`}
									onClick={() => onRetry(step.id)}
									className={s.retry()}
								>
									<Glyph d={RETRY} width={3} />
								</button>
							) : null}
						</div>
						<div
							className="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
							style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
						>
							<div className="overflow-hidden">
								<div className={s.details()}>
									<span aria-hidden className="mx-auto h-full w-px bg-border" />
									<div className="flex flex-col gap-1.5">
										{(step.details ?? []).map((d) => (
											<div key={d.label} className={s.detail()}>
												<span>{d.label}</span>
												<span className="font-mono tabular-nums">{d.meta}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</li>
				);
			})}
		</ol>
	);
}
