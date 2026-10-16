import { tv } from "tailwind-variants";

// The label and the success word share a morph frame, so the button glides between widths.
export const actionButton = tv({
	slots: {
		face: "inline-flex items-center",
		icon: [
			"mr-2 grid size-4 place-items-center *:col-start-1 *:row-start-1 [&_svg]:size-4",
			"transition-[width,margin] duration-(--duration-base) ease-(--ease-ui-out) data-[empty=true]:mr-0 data-[empty=true]:w-0",
			"group-data-[state=success]/action:data-[empty=true]:mr-2 group-data-[state=success]/action:data-[empty=true]:w-4 motion-reduce:transition-none",
		],
		tick: "transition-[stroke-dashoffset] delay-75 duration-300 ease-(--ease-ui-out) [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[state=success]/action:[stroke-dashoffset:0] motion-reduce:transition-none",
	},
});
