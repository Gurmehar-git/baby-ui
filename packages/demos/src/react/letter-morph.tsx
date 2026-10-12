"use client";

import { Button, LetterMorph } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const STEPS = ["Publish", "Publishing", "Published"];

export function LetterMorphDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof LetterMorph>>(props);
	const [step, setStep] = useState(0);
	return (
		<Button
			variant="default"
			onClick={() => setStep((value) => (value + 1) % STEPS.length)}
		>
			<LetterMorph text={STEPS[step] ?? ""} variant={p.variant} size={p.size} />
		</Button>
	);
}
