/** Sample AI search answer for demos: how HTTPS works, backed by five public sources. */
export const TLS_SOURCES = [
	{
		id: "wikipedia",
		title: "Transport Layer Security",
		url: "https://en.wikipedia.org/wiki/Transport_Layer_Security",
		domain: "en.wikipedia.org",
		snippet:
			"A cryptographic protocol designed to provide communications security over a computer network, widely used in HTTPS.",
	},
	{
		id: "mdn",
		title: "Transport Layer Security (TLS)",
		url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security",
		domain: "developer.mozilla.org",
		snippet:
			"TLS provides privacy and data integrity between two communicating applications, most visibly for HTTPS.",
	},
	{
		id: "cloudflare",
		title: "What happens in a TLS handshake?",
		url: "https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/",
		domain: "cloudflare.com",
		snippet:
			"During the handshake the two sides agree on a cipher suite, authenticate the server and generate session keys.",
	},
	{
		id: "rfc8446",
		title: "RFC 8446: The TLS Protocol Version 1.3",
		url: "https://datatracker.ietf.org/doc/html/rfc8446",
		domain: "datatracker.ietf.org",
		snippet:
			"TLS 1.3 removes static RSA and Diffie-Hellman cipher suites and completes a full handshake in one round trip.",
	},
	{
		id: "letsencrypt",
		title: "How It Works",
		url: "https://letsencrypt.org/how-it-works/",
		domain: "letsencrypt.org",
		snippet:
			"Let's Encrypt uses the ACME protocol to verify domain control and issue certificates automatically.",
	},
];

export const TLS_ANSWER = [
	{
		text: "TLS is the protocol behind the padlock in your browser: it encrypts traffic between a client and a server and proves the server is who it claims to be.",
		citations: ["wikipedia", "mdn"],
	},
	{
		text: "Every connection opens with a handshake, where both sides agree on a cipher suite and derive shared session keys.",
		citations: ["cloudflare"],
	},
	{
		text: "TLS 1.3 cuts that handshake to a single round trip and drops older options such as static RSA key exchange.",
		citations: ["rfc8446", "cloudflare"],
	},
	{
		text: "The server proves its identity with a certificate signed by a certificate authority.",
		citations: ["mdn"],
	},
	{
		text: "Let's Encrypt issues those certificates for free and renews them automatically over the ACME protocol.",
		citations: ["letsencrypt"],
	},
];
