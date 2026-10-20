"use client";

import { AnimatedBeam, AnimatedBeamBeams, AnimatedBeamNodes } from "@baby-ui/react";

const nodes = [
	{ id: "app", label: "Your app", src: "/logo.svg" },
	{ id: "slack", label: "Slack", src: "https://cdn.simpleicons.org/slack" },
	{ id: "github", label: "GitHub", src: "https://cdn.simpleicons.org/github" },
	{ id: "stripe", label: "Stripe", src: "https://cdn.simpleicons.org/stripe" },
];

const beams = [
	{ from: "slack", to: "app" },
	{ from: "github", to: "app", delay: 600 },
	{ from: "stripe", to: "app", delay: 1200, reverse: true },
];

export function Integrations() {
	return (
		<AnimatedBeam nodes={nodes} beams={beams} center="app" layout="hub">
			<AnimatedBeamBeams />
			<AnimatedBeamNodes label="Connected tools" />
		</AnimatedBeam>
	);
}
