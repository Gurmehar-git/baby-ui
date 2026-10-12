"use client";

import { Button, IconMorph } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { ICON_MORPH_BUTTONS } from "../data/icon-morph";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function IconMorphDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof IconMorph>>(props);
	const [on, setOn] = useState<Record<string, boolean>>({});
	return (
		<div className="grid grid-cols-4 gap-2">
			{ICON_MORPH_BUTTONS.map((item) => (
				<Button
					key={item.name}
					variant="ghost"
					size="icon-lg"
					aria-label={on[item.name] ? item.on : item.off}
					onClick={() => setOn((value) => ({ ...value, [item.name]: !value[item.name] }))}
				>
					<IconMorph
						name={item.name}
						state={!!on[item.name]}
						strokeWidth={p.strokeWidth}
					/>
				</Button>
			))}
		</div>
	);
}
