"use client";

import { MorphSelect } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { TIME_ZONES } from "../data/morph-select";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function MorphSelectDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MorphSelect>>(props);
	const [zone, setZone] = useState("europe/zurich");
	return (
		<MorphSelect
			label="Time zone"
			items={TIME_ZONES}
			value={zone}
			onValueChange={setZone}
			variant={p.variant}
			size={p.size}
		/>
	);
}
