"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { Sparkline } from "../../sparkline/react/sparkline";
import {
	distributionBars,
	type Stat,
	type StatBar,
	type StatVisual,
	statFormat,
	uptimeBars,
	WORLD,
	worldDots,
} from "../stats";
import { type StatsBandVariant, statsBand } from "../variants";

export type { Stat, StatsBandVariant, StatVisual };

export interface StatsBandProps {
	/** Three or four read best. */
	stats: Stat[];
	/** `plain` floats the stats on whitespace; `divided` sets them in a hairline grid. */
	variant?: StatsBandVariant;
	title?: string;
	description?: string;
	locale?: string;
	className?: string;
}

/** Headline numbers that count up once seen, each with an optional tiny visual that proves it. */
export function StatsBand({
	stats,
	variant = "plain",
	title,
	description,
	locale,
	className,
}: StatsBandProps) {
	const id = useId();
	const s = statsBand({ variant });
	const ref = useRef<HTMLElement>(null);
	const [seen, setSeen] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				setSeen(true);
				observer.disconnect();
			},
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const withVisuals = stats.some((stat) => stat.visual);

	return (
		<section
			ref={ref}
			data-slot="stats-band"
			data-variant={variant}
			data-seen={seen}
			aria-labelledby={title ? `${id}-title` : undefined}
			aria-label={title ? undefined : "Key numbers"}
			className={cn(s.root(), className)}
		>
			<div className={s.inner()}>
				{title || description ? (
					<header className={s.header()}>
						{title ? (
							<h2 id={`${id}-title`} className={s.title()}>
								{title}
							</h2>
						) : null}
						{description ? <p className={s.description()}>{description}</p> : null}
					</header>
				) : null}
				<dl
					className={s.stats()}
					style={{ "--count": Math.min(stats.length, 4) } as CSSProperties}
				>
					{stats.map((stat, index) => {
						const { unit, format } = statFormat(stat, locale);
						const suffix = `${unit}${stat.suffix ?? ""}`;
						return (
							<div
								key={stat.label}
								data-context={Boolean(stat.context && stat.detail)}
								tabIndex={stat.context ? 0 : undefined}
								className={s.stat()}
								style={{ "--i": index } as CSSProperties}
							>
								<dt className={s.label()}>{stat.label}</dt>
								<dd className={s.figure()}>
									{stat.prefix ? <span className={s.affix()}>{stat.prefix}</span> : null}
									<RollingDigits variant="count" value={stat.value} format={format} />
									{suffix ? <span className={s.affix()}>{suffix}</span> : null}
								</dd>
								{stat.detail || stat.context ? (
									<dd className={s.caption()}>
										{stat.detail ? (
											<span className={s.detail()}>{stat.detail}</span>
										) : null}
										{stat.context ? (
											<span className={s.context()}>{stat.context}</span>
										) : null}
									</dd>
								) : null}
								{withVisuals ? (
									<dd aria-hidden="true" className={s.visual()}>
										{stat.visual ? (
											<Visual visual={stat.visual} label={stat.label} styles={s} />
										) : null}
									</dd>
								) : null}
							</div>
						);
					})}
				</dl>
			</div>
		</section>
	);
}

function Bars({
	bars,
	dense,
	styles,
}: {
	bars: StatBar[];
	dense?: boolean;
	styles: ReturnType<typeof statsBand>;
}) {
	return (
		<div data-dense={dense} className={styles.bars()}>
			{bars.map((bar, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: bars are positional and never reorder.
					key={index}
					data-ink={bar.ink}
					className={styles.bar()}
					style={{ "--h": bar.height, "--j": index / bars.length } as CSSProperties}
				/>
			))}
		</div>
	);
}

function Visual({
	visual,
	label,
	styles,
}: {
	visual: StatVisual;
	label: string;
	styles: ReturnType<typeof statsBand>;
}) {
	if (visual.kind === "trend")
		return (
			<Sparkline data={visual.values} label={label} interactive={false} height={40} />
		);
	if (visual.kind === "uptime")
		return <Bars bars={uptimeBars(visual.days)} dense styles={styles} />;
	if (visual.kind === "distribution")
		return (
			<Bars
				bars={distributionBars(visual.bins, visual.max, visual.marker)}
				styles={styles}
			/>
		);
	return (
		<svg
			aria-hidden="true"
			viewBox={`0 0 ${WORLD.columns} ${WORLD.rows}`}
			className={styles.map()}
		>
			{worldDots(visual.points).map((dot) => (
				<circle
					key={dot.key}
					cx={dot.x}
					cy={dot.y}
					r={dot.lit ? 0.5 : 0.3}
					className={dot.lit ? styles.lit() : styles.land()}
				/>
			))}
		</svg>
	);
}
