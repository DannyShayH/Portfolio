---
title: "07 — Spec-Driven Development"
description: "Using shared domain understanding, specifications, acceptance criteria, and small tickets to guide code agents."
date: 2026-09-07
lastmod: 2026-09-07
weight: 7
tags: ["AIDA", "spec-driven development", "code agents"]
---

## Summary

Spec-driven development uses specifications as active artifacts that guide requirements, design, implementation, and review. The session combines Peter Naur's view of programming as theory building with a practical quiz exercise: interview a domain expert, create a glossary and selected architecture decisions, write a specification, split it into vertical tickets, implement one ticket with an agent, and review against the spec.

A code agent can produce code quickly but cannot infer the customer's full mental model. A shared vocabulary, explicit non-goals, acceptance criteria, and testable boundaries reduce guessing. They also help a team verify that it has built the right product, not just code that runs.

## Mini AI Hero workflow

The meditation quiz exercise uses a simplified six-step process:

1. **Interview the customer:** clarify the audience, learning purpose, scoring, feedback, tone, storage, and boundaries before asking an agent to code.
2. **Write the context:** create a small glossary and record only the architectural decisions that are important or difficult to reverse.
3. **Create the specification:** document the problem, audience, goals, non-goals, user flow, requirements, acceptance criteria, and testable boundaries.
4. **Create vertical tickets:** divide the feature into small slices that each produce behavior that can be demonstrated.
5. **Implement one slice:** give the agent the specification, relevant ticket, data, decisions, and acceptance criteria.
6. **Review in two directions:** check both code quality and whether the implementation actually matches the specification.

Peter Naur's theory-building perspective supports the exercise. The programmer needs a working theory of how the real-world problem maps to the program, including the ability to explain decisions and respond constructively to change. Documents help carry this knowledge but cannot contain all of it.

## Key takeaways

The most valuable specification records understanding and decisions rather than trying to describe every line of implementation. Small vertical tickets should deliver observable behavior and include their own acceptance criteria. Naur's argument also shows why documents support understanding but cannot fully replace the team's internal theory of the system.

- Do not let the agent invent requirements when the domain is unclear.
- Use non-goals to prevent the first version from expanding without purpose.
- Split tickets by user-visible behavior rather than HTML, CSS, and JavaScript layers.
- Review whether the team understands the system, not only whether all documents exist.

## Closing note

The distinction between producing artifacts and building understanding is important. A specification is useful when it improves the conversation and exposes unanswered questions; it becomes harmful when it is treated as paperwork that allows people—or agents—to stop thinking.

[Source: 07-Spec-Driven-Dev](https://aida.kursusmaterialer.dk/07-spec-driven-dev/) · [Naur: Theory Building](https://aida.kursusmaterialer.dk/07-spec-driven-dev/naur-theory-building/) · [Quiz exercise](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
