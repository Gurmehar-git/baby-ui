import { cn } from "../../lib/cn";
import {
	OG_JOB_RINGS,
	type OgJobPostingMode,
	type OgJobPostingTone,
	ogJobPosting,
} from "../variants";

export type { OgJobPostingMode, OgJobPostingTone };

export interface OgJobPostingProps {
	/** Role title, the headline. */
	title: string;
	company: string;
	logo?: string;
	/** Pill top right, e.g. "We're hiring". */
	badge?: string;
	/** Shown above the role, e.g. "Design team". */
	team?: string;
	location?: string;
	/** Swaps the location pin for a globe. */
	remote?: boolean;
	/** Pre-formatted range, e.g. "$160k to $200k". */
	salary?: string;
	/** e.g. "Full-time". */
	employment?: string;
	mode?: OgJobPostingMode;
	tone?: OgJobPostingTone;
	className?: string;
}

/** A 1200x630 job posting card. Render it to PNG with takumi-js. */
export function OgJobPosting({
	title,
	company,
	logo,
	badge,
	team,
	location,
	remote = false,
	salary,
	employment,
	mode = "light",
	tone = "neutral",
	className,
}: OgJobPostingProps) {
	const s = ogJobPosting({ mode, tone });
	return (
		<div data-slot="og-job-posting" className={cn(s.root(), className)}>
			{OG_JOB_RINGS.map((ring) => (
				<div key={ring} className={cn(s.ring(), ring)} />
			))}
			<div className={s.core()} />
			<div className={s.header()}>
				<div className={s.company()}>
					{logo ? (
						<span className={s.logoTile()}>
							<img src={logo} alt="" className={s.logo()} />
						</span>
					) : null}
					<span className={s.companyName()}>{company}</span>
				</div>
				{badge ? (
					<span className={s.badge()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
							className={s.badgeIcon()}
						>
							<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0" />
							<path d="M16 19h6" />
							<path d="M19 16v6" />
							<path d="M6 21v-2a4 4 0 0 1 4-4h4" />
						</svg>
						{badge}
					</span>
				) : null}
			</div>
			<div className={s.body()}>
				{team ? <span className={s.team()}>{team}</span> : null}
				<h1 className={s.title()}>{title}</h1>
				{location || salary || employment ? (
					<div className={s.strip()}>
						{location ? (
							<span className={s.cell()}>
								{remote ? (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										className={s.cellIcon()}
									>
										<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0" />
										<path d="M3.6 9h16.8" />
										<path d="M3.6 15h16.8" />
										<path d="M11.5 3a17 17 0 0 0 0 18" />
										<path d="M12.5 3a17 17 0 0 1 0 18" />
									</svg>
								) : (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										className={s.cellIcon()}
									>
										<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
										<path d="M17.66 16.66l-4.24 4.24a2 2 0 0 1-2.83 0l-4.25-4.24a8 8 0 1 1 11.32 0z" />
									</svg>
								)}
								<span className={s.cellText()}>{location}</span>
							</span>
						) : null}
						{salary ? (
							<>
								{location ? <span className={s.separator()} /> : null}
								<span className={s.cell()}>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										className={s.cellIcon()}
									>
										<path d="M7 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
										<path d="M12 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
										<path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
									</svg>
									<span className={s.cellText()}>{salary}</span>
								</span>
							</>
						) : null}
						{employment ? (
							<>
								{location || salary ? <span className={s.separator()} /> : null}
								<span className={s.cell()}>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										className={s.cellIcon()}
									>
										<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
										<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
										<path d="M12 12v.01" />
										<path d="M3 13a20 20 0 0 0 18 0" />
									</svg>
									<span className={s.cellText()}>{employment}</span>
								</span>
							</>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
}
