"use client";

import { Stepper } from "@baby-ui/react";
import { useState } from "react";

const steps = [
	{ id: "account", label: "Account" },
	{ id: "profile", label: "Profile" },
	{ id: "done", label: "Done" },
];

export function Example() {
	const [current, setCurrent] = useState(1);
	return <Stepper steps={steps} current={current} onStepSelect={setCurrent} />;
}
