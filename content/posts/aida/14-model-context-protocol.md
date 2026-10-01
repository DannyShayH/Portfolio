---
title: "14 — Model Context Protocol"
description: "Connecting AI assistants to tools and data through MCP and building a small Java server over stdio."
date: 2026-10-02
publishDate: 2026-10-01
lastmod: 2026-10-02
weight: 14
tags: ["AIDA", "MCP", "Java"]
---

## Summary

Model Context Protocol is a standard interface through which an AI client can discover and use tools, resources, and prompts exposed by a server. The workshop begins with local `stdio` transport and demonstrates a Java MCP server that publishes simple tools, describes their inputs with JSON Schema, and can be registered with Codex or Claude CLI.

Without an integration, a model is limited to the context in its prompt. MCP gives assistants a consistent way to retrieve current information and invoke backend capabilities. It serves model-to-tool communication, while REST continues to serve conventional app-to-app or frontend-to-backend communication.

## Concepts and workshop steps

An MCP server can expose three main capability types:

- **Tools:** actions the assistant can call with structured arguments.
- **Resources:** data or context that a client can retrieve.
- **Prompts:** reusable prompt definitions supplied by the server.

The Java tutorial turns those concepts into a local working server:

1. Create a Maven project and add the official Java MCP SDK dependencies.
2. Configure an `StdioServerTransportProvider` and build a synchronous server.
3. Define tools such as `add_numbers` and `current_time` with JSON Schema inputs.
4. Package the application as an executable JAR.
5. Register the same server with Codex and Claude CLI.
6. Verify that each client discovers the tool and can invoke it from natural language.

The course also distinguishes transport choices. `stdio` is well suited to a local process and classroom prototype. Streamable HTTP is a better direction for remote, hosted, or shared use, while older HTTP and SSE examples are mainly relevant when maintaining legacy integrations.

## Key takeaways

In the MCP client-server flow, the server advertises capabilities, the assistant selects a tool, sends structured arguments, and receives a structured result. `stdio` is a simple choice for local tools, while Streamable HTTP is more appropriate for hosted or shared services.

- MCP complements REST rather than replacing it.
- Tool descriptions and schemas help the model select and call capabilities correctly.
- Business logic can be reused behind both a REST API and an MCP interface.
- Real tools still require input validation, authorization, error handling, and logging.

## Closing note

The most useful mental model is that MCP is another interface to existing backend logic. Its value is not merely allowing an AI to call code, but defining a discoverable contract around what the assistant may do. That contract still needs validation, authorization, and careful tool design.

[Source: 14-MCP](https://aida.kursusmaterialer.dk/14-MCP/) · [MCP introduction](https://aida.kursusmaterialer.dk/toolbox/mcp/mcp/) · [Java tutorial](https://aida.kursusmaterialer.dk/toolbox/mcp/mcp-tutorial/)
