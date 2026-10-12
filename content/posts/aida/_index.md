---
title: "Supavisor — Grill Me & Spec-Driven Project Journal"
description: "Ten posts reviewing Supavisor's design and full-stack development through the AIDA Grill Me and spec-driven development framework."
date: 2026-09-10
lastmod: 2026-10-12
weight: 3
tags: ["AIDA", "Supavisor", "Grill Me", "spec-driven development", "code agents"]
categories: ["Projects"]
---

Supavisor is a workforce-scheduling project for Morgendagens Måltid. It began as sketches and an interactive frontend and has developed into separate React and Java/Javalin repositories with a REST API, PostgreSQL persistence through Hibernate, authorization, scheduling, and test work. The project contains administrator and employee experiences for assignments, staffing, availability, projects, roles, qualifications, notifications, and account management.

> **AI's role in the project:** Supavisor does not currently contain an AI feature. There is no model, RAG pipeline, LLM API, or MCP integration inside the product. AI-assisted tools have instead been used to help design, build, debug, and iterate on the project. The distinction is important: this is software built *with* AI assistance, not an AI-driven feature for the end user.

This journal reviews that work retrospectively through the AIDA Mini AI Hero flow:

1. **Grill Me preparation:** challenge the brief and expose the questions that still need customer answers.
2. **Context:** establish a shared glossary for the project.
3. **Decision notes:** record important choices, reasons, and consequences in plain language.
4. **Specification:** state the problem, users, goals, non-goals, and flows.
5. **Acceptance:** define observable behavior and testable boundaries.
6. **Tickets:** divide the product into small vertical slices.
7. **Implementation:** compare the administrator and employee slices with the spec.
8. **Review:** check both code quality and whether the right product was built.
9. **Theory building:** identify what the team understands and what is still only assumed.

No customer interview was recorded for this project. The backend repository does, however, contain shared engineering rules in `contributing.md` and detailed product documentation under `.scratch/project-management-tool/`, including the specification, prioritized user stories, blockers, and Figma slice map. These posts use those documents together with the sketches, Figma design, frontend, backend issues, pull requests, tests, and implemented behavior. Where the written sources do not settle a question, it remains open instead of being presented as a customer decision.

The work was also personal and iterative. I was sick during the first three weeks. After returning, I concentrated heavily on rebuilding and connecting the frontend, while also completing backend issues concerning assignment acknowledgement, automatic acceptance, concurrent schedule updates, and production database validation. GitHub issues became the project backlog, while Git worktrees and the GitHub command-line tool (`gh`) helped me separate work and inspect repository state without mixing unrelated changes.

The result is ten project posts about what has actually been built, while also showing how Grill Me and spec-driven development can make the next iteration more deliberate and verifiable.

[AIDA exercise: Mini AI Hero — spec-driven quiz website](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
