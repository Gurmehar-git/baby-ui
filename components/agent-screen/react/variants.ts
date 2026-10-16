import { tv, type VariantProps } from "tailwind-variants";

export const agentScreen = tv({
	slots: { root: "w-full" },
	variants: {
		size: {
			sm: { root: "max-w-[260px]" },
			default: { root: "max-w-[340px]" },
			lg: { root: "max-w-[420px]" },
		},
	},
	defaultVariants: { size: "default" },
});

export type AgentScreenSize = NonNullable<VariantProps<typeof agentScreen>["size"]>;
