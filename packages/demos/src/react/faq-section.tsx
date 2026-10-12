"use client";

import { FaqSection } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { FAQ_CONTACT, FAQ_ITEMS } from "../data/faq";
import { controlProps } from "../data/preview-props";

export function FaqSectionDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof FaqSection>>(props);
	return (
		<FaqSection
			key={p.variant}
			items={FAQ_ITEMS}
			description="Everything to know before you install your first component."
			contact={FAQ_CONTACT}
			variant={p.variant}
			type={p.type}
		/>
	);
}
