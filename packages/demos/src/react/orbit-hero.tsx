"use client";

import {
	OrbitHero,
	OrbitHeroAction,
	OrbitHeroActions,
	OrbitHeroContent,
	OrbitHeroDescription,
	OrbitHeroSubheading,
	OrbitHeroTitle,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { ORBIT_GLYPHS, ORBIT_GROUPS, ORBIT_HERO } from "../data/orbit-hero";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

function Glyph({ name }: { name: string }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{(ORBIT_GLYPHS[name] ?? []).map(([d, faded]) => (
				<path key={d} d={d} opacity={faded ? 0.5 : undefined} />
			))}
		</svg>
	);
}

export function OrbitHeroDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof OrbitHero>>(props);
	return (
		<OrbitHero
			interval={p.interval}
			variant={p.variant}
			size={p.size ?? "section"}
			groups={ORBIT_GROUPS}
			renderItem={(name) => <Glyph name={name} />}
		>
			<OrbitHeroContent>
				<OrbitHeroTitle>
					{ORBIT_HERO.headline}
					<OrbitHeroSubheading>{ORBIT_HERO.subheading}</OrbitHeroSubheading>
				</OrbitHeroTitle>
				<OrbitHeroDescription>{ORBIT_HERO.description}</OrbitHeroDescription>
				<OrbitHeroActions>
					{ORBIT_HERO.actions.map((action, i) => (
						<OrbitHeroAction
							key={action.label}
							href={action.href}
							target={action.target}
							variant={i === 0 ? "default" : "outline"}
						>
							{action.label}
						</OrbitHeroAction>
					))}
				</OrbitHeroActions>
			</OrbitHeroContent>
		</OrbitHero>
	);
}
