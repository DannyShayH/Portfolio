---
title: "05 — LLM API Integration"
description: "Designing an application that evaluates an assignment with a rubric through an external LLM API."
date: 2026-08-31
lastmod: 2026-08-31
weight: 5
tags: ["AIDA", "LLM API", "structured output"]
---

## Summary

The task is to build an application that accepts an assignment, evaluates it against a rubric, calls an external LLM API, and returns structured, advisory feedback. The solution needs a backend endpoint, system and user prompts, 4–6 assessment criteria, and output such as criterion-level feedback, strengths, weaknesses, improvements, and follow-up questions.

Calling a model from an application introduces concerns that are hidden in a chat interface: input validation, prompt construction, timeouts, errors, unpredictable responses, and parsing. A rubric makes the evaluation criteria explicit, while structured output lets the rest of the software use the result reliably.

## Assignment structure

The assessment application is divided into a set of concrete development tasks:

1. **Derive a rubric:** translate the supplied learning goals and report requirements into 4–6 criteria with descriptions of low, medium, and high achievement.
2. **Design the prompts:** use a system prompt to define the evaluator's role and a user prompt containing the rubric and assignment text.
3. **Build the backend:** create an endpoint that receives input, constructs the model request, calls the external API, and returns the result.
4. **Structure the feedback:** return an overall assessment, feedback per criterion, strengths, weaknesses, suggested improvements, and 4–6 questions for further discussion.
5. **Test and review:** run the application against the supplied example assignments and identify unstable, misleading, or generic feedback.

JSON is encouraged for both the rubric and the model response because it creates a clearer boundary between the probabilistic model and the deterministic application.

## Key takeaways

The model should be treated as an external, non-deterministic service. The application must define a clear contract around it, request a machine-readable format such as JSON, validate the response, and present the result as guidance rather than an objective grade.

- Keep the first version focused on plain text or Markdown rather than PDF upload.
- Separate the system instructions, rubric, and submitted assignment clearly.
- Handle API errors, timeouts, missing fields, and invalid structured output.
- Compare several responses before concluding that a prompt is reliable.

## Closing note

This is a good example of a task where AI can support human work without owning the final decision. The quality of the result depends heavily on the rubric and prompts, but transparency about uncertainty is just as important as technical accuracy.

[Source: 05-LLM-API](https://aida.kursusmaterialer.dk/05-llm-api/) · [Assignment](https://aida.kursusmaterialer.dk/05-llm-api/opgave/)
