---
title: "Indexing the Content"
weight: 2
date: 2026-08-24
lastmod: 2026-08-26
tags: ["rag", "embeddings", "chunking", "dify"]
categories: ["Projects"]
---

The chatbot is only as good as what it can retrieve. This page is the plan for getting
every page of the site into Dify's knowledge base, and how the chunking works once it's
there. The whole job is done by one script at the repo root, `upload_to_dify.py`.

## The pipeline

<figure>
<svg viewBox="0 0 900 320" role="img" aria-labelledby="ragpipe-title ragpipe-desc"
     xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;color:inherit">
  <title id="ragpipe-title">Portfolio RAG indexing pipeline</title>
  <desc id="ragpipe-desc">upload_to_dify.py walks the content folder, filters by file
  extension, renames each file after its relative path, and POSTs it to Dify. Dify splits
  each file into parent and child chunks; child chunks are embedded for similarity search
  and parent chunks are returned as context. Everything lands in the Portfolio knowledge
  base, which the footer chatbot queries at runtime.</desc>
  <defs>
    <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="currentColor"/>
    </marker>
    <style>
      .box{fill:none;stroke:currentColor;stroke-width:1.5}
      .lbl{fill:currentColor;font:600 13px/1.3 ui-sans-serif,system-ui,sans-serif}
      .sub{fill:currentColor;font:11px ui-sans-serif,system-ui,sans-serif;opacity:.72}
      .flow{stroke:currentColor;stroke-width:1.5;fill:none;marker-end:url(#arw)}
    </style>
  </defs>

  <rect class="box" x="8" y="70" width="160" height="76" rx="8"/>
  <text class="lbl" x="22" y="98">walk content/**</text>
  <text class="sub" x="22" y="116">rglob, keep files in</text>
  <text class="sub" x="22" y="131">SUPPORTED_EXTENSIONS</text>

  <rect class="box" x="200" y="70" width="176" height="76" rx="8"/>
  <text class="lbl" x="214" y="94">path &#8594; doc name</text>
  <text class="sub" x="214" y="112">posts/Warranty/week1/</text>
  <text class="sub" x="214" y="127">index.md &#8594;</text>
  <text class="sub" x="214" y="141">posts_Warranty_week1_index.md</text>

  <rect class="box" x="408" y="66" width="176" height="84" rx="8"/>
  <text class="lbl" x="422" y="90">POST create_by_file</text>
  <text class="sub" x="422" y="108">multipart upload</text>
  <text class="sub" x="422" y="123">+ process_rule</text>
  <text class="sub" x="422" y="138">indexing_technique: high_quality</text>

  <rect class="box" x="616" y="30" width="276" height="150" rx="8"/>
  <text class="lbl" x="630" y="54">Dify &#183; parent&#8211;child chunking</text>
  <text class="sub" x="630" y="76">parent: split on \n\n, &#8804; 1000 tokens</text>
  <text class="sub" x="630" y="93">child: split on \n, &#8804; 200 tokens</text>
  <text class="sub" x="630" y="115">child chunks &#8594; embedded (vector search)</text>
  <text class="sub" x="630" y="132">parent chunks &#8594; returned as context</text>
  <text class="sub" x="630" y="158">&#8594; knowledge base "Portfolio"</text>

  <rect class="box" x="300" y="230" width="300" height="66" rx="8"/>
  <text class="lbl" x="314" y="256">query time: retrieve &#8594; answer</text>
  <text class="sub" x="314" y="276">rendered in the footer chat bubble</text>

  <path class="flow" d="M168 108 H198"/>
  <path class="flow" d="M376 108 H406"/>
  <path class="flow" d="M584 108 H614"/>
  <path class="flow" d="M754 180 V210 H450 V228"/>
</svg>
<figcaption class="sub">Indexing pipeline: <code>upload_to_dify.py</code> &#8594; Dify knowledge base &#8594; footer chatbot.</figcaption>
</figure>

## What gets indexed

The script walks `content/` recursively with `Path.rglob("*")` and keeps anything whose
extension is in `SUPPORTED_EXTENSIONS`:

```
.md  .txt  .pdf  .html  .htm  .csv  .json  .xml  .yaml  .yml
```

In practice that is every Markdown file under `content/` — the Warranty weeks, the
frontend doc, the section landing pages, this progression.

## Stable document names from the path

Each file is given a Dify document name built from its path relative to `content/`:

```python
rel = file_path.relative_to(CONTENT_DIR)
unique_name = "_".join(rel.parts[:-1] + (rel.name,)) if rel.parts[:-1] else rel.name
# posts/Warranty/week1/index.md  ->  posts_Warranty_week1_index.md
```

The name is deterministic, so re-running the script targets the same document instead of
creating a duplicate. The trade-off: if a file moves, its old document is orphaned and
has to be cleaned up by hand (see below).

## The upload

For each file the script does a multipart `POST` to:

```
{BASE_URL}/datasets/{DATASET_ID}/document/create_by_file
```

with an `Authorization: Bearer <API_KEY>` header and a `data` JSON blob carrying the
indexing settings. MIME type is guessed with `mimetypes.guess_type`, defaulting to
`text/plain`.

## Parent–child chunking

The `process_rule` is `mode: custom`, `parent_mode: paragraph`:

| | Split on | Max tokens | Used for |
|---|---|---|---|
| **Parent chunk** | blank line (`\n\n`) | 1000 | context handed to the model at answer time |
| **Child chunk** | single newline (`\n`) | 200 | embedded and matched during similarity search |

Pre-processing: `remove_extra_whitespace` on, `remove_urls_emails` off.

The idea: small child chunks make retrieval *precise* (you match the exact sentence that
answers the question), while returning the whole parent paragraph gives the model enough
surrounding context to actually write a good answer.

At query time: the question is embedded, the nearest child chunks are found, their parent
paragraphs are assembled into context, and Dify's model answers from that — rendered in
the chat bubble in the site footer.

## Running it

```bash
source .venv/bin/activate      # venv lives at ./.venv
python upload_to_dify.py       # walks ./content and uploads every supported file
```

The script prints each file, the Dify document id it got back, and a success/failure
tally at the end.

## Re-indexing after this reorganisation

Because document names are path-derived, moving the content around leaves **stale
documents** in the knowledge base. These have to be deleted manually in the Dify UI:

- `blog__index.md`
- `blog_hello-rag_index.md`
- `posts_exam.md`
- `posts_Warranty_Frontend_frontend_index.md`

And the next run creates their replacements:

- `posts_Warranty_Warranty_Frontend__index.md`
- `posts_Warranty_Warranty_Frontend_frontend_index.md`
- `posts_Warranty_Warranty_Frontend_exam_index.md`
- `posts_RAG-Bot__index.md` plus one document per RAG-Bot sub-page

## What I'd improve

The script indexes raw Markdown — including YAML front matter and raw HTML/SVG blocks
(like the diagram above). That's retrieval noise. Pointing the script at the rendered
`public/**/*.html` after a `hugo` build, or stripping front matter before upload, would
give the retriever a cleaner corpus to work with.
