---
title: "06 — Implementing the LLM Application"
description: "Turning the rubric-based assessment idea into a tested end-to-end application."
date: 2026-09-04
lastmod: 2026-09-04
weight: 6
tags: ["AIDA", "LLM API", "implementation"]
---

## Summary

This session continues the previous assignment and focuses on implementation. The rubric, prompts, backend endpoint, external API call, and structured response are connected into one end-to-end flow. The application is then tested with supplied example assignments and documented with requests, responses, and known uncertainties.

Design choices only become meaningful when the entire data flow works. Integration exposes practical problems such as malformed responses, weak criteria, timeouts, and prompts that behave differently across inputs. A thin but complete version gives a better foundation for improvement than several disconnected, polished pieces.

## End-to-end implementation

The work continues directly from the previous session. The goal is a first complete version in which:

- A user submits an assignment text through a frontend or REST client.
- The backend combines the text with the selected rubric and prompts.
- The external LLM API returns a structured assessment.
- The backend parses and validates the response before returning it to the client.
- The result can be tested against one or more of the provided example assignments.

The portfolio documentation should include the rubric, important prompt decisions, endpoint design, an example request and response, and a short account of what worked or remained uncertain. The emphasis is on a connected solution rather than a perfect interface.

## Key takeaways

An AI feature can be built vertically by accepting real input, calling the model, parsing its response, returning useful output, and testing the behavior. Prompt iteration should be systematic and based on several examples rather than on a single successful response.

- Debug the pipeline one boundary at a time: client, backend, API request, response parsing, and presentation.
- Confirm that rubric criteria are visible in the returned feedback.
- Record prompt changes so improvements can be compared instead of guessed.
- Identify the smallest useful next iteration after the first version works.

## Closing note

The session reinforces the value of making a complete path work before adding features. With LLMs, the first version will contain uncertainty, but a functioning pipeline makes that uncertainty visible and creates something concrete to measure and improve.

[Source: 06-LLM-API-IMPL](https://aida.kursusmaterialer.dk/06-llm-api-impl/)
