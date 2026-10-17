"use client";

import {
	GradientHero01,
	GradientHero01Action,
	GradientHero01Actions,
	GradientHero01Badge,
	GradientHero01Content,
	GradientHero01Description,
	GradientHero01Install,
	GradientHero01Meta,
	GradientHero01Title,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { GRADIENT_HERO_01 as copy } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";

export function GradientHero01Demo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof GradientHero01>>(props);
	return (
		<GradientHero01 tone={p.tone} size={p.size}>
			<GradientHero01Content>
				<GradientHero01Badge>{copy.badge}</GradientHero01Badge>
				<GradientHero01Title>{copy.headline}</GradientHero01Title>
				<GradientHero01Description>{copy.description}</GradientHero01Description>
				<GradientHero01Actions>
					{copy.actions.map((action, i) => (
						<GradientHero01Action
							key={action.label}
							href={action.href}
							variant={i === 0 ? "default" : "outline"}
						>
							{action.label}
						</GradientHero01Action>
					))}
				</GradientHero01Actions>
				<GradientHero01Install command={copy.install} />
				<GradientHero01Meta>
					{copy.meta.map((fact) => (
						<li key={fact}>{fact}</li>
					))}
				</GradientHero01Meta>
			</GradientHero01Content>
		</GradientHero01>
	);
}
