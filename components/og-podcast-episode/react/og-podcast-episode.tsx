import { cn } from "../../lib/cn";
import {
	type OgPodcastEpisodeLayout,
	type OgPodcastEpisodeMode,
	type OgPodcastEpisodeTone,
	ogPodcastEpisode,
} from "../variants";
import { OG_PODCAST_WAVE, waveBarHeights } from "../waveform";

export type { OgPodcastEpisodeLayout, OgPodcastEpisodeMode, OgPodcastEpisodeTone };

export interface OgPodcastEpisodeProps {
	title: string;
	/** Show name, top of the text column. */
	show: string;
	/** Cover art URL; a mic mark fills the sleeve when omitted. */
	cover?: string;
	/** Pre-formatted, e.g. "EP 142". */
	episode?: string;
	guest?: { name: string; avatar?: string };
	/** Pre-formatted, e.g. "48:12". */
	duration?: string;
	/** Waveform bar heights from 0 to 1; a static motif is drawn when omitted. */
	peaks?: number[];
	mode?: OgPodcastEpisodeMode;
	tone?: OgPodcastEpisodeTone;
	layout?: OgPodcastEpisodeLayout;
	className?: string;
}

/** A 1200x630 podcast episode card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgPodcastEpisode({
	title,
	show,
	cover,
	episode,
	guest,
	duration,
	peaks,
	mode = "light",
	tone = "neutral",
	layout = "left",
	className,
}: OgPodcastEpisodeProps) {
	const s = ogPodcastEpisode({ mode, tone, layout });
	const bars = waveBarHeights(peaks?.length ? peaks : OG_PODCAST_WAVE);
	return (
		<div data-slot="og-podcast-episode" className={cn(s.root(), className)}>
			<div className={s.dots()} />
			<div className={s.glow()} />
			<div className={s.art()}>
				<div className={s.disc()}>
					<div className={s.discRing()}>
						<div className={s.discLabel()} />
					</div>
				</div>
				<div className={s.cover()}>
					{cover ? (
						<img src={cover} alt="" className={s.coverImage()} />
					) : (
						<div className={s.coverFallback()}>
							<svg
								aria-hidden="true"
								width="160"
								height="160"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -6 0z" />
								<path d="M5 10a7 7 0 0 0 14 0" />
								<path d="M8 21h8" />
								<path d="M12 17v4" />
							</svg>
						</div>
					)}
				</div>
			</div>
			<div className={s.content()}>
				<div className={s.header()}>
					<span className={s.show()}>{show}</span>
					{episode ? <span className={s.episode()}>{episode}</span> : null}
				</div>
				<div className={s.body()}>
					<h1 className={s.title()}>{title}</h1>
					{guest ? (
						<div className={s.guest()}>
							{guest.avatar ? (
								<img src={guest.avatar} alt="" className={s.guestAvatar()} />
							) : null}
							<span>with</span>
							<span className={s.guestName()}>{guest.name}</span>
						</div>
					) : null}
				</div>
				<div className={s.player()}>
					<div className={s.play()}>
						<svg
							aria-hidden="true"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinejoin="round"
						>
							<path d="M7 4v16l13 -8z" />
						</svg>
					</div>
					<div className={s.wave()}>
						{bars.map((h, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							<div key={i} className={s.bar()} style={{ height: `${h}px` }} />
						))}
					</div>
					{duration ? <span className={s.duration()}>{duration}</span> : null}
				</div>
			</div>
		</div>
	);
}
