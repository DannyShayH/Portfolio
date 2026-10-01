---
title: "04 — Code Agents in Software Development"
description: "Using AI code agents for architecture, debugging, refactoring, and testing while keeping the developer in control."
date: 2026-08-28
lastmod: 2026-08-28
weight: 4
tags: ["AIDA", "code agents", "software development"]
---

## Summary

This session introduces code agents such as Claude Code, OpenAI Codex, and Gemini CLI. Unlike a simple chat response, an agent can inspect a codebase, edit files, run commands, and iterate on a task. The exercise is to solve a programming problem with an agent and document the workflow.

Agents can reduce the effort needed for exploration, repetitive changes, debugging, refactoring, and tests. Their ability to act across a repository also creates risk: vague instructions can produce broad changes, incorrect assumptions, or code that appears plausible without meeting the real requirement.

## Areas of use

The course places code agents inside normal software-development activities rather than treating them as code generators only:

- **Architecture:** exploring the repository and suggesting where a feature belongs.
- **Debugging:** tracing an error across logs, tests, and related source files.
- **Refactoring:** making a bounded structural change while preserving behavior.
- **Testing:** adding cases, running the suite, and using failures as feedback.
- **Documentation:** recording the chosen workflow, assumptions, and final result.

The portfolio exercise is to solve a programming task with an agent and document how the collaboration worked. Useful evidence includes the original task, important prompts, files changed, tests run, mistakes discovered, and corrections made during review.

## Key takeaways

Working well with a code agent depends on context, scope, and verification. A useful task states the goal and constraints, gives the agent access to the relevant material, and defines how success will be tested. Reviewing the diff and the test results remains a human responsibility.

- Give the agent a concrete outcome instead of a broad request to “improve” the project.
- Identify files or behaviors that must remain unchanged.
- Ask the agent to surface assumptions and stop when requirements conflict.
- Treat passing tests as evidence, not as proof that every requirement is satisfied.

## Closing note

A code agent works best as a capable collaborator, not an automatic replacement for engineering judgment. The faster it can change a codebase, the more important it becomes to make the intended outcome explicit and check the result critically.

[Source: 04-Kodeagenter](https://aida.kursusmaterialer.dk/04-kodeagenter/)
