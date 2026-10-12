---
title: Comment Thread
description: "A threaded discussion with nested replies, reactions, inline edit and delete, @mentions, and a resolve state that folds it into a chip."
component: comment-thread
category: advanced
tags: [comments, thread, discussion, review, mentions]
---

`onCommentsChange` gets the full next tree plus an event (`reply`, `edit`, `delete` or `react`),
so you can store the tree as is and sync only the change to your server.
