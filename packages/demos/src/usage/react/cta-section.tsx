"use client";

import {
	CtaSection,
	CtaSectionAction,
	CtaSectionActions,
	CtaSectionContent,
	CtaSectionDescription,
	CtaSectionNote,
	CtaSectionTitle,
} from "@baby-ui/react";

export function Example() {
	return (
		<CtaSection>
			<CtaSectionContent>
				<CtaSectionTitle>Ready to ship?</CtaSectionTitle>
				<CtaSectionDescription>
					Start free, upgrade when your team grows.
				</CtaSectionDescription>
				<CtaSectionActions>
					<CtaSectionAction href="/signup">Get started</CtaSectionAction>
					<CtaSectionAction variant="outline" href="/docs">
						Read the docs
					</CtaSectionAction>
				</CtaSectionActions>
				<CtaSectionNote>No credit card required</CtaSectionNote>
			</CtaSectionContent>
		</CtaSection>
	);
}
