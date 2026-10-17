"use client";

import { useId, useState } from "react";
import { cn } from "../../lib/cn";
import { TOOL_LABELS, type ToolLabels, type ToolState, tool } from "../variants";

export type { ToolLabels, ToolState };

export interface ToolProps {
	name: string;
	status?: ToolState;
	input?: string;
	output?: string;
	/** Whether the input/output panel is expanded. Controlled with onOpenChange. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Overrides for the status and section labels. */
	labels?: Partial<ToolLabels>;
	className?: string;
}

export function Tool({
	name,
	status = "running",
	input,
	output,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	labels,
	className,
}: ToolProps) {
	const id = useId();
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const open = openProp ?? internalOpen;
	const text = { ...TOOL_LABELS, ...labels };
	const styles = tool({ status, open });

	const toggle = () => {
		if (openProp === undefined) setInternalOpen(!open);
		onOpenChange?.(!open);
	};

	return (
		<div data-slot="tool" data-status={status} className={cn(styles.root(), className)}>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={id}
				onClick={toggle}
				className={styles.trigger()}
			>
				<span aria-hidden className={styles.icon()}>
					{status === "running" ? (
						<svg viewBox="0 0 12 12" fill="none" aria-hidden className="spinner size-3">
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
					) : status === "done" ? (
						<svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3">
							<path
								d="M2.5 6.2 4.8 8.5 9.5 3.6"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					) : status === "error" ? (
						<svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3">
							<path
								d="M3.5 3.5 8.5 8.5M8.5 3.5 3.5 8.5"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
							/>
						</svg>
					) : (
						<span className="size-1.5 rounded-full bg-current" />
					)}
				</span>

				<span className={styles.name()}>{name}</span>
				<span className={styles.label()}>{text[status]}</span>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.chevron()}>
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<div id={id} inert={!open} className={styles.panel()}>
				<div className="overflow-hidden">
					<div className={styles.body()}>
						{input ? (
							<div>
								<p className={styles.heading()}>{text.input}</p>
								<pre className={cn(styles.code(), "text-muted-foreground")}>
									<code>{input}</code>
								</pre>
							</div>
						) : null}
						{output ? (
							<div>
								<p className={styles.heading()}>{text.output}</p>
								<pre className={cn(styles.code(), "text-foreground")}>
									<code>{output}</code>
								</pre>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
