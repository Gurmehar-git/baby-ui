---
title: Image Trail
description: Images that spawn along the pointer's path and glide, then leave in the chosen exit style.
component: image-trail
category: animated
tags: [images, trail, cursor, pointer]
---

Each time the pointer travels `threshold` px, the next image from a fixed pool appears at the
previous spawn point and glides to the pointer, then fades, falls or shrinks away per `variant`.
The pool is one element per URL, reused round-robin, so repeat a URL to lengthen the trail.

Motion is plain CSS keyframes and nothing runs while the pointer is still. Touch and pen work
through pointer events; with reduced motion no images spawn.
