"use client";

import {
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/react/cn";
import {
	ORBIT_HERO_LABELS,
	ORBIT_HERO_TONES,
	ORBIT_INNER_RADIUS,
	ORBIT_OUTER_RADIUS,
	orbitDelay,
	orbitPlace,
	spinOrbits,
} from "./orbit";
import type {
	OrbitHeroAction,
	OrbitHeroGroup,
	OrbitHeroLabels,
	OrbitHeroTone,
} from "./types";
import { type OrbitHeroSize, type OrbitHeroVariant, orbitHero } from "./variants";

export type {
	OrbitHeroAction,
	OrbitHeroGroup,
	OrbitHeroLabels,
	OrbitHeroSize,
	OrbitHeroTone,
	OrbitHeroVariant,
};

export interface OrbitHeroProps<T> extends Omit<HTMLAttributes<HTMLElement>, "title"> {
	headline: string;
	/** A second, muted headline line. */
	subheading?: string;
	description?: string;
	/** Pill above the headline. */
	badge?: string;
	/** The first is the primary action; the rest are outlined. */
	actions?: OrbitHeroAction[];
	/** Item sets for the rings; the centre's top half cycles through them. */
	groups: OrbitHeroGroup<T>[];
	/** Draws one ring item, usually a 24px-grid icon; it is sized to 32px. */
	renderItem: (item: T) => ReactNode;
	tones?: OrbitHeroTone[];
	/** Index into `groups`. Controlled when set. */
	group?: number;
	defaultGroup?: number;
	onGroupChange?: (group: number) => void;
	/** Index into `tones`. Controlled when set. */
	tone?: number;
	defaultTone?: number;
	onToneChange?: (tone: number) => void;
	/** Ms between automatic changes, alternating group and tone; 0 stops them. */
	interval?: number;
	labels?: Partial<OrbitHeroLabels>;
	variant?: OrbitHeroVariant;
	size?: OrbitHeroSize;
}

function useControlled(
	prop: number | undefined,
	initial: number,
	onChange?: (v: number) => void,
) {
	const [inner, setInner] = useState(initial);
	const value = prop ?? inner;
	const notify = useRef(onChange);
	notify.current = onChange;
	const controlled = prop !== undefined;
	const set = useCallback(
		(next: number) => {
			if (!controlled) setInner(next);
			notify.current?.(next);
		},
		[controlled],
	);
	return [value, set] as const;
}

/** The value shown before the last change, and a counter that re-keys the swap animation. */
function useSwap(value: number) {
	const [swap, setSwap] = useState({ at: value, from: -1, beat: 0 });
	if (swap.at !== value) {
		const next = { at: value, from: swap.at, beat: swap.beat + 1 };
		setSwap(next);
		return next;
	}
	return swap;
}

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const wrap = (index: number, length: number) =>
	length ? ((index % length) + length) % length : 0;

export function OrbitHero<T>({
	headline,
	subheading,
	description,
	badge,
	actions = [],
	groups,
	renderItem,
	tones = ORBIT_HERO_TONES,
	group: groupProp,
	defaultGroup = 0,
	onGroupChange,
	tone: toneProp,
	defaultTone = 0,
	onToneChange,
	interval = 4000,
	labels: labelsProp,
	variant = "panel",
	size = "screen",
	className,
	style,
	...props
}: OrbitHeroProps<T>) {
	const s = orbitHero({ variant, size });
	const labels = { ...ORBIT_HERO_LABELS, ...labelsProp };
	const noiseId = useId();
	const [groupRaw, setGroup] = useControlled(groupProp, defaultGroup, onGroupChange);
	const [toneRaw, setTone] = useControlled(toneProp, defaultTone, onToneChange);
	const groupIndex = wrap(groupRaw, groups.length);
	const toneIndex = wrap(toneRaw, tones.length);
	const groupSwap = useSwap(groupIndex);
	const toneSwap = useSwap(toneIndex);
	const current = groups[groupIndex];
	const previous = groups[groupSwap.from];
	const tone = tones[toneIndex];
	const live = actions.filter((a) => a.href !== undefined || a.onClick !== undefined);
	const counts = groups.map((g) => g.count ?? g.outer.length + g.inner.length);
	const maxCount = Math.max(1, ...counts);

	const nextGroup = () => setGroup(wrap(groupIndex + 1, groups.length));
	const nextTone = () => setTone(wrap(toneIndex + 1, tones.length));
	const advance = useRef({ nextGroup, nextTone });
	advance.current = { nextGroup, nextTone };

	useEffect(() => {
		if (!interval || reducedMotion()) return;
		let cycle = 0;
		const id = setInterval(() => {
			if (cycle % 2 === 0) advance.current.nextGroup();
			else advance.current.nextTone();
			cycle += 1;
		}, interval);
		return () => clearInterval(id);
	}, [interval]);

	const stageRef = useRef<HTMLDivElement>(null);
	const outerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const [stage, outer, inner] = [stageRef.current, outerRef.current, innerRef.current];
		if (!stage || !outer || !inner || reducedMotion()) return;
		return spinOrbits(stage, outer, inner);
	}, []);

	const ring = (items: T[], radius: number, reverse: boolean, cls: string) =>
		items.map((item, i) => (
			<span
				// biome-ignore lint/suspicious/noArrayIndexKey: ring slots are positional and items can repeat.
				key={i}
				className={cn(s.item(), cls)}
				style={
					{
						translate: orbitPlace(i, items.length, radius),
						"--orbit-delay": orbitDelay(reverse ? items.length - i - 1 : i),
					} as CSSProperties
				}
			>
				{renderItem(item)}
			</span>
		));

	const rings = (g: OrbitHeroGroup<T>, which: "outer" | "inner", cls: string) =>
		which === "outer"
			? ring(g.outer, ORBIT_OUTER_RADIUS, false, cls)
			: ring(g.inner, ORBIT_INNER_RADIUS, true, cls);

	const swapping = groupSwap.beat > 0 && previous !== undefined;
	const inClass = groupSwap.beat > 0 ? "orbit-hero-in" : "";

	return (
		<section
			data-slot="orbit-hero"
			className={cn(s.root(), className)}
			style={{ ...style, "--orbit-tone": tone?.color } as CSSProperties}
			{...props}
		>
			<div className={s.panel()}>
				<svg aria-hidden className={s.noise()}>
					<filter id={noiseId}>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.54"
							numOctaves={4}
							stitchTiles="stitch"
						/>
						<feColorMatrix type="saturate" values="0" />
						<feComponentTransfer>
							<feFuncR type="linear" slope="0.61" />
							<feFuncG type="linear" slope="0.61" />
							<feFuncB type="linear" slope="0.61" />
							<feFuncA type="linear" slope="1" />
						</feComponentTransfer>
						<feComponentTransfer>
							<feFuncR type="linear" slope="3" intercept="-1" />
							<feFuncG type="linear" slope="3" intercept="-1" />
							<feFuncB type="linear" slope="3" intercept="-1" />
						</feComponentTransfer>
					</filter>
					<rect width="100%" height="100%" filter={`url(#${noiseId})`} />
				</svg>
				<div aria-hidden className={s.glow()} />
				<div aria-hidden className={s.glowWarm()} />
				<div aria-hidden className={s.vignette()} />

				<div className={s.content()}>
					{badge ? (
						<Badge variant="outline" className={s.badge()}>
							{badge}
						</Badge>
					) : null}
					<h1 className={s.title()}>
						{headline}
						{subheading ? (
							<>
								<br />
								<span className={s.subheading()}>{subheading}</span>
							</>
						) : null}
					</h1>
					{description ? <p className={s.description()}>{description}</p> : null}
					{live.length ? (
						<div className={s.actions()}>
							{live.map((action, i) => {
								const v = i === 0 ? "default" : "outline";
								return action.href !== undefined ? (
									<Button
										// biome-ignore lint/suspicious/noArrayIndexKey: actions render in a fixed order and can repeat.
										key={i}
										href={action.href}
										target={action.target}
										rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
										variant={v}
										size="lg"
										onClick={action.onClick}
									>
										{action.label}
									</Button>
								) : (
									<Button
										// biome-ignore lint/suspicious/noArrayIndexKey: actions render in a fixed order and can repeat.
										key={i}
										variant={v}
										size="lg"
										onClick={action.onClick}
									>
										{action.label}
									</Button>
								);
							})}
						</div>
					) : null}
				</div>

				<div ref={stageRef} className={s.stage()}>
					{current ? (
						<div aria-hidden className={s.readouts()}>
							<div className={s.countReadout()}>
								<div className={s.readoutRow()}>
									<span className={s.readoutLabel()}>{current.label}</span>
									<span key={groupSwap.beat} className={s.readoutValue()}>
										{counts[groupIndex]}
									</span>
								</div>
								<div className={s.bars()}>
									{counts.map((count, i) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: one bar per group, in group order.
											key={i}
											data-active={i === groupIndex}
											className={s.bar()}
											style={{ height: `${Math.max(3, (count / maxCount) * 28)}px` }}
										/>
									))}
								</div>
							</div>
							<div className={s.toneReadout()}>
								<div className={s.readoutRow()}>
									<span className={s.swatch()} />
									<span className={s.readoutLabel()}>Tone</span>
									<span key={toneSwap.beat} className={s.toneValue()}>
										{tone?.label}
									</span>
								</div>
							</div>
						</div>
					) : null}

					<div className={s.wheel()}>
						<div className={s.visual()}>
							<div className={s.ringBox()}>
								<div className={s.ringOuter()} />
							</div>
							<div className={s.ringBox()}>
								<div className={s.ringMiddle()} />
							</div>
							<div className={s.ringBox()}>
								<div className={s.ringInner()} />
							</div>

							<div aria-hidden className={s.orbits()}>
								<div ref={outerRef} className={s.orbit()}>
									{swapping ? (
										<span key={`out-${groupSwap.beat}`}>
											{rings(previous, "outer", "orbit-hero-out")}
										</span>
									) : null}
									{current ? (
										<span key={`in-${groupSwap.beat}`}>
											{rings(current, "outer", inClass)}
										</span>
									) : null}
								</div>
								<div ref={innerRef} className={s.orbit()}>
									{swapping ? (
										<span key={`out-${groupSwap.beat}`}>
											{rings(previous, "inner", "orbit-hero-out")}
										</span>
									) : null}
									{current ? (
										<span key={`in-${groupSwap.beat}`}>
											{rings(current, "inner", inClass)}
										</span>
									) : null}
								</div>
							</div>

							<div className={s.controlsBox()}>
								<div className={s.controls()}>
									<Button
										variant="ghost"
										className={s.groupControl()}
										aria-label={`${labels.group}, currently ${current?.label ?? ""}`}
										onClick={nextGroup}
									>
										{swapping ? (
											<span
												key={`out-${groupSwap.beat}`}
												className={cn(s.groupLabel(), "orbit-hero-label-out")}
											>
												{previous.label}
											</span>
										) : null}
										<span
											key={`in-${groupSwap.beat}`}
											className={cn(
												s.groupLabel(),
												groupSwap.beat > 0 && "orbit-hero-label-in",
											)}
										>
											{current?.label}
										</span>
									</Button>
									<Button
										variant="ghost"
										className={s.toneControl()}
										aria-label={`${labels.tone}, currently ${tone?.label ?? ""}`}
										onClick={nextTone}
									>
										{toneSwap.beat > 0 && tones[toneSwap.from] ? (
											<span
												key={`out-${toneSwap.beat}`}
												className={cn(s.toneLabel(), "orbit-hero-label-out")}
											>
												{tones[toneSwap.from]?.label}
											</span>
										) : null}
										<span
											key={`in-${toneSwap.beat}`}
											className={cn(
												s.toneLabel(),
												toneSwap.beat > 0 && "orbit-hero-label-in",
											)}
										>
											{tone?.label}
										</span>
									</Button>
								</div>
							</div>

							{groupSwap.beat + toneSwap.beat > 0 ? (
								<span
									aria-hidden
									key={groupSwap.beat + toneSwap.beat}
									className={s.ripple()}
								/>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
