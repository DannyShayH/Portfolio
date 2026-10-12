---
title: "07 — Reviewing the Admin Scheduling Slice"
description: "Comparing Supavisor's implemented administrator workflow with its reconstructed specification and tickets."
date: 2026-09-25
lastmod: 2026-10-12
weight: 7
tags: ["AIDA", "Supavisor", "admin workflow", "scheduling"]
categories: ["Projects"]
---

## The implemented slice

The administrator frontend now exposes real management areas for users, roles, qualifications, assignments, projects, customers, and products. Its service layer calls the backend to create and update these resources, assign or delegate people, set a responsible person, and activate or deactivate records. This is substantially further than the first visual prototype.

## Evidence against the spec

The backend adds production-oriented rules behind those screens. Completed work includes creating projects, project lifecycle states, assignment acknowledgement, automatic acceptance, concurrent-update protection, deactivated-user access control, and production schema validation. Integration tests have also been repaired so authorization-aware visibility and assignment history can be checked against the actual API behavior.

The repositories still need an end-to-end review. A screen, endpoint, and test can each work independently while their names, validation messages, or allowed transitions disagree. The specification is the common reference that prevents this drift.

## The next production work

The next step is to finish and verify the remaining GitHub issues rather than invent a new feature list. Important themes include assignment types and requirements, responsible-person history, delegation, warnings and overrides, schedule filtering, decline or shift-swap behavior, reassignment history, custom statuses, and frontend handling of backend rules. The newer cleanup issues should improve maintainability without changing confirmed scheduling behavior.

## Grill Me before implementation

This ticket still depends on customer answers. Does assignment require approval? What counts as unavailable? Are rest and weekly-hour rules warnings or hard blocks? Can multiple administrators edit the same week? Should a changed published schedule notify affected employees immediately?

The right next step is to resolve those questions and update the spec, not to let an AI coding assistant choose policy through implementation.

[AIDA source: Implement and review one vertical slice](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
