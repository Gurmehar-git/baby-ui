"use client";

import { ContactSection, type ContactStatus } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [status, setStatus] = useState<ContactStatus>("idle");
	return (
		<ContactSection
			topics={["Sales", "Support", "Partnerships"]}
			status={status}
			onSubmit={async (message) => {
				setStatus("submitting");
				const res = await fetch("/api/contact", {
					method: "POST",
					body: JSON.stringify(message),
				});
				setStatus(res.ok ? "success" : "error");
			}}
			onReset={() => setStatus("idle")}
		/>
	);
}
