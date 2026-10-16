---
title: Money Input
description: "An amount field that groups digits as you type, stores minor units, refuses amounts past the limit, steps with the arrows and offers quick-add chips."
component: money-input
category: base
tags: [money, currency, amount, form]
---

The value is an integer of minor units (cents for USD, yen for JPY), so nothing rounds on the
way to your server. Pass several `currencies` to show a menu; pass one to show only its symbol.
