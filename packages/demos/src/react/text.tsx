"use client";

import {
	AnimatedGradientText,
	GibberishText,
	GlitchText,
	MirrorText,
	RollText,
	TextTransition,
	TypingText,
	UnderlineHoverText,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function AnimatedGradientTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof AnimatedGradientText>>(props);
	return (
		<AnimatedGradientText
			as="h2"
			tone={p.tone ?? "primary"}
			durationSeconds={Number(props.durationSeconds ?? 3)}
			className="text-3xl font-semibold sm:text-4xl"
		>
			Ship it in seconds
		</AnimatedGradientText>
	);
}

export function UnderlineHoverTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof UnderlineHoverText>>(props);
	return (
		<p className="text-2xl text-foreground">
			Every{" "}
			<UnderlineHoverText
				variant={p.variant ?? "sweep"}
				tone={p.tone ?? "default"}
				trigger={p.trigger ?? "hover"}
				durationMs={Number(props.durationMs ?? 500)}
			>
				component
			</UnderlineHoverText>{" "}
			ships in both ports.
		</p>
	);
}

export function MirrorTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MirrorText>>(props);
	return (
		<MirrorText
			key={String(props.durationMs ?? "") + String(props.staggerMs ?? "")}
			text={p.text || "This is a text"}
			direction={p.direction ?? "up"}
			durationMs={Number(props.durationMs ?? 500)}
			staggerMs={Number(props.staggerMs ?? 67)}
			className="text-4xl font-light uppercase"
		/>
	);
}

export function GibberishTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof GibberishText>>(props);
	return (
		<GibberishText
			key={p.text || "Gibberish"}
			text={p.text || "Gibberish"}
			speedMs={Number(props.speedMs ?? 24)}
			size={p.size ?? "lg"}
			className="text-foreground"
		/>
	);
}

export function GlitchTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof GlitchText>>(props);
	return (
		<GlitchText
			text={p.text || "Glitch"}
			size={p.size ?? "default"}
			intensity={Number(props.intensity ?? 5)}
			durationSeconds={Number(props.durationSeconds ?? 2.5)}
			baseColor={p.baseColor || undefined}
			colorA={p.colorA || undefined}
			colorB={p.colorB || undefined}
			blendMode={p.blendMode ?? "screen"}
			className="text-foreground"
		/>
	);
}

export function RollTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof RollText>>(props);
	const to = p.to || undefined;
	const groupHover = props.groupHover === true && to === undefined;
	const roll = (
		<RollText
			text={p.text || "Roll on hover"}
			to={to}
			groupHover={groupHover}
			disabled={props.disabled === true}
			stagger={p.stagger ?? "none"}
			staggerMs={Number(props.staggerMs ?? 32)}
			durationMs={Number(props.durationMs ?? 450)}
			size={p.size ?? "lg"}
			motion={p.motion ?? "slide"}
			className="font-semibold text-foreground"
		/>
	);
	if (!groupHover) return roll;
	return (
		<button
			type="button"
			data-roll-group
			className="rounded-lg border border-border px-6 py-4 text-left hover:bg-foreground/[0.06]"
		>
			{roll}
		</button>
	);
}

export function TextTransitionDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TextTransition>>(props);
	return (
		<TextTransition
			key={
				(p.variant ?? "blur-out-up") +
				String(props.durationMs ?? "") +
				String(props.staggerMs ?? "")
			}
			text={p.text || "Ship it in seconds"}
			variant={p.variant ?? "blur-out-up"}
			durationMs={props.durationMs === undefined ? undefined : Number(props.durationMs)}
			staggerMs={props.staggerMs === undefined ? undefined : Number(props.staggerMs)}
			className="text-3xl font-semibold text-foreground"
		/>
	);
}

export function TypingTextDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TypingText>>(props);
	return (
		<TypingText
			key={String(props.smooth ?? "") + String(props.stumbles ?? "")}
			text={p.text || "Creates a typing effect for given text"}
			delay={Number(props.delay ?? 32)}
			repeat={props.repeat !== false}
			waitMs={Number(props.waitMs ?? 1000)}
			smooth={props.smooth === true}
			fadeDurationMs={Number(props.fadeDurationMs ?? 300)}
			grow={props.grow === true}
			hideCursorOnComplete={props.hideCursorOnComplete === true}
			stumbles={props.stumbles === true}
			size={p.size ?? "default"}
			className="text-foreground"
		/>
	);
}
