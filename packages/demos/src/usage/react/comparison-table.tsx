"use client";

import { ComparisonTable } from "@baby-ui/react";

export function Example() {
	return (
		<ComparisonTable
			title="Compare plans"
			columns={[
				{ id: "free", name: "Free", price: 0 },
				{
					id: "pro",
					name: "Pro",
					price: { monthly: 12, yearly: 9 },
					highlight: true,
					action: { label: "Upgrade", href: "/upgrade" },
				},
			]}
			sections={[
				{
					id: "core",
					rows: [
						{
							id: "projects",
							feature: "Projects",
							values: { free: "3", pro: "Unlimited" },
						},
						{ id: "sso", feature: "Single sign-on", values: { free: false, pro: true } },
					],
				},
			]}
		/>
	);
}
