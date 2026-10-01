---
title: "09 — Project Start"
description: "Forming a team, selecting a case, and turning an AI project idea into a description and system sketch."
date: 2026-09-14
lastmod: 2026-09-14
weight: 9
tags: ["AIDA", "project", "architecture"]
---

## Summary

The project begins with team formation and the selection of either a company case or an original idea. The initial deliverables are a project description and a system sketch that show the problem, intended users, main components, data flow, and role of AI.

An early shared picture gives the team a basis for discussion before implementation creates momentum in the wrong direction. It also reveals assumptions and dependencies, such as where data comes from, which external services are involved, and where failures or human review must be handled.

## Initial project foundation

The two required outputs establish a common direction for the team:

- **Project description:** the problem, target users, proposed value, scope of the first version, and the reason AI is—or is not—part of the solution.
- **System sketch:** the major components and the way data moves between the user interface, backend, storage, model, retrieval layer, and external services.

Before implementation begins, the team should also make visible:

- The source and sensitivity of the data used by the application.
- The boundary between deterministic application logic and model-generated behavior.
- The points where an external service can fail or respond slowly.
- The decisions that require company input or human approval.
- A small user flow that can become the first working vertical slice.

This is the transition from a promising idea to a project that can be divided, tested, and discussed technically.

## Key takeaways

A system sketch is valuable because it turns vague ideas into concrete relationships between the frontend, backend, storage, model or retrieval layer, and external integrations. Combined with a short project description, it becomes a boundary for the first version.

- Agree on the problem statement before distributing implementation tasks.
- Mark uncertain assumptions rather than silently building around them.
- Keep the first architecture simple enough to explain in a few minutes.
- Use the sketch as a living artifact when the project changes.

## Closing note

The first plan will change, but that does not make planning wasteful. Its value is in giving the team a shared starting theory and making later changes deliberate rather than accidental.

[Source: 09-Projektstart](https://aida.kursusmaterialer.dk/09-projektstart/)
