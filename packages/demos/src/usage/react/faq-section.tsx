"use client";

import {
	FaqSection,
	FaqSectionContact,
	FaqSectionHeader,
	FaqSectionList,
	FaqSectionRail,
	FaqSectionTitle,
	FaqSectionTopics,
} from "@baby-ui/react";

const items = [
	{
		question: "Can I cancel anytime?",
		answer: "Yes. Your plan stays active until the period ends.",
		category: "Billing",
	},
	{
		question: "Do you offer refunds?",
		answer: "No, so try the free tier first.",
		category: "Billing",
	},
	{
		question: "Is my data encrypted?",
		answer: "At rest and in transit.",
		category: "Security",
	},
];

export function Example() {
	return (
		<FaqSection items={items} variant="columns">
			<FaqSectionRail>
				<FaqSectionHeader>
					<FaqSectionTitle>Frequently asked questions</FaqSectionTitle>
				</FaqSectionHeader>
				<FaqSectionTopics />
				<FaqSectionContact href="/support" description="Write to support">
					Still stuck?
				</FaqSectionContact>
			</FaqSectionRail>
			<FaqSectionList />
		</FaqSection>
	);
}
