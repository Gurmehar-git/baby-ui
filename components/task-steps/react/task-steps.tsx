import {
	TASK_STEP_LABELS,
	type TaskStatus,
	type TaskStep,
	type TaskStepDetail,
	type TaskStepsSize,
	type TaskStepsVariant,
	taskSteps,
} from "../variants";
import { TaskStepRows } from "./rows";

export type { TaskStatus, TaskStep, TaskStepDetail, TaskStepsSize, TaskStepsVariant };

export interface TaskStepsProps {
	steps: TaskStep[];
	variant?: TaskStepsVariant;
	/** Rows: fired when a row expands or collapses. */
	onToggle?: (id: string, open: boolean) => void;
	/** Rows: shows a retry button on failed rows. */
	onRetry?: (id: string) => void;
	showConnector?: boolean;
	compact?: boolean;
	size?: TaskStepsSize;
	/** Overrides for the screen-reader status words. */
	labels?: Partial<Record<TaskStatus, string>>;
	className?: string;
}

export function TaskSteps({
	steps,
	variant = "timeline",
	onToggle,
	onRetry,
	showConnector = true,
	compact = false,
	size = "default",
	labels,
	className,
}: TaskStepsProps) {
	const LABEL = { ...TASK_STEP_LABELS, ...labels };
	if (variant !== "timeline")
		return (
			<TaskStepRows
				steps={steps}
				variant={variant}
				labels={LABEL}
				onToggle={onToggle}
				onRetry={onRetry}
				className={className}
			/>
		);
	return (
		<ol
			aria-live="polite"
			data-slot="task-steps"
			className={taskSteps({ size }).root({ className })}
		>
			{steps.map((step, i) => {
				const styles = taskSteps({ size, compact, status: step.status });
				return (
					<li key={step.id} className={styles.item()}>
						{showConnector && i < steps.length - 1 ? (
							<span aria-hidden className={styles.connector()} />
						) : null}

						<span aria-hidden className={styles.marker()}>
							{step.status === "done" ? (
								<svg
									viewBox="0 0 12 12"
									fill="none"
									aria-hidden
									className={styles.icon({ className: "checkbox-check" })}
									data-on="true"
								>
									<path
										d="M2.5 6.2 4.8 8.5 9.5 3.6"
										stroke="currentColor"
										strokeWidth="1.8"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							) : step.status === "failed" ? (
								<svg
									viewBox="0 0 12 12"
									fill="none"
									aria-hidden
									className={styles.icon()}
								>
									<path
										d="M3.5 3.5 8.5 8.5M8.5 3.5 3.5 8.5"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
									/>
								</svg>
							) : step.status === "active" ? (
								<svg
									viewBox="0 0 12 12"
									fill="none"
									aria-hidden
									className={styles.icon({ className: "step-spinner" })}
								>
									<circle
										cx="6"
										cy="6"
										r="4.4"
										stroke="currentColor"
										strokeWidth="1.5"
										opacity="0.25"
									/>
									<path
										d="M10.4 6A4.4 4.4 0 0 0 6 1.6"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
							) : (
								<span className={styles.dot()} />
							)}
						</span>

						<span className={styles.text()}>
							<span className={styles.label()}>{step.label}</span>
							<span className="sr-only">{LABEL[step.status]}</span>
						</span>
					</li>
				);
			})}
		</ol>
	);
}
