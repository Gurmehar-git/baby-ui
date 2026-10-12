"use client";

import { ContactSection, type ContactStatus } from "@baby-ui/react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { CONTACT_CHANNELS, CONTACT_DETAILS, CONTACT_OFFICES } from "../data/contact";
import { controlProps } from "../data/preview-props";

export function ContactSectionDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof ContactSection>>(props);
	const [status, setStatus] = useState<ContactStatus>("idle");
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	return (
		<ContactSection
			variant={p.variant}
			description="Tell us what you're working on and the right person will reply."
			status={status}
			onSubmit={() => {
				setStatus("submitting");
				// The demo stands in for a request.
				timer.current = setTimeout(() => setStatus("success"), 900);
			}}
			onReset={() => setStatus("idle")}
			channels={CONTACT_CHANNELS.map((channel) => ({
				...channel,
				detail: (
					<>
						<p>{CONTACT_DETAILS[channel.value]?.lead}</p>
						<a
							className="mt-3 inline-block underline underline-offset-4"
							href={`mailto:${CONTACT_DETAILS[channel.value]?.email}`}
						>
							{CONTACT_DETAILS[channel.value]?.email}
						</a>
					</>
				),
			}))}
			offices={CONTACT_OFFICES}
			locale="en-US"
		/>
	);
}
