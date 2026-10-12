"use client";

import { CtaSection } from "@baby-ui/react";

export function Example() {
	return (
		<CtaSection
			title="Ready to ship?"
			description="Start free, upgrade when your team grows."
			primaryAction={{ label: "Get started", href: "/signup" }}
			secondaryAction={{ label: "Read the docs", href: "/docs" }}
			note="No credit card required"
		/>
	);
}
