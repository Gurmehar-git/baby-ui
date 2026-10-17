import { cn } from "../../lib/cn";
import { AREA_H, AREA_W, sparklinePath } from "../sparkline";
import {
	type OgStatsMetricsMode,
	type OgStatsMetricsTone,
	type OgStatsMetricsTrend,
	ogStatsMetrics,
} from "../variants";

export type { OgStatsMetricsMode, OgStatsMetricsTone, OgStatsMetricsTrend };

export interface OgStatsMetricsStat {
	label: string;
	/** Pre-formatted, e.g. "$1.2M". */
	value: string;
	/** Pre-formatted, e.g. "+18%". Shown on the hero stat only. */
	delta?: string;
	trend?: OgStatsMetricsTrend;
}

export interface OgStatsMetricsProps {
	headline: string;
	/** First entry is the hero number; the next two print as one plain line; extras are dropped. */
	stats: OgStatsMetricsStat[];
	site?: string;
	logo?: string;
	/** Pre-formatted, e.g. "Q3 2026". */
	period?: string;
	/** Raw values drawn as the soft area shape behind the card. */
	sparkline?: number[];
	mode?: OgStatsMetricsMode;
	tone?: OgStatsMetricsTone;
	className?: string;
}

const UP = "M12 5l8 12h-16z";
const DOWN = "M12 19l8 -12h-16z";
const SEP = "  ·  ";

/** A 1200x630 card led by one big metric. Render it to PNG with takumi-js (see the docs recipe). */
export function OgStatsMetrics({
	headline,
	stats,
	site,
	logo,
	period,
	sparkline,
	mode = "light",
	tone = "neutral",
	className,
}: OgStatsMetricsProps) {
	const s = ogStatsMetrics({ mode, tone });
	const spark = sparkline ? sparklinePath(sparkline) : null;
	const [hero, ...rest] = stats;
	const secondary = rest
		.slice(0, 2)
		.map((stat) => `${stat.value} ${stat.label}`)
		.join(SEP);
	return (
		<div data-slot="og-stats-metrics" className={cn(s.root(), className)}>
			{spark ? (
				<svg
					aria-hidden="true"
					width={AREA_W}
					height={AREA_H}
					viewBox={`0 0 ${AREA_W} ${AREA_H}`}
					fill="none"
					className={s.area()}
				>
					<polygon points={spark.area} fill="currentColor" fillOpacity="0.12" />
					<polyline
						points={spark.line}
						stroke="currentColor"
						strokeOpacity="0.4"
						strokeWidth="5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			) : null}
			{site || logo || period ? (
				<div className={s.header()}>
					<div className={s.brand()}>
						{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
						{site ? <span className={s.site()}>{site}</span> : null}
					</div>
					{period ? <span className={s.period()}>{period}</span> : null}
				</div>
			) : null}
			<div className={s.body()}>
				{hero ? (
					<>
						<span className={s.label()}>{hero.label}</span>
						<div className={s.hero()}>
							<span className={s.value()}>{hero.value}</span>
							{hero.delta ? (
								<span className={s.delta({ trend: hero.trend ?? "up" })}>
									<svg
										aria-hidden="true"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
										className={s.deltaIcon()}
									>
										<path d={hero.trend === "down" ? DOWN : UP} />
									</svg>
									<span className={s.deltaText()}>{hero.delta}</span>
								</span>
							) : null}
						</div>
					</>
				) : null}
				<h1 className={s.headline()}>{headline}</h1>
				{secondary ? <span className={s.secondary()}>{secondary}</span> : null}
			</div>
		</div>
	);
}
