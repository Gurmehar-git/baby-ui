import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { paymentMethodCard as paymentMethodCardVariants } from "./variants";

export const paymentMethodCard = defineComponent({
	slug: "payment-method-card",
	name: "Payment Method Card",
	description:
		"Composable view of the card or wallet on file with an expiry warning, an empty state and an update action that hands off to your provider's portal.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(paymentMethodCardVariants, ["variant"]),
	props: [
		{
			name: "method",
			type: "PaymentMethod | null",
			description:
				'{ type: "card", brand, last4, expMonth, expYear } or { type: "paypal" | "link", email }; null shows the empty state. The demo control swaps samples.',
			required: true,
			control: {
				kind: "select",
				options: ["visa", "mastercard", "amex", "paypal", "link", "none"],
			},
		},
		{
			name: "variant",
			type: '"card" | "inline"',
			description: "PaymentMethodCard: bordered card, or a bare row for settings lists.",
			default: "card",
			control: { kind: "select", options: ["card", "inline"] },
		},
		{
			name: "status",
			type: '"idle" | "redirecting" | "error"',
			description:
				"PaymentMethodCard: redirecting spins PaymentMethodCardAction; error folds open PaymentMethodCardError.",
			default: "idle",
			control: { kind: "select", options: ["idle", "redirecting", "error"] },
		},
		{
			name: "now",
			type: "string | number | Date",
			description:
				"PaymentMethodCard: expiry is measured against this. Within 60 days of the month's end it warns; after, it reads Expired.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "onClick",
			type: "() => void",
			description:
				"PaymentMethodCardAction (onclick in Svelte): add or replace the method, usually by redirecting to the billing portal.",
			control: { kind: "none" },
		},
		{
			name: "headingLevel",
			type: "2 | 3 | 4 | 5 | 6",
			description: "PaymentMethodCardTitle: level of the heading.",
			default: "3",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description: "PaymentMethodCard: BCP 47 locale for the expiry date.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<PaymentMethodLabels>",
			description: "PaymentMethodCard: override any copy, including brand names.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The error folds without moving; the redirecting spinner follows the button's own handling.",
		behaviour: [
			"The update button swaps its label for a spinner in place while the redirect is prepared.",
			"A failed redirect folds the error open under the row, and shut on retry.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches Update, or Add payment method when nothing is on file",
			},
		],
		notes: [
			"The brand chip is decorative; the brand is spelled out in the text, e.g. Visa ending in 4242.",
			"Expiry warnings are text badges, never colour alone.",
			"The error message is role alert while open, so it is announced when the redirect fails.",
		],
	},
	impl: {
		react: { entry: "PaymentMethodCard" },
		svelte: { entry: "PaymentMethodCard" },
	},
	keywords: [
		"payment method",
		"credit card",
		"billing",
		"expiry",
		"wallet",
		"saas",
		"dashboard",
	],
});
