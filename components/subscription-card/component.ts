import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { subscriptionCard as subscriptionCardVariants } from "./variants";

export const subscriptionCard = defineComponent({
	slug: "subscription-card",
	name: "Subscription Card",
	description:
		"Composable current-plan card: price, status, renewal or trial date, a seats meter and billing actions, with cancel behind a confirmation.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(subscriptionCardVariants, ["variant"]),
	props: [
		{
			name: "plan",
			type: "SubscriptionPlan",
			description:
				'SubscriptionCard: { name, interval: "month" | "year" | "lifetime", amount in cents, currency, status }. The demo control swaps sample plans.',
			required: true,
			control: {
				kind: "select",
				options: ["team", "lifetime", "past_due", "trialing", "canceled"],
			},
		},
		{
			name: "variant",
			type: '"card" | "compact"',
			description: "SubscriptionCard: roomy with a ruled footer, or a tighter card.",
			default: "card",
			control: { kind: "select", options: ["card", "compact"] },
		},
		{
			name: "now",
			type: "string | number | Date",
			description:
				"SubscriptionCard: the time relative dates are measured from. The card keeps no clock.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "renewsAt",
			type: "string | number | Date",
			description: "SubscriptionCard: next charge for an active recurring plan.",
			control: { kind: "none" },
		},
		{
			name: "endsAt",
			type: "string | number | Date",
			description:
				"SubscriptionCard: when a canceled plan stops; SubscriptionCardResume shows while it is still ahead.",
			control: { kind: "none" },
		},
		{
			name: "trialEndsAt",
			type: "string | number | Date",
			description:
				"SubscriptionCard: end of a trial, shown while the status is trialing.",
			control: { kind: "none" },
		},
		{
			name: "pending",
			type: '"manage" | "change" | "cancel" | "resume" | "payment" | null',
			description:
				"SubscriptionCard: the action waiting on your server or redirect. Its button spins and the others disable until you clear it.",
			default: "null",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description:
				"SubscriptionCard: BCP 47 locale for money and dates; defaults to the browser's.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<SubscriptionLabels>",
			description:
				"SubscriptionCard: override any copy, including status names and the confirmation text.",
			control: { kind: "none" },
		},
		{
			name: "headingLevel",
			type: "2 | 3 | 4 | 5 | 6",
			description:
				"SubscriptionCardTitle: level of the plan name heading, to fit the page outline.",
			default: "3",
			control: { kind: "none" },
		},
		{
			name: "used / total",
			type: "number",
			description:
				"SubscriptionCardSeats: seat usage for the meter; leave the part out for single-seat plans.",
			control: { kind: "none" },
		},
		{
			name: "onUpdatePayment",
			type: "() => void",
			description: "SubscriptionCardAlert: the action on the past due notice.",
			control: { kind: "none" },
		},
		{
			name: "onClick",
			type: "() => void",
			description:
				"SubscriptionCardManage, ChangePlan, Resume and Cancel (onclick in Svelte). Cancel runs it after the customer confirms; Resume and Cancel render only when the plan allows them.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Folds open and shut without moving; the dialog and button spinners keep their own reduced-motion handling.",
		behaviour: [
			"The past due notice folds open when a payment fails and shut once it is fixed, so the card never jumps.",
			"The all-seats-taken note folds in under the meter; the meter fills on the snappy spring.",
			"Cancel opens an alert dialog; the safe Keep plan button takes focus first.",
			"A pending action swaps its label for a spinner in place, so the button keeps its width.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Moves through the billing actions in reading order" },
			{
				keys: ["Escape"],
				action: "Closes the cancel confirmation and returns focus to Cancel plan",
			},
		],
		notes: [
			"The card is a section named by the plan heading; status is a text badge, never colour alone.",
			"The past due notice is role alert while open, so it is announced when it appears; closed, it is inert.",
			"The seats meter is a labelled progressbar that reads as 5 of 5.",
		],
	},
	impl: {
		react: { entry: "SubscriptionCard" },
		svelte: { entry: "SubscriptionCard" },
	},
	keywords: [
		"subscription",
		"billing",
		"plan",
		"seats",
		"renewal",
		"cancel",
		"saas",
		"dashboard",
	],
});
