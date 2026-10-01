---
title: "02 — RAG Foundations"
description: "An introduction to retrieval-augmented generation, data preparation, and choosing when RAG adds value."
date: 2026-08-21
lastmod: 2026-08-21
weight: 2
tags: ["AIDA", "RAG", "retrieval"]
---

## Summary

Retrieval-augmented generation, or RAG, connects a language model to a collection of documents. Relevant passages are retrieved and added to the model's context before it produces an answer. The session compares Custom GPTs, CustomGPT.ai, and Dify.ai, then uses a study-program document to build a simple chatbot.

An LLM's built-in knowledge may be outdated, too general, or disconnected from private material. RAG can ground an answer in selected sources without retraining the model. It is valuable when answers must depend on a known document collection, although it also introduces retrieval quality, cost, and maintenance concerns.

## Approaches explored

The session compares three ways of creating a document-based assistant:

1. **ChatGPT Custom GPT:** a quick way to attach knowledge files and configure assistant behavior.
2. **CustomGPT.ai:** a hosted product focused on building assistants from an organization's own material.
3. **Dify.ai:** a more configurable platform for assembling a RAG workflow and exposing it through an API.

The practical exercise uses a study-program document as the source for a Dify chatbot. The PDF is converted to Markdown so that headings, sections, and textual relationships become easier for the retrieval system to process.

The mini-project is to repeat the process with personally selected material and document the resulting RAG chatbot in the portfolio.

## Key takeaways

The basic RAG flow is to prepare documents, split and index them, retrieve relevant content, and give that context to the model. Source quality and structure matter; converting a difficult PDF into clean Markdown can improve retrieval before any prompt is changed.

- Hosted solutions are fast to start with but offer different levels of cost, control, and flexibility.
- Retrieval adds relevant context; it does not guarantee a correct interpretation of that context.
- Clear headings and clean source text improve the chance of retrieving a meaningful passage.
- RAG is most useful when the source collection is specific, valuable, and kept up to date.

## Closing note

RAG is not automatically the right solution for every chatbot. It is most convincing when the data source is clearly defined and the system can show where its answer came from. The exercise demonstrates that data preparation is part of the product rather than a hidden preprocessing step.

[Source: 02-RAG-I](https://aida.kursusmaterialer.dk/02-rag-1/)
