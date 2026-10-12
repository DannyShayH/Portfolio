---
title: "09 — Two-Track Review: Code Standards and Product Spec"
description: "Reviewing whether Supavisor is built sensibly and whether it actually satisfies the behavior the spec describes."
date: 2026-10-05
lastmod: 2026-10-12
weight: 9
tags: ["AIDA", "Supavisor", "review", "code quality", "specification"]
categories: ["Projects"]
---

## Review track one: is it built sensibly?

The current project has moved beyond its original all-in-one visual prototype. The frontend is organized into JSX pages, components, hooks, a service layer, and page-scoped CSS Modules. The backend contains controllers, services, persistence, authorization-aware behavior, scheduled work, state history, and automated unit and integration tests.

Recent backend pull requests show several useful engineering choices: server time instead of trusting a browser clock, pessimistic locking for the automatic-acceptance job, optimistic versioning for user-driven concurrent updates, production-only schema validation, and tests for both successful and forbidden behavior.

The remaining technical risk is now breadth and consistency rather than the absence of a backend. Many open issues cover assignment rules, states, delegation, qualifications, warnings, overrides, filtering, and cleanup. Each change must preserve the behavior already proven by tests and avoid creating a different interpretation in the frontend.

## Review track two: does it meet the spec?

The repositories meet important parts of the documented specification in `.scratch/project-management-tool/spec.md`:

- two distinct user experiences exist;
- administrators can manage several real resources through frontend service calls;
- projects and project lifecycle states are implemented;
- assignment acknowledgement and automatic acceptance have backend rules and history;
- stale schedule writes are rejected rather than silently overwriting newer work;
- deactivated users and role-specific data access are checked by the backend;
- automated tests exercise important API and domain behavior.

The complete product still requires issue-by-issue completion and an end-to-end review of frontend, backend, database, authorization, and error handling. It also contains no implemented AI capability, even though AI-assisted tools were used during development.

## Did AI-assisted implementation invent requirements?

That remains a review question. Issues and code contain detailed status transitions, permissions, timing rules, and override behavior. Some are confirmed project decisions; others may have entered through design exploration, developer assumptions, or generated suggestions. Code alone cannot explain which is which.

The review outcome is therefore not “remove them.” It is “mark them as assumptions, ask the customer, and update the spec.”

## Review outcome

Supavisor is now a developing full-stack system rather than only a prototype. The next quality improvement is to close the remaining issue slices, connect and verify both repositories end to end, and use the spec to protect confirmed behavior during cleanup.

## What the GitHub review showed

On 12 October 2026, the backend repository's issue search showed 60 closed issues and 59 open issues. The open list includes both product slices and a newer series of code-cleanup tasks. The separate frontend repository had no GitHub issues, but its commit history and code show active implementation. This means the backend repository is functioning as the shared backlog for work that may affect one or both applications; “no frontend issues” does not mean “no frontend work.”

[Backend repository](https://github.com/EmilXavierVT/Supavisor) · [Frontend repository](https://github.com/EmilXavierVT/SupavisorFront)

[AIDA source: Two-track review in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
