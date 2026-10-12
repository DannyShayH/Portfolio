---
title: "05 — Acceptance Criteria and Testable Boundaries"
description: "Checking Supavisor through observable behavior instead of judging the prototype only by its visual completeness."
date: 2026-09-18
lastmod: 2026-10-12
weight: 5
tags: ["AIDA", "Supavisor", "acceptance criteria", "testing"]
categories: ["Projects"]
---

## From screens to observable behavior

A spec becomes useful to an AI coding assistant when success can be checked from outside the implementation. Supavisor's GitHub issues use acceptance checklists to turn broad user stories into observable behavior across the frontend, API, database, authorization, and test boundaries.

## Criteria supported by completed work

- [x] Projects can be created and moved through defined lifecycle statuses.
- [x] An employee can acknowledge an assignment before it begins, with role and timing checks.
- [x] A due assignment can be accepted automatically by a server-side job without creating duplicate history.
- [x] A stale schedule update is rejected with a conflict response instead of overwriting newer data.
- [x] Production startup validates the database schema rather than changing it automatically.
- [x] Deactivated users are prevented from entering the company domain.
- [x] Calendar and assignment work is connected to persistent backend data.
- [x] Backend unit and integration tests cover important scheduling and authorization behavior.

These are stronger claims than “the button exists.” They are supported by closed issues and implementation pull requests, including [assignment acknowledgement](https://github.com/EmilXavierVT/Supavisor/pull/146), [automatic acceptance](https://github.com/EmilXavierVT/Supavisor/pull/145), [stale-update protection](https://github.com/EmilXavierVT/Supavisor/pull/147), and [production schema validation](https://github.com/EmilXavierVT/Supavisor/pull/148).

## Criteria that still need continued verification

- [ ] Every frontend action uses the final backend endpoint and handles loading, empty, success, and error states.
- [ ] Administrator and employee permissions are consistent across all routes and endpoints.
- [ ] Assignment requirements, qualifications, delegation, status changes, and reassignment work as one coherent flow.
- [ ] The frontend and backend agree on terminology, validation messages, and state transitions.
- [ ] Remaining cleanup issues are resolved without changing confirmed behavior.
- [ ] A full end-to-end test proves the most important administrator and employee journeys.

## Testable boundaries for the next slice

The next version should continue testing at the browser, API, database, and authorization boundaries. A useful end-to-end check is: an administrator authenticates, changes an assignment, an employee sees and acknowledges it, the state survives refresh, and a stale competing update receives a clear conflict instead of silently winning.

## Why this matters for agent work

Without criteria, an AI coding assistant may satisfy a ticket by rendering a convincing button. With criteria, the team can distinguish visual completion, API integration, persistence, authorization, and tested behavior. This is why the issue checklist and the resulting tests matter as much as the screen.

[AIDA source: Acceptance criteria and testable boundaries](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
