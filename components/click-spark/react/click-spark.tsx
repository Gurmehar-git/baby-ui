"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { createSparks } from "../sparks";
import { type ClickSparkScope, type ClickSparkTone, clickSpark } from "../variants";

export type { ClickSparkScope, ClickSparkTone };

export interface ClickSparkProps {
	tone?: ClickSparkTone;
	/** `page` covers the viewport; `parent` fills and listens on a positioned parent only. */
	scope?: ClickSparkScope;
	/** Lines per burst. */
	count?: number;
	/** Starting line length, px. */
	size?: number;
	/** How far the lines travel, px. */
	radius?: number;
	durationMs?: number;
	className?: string;
}

/** Mount once near the root for page-wide bursts, or inside a positioned box with `scope="parent"`. */
export function ClickSpark({
	tone = "foreground",
	scope = "page",
	count = 8,
	size = 10,
	radius = 15,
	durationMs = 400,
	className,
}: ClickSparkProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sparksRef = useRef<ReturnType<typeof createSparks>>(null);
	const options = { count, size, radius, durationMs };

	// biome-ignore lint/correctness/useExhaustiveDependencies: options left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!canvasRef.current) return;
		const sparks = createSparks(canvasRef.current, scope, options);
		sparksRef.current = sparks;
		return () => sparks.destroy();
	}, [scope]);

	useEffect(() => {
		sparksRef.current?.update(options);
	});

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas without tabIndex is not focusable
		<canvas
			ref={canvasRef}
			data-slot="click-spark"
			aria-hidden="true"
			className={cn(clickSpark({ tone, scope }), className)}
		/>
	);
}
