"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Progress } from "../../progress/react/progress";
import { Spinner } from "../../spinner/react/spinner";
import {
	type LoadingScreenIndicator,
	type LoadingScreenLogoMotion,
	type LoadingScreenPosition,
	loadingScreen,
	statusLabel,
} from "../variants";

export type { LoadingScreenIndicator, LoadingScreenLogoMotion, LoadingScreenPosition };

export interface LoadingScreenProps {
	/** Your mark, e.g. an inline SVG. Omit for an indicator-only screen. */
	logo?: ReactNode;
	/** Visible while true; false fades it out and makes it inert. */
	open?: boolean;
	/** 0-100 for a determinate bar; omit for an indeterminate one. */
	progress?: number;
	indicator?: LoadingScreenIndicator;
	logoMotion?: LoadingScreenLogoMotion;
	/** `fixed` covers the page; `absolute` covers the nearest positioned container. */
	position?: LoadingScreenPosition;
	/** Short visible line under the indicator. */
	caption?: ReactNode;
	/** Screen-reader status text. */
	label?: string;
	className?: string;
}

/** A full-page or container loading overlay: your logo, an indicator and an optional caption. */
export function LoadingScreen({
	logo,
	open = true,
	progress,
	indicator = "bar",
	logoMotion,
	position,
	caption,
	label = "Loading",
	className,
}: LoadingScreenProps) {
	const s = loadingScreen({ position, logoMotion, indicator, open });
	return (
		<div
			data-slot="loading-screen"
			role="status"
			inert={!open}
			className={cn(s.root(), className)}
		>
			<span className={s.srOnly()}>{statusLabel(label, progress)}</span>
			{logo ? (
				<div aria-hidden className={s.logo()}>
					{logo}
				</div>
			) : null}
			{indicator !== "none" ? (
				<div aria-hidden className={s.indicator()}>
					{indicator === "bar" ? (
						<Progress
							value={progress ?? 0}
							indeterminate={progress === undefined}
							size="sm"
							className="w-28"
						/>
					) : indicator === "spinner" ? (
						<Spinner size="default" label={label} />
					) : (
						<span className={s.dots()}>
							{[0, 1, 2].map((i) => (
								<span
									key={i}
									className={s.dot()}
									style={{ animationDelay: `${i * 160}ms` }}
								/>
							))}
						</span>
					)}
				</div>
			) : null}
			{caption ? <p className={s.caption()}>{caption}</p> : null}
		</div>
	);
}
