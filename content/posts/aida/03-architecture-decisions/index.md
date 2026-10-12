---
title: "03 — Recording Supavisor's Important Technical Decisions"
description: "Turning implementation choices already visible in Supavisor into short decision notes with explicit reasons and consequences."
date: 2026-09-14
lastmod: 2026-10-12
weight: 3
tags: ["AIDA", "Supavisor", "decision notes", "architecture"]
categories: ["Projects"]
---

## Decisions hidden inside the implementation

The AIDA workflow recommends short written records for choices that are important, surprising, or expensive to reverse. In this portfolio I call them **decision notes**. Each note explains the situation, the chosen approach, and its consequences so a reader does not need to know a specialist acronym.

## Decision note 1: Build an interactive frontend before the backend

**Status:** Historical starting point; the project is now moving those flows onto real backend services.

**Context:** The project needed to explore navigation, role-specific workflows, schedule layouts, and operational information quickly.

**Decision:** Explore Supavisor first through Figma and an interactive React frontend, then connect the confirmed slices to persistent backend services.

**Consequences:** The team could demonstrate and revise workflows early. It also created a clear second phase: replace mock behavior with protected API calls, persistent data, server-side rules, and tests. The current repositories show that transition in progress.

## Decision note 2: Separate the two main user experiences

**Status:** Implemented in the interface.

**Context:** Administrators need workforce-wide controls, while employees need a private and reduced experience.

**Decision:** Give Administrator and Employee distinct navigation and permissions, while allowing the backend to model more detailed business roles and qualifications.

**Consequences:** Navigation remains understandable while custom roles and qualifications can express more detailed business responsibility. Grill Me must still confirm which capabilities belong to each role and whether another top-level experience is needed.

## Decision note 3: Treat assignments as a shared domain object

**Status:** Implemented across the evolving frontend and backend model.

**Context:** The overview, week calendar, employee grid, location page, reports, and personal schedule all describe the same work.

**Decision:** Use assignment data as the shared source for scheduling views and extend the backend model with participants, responsibility, versions, lifecycle state, and history.

**Consequences:** Multiple views can stay conceptually aligned, and stale-update protection and history now have a defined place. Recurrence, publication rules, and the remaining issue-driven states still need confirmation and end-to-end verification.

## Decision note 4: Keep administrator and employee navigation separate

**Status:** Implemented across desktop and mobile layouts.

**Context:** The roles perform different tasks and use different amounts of information.

**Decision:** Administrators receive the full sidebar and Admin Hub; employees receive overview, schedule, settings, and a mobile bottom navigation.

**Consequences:** The employee experience stays focused and mobile-friendly. The backend also has to enforce the same boundary, because conditional rendering alone is not security. Existing authorization-aware tests support that approach, and the remaining routes still need consistent verification.

## Why decision notes improve the next AI-assisted session

An AI coding assistant asked to “add a supervisor role” should not silently stretch the current access model. A decision note makes the cost and the required customer decision visible. That is the difference between preserving project understanding and merely generating another screen.

[AIDA source: Context and technical decisions in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
