import type { ComponentProps } from "react";
import { cn } from "../../lib/react/cn";
import { type NativeSelectSize, nativeSelect } from "./variants";

export type { NativeSelectSize };

export function NativeSelect({
	className,
	size = "default",
	...props
}: Omit<ComponentProps<"select">, "size"> & { size?: NativeSelectSize }) {
	const s = nativeSelect({ size });
	return (
		<div
			data-slot="native-select-wrapper"
			data-size={size}
			className={cn(s.wrapper(), className)}
		>
			<select
				data-slot="native-select"
				data-size={size}
				className={s.select()}
				{...props}
			/>
			<svg
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
				data-slot="native-select-icon"
				className={s.icon()}
			>
				<path
					d="m4 6 4 4 4-4"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

export function NativeSelectOption({ className, ...props }: ComponentProps<"option">) {
	return (
		<option
			data-slot="native-select-option"
			className={cn(nativeSelect().option(), className)}
			{...props}
		/>
	);
}

export function NativeSelectOptGroup({
	className,
	...props
}: ComponentProps<"optgroup">) {
	return (
		<optgroup
			data-slot="native-select-opt-group"
			className={cn(nativeSelect().option(), className)}
			{...props}
		/>
	);
}
