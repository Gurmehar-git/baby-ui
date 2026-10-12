---
title: Avatar
description: Avatar, AvatarImage and AvatarFallback, where the fallback shows until the image really loads.
component: avatar
category: base
tags: [avatar, profile, user]
---

shadcn's parts: `Avatar`, `AvatarImage`, `AvatarFallback`, plus `AvatarBadge`, `AvatarGroup` and
`AvatarGroupCount`. The fallback is your
content, not a string we derive, because initials are not the only sensible fallback.

Put the fallback first in the markup. It renders immediately and the image fades in over
it once it loads; the alternative is an empty box that pops, which looks like a bug on a
slow connection.

## The fallback is not a placeholder

If the image 404s, the initials stay. They are not a loading state that eventually gets
replaced; they are the fallback identity. `name` supplies both the alt text and the
initials, so the two cannot disagree.

Initials are the first letter of the first and last word, uppercased. One-word names get
a single letter rather than two letters from the same word.

## Groups

`AvatarGroup` overlaps its members on a background ring. A member lifts on hover and pops in
when it joins; end the row with `AvatarGroupCount` for the people not shown.
