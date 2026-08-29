---
title: "Why a Chatbot & Choosing the Stack"
weight: 1
date: 2026-08-24
lastmod: 2026-08-24
tags: ["ai", "rag", "dify", "chatbot", "self-hosted"]
categories: ["Projects"]
---

## The problem

The portfolio is spread across a lot of pages — the Warranty backend broken into five
weekly write-ups, a separate frontend document, an exam page. Each one is a wall of
prose. If someone only wants to know *"how did you handle JWT?"* or *"what went wrong
with CORS?"*, they have to skim several pages to get there.

I wanted a visitor to be able to ask that question in plain language and get a short,
correct answer that comes from what I actually wrote — not a generic answer a language
model invents on its own.

## Why RAG

Retrieval-augmented generation fits this exactly:

- **Retrieval** — the question is matched against chunks of my own content and the most
  relevant pieces are pulled out.
- **Augmented generation** — those pieces are handed to the model as context, and it
  answers *from them* rather than from its training data.

The answer stays anchored to the source pages, so it can cite where it came from and it
doesn't drift into things I never claimed.

## Choosing the stack: Dify

I used **[Dify](https://dify.ai/)** as the layer that holds the knowledge base and runs
the retrieval + answer loop. It gives me a managed vector store, configurable chunking,
an embedding pipeline, and a drop-in chat widget without wiring all of that together
myself.

The first iteration ran on the **hosted `udify.app`**: create a knowledge base in the
UI, get an embed snippet, paste it into the site footer — the hosted chatbot token plus
the embed script from `https://udify.app/embed.min.js`.

| | Hosted (`udify.app`) | Self-hosted (Docker) |
|---|---|---|
| Setup | minutes | run the container stack |
| Chunking control | limited | full control of the process rules |
| Embedding model | fixed | your choice |
| Where the content goes | Dify's servers | your machine |
| Iteration speed | subject to rate limits | as fast as your box |

I started hosted to prove the idea worked, then moved to a self-hosted Dify once I
wanted to tune the indexing (see *Going Local for Testing*).

## The knowledge base

One Dify knowledge base, named **"Portfolio"**, with
`indexing_technique: high_quality` — real embeddings and vector similarity search,
rather than the `economy` mode which is keyword-only.

## The embed

The chat bubble is a `<script>` widget dropped into `layouts/partials/footer.html` (that
file was renamed from `extended-footer.html` when the bot was added), so the bot shows
up on every page of the site.
