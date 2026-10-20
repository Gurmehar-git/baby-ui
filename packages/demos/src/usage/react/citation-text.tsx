"use client";

import { CitationText, CitationTextBody, CitationTextSources } from "@baby-ui/react";

const sources = [
	{
		id: "mdn",
		title: "Transport Layer Security (TLS)",
		url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security",
		domain: "developer.mozilla.org",
		snippet:
			"TLS provides privacy and data integrity between two communicating applications.",
	},
	{
		id: "rfc8446",
		title: "RFC 8446: The TLS Protocol Version 1.3",
		url: "https://datatracker.ietf.org/doc/html/rfc8446",
		domain: "datatracker.ietf.org",
	},
];

const segments = [
	{ text: "TLS encrypts traffic between a client and a server.", citations: ["mdn"] },
	{
		text: "Version 1.3 completes the handshake in one round trip.",
		citations: ["rfc8446"],
	},
];

export function Example() {
	return (
		<CitationText segments={segments} sources={sources}>
			<CitationTextBody />
			<CitationTextSources />
		</CitationText>
	);
}
