"use client";

import { useId, useLayoutEffect, useMemo } from "react";
import { seriesVisibleInPhase } from "../../chart/core";
import { useExtentRegistry, usePlot } from "../../chart/react/time-series";
import { cn } from "../../lib/cn";
import {
	bezierPath,
	type ProjectionPoint,
	projectionExtent,
	visibleEndX,
} from "../geometry";
import {
	type ProjectionLineCurve,
	type ProjectionLineVariant,
	projectionLine,
} from "../variants";

export interface ProjectionLineProps {
	/** Anchor plus horizon, e.g. from `buildProjection`; the chart widens to fit it. */
	data: ProjectionPoint[];
	variant?: ProjectionLineVariant;
	curve?: ProjectionLineCurve;
	stroke?: string;
	/** End colour when `variant` is gradient. */
	gradientEnd?: string;
	strokeWidth?: number;
	endMarker?: boolean;
	endRadius?: number;
	className?: string;
}

export function ProjectionLine({
	data,
	variant = "dashed",
	curve = "linear",
	stroke = "var(--chart-3)",
	gradientEnd = "var(--chart-5)",
	strokeWidth = 2,
	endMarker = true,
	endRadius = 5,
	className,
}: ProjectionLineProps) {
	const { xScale, yScale, innerWidth, phase, clipId } = usePlot();
	const register = useExtentRegistry();
	const id = useId().replace(/:/g, "");
	const extent = useMemo(() => projectionExtent(data), [data]);
	const extentKey = extent ? `${extent.x.join()}|${extent.y.join()}` : "";

	// biome-ignore lint/correctness/useExhaustiveDependencies: extentKey is a content key, so equal data does not re-run; extent left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		if (!extent) return;
		return register(id, extent);
	}, [register, id, extentKey]);

	const start = data[0];
	const end = data.at(-1);
	if (!(start && end) || data.length < 2) return null;
	const x0 = xScale(start.date);
	const y0 = yScale(start.value);
	const x1 = visibleEndX(
		xScale(end.date),
		innerWidth,
		endMarker ? endRadius : 0,
		strokeWidth,
	);
	const y1 = yScale(end.value);
	const d = curve === "bezier" ? bezierPath(x0, y0, x1, y1) : `M${x0},${y0}L${x1},${y1}`;
	const drawn = seriesVisibleInPhase(phase);
	const color = variant === "gradient" ? `url(#${id}-g)` : stroke;
	const styles = projectionLine({ variant, curve });

	return (
		<g data-slot="chart-projection" className={className}>
			{variant === "gradient" ? (
				<defs>
					<linearGradient
						id={`${id}-g`}
						gradientUnits="userSpaceOnUse"
						x1={x0}
						x2={x1}
						y1={y0}
						y2={y1}
					>
						<stop offset="0%" stopColor={stroke} />
						<stop offset="100%" stopColor={gradientEnd} />
					</linearGradient>
				</defs>
			) : null}
			<g clipPath={`url(#${clipId})`}>
				<path
					d={d}
					className={cn(styles.line())}
					stroke={drawn ? color : "transparent"}
					strokeWidth={strokeWidth}
				/>
			</g>
			{endMarker ? (
				<circle
					data-slot="chart-projection-end"
					cx={x1}
					cy={y1}
					r={endRadius * 0.85}
					fill={variant === "gradient" ? gradientEnd : stroke}
					className={styles.marker()}
					style={{ opacity: phase === "ready" ? 1 : 0 }}
				/>
			) : null}
		</g>
	);
}
