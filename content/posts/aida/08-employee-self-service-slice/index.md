---
title: "08 — Reviewing the Employee Self-Service Slice"
description: "Testing the personal schedule, open spots, requests, notifications, and mobile flow against the Supavisor spec."
date: 2026-09-29
lastmod: 2026-10-12
weight: 8
tags: ["AIDA", "Supavisor", "employee workflow", "mobile UX"]
categories: ["Projects"]
---

## The implemented employee experience

The employee side deliberately removes administrator-only management pages. The current frontend includes an employee overview and assignment details, while the backend defines authorization-aware assignment visibility and employee actions.

The acknowledgement slice is the clearest completed example. An assigned employee may acknowledge work before it starts; an unrelated user or a late request must be rejected; the state change is recorded. At the start time, the automatic-acceptance job can move eligible work forward safely and without duplicate history.

## What the slice proves

The slice demonstrates why the employee experience should be smaller and more task-focused than the administrator experience. It also shows why a frontend-only role switch is insufficient: identity, timing, assignment membership, and allowed transitions are backend responsibilities.

## Acceptance questions exposed by Grill Me

- Can an employee claim an open spot, or only request it?
- Can a manager reject a request, and what reason is shown?
- What happens if two employees request the final spot?
- Which leave information may coworkers or supervisors see?
- When must sickness be reported by phone instead of through the app?
- Does changing contact information require verification?

## The next vertical ticket

**Goal:** An authenticated employee can review an assignment, understand its current state, and take only the action currently allowed.

**Acceptance criteria:** The backend verifies identity, assignment membership, timing, and state. The action survives refresh and creates the expected history once. The frontend explains success, conflict, and forbidden responses without exposing another employee's private information.

This ticket is small enough for one agent session only after the customer answers define the approval policy and conflict behavior.

[AIDA source: Grill Me, tickets, implementation, and review](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
