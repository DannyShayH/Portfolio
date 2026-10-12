---
title: "10 — Theory Building and the Next Supavisor Spec"
description: "Reflecting on what the team understands, what the implementation records, and what Grill Me must resolve before the next issue slice."
date: 2026-10-12
lastmod: 2026-10-12
weight: 10
tags: ["AIDA", "Supavisor", "Peter Naur", "theory building", "next steps"]
categories: ["Projects"]
---

## The implementation contains a partial theory

Peter Naur describes programming as building a theory of how a real-world problem relates to a program. Supavisor's frontend, backend, issues, and tests contain part of that theory. They say that scheduling connects people, roles, qualifications, assignments, projects, responsibility, timing, states, history, and access control. They also say that administrators and employees need different views of the same operation.

The code records those relationships, but it cannot explain why every rule was chosen. Which responsibility changes require history? Which qualification failures must block assignment? Which status transitions may an administrator override? When may an employee decline or swap work? Those answers may exist in the team's heads or issue discussions, but they should also be recoverable from the specification.

## What Grill Me should resolve next

Before the next spec, the customer interview should focus on one end-to-end slice rather than the whole product. For real assignment management, the blocking questions are:

1. Who is allowed to create, publish, change, and cancel assignments?
2. Which conflicts must block saving, and which only warn?
3. How are availability, leave, working hours, and rest rules prioritized?
4. What happens when two people change the same assignment?
5. Which changes notify employees, and when?

After each answer round, the team should update the known facts, glossary, decision-note candidates, and remaining blockers.

## The next spec-driven cycle

The next iteration should produce:

- a confirmed glossary for assignment, shift, project, availability, and open spot;
- plain-language decision notes for authentication, role enforcement, persistence, and conflict handling;
- a narrow specification for one administrator scheduling flow;
- explicit non-goals to prevent the backend slice from expanding into every screen;
- acceptance criteria across browser, API, database, and authorization boundaries;
- one or two vertical tickets suitable for a code agent;
- a two-track review against both code standards and the spec.

## Where AI does and does not fit

AI-assisted tools have been used to help design, build, and iterate on Supavisor. That makes AI part of the development process: it can accelerate exploration, generate interface code, and help revise implementation details. The team still has to supply the domain theory, decide what the customer needs, constrain the work through specs, and review the result.

No AI, RAG, LLM API, or MCP capability is implemented inside the available Supavisor product. Administrators and employees are not currently interacting with a model, and the scheduling views do not make AI decisions. That is preferable to pretending that ordinary filtering or mock recommendations are AI.

Once the scheduling data and rules are trustworthy, the team could evaluate an assistant that explains staffing gaps or suggests candidates. Human approval should remain explicit, and deterministic rules should enforce constraints that must never be violated.

## How I worked with AI

I did not use AI as a one-shot generator. The work developed through a conversation in which I reviewed the result, corrected its direction, added missing facts, and narrowed the boundaries. My prompts moved through several useful stages:

1. I began with a broad outcome: find the relevant AIDA material and turn it into portfolio content.
2. I added scope boundaries: work only in the portfolio, do not change Supavisor or GitHub, and leave the Dify, RAGbot, and Cloudflare sections alone.
3. I corrected the source of truth: replace generic AIDA material with what is actually present in Supavisor and the work scraped from `aida.kursusmaterialer`.
4. I clarified the emphasis: ten posts should focus on Grill Me and spec-driven development.
5. I added factual constraints and personal context: no AI feature is implemented; AI was used to build the project; the Figma output needed a TSX-to-JSX and CSS Modules remake; I was sick for the first three weeks; afterward I focused strongly on the frontend and also completed backend work.
6. I asked for verification against the repositories and GitHub issues instead of relying only on memory or a polished narrative.

The strongest prompts named the desired result, the evidence to use, what must not be touched, and a fact that must not be misrepresented. These instructions reduced drift and made review possible. The less precise prompts used phrases such as “what is in there” or “what we scraped” without naming the exact source or defining what should be replaced. They were not useless, but they required follow-up corrections because several interpretations were possible.

A prompt structure I can reuse is:

> **Goal:** State the finished outcome. **Source of truth:** Name the repository, issue, document, or page to use. **Scope:** Name the files or section that may change. **Do not touch:** List excluded repositories and sections. **Facts and voice:** State required facts, personal context, and wording preferences. **Done when:** Describe the checks that prove the work is complete.

This conversation also showed an important AI skill: reviewing generated work is part of prompting. A good result did not come from finding one magical sentence. It came from noticing where the draft no longer matched the project, saying so directly, and supplying better constraints.

## My contribution and working method

I was sick during the first three weeks of the project. When I returned, I put most of my attention into the frontend: remaking the Figma output for the actual React setup, converting TSX to JSX, moving styles into CSS Modules, and connecting pages to the project structure. I also worked on backend issues. The repository history records my contributions to assignment acknowledgement, automatic acceptance, stale schedule-update protection, production schema validation, and integration-test repairs.

I used Git worktrees to isolate pieces of work and reduce the risk of mixing unrelated changes. I also used `gh`, the GitHub command-line tool, to inspect and manage issues, pull requests, and checks. AI helped me reason, draft, convert, and debug, but I remained responsible for choosing the task, correcting assumptions, reading documentation, checking the diff, and deciding whether the result met the specification.

## The immediate next step

The next step is to finish the GitHub issues and verify the frontend and backend together. The frontend repository currently has no issue list of its own, so the backend repository's shared backlog is the practical planning source. Work should proceed in narrow slices: clarify the issue, confirm the relevant glossary and decision notes, implement it in an isolated worktree when useful, run the appropriate checks, review it against both code standards and the spec, and only then close the issue.

## Final reflection

The main lesson is that more generated code would not automatically create more understanding. Supavisor already contains enough frontend and backend breadth to expose the domain. Grill Me and spec-driven development provide a way to turn that breadth into a confirmed, testable system—one issue and one vertical slice at a time.

[AIDA source: Mini AI Hero and Naur reflection](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/) · [AIDA source: Spec-driven development](https://aida.kursusmaterialer.dk/07-spec-driven-dev/)
