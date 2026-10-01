---
title: "11 — Security and Secret Management"
description: "Protecting credentials and making security part of the AI-assisted development workflow."
date: 2026-09-21
lastmod: 2026-09-21
weight: 11
tags: ["AIDA", "security", "secrets"]
---

## Summary

This session focuses on technical choices, code-agent use, and the safe handling of API keys, tokens, and other credentials. The project work is reviewed with attention to where secrets are stored, how they enter the application, and what information an external model or development agent can access.

AI applications commonly depend on paid external APIs and sensitive data. Committing a key can lead to unauthorized use and cost, while exposing data to a model can create privacy and compliance problems. Agents increase the number of operations performed on a repository, so boundaries around secrets must be intentional.

## Security review areas

The session connects security directly to the technical choices made in the project:

- **Local development:** load credentials from environment variables or ignored configuration files rather than placing them in source code.
- **Version control:** maintain a suitable `.gitignore` and provide placeholder configuration without real values.
- **Deployment:** configure secrets through the hosting platform instead of copying a local file into production.
- **CI workflows:** use protected repository secrets and avoid printing sensitive values in build logs.
- **External AI services:** check whether prompts contain personal, confidential, or unnecessary project data.
- **Agent access:** limit which files and commands a code agent can use when sensitive configuration is present.

If a credential reaches a commit, chat, log, or screenshot, deleting the visible copy is not enough. The safe response is to revoke or rotate it and then investigate where else it may have been recorded.

## Key takeaways

Secrets should stay outside source control, using environment variables or a managed secret store. Example configuration can be committed without real values, and credentials should be rotated if exposure is suspected. Logging, prompt content, CI configuration, and agent access also need review—not just the application code.

- Give each environment only the permissions it actually needs.
- Use separate credentials for development, testing, and production.
- Avoid logging full requests when they may contain sensitive content.
- Document how another developer can configure the project safely.

## Closing note

Secret management is a small implementation detail with potentially large consequences. The safest workflow assumes mistakes can happen and limits their impact through least privilege, separate environments, monitoring, and easy credential rotation.

[Source: 11-Sikkerhedsaspekter](https://aida.kursusmaterialer.dk/12-sikkerhedsaspekter/)
