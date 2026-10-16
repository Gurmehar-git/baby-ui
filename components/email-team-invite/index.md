---
title: Team Invite
description: An invitation to join a team, showing who sent it, the role and their personal note.
component: email-team-invite
category: emails
tags: [email, invite, team, workspace]
---

Built from the [Email Kit](/emails/email-kit), themed from your tokens and switched to your dark palette when the inbox is. Leads with the person who sent it: an invitation from a named colleague is the one people open. Without `inviterAvatarUrl` their initials show instead. `message` appears quoted, so pass it only when the inviter wrote one.

A large avatar, the team name and a role badge lead the card.

## Send it

Render and send it exactly like the [Welcome Email](/emails/email-welcome): render HTML and plain text on the server, then pass both to your provider. Swap the component and its props.
