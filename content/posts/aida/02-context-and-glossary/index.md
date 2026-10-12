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

The Supavisor interface uses the same concepts across many screens, but the mirror contains no formal `CONTEXT.md`. A shared glossary is important because a code agent can reproduce a label without understanding its business meaning. The team and customer need one language before a specification can become reliable.

The following retrospective glossary is based on the current screens, frontend services, backend work, and issue descriptions. The tables use fixed columns and wrapping so every definition remains visible without horizontal scrolling.

<div style="width: 100%; overflow: visible;">
<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
<colgroup><col style="width: 28%;"><col style="width: 72%;"></colgroup>
<thead><tr><th style="white-space: normal; overflow-wrap: anywhere;">Role</th><th style="white-space: normal; overflow-wrap: anywhere;">Meaning in Supavisor</th></tr></thead>
<tbody>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Administrator</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A user who can manage organization-wide resources such as users, roles, qualifications, assignments, projects, customers, and products. Sensitive actions must be enforced by the backend, not only hidden in the interface.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Employee</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A user who sees a smaller self-service experience: personal profile and assignment information, notifications, and actions allowed for their own work. An employee must not receive administrator-only data or actions.</td></tr>
</tbody>
</table>
</div>

<div style="width: 100%; overflow: visible;">
<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
<colgroup><col style="width: 28%;"><col style="width: 72%;"></colgroup>
<thead><tr><th style="white-space: normal; overflow-wrap: anywhere;">Term</th><th style="white-space: normal; overflow-wrap: anywhere;">Meaning in Supavisor</th></tr></thead>
<tbody>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Assignment</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A planned piece of work with time boundaries, participants, a responsible person, status, and history. The backend work includes acknowledgement, automatic acceptance, delegation, overlap handling, and protection against stale updates.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Project</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A business grouping with its own lifecycle status. Projects can provide context for assignments and other customer-facing work.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Role</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A permission or responsibility grouping. This is different from the two main interface experiences, Administrator and Employee.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Qualification</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A capability attached to a user and used when deciding whether someone is suitable for an assignment.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Responsible person</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">The person with explicit responsibility for an assignment. This is not necessarily identical to every assigned participant.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Assignment acknowledgement</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">An employee's confirmation that they have seen and accepted an assignment before it begins.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Automatic acceptance</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A server-side rule that accepts a due assignment at its start when the required conditions are met, while preserving history and avoiding duplicate processing.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Optimistic version</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A version value used to reject a stale schedule update instead of silently overwriting another user's newer change.</td></tr>
<tr><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;"><strong>Audit or state history</strong></td><td style="white-space: normal; overflow-wrap: anywhere; vertical-align: top;">A record of important assignment changes so the system can explain how the current state was reached.</td></tr>
</tbody>
</table>
</div>

## Terms that still need Grill Me

Some labels are still easy to confuse. “Role” may describe system access, a custom business role, or an employee's responsibility on an assignment. Assignment, shift, project, delegation, acknowledgement, and acceptance also need exact customer-facing definitions.

These are not cosmetic differences. They affect the data model, API naming, validation, and what a user expects an action to do. The customer should decide whether:

- a shift is one employee's participation in an assignment;
- a project groups several assignments for one customer or purpose;
- qualifications block assignment or only produce a warning;
- acknowledgement and acceptance are separate business states;
- delegation changes responsibility, participation, or both.

## Context an agent should receive

Before changing Supavisor, a code agent should receive this glossary together with the relevant spec and ticket. If a requested feature conflicts with the domain language, the agent should stop and surface the conflict instead of introducing a new synonym or data shape.

## Reflection

The current React objects already contain part of the team's theory of the domain. Writing the glossary makes that theory reviewable. It also reveals where the code appears more certain than the available customer evidence.

[AIDA source: Context and glossary in the Mini AI Hero flow](https://aida.kursusmaterialer.dk/07-spec-driven-dev/mini-ai-hero-quiz-oevelse/)
