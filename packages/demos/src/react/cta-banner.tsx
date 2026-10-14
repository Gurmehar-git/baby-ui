"use client";

import {
	BANNER_SPOTS,
	Button,
	CtaBanner,
	CtaBannerActions,
	CtaBannerBadge,
	CtaBannerContent,
	CtaBannerDescription,
	CtaBannerEyebrow,
	CtaBannerFloater,
	CtaBannerGrain,
	type CtaBannerGrainProps,
	CtaBannerNote,
	type CtaBannerProps,
	CtaBannerSpotlight,
	type CtaBannerSpotlightProps,
	CtaBannerTicker,
	type CtaBannerTickerProps,
	CtaBannerTitle,
} from "@baby-ui/react";
import { BANNER_ICONS } from "../data/cta-banner";
import { controlProps } from "../data/preview-props";

type Controls = Partial<
	CtaBannerProps & CtaBannerGrainProps & CtaBannerTickerProps & CtaBannerSpotlightProps
> & { title?: string };

function Stroke({ paths }: { paths: readonly string[] }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{paths.map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

// The site's h2 face is a display font; demos stay on the body face.
const FRAME = "w-full max-w-6xl [&_h2]:font-sans";

export function CtaBannerDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<Controls>(props);
	const root = {
		size: p.size,
		tint: p.tint,
		speed: p.speed === undefined ? undefined : Number(p.speed),
		className: FRAME,
	};

	if (p.variant === "ticker")
		return (
			<CtaBanner variant="ticker" {...root}>
				<CtaBannerTicker
					word="Baby UI"
					mark={<Stroke paths={BANNER_ICONS.floaters[5]} />}
					angle={p.angle === undefined ? undefined : Number(p.angle)}
					rows={p.rows === undefined ? undefined : Number(p.rows)}
					veil={p.veil}
				/>
				<CtaBannerContent>
					<CtaBannerTitle>{p.title ?? "Ready to build?"}</CtaBannerTitle>
					<CtaBannerDescription>
						Install any component as source with the shadcn CLI, in React or Svelte, and
						own every line.
					</CtaBannerDescription>
					<CtaBannerActions>
						<Button size="lg" variant="secondary">
							Get started
						</Button>
						<Button size="lg" variant="dark">
							Browse components
						</Button>
					</CtaBannerActions>
				</CtaBannerContent>
			</CtaBanner>
		);

	if (p.variant === "spotlight")
		return (
			<CtaBanner variant="spotlight" {...root}>
				<CtaBannerSpotlight
					radius={p.radius === undefined ? undefined : Number(p.radius)}
					grid={p.grid}
					sweep={p.sweep}
				/>
				<CtaBannerContent>
					<CtaBannerEyebrow>React and Svelte</CtaBannerEyebrow>
					<CtaBannerTitle>{p.title ?? "Ship the page tonight"}</CtaBannerTitle>
					<CtaBannerDescription>
						Every component installs as source, so the last ten percent is yours to
						change.
					</CtaBannerDescription>
					<CtaBannerActions>
						<Button size="lg" variant="secondary">
							Get started
						</Button>
						<Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
							Browse components
						</Button>
					</CtaBannerActions>
					<CtaBannerNote>Free for personal and commercial use.</CtaBannerNote>
				</CtaBannerContent>
			</CtaBanner>
		);

	return (
		<CtaBanner variant="grain" {...root}>
			<CtaBannerGrain
				noise={p.noise === undefined ? undefined : Number(p.noise)}
				lines={p.lines}
			/>
			{BANNER_ICONS.floaters.map((paths, i) => {
				const spot = BANNER_SPOTS[i];
				return spot ? (
					<CtaBannerFloater
						key={paths[0]}
						x={spot.x}
						y={spot.y}
						delay={spot.delay}
						duration={6 + i}
						className={spot.size}
					>
						<Stroke paths={paths} />
					</CtaBannerFloater>
				) : null;
			})}
			<CtaBannerContent>
				<CtaBannerBadge>
					<Stroke paths={BANNER_ICONS.badge} />
				</CtaBannerBadge>
				<CtaBannerTitle>
					{p.title ?? "One spec. Two frameworks. Every component."}
				</CtaBannerTitle>
				<CtaBannerActions>
					<Button variant="dark">Browse components</Button>
					<Button variant="secondary">Star on GitHub</Button>
				</CtaBannerActions>
				<CtaBannerNote>
					No account, no lock-in.
					<strong>The source lands in your repo, ready to change.</strong>
				</CtaBannerNote>
			</CtaBannerContent>
		</CtaBanner>
	);
}
