"use client";

import {
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyIllustration,
	EmptyMedia,
	type EmptyPhase,
	EmptyTitle,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { EMPTY_SCENES, ILLUSTRATION_SCENES, isEmptyScene } from "../data/empty";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

function IllustrationDemo({ p }: { p: ComponentProps<typeof Empty> }) {
	const [index, setIndex] = useState(0);
	const [phase, setPhase] = useState<EmptyPhase>("idle");
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	const scene = ILLUSTRATION_SCENES[index] ?? ILLUSTRATION_SCENES[0];
	const copy = phase === "done" ? scene.done : scene.idle;
	// The demo stands in for real work: actions with a pending line wait a beat, then resolve.
	const act = () => {
		if (phase === "loading") return;
		if (phase === "done" || !scene.loading)
			return setPhase(phase === "done" ? "idle" : "done");
		setPhase("loading");
		timer.current = setTimeout(() => setPhase("done"), 1200);
	};
	return (
		<Empty
			variant={p.variant ?? "outline"}
			size={p.size ?? "default"}
			className="max-w-xl"
		>
			<ToggleGroup
				variant="segmented"
				size="sm"
				label="Empty state"
				value={scene.id}
				onValueChange={(next) => {
					const at = ILLUSTRATION_SCENES.findIndex((item) => item.id === next);
					if (at < 0) return;
					clearTimeout(timer.current);
					setIndex(at);
					setPhase("idle");
				}}
			>
				{ILLUSTRATION_SCENES.map((item) => (
					<ToggleGroupItem key={item.id} value={item.id}>
						{item.tab}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<EmptyHeader>
				<EmptyIllustration scene={scene.id} phase={phase} />
				<EmptyTitle>{copy.title}</EmptyTitle>
				<EmptyDescription aria-live="polite">
					{phase === "loading" ? scene.loading : copy.line}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant="outline" loading={phase === "loading"} onClick={act}>
					{copy.action}
				</Button>
			</EmptyContent>
		</Empty>
	);
}

export function EmptyDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Empty>>(props);
	const media = controlProps<ComponentProps<typeof EmptyMedia>>(props);
	const scene = EMPTY_SCENES[isEmptyScene(props.scene) ? props.scene : "search"];
	if (props.media === "illustration") return <IllustrationDemo p={p} />;
	return (
		<Empty
			variant={p.variant ?? "outline"}
			layout={p.layout ?? "vertical"}
			size={p.size ?? "default"}
			className="max-w-xl"
		>
			<EmptyHeader>
				<EmptyMedia variant="icon" tone={media.tone ?? scene.tone}>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
					>
						<path d={scene.icon} />
					</svg>
				</EmptyMedia>
				<EmptyTitle>{scene.title}</EmptyTitle>
				<EmptyDescription>{scene.description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant={scene.tone === "primary" ? "default" : "outline"}>
					{scene.action}
				</Button>
			</EmptyContent>
		</Empty>
	);
}
