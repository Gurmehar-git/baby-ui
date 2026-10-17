"use client";

import {
	FaqSection,
	FaqSectionContact,
	FaqSectionDescription,
	FaqSectionEmpty,
	FaqSectionHeader,
	FaqSectionList,
	FaqSectionRail,
	FaqSectionSearch,
	FaqSectionTitle,
	FaqSectionTopics,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { FAQ_CONTACT, FAQ_ITEMS } from "../data/faq";
import { controlProps } from "../data/preview-props";

export function FaqSectionDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof FaqSection>>(props);
	const header = (
		<FaqSectionHeader>
			<FaqSectionTitle>Frequently asked questions</FaqSectionTitle>
			<FaqSectionDescription>
				Everything to know before you install your first component.
			</FaqSectionDescription>
		</FaqSectionHeader>
	);
	const contact = (
		<FaqSectionContact href={FAQ_CONTACT.href} description={FAQ_CONTACT.description}>
			{FAQ_CONTACT.label}
		</FaqSectionContact>
	);
	return (
		<FaqSection key={p.variant} items={FAQ_ITEMS} variant={p.variant} type={p.type}>
			{p.variant === "columns" ? (
				<>
					<FaqSectionRail>
						{header}
						<FaqSectionTopics />
						{contact}
					</FaqSectionRail>
					<FaqSectionList />
				</>
			) : (
				<>
					{header}
					{p.variant === "search" ? <FaqSectionSearch /> : null}
					<FaqSectionList />
					<FaqSectionEmpty />
					{contact}
				</>
			)}
		</FaqSection>
	);
}
