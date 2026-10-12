---
title: File Upload
description: A dropzone with type, size and count checks, and a file list with progress, retry and remove.
component: file-upload
category: base
tags: [file upload, dropzone, drag and drop, upload, progress]
---

The component never uploads anything itself. It validates what was dropped or picked, hands
you the accepted files through `onFilesAdded`, and lists whatever you pass back in `files`. Start
your request there, then update each file's `progress` and `status` as it runs.

Files that miss `accept`, `maxSize` or `maxFiles` are not added; each one gets a line in the
error message under the dropzone. Image files get a thumbnail, and its object URL is released
when the file leaves the list.

`compactAt` folds the drop zone into a slim bar once the list holds that many files, so a
long list keeps its room. A rejected drop shakes the zone beside its error message.
