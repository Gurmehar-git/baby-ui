---
title: File Upload
description: Composable upload with a drop zone that checks type, size and count, and file rows with progress, retry and remove.
component: file-upload
category: base
tags: [file upload, dropzone, drag and drop, upload, progress]
---

Built from parts. `FileUpload` holds the files, the limits and the hidden picker; you arrange
the rest:

```tsx
<FileUpload files={files} onFilesAdded={add} accept="image/*,.pdf" maxSize={5_000_000}>
  <FileUploadDropzone />
  <FileUploadError />
  <FileUploadList>
    {files.map((file) => (
      <FileUploadItem key={file.id} file={file} onRemove={() => remove(file.id)} onRetry={() => retry(file.id)} />
    ))}
  </FileUploadList>
</FileUpload>
```

The component never uploads anything. It validates what was dropped or picked and hands you
the accepted files through `onFilesAdded`. You keep each file in `files` and move its `status`
from `queued` to `uploading` to `done` or `error` as your request runs, updating `progress` on
the way.

## States

- **Drop zone:**
  - rest, hover and keyboard focus;
  - drag-over (a primary tint, the icon lifts);
  - a refused drop (it shakes beside FileUploadError's reasons);
  - disabled;
  - compact (a slim bar once `compactAt` files are listed, or always with `variant="inline"`).
- **Row:**
  - `queued` says Waiting;
  - `uploading` shows the bar and the percent;
  - `done` folds the bar away and shows the size;
  - `error` shows the reason, a warning icon and Retry.
- Remove folds the row shut before `onRemove` runs.
- Image files get a thumbnail. Its object URL is released when the file leaves `files`.

Pass children to `FileUploadDropzone` to replace its icon, title and hint.

For a file chip in a chat composer or a sent message, use [Attachment](/components/agents/attachment).

## Migrating

Before parts, `FileUpload` rendered its own zone and list and took `onRemove(id)` /
`onRetry(id)`. Move both onto each `FileUploadItem`, and add the parts above inside the root.
