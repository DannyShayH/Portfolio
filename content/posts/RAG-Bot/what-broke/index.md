---
title: "What Broke & What I Learned"
weight: 4
date: 2026-08-28
lastmod: 2026-08-29
tags: ["rag", "dify", "security", "lessons"]
categories: ["Projects"]
---

## localhost vs production URLs

Moving to a self-hosted Dify meant the footer embed pointed at `http://localhost`. On my
machine under `hugo server` that works. On the deployed GitHub Pages site it's an
`http://` request from an `https://` page pointed at a host that isn't there — mixed
content, blocked, no chat bubble.

**Lesson:** environment-specific config (the embed URL, the API base) shouldn't be
hard-coded in a committed partial. It should switch on the environment — gate the embed
with `{{ if hugo.IsServer }}`, or read the URL from a per-environment site parameter, so
the local instance is used locally and the hosted one in production.

## The API key that went into git

The local dataset API key was written straight into `upload_to_dify.py` and committed. A
later commit stopped tracking the file and added it to `.gitignore` — but the key is
still in the history of the earlier commit, so it has to be **rotated** in Dify, not just
deleted from the working tree.

**Lesson:** a secret in a helper script is a secret in the repo history. Read it from an
environment variable (`os.environ["DIFY_API_KEY"]`) and a git-ignored `.env` from the
first commit, not after the leak.

## Path-derived document names cut both ways

Naming each Dify document after its content path makes re-runs idempotent — the same file
updates the same document. But any reorganisation of `content/` orphans the old
documents, and Dify won't clean them up for you. After moving everything under
`content/posts/` I had to delete the stale documents by hand and re-index.

## Chunk sizes

Parent 1000 tokens / child 200 tokens was the setting that balanced *precise retrieval*
(small children match the exact relevant sentence) against *enough context to answer*
(the full parent paragraph goes to the model). Getting to that took several
re-index-and-test cycles — which is the whole reason the local Dify was worth setting up.

## The big takeaway

The quality of a RAG bot is bounded by how clean the text you feed it is. Right now the
script indexes raw Markdown, front matter and embedded HTML included. The next real
improvement isn't a better model or better chunking — it's indexing the *rendered* pages
so the retriever sees what a reader sees.
