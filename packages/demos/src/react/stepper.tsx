"use client";

import { Button, Stepper } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { CHECKOUT_STEPS, PAYMENT_ERROR } from "../data/stepper";

type Props = Record<string, unknown>;

export function StepperDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Stepper>>(props);
	const [current, setCurrent] = useState(1);
	const [failed, setFailed] = useState(false);
	const steps = CHECKOUT_STEPS.map((step) =>
		failed && step.id === "payment" ? { ...step, error: PAYMENT_ERROR } : step,
	);
	return (
		<div className="grid w-full max-w-xl gap-6">
			<Stepper
				steps={steps}
				current={current}
				onStepSelect={setCurrent}
				orientation={p.orientation}
				compact={p.compact}
				details={p.details}
			/>
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={current === 0}
					onClick={() => setCurrent(current - 1)}
				>
					Back
				</Button>
				<Button
					size="sm"
					disabled={current === steps.length}
					onClick={() => setCurrent(current + 1)}
				>
					{current >= steps.length - 1 ? "Finish" : "Next"}
				</Button>
				<Button variant="ghost" size="sm" onClick={() => setFailed(!failed)}>
					{failed ? "Clear error" : "Decline payment"}
				</Button>
			</div>
		</div>
	);
}
