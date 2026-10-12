"use client";

import { PhoneInput } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function PhoneInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof PhoneInput>>(props);
	const [value, setValue] = useState("");
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<PhoneInput
				label={p.label || "Phone number"}
				defaultCountry="GB"
				preferredCountries={["GB", "US", "IN"]}
				variant={p.variant}
				size={p.size}
				validate={p.validate}
				value={value}
				onValueChange={setValue}
			/>
			<p className="h-4 text-muted-foreground text-xs tabular-nums">{value}</p>
		</div>
	);
}
