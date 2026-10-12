---
title: "04 — Writing a Retrospective Supavisor Spec"
description: "Capturing the problem, users, goals, non-goals, flows, and design requirements demonstrated by the current Supavisor project."
date: 2026-09-16
lastmod: 2026-10-12
weight: 4
tags: ["AIDA", "Supavisor", "specification", "Figma"]
categories: ["Projects"]
---

## Why this spec is retrospective

The available material contains sketches, a Figma design, a React frontend, a Spring Boot backend, GitHub issues, and tests, but no single original specification that explains every choice. The document below records what those artifacts demonstrate. It is not a substitute for Grill Me: anything requiring customer confirmation remains an assumption.

AI-assisted tools were used during design and implementation. They helped turn ideas and visual directions into React pages, supported the Figma conversion, and assisted with debugging and backend work. AI is therefore part of the development method, but not part of Supavisor's runtime product behavior. The application itself does not currently call a model or expose an AI feature to administrators or employees.

## Remaking the Figma output for the real frontend

The Figma-generated starting point could not simply be copied into the repository. It began as TSX, while this frontend is implemented with React and JSX. I used AI assistance to translate the TSX into JSX, repair syntax and import differences, and work through styling problems. I also read the relevant documentation rather than treating generated code as authoritative.

The styling needed a second conversion. Broad generated CSS was reorganized into CSS Modules so styles could stay close to their page or component without leaking across the application. The current frontend reflects that result: pages such as the login screen, administrator dashboard, and employee overview are `.jsx` files that import their own `.module.css` files. AI accelerated the remake, but manual review, documentation, and testing were what made it fit the project.

<div class="image-center">
<img src="login-sketch.jpg" alt="Early Supavisor login sketch" loading="lazy" decoding="async">
</div>

<div class="image-center">
<img src="admin-mockup.png" alt="Figma mockup of the Supavisor administrator dashboard" loading="lazy" decoding="async">
</div>

## Problem

Scheduling work across employees, teams, assignments, locations, availability, and leave can make staffing gaps and conflicts difficult to see. Supavisor aims to give administrators an operational overview and employees a clear personal schedule.

## Users

- Administrators who plan and monitor work.
- Employees who review shifts and submit scheduling-related requests.

## Goals demonstrated by the current project

- Separate administrator and employee experiences and enforce sensitive boundaries on the backend.
- Let administrators manage users, roles, qualifications, assignments, projects, customers, and products.
- Let employees inspect their own profile and assignment information and take permitted actions.
- Preserve assignment state history and important responsibility changes.
- Reject stale schedule updates instead of silently overwriting newer work.
- Persist business data and verify important behavior with automated tests.

## Non-goals and claims this portfolio does not make

- Supavisor does not currently provide an AI assistant, model integration, RAG pipeline, or automated AI scheduling.
- The portfolio does not claim that every open GitHub issue is finished or every frontend path is fully connected.
- It does not claim payroll, time tracking, notification delivery, or legal-compliance guarantees unless those are proven by a specific issue and test.
- It does not treat a completed screen as proof that authorization, persistence, and concurrency are complete.

## Primary administrator flow

1. Authenticate as an administrator.
2. Open the relevant management area, such as assignments, users, projects, roles, or qualifications.
3. Load data through the frontend service layer.
4. Create or update a permitted resource.
5. Let the backend validate authorization, state, timing, and concurrency rules.
6. Show the saved result or a clear conflict, validation, or forbidden message.

## Primary employee flow

1. Authenticate as an employee.
2. Open the employee overview or assignment details.
3. See only the information allowed for that identity.
4. Take an action such as acknowledging an eligible future assignment.
5. Receive a clear result and see the persisted state and history after refresh.

## Design requirements visible in the implementation

The remade interface should preserve the intent of the Figma design while fitting the real component structure. CSS Modules should keep page styles scoped. Warnings and states must remain understandable without relying only on color. Administrator density and employee simplicity should remain distinct, and responsive layouts should keep the main actions usable.

## Open blockers

Grill Me must still confirm the approval model, scheduling rules, privacy boundaries, status vocabulary, notification channels, and whether supervisors need a third role. The spec should not convert those uncertainties into accidental requirements.

[AIDA source: Writing the spec in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
