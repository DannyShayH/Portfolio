---
title: "02 — Building Supavisor's Shared Context and Glossary"
description: "Deriving a precise project vocabulary from the concepts used throughout Supavisor's frontend, backend, and issue backlog."
date: 2026-09-12
lastmod: 2026-10-12
weight: 2
tags: ["AIDA", "Supavisor", "glossary", "domain language"]
categories: ["Projects"]
---

## Why the words matter

Supavisor already has substantial shared context in the backend repository. The product baseline and domain language are documented in `.scratch/project-management-tool/spec.md`; delivery order and dependencies are recorded in `user-story-priority-and-blockers.md`; the Figma handoff is mapped in `figma-user-story-slices.md`; and `contributing.md` defines the Java, REST API, validation, exception, testing, and review conventions.

The glossary below condenses those sources so the frontend, backend, issues, and AI-assisted work use the same terms. It is a readable companion to the repository documentation, not a replacement for it.

<div style="width: 100%; overflow: visible;">
<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
<colgroup><col style="width: 28%;"><col style="width: 72%;"></colgroup>
<thead><tr><th style="white-space: normal; overflow-wrap: anywhere;">Role</th><th style="white-space: normal; overflow-wrap: anywhere;">Meaning in Supavisor</th></tr></thead>
<tbody>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Administrator</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An authenticated user with organization-level capabilities granted through roles and permissions. Administrators manage users, categories, qualifications, projects, tasks, assignments, resources, expenses, statuses, and operational exceptions. The backend must enforce every sensitive action.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Employee</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An authenticated user who can view permitted schedules and assignment details, acknowledge or decline eligible work, and record check-in and check-out. Employees may see limited colleague scheduling information within their category, but not private notes, expenses, or sensitive project data.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Responsible person</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">The one optional user responsible for coordinating a task and applying permitted task-progress changes. This is task ownership, not a synonym for every employee who receives an assignment.</td></tr>
</tbody>
</table>
</div>

<div style="width: 100%; overflow: visible;">
<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
<colgroup><col style="width: 28%;"><col style="width: 72%;"></colgroup>
<thead><tr><th style="white-space: normal; overflow-wrap: anywhere;">Term</th><th style="white-space: normal; overflow-wrap: anywhere;">Meaning in Supavisor</th></tr></thead>
<tbody>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Organization</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">The security and data boundary that contains the system's users and operational records. The first release targets one organization, but persisted records remain organization-scoped.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>User</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An authenticated account whose access is determined by assigned roles and permissions. Deactivation blocks new assignments while preserving operational history.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Role</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An administrator-defined grouping assembled from a fixed permission catalogue. A role controls capabilities; it is separate from an employee category and from responsibility for a task.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Permission</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A fixed capability that can be included in a role. Permission changes must take effect immediately rather than waiting for a long-lived session to expire.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Employee category</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An administrator-managed work-area grouping. Each employee has one primary category, which supports predictable category-based schedule visibility.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Qualification</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A capability recorded separately from an employee's primary category. Task requirements can use qualifications to warn about or block an unsuitable delegation.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Project</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A lifecycle-managed container for related tasks, moving through draft, active, on-hold, completed, and archived states.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Task</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">Reusable work within a project. A task can define details, requirements, resources, dependencies, progress, a custom task status, one optional responsible person, and multiple assignments.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Assignment</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A scheduled allocation of a task to one employee. It owns its start and end time, assignment type, location, notes, status, acknowledgement outcome, resources, and attendance records.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Assignment type</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An administrator-managed classification for recurring kinds of scheduled work.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Delegation</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">The administrator action that allocates an assignment to an employee. Eligibility and overlap rules may warn, block, or require an audited override reason.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Acknowledgement</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An employee's explicit confirmation that they have seen an assignment. It is recorded separately from automatic acceptance.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Automatic acceptance</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">The server-side transition applied at an assignment's start time when the employee has not responded. It preserves a distinct history from explicit acknowledgement.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Check-in / check-out</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">Operational attendance events recorded with authoritative server timestamps. They are not payroll calculations, and corrections must retain audit history.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Resource</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">Reusable operational context such as equipment, vehicles, materials, or locations. Assignment usage can be required, recommended, or informational; formal reservation is outside the first release.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Expense</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A monetary entry connected to a project, task, or assignment. Expenses are separate from resources and can carry quantity, unit price, currency, category, description, and workflow state.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Custom status</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An administrator-defined task or assignment status with a name, color, description, order, and permitted transitions. Used statuses are archived rather than deleted.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Audit event</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A durable record of an important change, including delegation, role changes, schedule edits, overrides, status transitions, expense changes, and attendance corrections.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Optimistic concurrency</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A version check that rejects stale schedule edits with a conflict response instead of silently overwriting newer work.</td></tr>
</tbody>
</table>
</div>

## Shared engineering language

`contributing.md` also defines terms used when implementing the domain:

- A **controller** receives HTTP requests, validates request-level data, calls services, and returns HTTP responses.
- A **service** contains application and business logic; controllers should not contain that logic.
- A **model/entity** represents domain and persisted data.
- A **DTO** carries permitted input or output across the API without exposing database entities or sensitive fields directly.
- A **repository/persistence boundary** contains Hibernate and JPQL access rather than placing queries in HTTP handlers.

The backend is Java 17 with Javalin, not Spring Boot. Its REST API is versioned under `/api/v1`, Hibernate provides ORM and persistence, PostgreSQL stores the data, and Maven builds the project.

## Context an agent should receive

Before changing Supavisor, a code agent should receive the relevant sections of `contributing.md`, `.scratch/project-management-tool/spec.md`, the priority/blocker map, this glossary, and the ticket with its acceptance criteria. If a request conflicts with those sources, the agent should surface the conflict instead of introducing a new synonym or data shape.

## Reflection

The repository documentation supplies much more context than the interface alone. Keeping the condensed glossary aligned with those source documents makes the team's domain model easier to review without pretending that the glossary itself is a recorded customer interview.

[AIDA source: Context and glossary in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
