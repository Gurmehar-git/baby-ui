"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../button/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	type EmptyLayout,
	EmptyMedia,
	type EmptySize,
	EmptyTitle,
	type EmptyVariant,
} from "../empty/empty";
import {
	ERROR_BOUNDARY_LABELS,
	type ErrorBoundaryLabels,
	errorMessage,
	resetKeysChanged,
} from "./core";

export type { ErrorBoundaryLabels };

type Look = { variant?: EmptyVariant; layout?: EmptyLayout; size?: EmptySize };

export interface ErrorBoundaryFallbackProps extends Look {
	error: unknown;
	reset: () => void;
	labels?: Partial<ErrorBoundaryLabels>;
	/** Show the thrown message in a collapsed details row. */
	details?: boolean;
	className?: string;
}

/** The default fallback: an Empty with a destructive tile, a retry and the error, folded away. */
export function ErrorBoundaryFallback({
	error,
	reset,
	labels: labelsProp,
	details = true,
	variant = "card",
	layout = "vertical",
	size = "default",
	className,
}: ErrorBoundaryFallbackProps) {
	const labels = { ...ERROR_BOUNDARY_LABELS, ...labelsProp };
	return (
		<Empty
			role="alert"
			data-slot="error-boundary"
			variant={variant}
			layout={layout}
			size={size}
			className={className}
		>
			<EmptyHeader>
				<EmptyMedia variant="icon" tone="destructive">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
					>
						<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
					</svg>
				</EmptyMedia>
				<EmptyTitle>{labels.title}</EmptyTitle>
				<EmptyDescription>{labels.description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant="outline" onClick={reset}>
					{labels.retry}
				</Button>
				{details ? (
					<details className="w-full text-left text-muted-foreground text-xs">
						<summary className="cursor-pointer select-none text-center">
							{labels.details}
						</summary>
						<code className="mt-2 block break-words rounded-md border border-border bg-background p-2 font-mono">
							{errorMessage(error)}
						</code>
					</details>
				) : null}
			</EmptyContent>
		</Empty>
	);
}

export interface ErrorBoundaryProps extends Look {
	children?: ReactNode;
	/** Replaces the default fallback; a function receives the error and a reset. */
	fallback?: ReactNode | ((props: { error: unknown; reset: () => void }) => ReactNode);
	onError?: (error: unknown, info: ErrorInfo) => void;
	/** Runs before the children render again, e.g. to clear the state that threw. */
	onReset?: () => void;
	/** When any of these change, a caught error clears by itself. */
	resetKeys?: readonly unknown[];
	labels?: Partial<ErrorBoundaryLabels>;
	details?: boolean;
	className?: string;
}

type State = { failed: boolean; error: unknown };

/** Catches errors thrown while its children render and shows a fallback instead of a blank page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
	override state: State = { failed: false, error: null };

	static getDerivedStateFromError(error: unknown): State {
		return { failed: true, error };
	}

	override componentDidCatch(error: unknown, info: ErrorInfo) {
		this.props.onError?.(error, info);
	}

	override componentDidUpdate(prev: ErrorBoundaryProps) {
		if (this.state.failed && resetKeysChanged(prev.resetKeys, this.props.resetKeys)) {
			this.reset();
		}
	}

	reset = () => {
		this.props.onReset?.();
		this.setState({ failed: false, error: null });
	};

	override render() {
		if (!this.state.failed) return this.props.children;
		const { fallback, variant, layout, size, labels, details, className } = this.props;
		const { error } = this.state;
		if (typeof fallback === "function") return fallback({ error, reset: this.reset });
		if (fallback !== undefined) return fallback;
		return (
			<ErrorBoundaryFallback
				error={error}
				reset={this.reset}
				variant={variant}
				layout={layout}
				size={size}
				labels={labels}
				details={details}
				className={className}
			/>
		);
	}
}
