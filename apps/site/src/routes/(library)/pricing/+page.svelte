<script lang="ts">
import Seo from "#lib/components/seo.svelte";
import { breadcrumbLd, type JsonLd, SITE_NAME } from "#lib/seo.js";
import { goto } from "$app/navigation";

let { data } = $props();

type Plan = {
	id: string;
	name: string;
	description: string;
	prices: { lifetime?: number };
};

let loadingPlanId = $state<string | null>(null);

const plans: Plan[] = $derived(data.sample.PRO_PLANS);

const jsonLd = $derived<JsonLd[]>([
	{
		"@type": "Product",
		name: `${SITE_NAME} Pro`,
		description: "Pro React and Svelte components installed through the shadcn CLI.",
		offers: plans.map((plan) => ({
			"@type": "Offer",
			name: plan.name,
			description: plan.description,
			price: ((plan.prices.lifetime ?? 0) / 100).toFixed(2),
			priceCurrency: "USD",
			hasMerchantReturnPolicy: {
				"@type": "MerchantReturnPolicy",
				returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
			},
		})),
	},
	{
		"@type": "FAQPage",
		mainEntity: data.sample.PRICING_FAQS.map(
			(f: { question: string; answer: string }) => ({
				"@type": "Question",
				name: f.question,
				acceptedAnswer: { "@type": "Answer", text: f.answer },
			}),
		),
	},
	breadcrumbLd([{ name: "Pricing", path: "/pricing" }]),
]);

async function select(planId: string) {
	loadingPlanId = planId;
	await goto(`/checkout?plan=${planId}`);
	loadingPlanId = null;
}
</script>

<Seo
	title="Pricing"
	description="Baby UI Pro pricing: one payment for a year of Pro React and Svelte components, or lifetime access. Per seat, with team discounts."
	keywords={["baby ui pro", "shadcn pro components", "svelte ui kit pricing", "react component library lifetime license"]}
	{jsonLd}
/>

<data.Screen
	plans={data.sample.PRO_PLANS}
	seatDiscounts={data.sample.SEAT_DISCOUNTS}
	comparisonPlans={data.sample.COMPARISON_PLANS}
	comparisonGroups={data.sample.COMPARISON_GROUPS}
	faqs={data.sample.PRICING_FAQS}
	{loadingPlanId}
	onSelect={select}
/>
