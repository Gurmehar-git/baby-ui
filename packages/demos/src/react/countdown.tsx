"use client";

import { Button, Countdown } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const LAUNCH = (2 * 24 + 7) * 3_600_000 + 42 * 60_000;

export function CountdownDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Countdown>>(props);
	const [target, setTarget] = useState(() => Date.now() + LAUNCH);
	return (
		<div className="grid w-full max-w-lg justify-items-center gap-6">
			<Countdown target={target} label="Launch starts in" variant={p.variant} />
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setTarget(Date.now() + 10_000)}
				>
					Count down 10 seconds
				</Button>
				<Button variant="ghost" size="sm" onClick={() => setTarget(Date.now() + LAUNCH)}>
					Reset
				</Button>
			</div>
		</div>
	);
}
