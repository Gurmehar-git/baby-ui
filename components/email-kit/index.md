---
title: Email Kit
description: Shell, header, heading, text, button, callout, divider, footer, code and key-value parts for transactional email, themed from your tokens.
component: email-kit
category: emails
tags: [email, react email, better svelte email, transactional]
---

Built on [React Email](https://react.email) and
[Better Svelte Email](https://better-svelte-email.konixy.dev/docs), with the same part names in both.
Every template on this site is built from these parts. The preview shows the
[Welcome Email](/emails/email-welcome).

Inboxes can't read CSS variables or oklch, so `lib/email-theme.ts` holds your tokens as hex, with
a `-dark` twin for each. Each part pairs a class with its dark twin (`bg-card dark:bg-card-dark`),
and inboxes that support `prefers-color-scheme` switch to the dark palette.

```svelte
<EmailShell preview="Your receipt from Acme">
	<EmailHeader brand="Acme" />
	<EmailHeading>Payment received</EmailHeading>
	<EmailText tone="muted">Thanks for your order.</EmailText>
	<EmailKeyValue rows={[{ label: "Plan", value: "Pro, monthly" }]} total={{ label: "Total", value: "$24.00" }} />
	<EmailButton href="https://acme.com/billing">View invoice</EmailButton>
	{#snippet footer()}
		<EmailFooter lines={["Acme, Inc.", "1 Main St, Springfield"]} />
	{/snippet}
</EmailShell>
```

- `EmailShell` sets a 600px column, the widest any inbox reliably shows, with a 12px gutter so
  phones keep the card near the edge.
- `EmailHeader` sets a square mark beside the product name (`variant="lockup"`), or a wordmark
  image alone (`"logo"`). Use PNG: Gmail and Outlook drop SVG.
- `EmailCallout` tones are soft fills. The text still has to say what happened, because colour
  alone carries no meaning for screen readers or high-contrast modes.
- `EmailFooter` takes the sender name and postal address. Anti-spam law in many regions requires
  them in commercial email.
- Render with Tailwind applied: React Email's `<Tailwind>` is inside `EmailShell`. In Svelte, pass
  `emailTailwindConfig` to `new Renderer({ tailwindConfig })`, as shown on each template page.
