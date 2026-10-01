---
title: "03 — RAG Quality and Integration"
description: "Improving retrieval, prompts, source structure, and the integration of a RAG chatbot into a portfolio."
date: 2026-08-24
lastmod: 2026-08-24
weight: 3
tags: ["AIDA", "RAG", "prompt design"]
---

## Summary

The second RAG session moves from a guided prototype to designing a solution around an interesting case. The task is to choose a data source, convert it to Markdown, optimize its structure and retrieval behavior, improve the prompts, embed the chatbot in the portfolio, and consider automatic updates through an API and GitHub Actions.

A working demo is not the same as a reliable information system. Retrieval can select irrelevant chunks, important context can be split apart, and prompts can encourage unsupported answers. Integration and automation also determine whether the system remains useful when its source content changes.

## Practical workflow

The course proposes a small research-and-implementation cycle:

1. Research possible solutions with tools such as ChatGPT or Claude.
2. Present the alternatives and compare their strengths and limitations.
3. Select an approach and implement it in the portfolio.
4. Test retrieval quality with questions that require different parts of the source material.
5. Improve the document structure and prompt based on the observed failures.

The finished case should cover:

- The selected topic and source data.
- How the data was converted and prepared.
- How retrieval and prompt design were configured.
- How the chatbot was embedded in the portfolio.
- How an API and GitHub Actions could keep the knowledge base synchronized with new or edited posts.

## Key takeaways

A RAG system should be evaluated as a pipeline rather than blaming every poor answer on the model. Useful questions include whether the right passage was retrieved, whether the chunk contained enough context, whether the source was well structured, and whether the prompt required grounded answers.

- Inspect retrieved passages before changing the generation prompt.
- Test both questions the system should answer and questions it should refuse.
- Prefer answers that cite or clearly relate to their source material.
- Plan how changed documents will be reprocessed and re-indexed.

## Closing note

The most important shift is from asking “does the chatbot answer?” to asking “why did it answer this way?” A maintainable RAG solution needs observable retrieval and a deliberate update process, especially when it is connected to content that changes over time.

[Source: 03-RAG-II](https://aida.kursusmaterialer.dk/03-rag-2/)
