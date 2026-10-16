---
title: Receipt
description: A payment receipt with status, reference details, line items, total and a billing contact.
component: email-receipt
category: emails
tags: [email, receipt, invoice, payment, billing]
---

Built from the [Email Kit](/emails/email-kit), themed from your tokens and switched to your dark palette when the inbox is. Every amount and date is a string you format first (`Intl.NumberFormat`, `Intl.DateTimeFormat`), so the email matches your invoices exactly and never guesses a locale. `adjustments` sit between the items and the total for subtotals, discounts and tax. Rename or translate any label through `labels`.

The items and total sit in a panel under a large heading, with a dark footer bar.

## Send it

Render and send it exactly like the [Welcome Email](/emails/email-welcome): render HTML and plain text on the server, then pass both to your provider. Swap the component and its props.
