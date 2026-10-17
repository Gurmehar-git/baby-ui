---
title: Introduction
description: Copy-paste components for React and Svelte, built from one spec and installed with the Baby UI CLI.
---

Baby UI is a shadcn registry, not a package. The CLI copies source into your project and you
own it. Use [`@baby-ui/cli`](/docs/cli) or the stock shadcn CLIs; the files are the same.

## Why Baby UI

- One spec, two hand-written ports: React and Svelte look and behave the same.
- Drop-in over shadcn: same part names, `data-slot`s and `variant`/`size` props.
- Built on Base UI (React) and bits-ui (Svelte), so focus, keyboard and ARIA come from the
  primitives shadcn itself uses.
- Motion that answers the hand: presses squish, popovers zoom from their trigger, panels
  grow instead of popping. All CSS, all tokens, all honouring reduced motion.
- Your theme drives it: components read CSS variables and never name a colour.

## What's inside

- [Base](/components/base): the shadcn set plus Color Field, Input OTP, Table variants and more.
- [Charts](/charts): d3 and SVG, keyboard navigable, with a generated summary and data table.
- [Blocks](/components/blocks): pricing, heroes, footers and whole screens built from the base set.
- [Text, Animated and Backgrounds](/components): effects for landing pages, each one pausing
  off screen and under reduced motion.

## How it works

1. Run `npx @baby-ui/cli init` once, or skip it in a shadcn project.
   [Installation](/docs/installation) has the details.
2. Run `npx @baby-ui/cli add button`; its source, variants and any CSS it needs land in your
   project.
3. Change anything. Tokens in [Theming](/docs/theming) restyle every component at once.

## FAQ

- **Is it free?** Every component on this site is Apache-2.0.
- **Do I need Tailwind?** Yes, Tailwind CSS v4; the theme is plain CSS variables on top.
- **TypeScript or JavaScript?** Both. The CLI follows `components.json`; the header's
  language picker switches the code shown on the site.
- **Can I mix it with shadcn/ui?** Yes. Base parts share shadcn's names, so they replace or
  sit beside shadcn components.
