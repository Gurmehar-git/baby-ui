import { cn } from "../../lib/react/cn";
import {
	OG_GITHUB_REPO_ICONS,
	OG_GITHUB_REPO_WEEKS,
	type OgGithubRepoMode,
	type OgGithubRepoTone,
	ogGithubRepo,
	ogGithubRepoCell,
} from "./variants";

export type { OgGithubRepoMode, OgGithubRepoTone };

export interface OgGithubRepoProps {
	owner: string;
	/** Repository name, the focal line. */
	name: string;
	description?: string;
	/** Owner avatar URL. */
	avatar?: string;
	language?: string;
	/** Pre-formatted counts, e.g. "12.4k". */
	stars?: string;
	forks?: string;
	issues?: string;
	/** Contributor avatar URLs; the first five are stacked. */
	contributors?: string[];
	/** Pre-formatted overflow chip, e.g. "+128". */
	contributorCount?: string;
	mode?: OgGithubRepoMode;
	tone?: OgGithubRepoTone;
	className?: string;
}

/** A 1200x630 repository card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgGithubRepo({
	owner,
	name,
	description,
	avatar,
	language,
	stars,
	forks,
	issues,
	contributors,
	contributorCount,
	mode = "light",
	tone = "chart",
	className,
}: OgGithubRepoProps) {
	const s = ogGithubRepo({ mode, tone });
	const stats = (["stars", "forks", "issues"] as const)
		.map((key) => ({ key, value: { stars, forks, issues }[key] }))
		.filter((stat) => stat.value);
	const faces = contributors?.slice(0, 5) ?? [];
	const crew = faces.length > 0 || Boolean(contributorCount);
	return (
		<div data-slot="og-github-repo" className={cn(s.root(), className)}>
			<div className={s.heatmap()}>
				{OG_GITHUB_REPO_WEEKS.map((week, w) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					<div key={`w${w}`} className={s.week()}>
						{week.map((level, d) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							<span key={`d${d}`} className={cn(s.cell(), ogGithubRepoCell({ level }))} />
						))}
					</div>
				))}
			</div>
			<div className={s.owner()}>
				{avatar ? <img src={avatar} alt="" className={s.ownerAvatar()} /> : null}
				<span className={s.ownerName()}>{owner} /</span>
			</div>
			<h1 className={s.name()}>{name}</h1>
			{description ? <p className={s.description()}>{description}</p> : null}
			{language || stats.length || crew ? (
				<div className={s.footer()}>
					{language ? (
						<span className={s.language()}>
							<span className={s.languageDot()} />
							<span className={s.languageName()}>{language}</span>
						</span>
					) : null}
					{stats.map((stat) => (
						<span key={stat.key} className={s.stat()}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={s.icon()}
								aria-hidden="true"
							>
								{OG_GITHUB_REPO_ICONS[stat.key].map((d) => (
									<path key={d} d={d} />
								))}
							</svg>
							{stat.value}
						</span>
					))}
					{crew ? (
						<span className={s.stack()}>
							{faces.map((src, i) => (
								<img
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									key={`${i}-${src}`}
									src={src}
									alt=""
									className={cn(s.avatar(), i > 0 && s.overlap())}
								/>
							))}
							{contributorCount ? (
								<span className={cn(s.more(), faces.length > 0 && s.overlap())}>
									{contributorCount}
								</span>
							) : null}
						</span>
					) : null}
				</div>
			) : null}
		</div>
	);
}
