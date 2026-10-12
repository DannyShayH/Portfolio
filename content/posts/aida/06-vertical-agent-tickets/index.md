---
title: "06 — Reconstructing Supavisor as Vertical Agent Tickets"
description: "Using completed Supavisor issues to show small, demonstrable vertical slices with their own acceptance criteria."
date: 2026-09-21
lastmod: 2026-10-12
weight: 6
tags: ["AIDA", "Supavisor", "vertical tickets", "code agents"]
categories: ["Projects"]
---

## Split by behavior, not technology

The AIDA workflow recommends vertical tickets that each produce something a person can demonstrate. Supavisor's strongest issues follow that idea: they cross the data model, business rules, endpoint, authorization, tests, and sometimes frontend instead of creating isolated “backend” and “CSS” tasks.

## Completed slice 1: Assignment acknowledgement

**User outcome:** An employee can acknowledge a future assignment.

**Boundaries:** The backend checks employee identity, assignment membership, and start time, changes the state once, and records history. Unit and integration tests prove both the success path and invalid attempts.

**Evidence:** [Issue 57](https://github.com/EmilXavierVT/Supavisor/issues/57) and [pull request 146](https://github.com/EmilXavierVT/Supavisor/pull/146).

## Completed slice 2: Automatic acceptance at start time

**User outcome:** A due assignment does not remain indefinitely in a waiting state.

**Boundaries:** A background job uses server time, locks the relevant row, avoids duplicate processing, and records the transition in history.

**Evidence:** [Issue 60](https://github.com/EmilXavierVT/Supavisor/issues/60) and [pull request 145](https://github.com/EmilXavierVT/Supavisor/pull/145).

## Completed slice 3: Protect concurrent schedule changes

**User outcome:** One administrator does not silently erase another administrator's newer update.

**Boundaries:** The client sends the version it read; the backend rejects an old version with a conflict response; tests cover the stale update.

**Evidence:** [Issue 94](https://github.com/EmilXavierVT/Supavisor/issues/94) and [pull request 147](https://github.com/EmilXavierVT/Supavisor/pull/147).

## Completed slice 4: Safe production schema behavior

**Operational outcome:** Production startup detects an unexpected database schema instead of modifying operational data automatically.

**Boundaries:** Production uses Hibernate validation, development remains configurable, and tests verify the configuration.

**Evidence:** [Issue 99](https://github.com/EmilXavierVT/Supavisor/issues/99) and [pull request 148](https://github.com/EmilXavierVT/Supavisor/pull/148).

## What an agent should receive

For one ticket, the AI coding assistant should receive the glossary, relevant decision notes, the retrospective spec, the ticket alone, and its acceptance criteria. It should not be asked to “finish Supavisor.” After implementation, it should report changed files, verification steps, assumptions, and blockers.

Git worktrees helped isolate these slices so parallel or experimental changes did not contaminate the main checkout. The GitHub command-line tool (`gh`) helped inspect issues, pull requests, checks, and repository state from the development environment. Neither tool decides what Supavisor should do: the spec, issue, and review still provide that direction.

This is also where the project's use of AI belongs in the portfolio. AI-assisted tools helped build Supavisor, but the value of the product still comes from the scheduling workflows and the team's domain understanding. Specs and tickets keep the AI working on confirmed behavior instead of allowing it to invent company policy.

[AIDA source: Vertical tickets in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
