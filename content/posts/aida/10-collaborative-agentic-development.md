---
title: "10 — Collaborative Agentic Development"
description: "Coordinating people and AI agents with scoped tickets, guardrails, worktrees, tests, and review."
date: 2026-09-18
lastmod: 2026-09-18
weight: 10
tags: ["AIDA", "code agents", "collaboration"]
---

## Summary

Collaborative agentic development considers how several developers and AI agents can work in the same codebase. The material uses an agent ticket as a contract: it defines the goal, allowed paths, forbidden changes, functional requirements, architectural guardrails, tests, definition of done, stop conditions, and handoff. Git worktrees, CODEOWNERS, branch protection, and CI support the workflow.

Parallel work creates speed but also overlap and integration risk. Natural-language rules alone are soft guardrails, so important boundaries should be enforced by repository structure and automation. Clear ownership and stop conditions prevent an agent from resolving ambiguity through unapproved changes.

## Anatomy of an agent-ready ticket

The detailed course example treats a ticket as a small working contract. It includes:

- A precise goal and a named human owner.
- The agent branch, base branch, and files the agent may change or create.
- Files and behaviors that must remain unchanged, such as public API contracts, migrations, or security code.
- Functional requirements expressed as observable behavior.
- Architectural rules, such as keeping database access out of the controller.
- Required unit or integration tests and the commands used to run them.
- A definition of done and explicit situations where the agent must stop and ask.
- A handoff containing changed files, test results, assumptions, limitations, and possible follow-up work.

The material distinguishes **soft guardrails** in the ticket from **hard guardrails** enforced by tools. CODEOWNERS, protected branches, CI, path checks, Maven Enforcer, ArchUnit, and pull-request templates can turn important instructions into controls that are harder to ignore.

## Key takeaways

An agent-ready ticket must specify both the desired result and the permitted change surface. Verification needs concrete commands and expected behavior. Written guardrails should be distinguished from technical controls such as protected branches, automated tests, path checks, and required review.

- Use worktrees or isolated branches to reduce collisions between parallel tasks.
- Preserve existing contracts unless the human owner explicitly approves a change.
- Make “stop and ask” a valid outcome when requirements conflict.
- Keep ordinary tickets short, reserving the full template for risky or shared areas.

## Closing note

Good agent collaboration looks surprisingly similar to good team engineering, only with a greater need for explicit boundaries. The lesson is not to write enormous prompts, but to create small, reviewable units of work and a reliable integration process.

[Source: 10-Collaborative-Agentic-Development](https://aida.kursusmaterialer.dk/10-collaborative-agentic-development/) · [Coworking with agents](https://aida.kursusmaterialer.dk/10-collaborative-agentic-development/cowork/)
