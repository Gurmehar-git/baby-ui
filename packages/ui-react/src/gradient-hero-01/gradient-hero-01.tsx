import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { CopyButton } from "../copy-button/copy-button";
import { cn } from "../lib/cn";
import type { GradientHero01Action } from "./types";
import {
	type GradientHero01Size,
	type GradientHero01Tone,
	gradientHero01,
} from "./variants";

export type { GradientHero01Action, GradientHero01Size, GradientHero01Tone };

export interface GradientHero01Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
	headline: string;
	description?: string;
	/** Pill above the headline. */
	badge?: string;
	/** The first is the primary action; the rest are outlined. */
	actions?: GradientHero01Action[];
	tone?: GradientHero01Tone;
	size?: GradientHero01Size;
	/** An install command in a pill with a copy button, e.g. `npm i acme`. */
	install?: string;
	/** Small facts under the actions, e.g. the version and licence. */
	meta?: string[];
	/** A visual beside the copy; the hero switches to a split layout. */
	media?: ReactNode;
}

export function GradientHero01({
	headline,
	description,
	badge,
	actions = [],
	tone = "chart",
	size = "screen",
	install,
	meta = [],
	media,
	className,
	...props
}: GradientHero01Props) {
	const s = gradientHero01({ tone, size, split: Boolean(media) });
	const live = actions.filter((a) => a.href !== undefined || a.onClick !== undefined);

	return (
		<section data-slot="gradient-hero-01" className={cn(s.root(), className)} {...props}>
			<div aria-hidden className={s.blob()} />
			<div aria-hidden className={s.wash()} />
			<div aria-hidden className={s.vignette()} />
			<div aria-hidden className={s.fade()} />
			<div className={s.inner()}>
				<div className={s.copy()}>
					{badge ? (
						<Badge variant="outline" className={s.badge()}>
							{badge}
						</Badge>
					) : null}
					<h1 className={s.title()}>{headline}</h1>
					{description ? <p className={s.description()}>{description}</p> : null}
					{live.length ? (
						<div className={s.actions()}>
							{live.map((action, i) => {
								const variant = i === 0 ? "default" : "outline";
								return action.href !== undefined ? (
									<Button
										// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
										key={i}
										href={action.href}
										variant={variant}
										size="lg"
										className={s.action()}
										onClick={action.onClick}
									>
										{action.label}
									</Button>
								) : (
									<Button
										// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
										key={i}
										variant={variant}
										size="lg"
										className={s.action()}
										onClick={action.onClick}
									>
										{action.label}
									</Button>
								);
							})}
						</div>
					) : null}
					{install ? (
						<div className={s.install()}>
							<span aria-hidden>$</span>
							<code>{install}</code>
							<CopyButton text={install} label="Copy install command" iconOnly />
						</div>
					) : null}
					{meta.length ? (
						<ul className={s.meta()}>
							{meta.map((fact) => (
								<li key={fact}>{fact}</li>
							))}
						</ul>
					) : null}
				</div>
				{media ? <div className={s.media()}>{media}</div> : null}
			</div>
		</section>
	);
}
