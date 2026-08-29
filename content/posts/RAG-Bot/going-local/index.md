---
title: "Going Local for Testing"
weight: 3
date: 2026-08-26
lastmod: 2026-08-26
tags: ["dify", "self-hosted", "rag", "chunking"]
categories: ["Projects"]
---

The hosted `udify.app` version proved the chatbot was worth having. But as soon as I
wanted to *tune* it — different chunk sizes, a different embedding model, re-indexing
the whole corpus over and over — the hosted setup got in the way. Rate limits, and every
experiment shipped my content to someone else's servers.

So I moved the entire loop to a **self-hosted Dify running in Docker on `localhost`**.

## What changed

The script pointed at the local API:

```python
BASE_URL = "http://localhost/v1"
```

with a new dataset API key for the local instance, and the footer embed was repointed at
the local Dify (`layouts/partials/footer.html`) — a separate chatbot token for the local
instance, and the embed script served from `http://localhost`:

```js
window.difyChatbotConfig = {
  token: '<local-chatbot-token>',
  baseUrl: 'http://localhost'
};
```

```html
<script src="http://localhost/embed.min.js" id="<local-chatbot-token>" defer></script>
```

## Why it was worth it

- **Iterate on chunking for free** — change `process_rule`, re-run `upload_to_dify.py`,
  ask the bot the same set of questions, compare. No rate limits, no waiting.
- **Control the embedding model** — pick the model rather than take whatever the hosted
  tier gives you.
- **Content stays on my machine** while experimenting.

## The catch

The footer embed now points at `http://localhost`. That's fine while running
`hugo server` on my own machine — but on the deployed HTTPS site it's a broken,
mixed-content request and the chat bubble simply won't load. That problem, and how the
config should really be handled, is the next page.
