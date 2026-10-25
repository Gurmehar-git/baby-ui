---
title: Email Draft
description: "An agent-written email waiting for review: switch the recipient, drop the attachment, pick a tone or edit in place, then send or discard into a receipt with Undo."
component: email-draft
category: agents
tags: [email, draft, agent, review, send, undo]
---

Composes `badge`, `button`, `textarea` and `toggle-group`; the demo puts a `select` in
`EmailDraftTo`. Use it when an agent wrote an email a person should check before it goes out.

Built from parts:

```tsx
<EmailDraft status={status} onSend={send} onDiscard={discard} onUndo={undo}>
  <EmailDraftHeader>
    <EmailDraftTitle>SUB-1182</EmailDraftTitle>
    <Badge variant="warning">Renews in 5 days</Badge>
    <EmailDraftAmount>$8,900</EmailDraftAmount>
    <EmailDraftDescription>Northwind Logistics</EmailDraftDescription>
  </EmailDraftHeader>
  <EmailDraftPanel>
    <EmailDraftContent>
      <EmailDraftFields>
        <EmailDraftTo>{/* a Select of contacts */}</EmailDraftTo>
        <EmailDraftAttachment name="Renewal-quote.pdf" attached={attached} onAttachedChange={setAttached} />
      </EmailDraftFields>
      <EmailDraftMessage value={text} onValueChange={setText}>
        <a href={quoteUrl}>Review quote</a>
      </EmailDraftMessage>
      <EmailDraftOptions>
        <EmailDraftTones value={tone} onValueChange={setTone}>
          <EmailDraftTone value="friendly">Friendly</EmailDraftTone>
          <EmailDraftTone value="short">Short</EmailDraftTone>
        </EmailDraftTones>
        <EmailDraftEdit />
        <EmailDraftHint />
      </EmailDraftOptions>
    </EmailDraftContent>
    <EmailDraftReceipt>Sent to <b>Jonas</b></EmailDraftReceipt>
    <EmailDraftFooter>
      <EmailDraftAuthor>Renewal agent</EmailDraftAuthor>
      <EmailDraftState />
      <EmailDraftActions>
        <EmailDraftDiscard />
        <EmailDraftSend />
      </EmailDraftActions>
    </EmailDraftFooter>
  </EmailDraftPanel>
</EmailDraft>
```

`status` drives everything: set `sending` in `onSend`, then `sent` when your mail call returns.
At `sent` or `discarded` the email folds into the receipt and Undo calls `onUndo`, where you set
`draft` again (and cancel the send if you hold it back for a few seconds).

The text, the tone and the attachment are yours to hold. Pass `""` as the tones' `value` once
the text is edited by hand, and rewrite the text when the recipient changes.
