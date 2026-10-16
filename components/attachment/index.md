---
title: Attachment
description: Composable file attachments for chat, as composer chips, full rows or image tiles, with an upload ring, retry and a remove that folds away.
component: attachment
category: agents
tags: [attachment, chat, composer, file chip, upload]
---

Built from parts for chat. Put chips in `Attachments` above a composer, where they scroll in
one line, or use `variant="wrap"` inside a sent message:

```tsx
<Attachments>
  <Attachment name="launch-brief.pdf" status="uploading" progress={62}>
    <AttachmentPreview />
    <AttachmentContent>
      <AttachmentName />
      <AttachmentMeta>248 KB</AttachmentMeta>
    </AttachmentContent>
    <AttachmentRetry onClick={retry} />
    <AttachmentRemove onClick={remove} />
  </Attachment>
</Attachments>
```

## Variants

- `chip`: a compact pill. While uploading, a ring over the preview fills with progress.
- `card`: a full-width row. Add `AttachmentProgress` under the name for a bar that folds away when done.
- `tile`: an image square. Remove shows on hover or focus, and always on touch screens.

## States

- **Uploading:** the ring or bar fills; the meta line reads "Uploading 62%".
- **Ready:** the meta line shows your text, e.g. the size.
- **Error:** the edge tints, the preview turns to a warning, the meta line reads "Upload failed", and `AttachmentRetry` appears.

The state is always written out, never left to the edge colour. Remove and retry name their
file, so a row of five chips is not five identical "Remove" buttons.

Remove folds the chip's width shut first, then runs your handler, so the next chip glides over
instead of jumping. Without an image, `AttachmentPreview` shows the file type, e.g. PDF.

For a form field with a drop zone and validation, use [File Upload](/components/base/file-upload).
