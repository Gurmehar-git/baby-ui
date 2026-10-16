---
title: Invoice List
description: "Billing history from parts: a table on wide containers, cards on narrow ones, status, downloads, skeletons and an empty state."
component: invoice-list
category: blocks
tags: [invoice, billing history, receipts, table, payments, saas, dashboard]
---

Needs `table`, `badge` and `skeleton`. Pass the invoices your billing provider returns, mapped
to `Invoice`. Amounts are in cents.

## Parts

`InvoiceList` holds density, locale and copy. Inside it:

- `InvoiceListTable` with an `InvoiceListRow` per invoice, for wide containers.
- `InvoiceListCards` with an `InvoiceListCard` per invoice, for narrow ones.
- `InvoiceListRowSkeleton` and `InvoiceListCardSkeleton` while loading.
- `InvoiceListEmpty` when there are none, and `InvoiceListFooter` for a Load more button.
- `InvoiceListStatus` and `InvoiceListDownloads` also work alone, in your own rows.

Render both the table and the cards: the list reads its container, not the viewport, and shows
the table from 36rem up and the cards below, so it fits a sidebar or a narrow column.

## Behaviour

Each row links to `receiptUrl` and `invoiceUrl` when they are set. Links open in a new tab and
are named with the invoice number for screen readers. The status badge always carries a label:
Paid, Open, Void, Refunded or Failed.

Paging is yours: fetch the next page, append it, and new rows grow into place. Set `loading`
on `InvoiceList` during the first fetch so it reads as busy and announces it.
