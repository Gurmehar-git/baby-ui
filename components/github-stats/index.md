---
title: GitHub Stats
description: "A year on GitHub: the total and its trend, streaks, the calendar, counts and where the work went."
component: github-stats
category: blocks
tags: [github, profile, contributions, heatmap, streak, open source, block]
---

No fetching of its own: load the profile on your server and pass `data`.

## Data shape

```ts
type GithubStatsData = {
  counts: { followers: number; stars: number; repos: number; forks: number };
  contributions: Record<string, Array<{ date: string; count: number }>>; // keyed by year
  mix?: { commits: number; pullRequests: number; codeReviews: number; issues: number }; // percent
  organizations?: Array<{ name: string; url: string; avatarUrl?: string }>;
  repositories?: Array<{ owner: string; name: string; url: string }>;
  profileUrl?: string; // links "+N more"
};
```

`contributions` maps straight from GitHub's contribution calendar. The year select only shows
when there is more than one year.

## What it derives

- **Trend**: the year against the same calendar days of the year before, so a year in progress
  is never compared with a whole one. It needs the previous year in `contributions`.
- **Longest and current streak**: runs of days with at least one contribution. The current
  streak survives an empty today.
- **Best day** and **active days**, from the same days.

## Variants

- `default`: the full section, with the contribution mix and the repositories.
- `compact`: the total, two facts, a small calendar and the counts, for a sidebar.
- `minimal`: no card, no mix, no repositories.
