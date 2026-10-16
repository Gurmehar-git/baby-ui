---
title: Phone Input
description: "A phone number field with a searchable country picker that formats as you type, switches country on pasted international numbers, and reports E.164."
component: phone-input
category: base
tags: [phone, tel, country, form]
---

Built on Input Group and Combobox. The value is always E.164 (`+14155550132`); `onValueChange`
also passes the parsed country, the formatted number and whether it is a valid length.
