"use client";

import {
	DiaText,
	MorphText,
	RevealText,
	RollingDigits,
	ShimmerText,
	TextLoop,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const DIA_WORDS = ["fast.", "focused.", "effortlessly smooth."];
const LOOP_ITEMS = ["Design", "Build", "Ship", "Iterate"];
const MORPH_WORDS = ["fast", "fluid", "alive"];

export function DiaTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DiaText>>(props);
	return (
		<p className="max-w-4xl text-center font-light text-3xl text-foreground tracking-tight sm:text-4xl">
			Make interfaces feel{" "}
			<DiaText
				text={DIA_WORDS}
				repeat
				durationMs={Number(props.durationMs ?? 1500)}
				delayMs={Number(props.delayMs ?? 0)}
				repeatDelayMs={Number(props.repeatDelayMs ?? 500)}
				fixedWidth={Boolean(props.fixedWidth ?? false)}
				size={p.size ?? "inherit"}
			/>
		</p>
	);
}

export function MorphTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MorphText>>(props);
	return (
		<p className="max-w-4xl text-center font-light text-2xl text-foreground tracking-tight sm:text-4xl">
			Build software that feels{" "}
			<MorphText
				words={MORPH_WORDS}
				defaultIndex={Number(props.defaultIndex ?? 0)}
				intervalMs={Number(props.intervalMs ?? 3000)}
				subtext={p.subtext || undefined}
				size={p.size ?? "inherit"}
				className="font-semibold"
			/>
		</p>
	);
}

export function RevealTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof RevealText>>(props);
	const split = p.split ?? "word";
	const trigger = p.trigger ?? "mount";
	return (
		<div className="text-2xl">
			<RevealText
				key={`${p.variant}-${split}-${trigger}-${props.once}-${props.staggerMs}-${props.delayMs}-${props.blur}-${props.direction}-${props.staggerFrom}-${props.mask}`}
				as="h2"
				text="Design meets motion, one word at a time"
				variant={p.variant}
				split={split}
				trigger={trigger}
				once={Boolean(props.once ?? true)}
				staggerMs={Number(props.staggerMs ?? 90)}
				delayMs={Number(props.delayMs ?? 0)}
				blur={Number(props.blur ?? 12)}
				direction={p.direction ?? "up"}
				staggerFrom={p.staggerFrom ?? "start"}
				mask={props.mask === true}
				size={p.size ?? "inherit"}
				className="text-center font-semibold text-foreground tracking-tight"
			/>
		</div>
	);
}

export function ShimmerTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ShimmerText>>(props);
	return (
		<div className="text-lg">
			<ShimmerText
				text="Agent is thinking ..."
				durationMs={Number(props.durationMs ?? 2000)}
				spread={Number(props.spread ?? 2)}
				active={p.active ?? true}
				variant={p.variant}
				size={p.size ?? "inherit"}
				className="font-light tracking-tight"
			/>
		</div>
	);
}

export function TextLoopDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TextLoop>>(props);
	return (
		<p className="max-w-4xl text-center font-light text-foreground text-lg tracking-tight sm:text-xl">
			<TextLoop
				items={LOOP_ITEMS}
				defaultIndex={Number(props.defaultIndex ?? 0)}
				intervalMs={Number(props.intervalMs ?? 1000)}
				durationMs={Number(props.durationMs ?? 300)}
				variant={p.variant ?? "slide"}
				direction={p.direction ?? "up"}
				size={p.size ?? "inherit"}
				className="font-medium"
			/>{" "}
			software that ships faster.
		</p>
	);
}

const ROLLING_VALUES = [128400, 131250, 129600, 145000, 987000, 1024000];

export function RollingDigitsDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof RollingDigits>>(props);
	const [step, setStep] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setStep((s) => (s + 1) % ROLLING_VALUES.length), 1800);
		return () => clearInterval(id);
	}, []);
	return (
		<div className="text-5xl">
			<RollingDigits
				value={ROLLING_VALUES[step] ?? 0}
				pad={props.pad === undefined ? undefined : Number(props.pad)}
				locale={p.locale || undefined}
				startOnView={props.startOnView !== false}
				stepMs={Number(props.stepMs ?? 80)}
				variant={p.variant ?? "roll"}
				durationMs={props.durationMs === undefined ? undefined : Number(props.durationMs)}
				coalesce={props.coalesce === true}
				direction={p.direction ?? "dynamic"}
				offset={Number(props.offset ?? 32)}
				size={p.size ?? "inherit"}
				className="font-semibold text-foreground tracking-tight"
			/>
		</div>
	);
}
