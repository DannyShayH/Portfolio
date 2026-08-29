---
title: "RAG Chatbot"
description: "Building the retrieval-augmented chatbot that answers questions about this portfolio: choosing the stack, the indexing pipeline, running it locally, and what broke."
date: 2026-08-24
lastmod: 2026-08-29
weight: 2
tags: ["ai", "rag", "dify", "chatbot", "embeddings", "project"]
categories: ["Projects"]
---

This portfolio is a pile of prose — five weeks of Warranty backend notes, a frontend
write-up, an exam page. If a visitor wants one specific answer ("how did you do JWT?",
"what broke in deployment?") they have to read all of it to find it.

So I added a chatbot that can answer those questions directly, grounded in the pages on
this site rather than in whatever a general model happens to remember. It runs on
**Dify** as the orchestration and knowledge-base layer, with a small Python script
(`upload_to_dify.py`) that walks the `content/` folder and feeds every page into a
retrieval-augmented pipeline.

This section is the progression: why a chatbot and how I picked the stack, how the
indexing pipeline actually works (with a diagram), moving the whole loop to a
self-hosted Dify for faster iteration, and the things that went wrong along the way.
