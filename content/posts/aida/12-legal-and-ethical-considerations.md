---
title: "12 — Legal and Ethical Considerations"
description: "Considering privacy, bias, risk, responsibility, and human oversight in AI-driven applications."
date: 2026-09-25
lastmod: 2026-09-25
weight: 12
tags: ["AIDA", "ethics", "privacy"]
---

## Summary

The session introduces legal and ethical questions around AI-driven applications, including responsible use, data privacy, bias, and risk. It asks the project team to consider not only whether a feature can be built, but also who may be affected by its output and who remains accountable.

Model output can be persuasive while still being wrong or unfair. Personal or confidential data may cross system boundaries, and automated decisions can affect people differently. These issues influence product scope, data collection, user communication, testing, and the need for human review.

## Questions for the project

The course topic can be translated into a practical review of the proposed application:

- **Purpose:** Is the AI feature necessary for the problem, and is its use clear to the user?
- **Privacy:** What data is collected, where is it sent, how long is it retained, and is every field necessary?
- **Bias:** Could the training data, prompts, source documents, or evaluation criteria disadvantage particular people or perspectives?
- **Accuracy:** What happens when the model hallucinates, misunderstands context, or produces inconsistent output?
- **Transparency:** Can users tell that content is AI-generated and understand the basis and limitations of the result?
- **Responsibility:** Who reviews important decisions, receives complaints, and corrects harmful or incorrect output?
- **Risk:** What is the impact of failure, and should the feature be limited or avoided in a high-stakes situation?

These questions should influence the system design, not only the written documentation. They may result in reduced data collection, clearer warnings, stronger testing, a human approval step, or a narrower product scope.

## Key takeaways

An AI feature should be examined through questions about purpose, data rights, affected groups, possible harm, transparency, and recourse. Bias and privacy are not isolated checks at the end; they should influence the design and the decision about whether AI is appropriate at all.

- Collect and transmit the minimum data required for the feature.
- Test with varied inputs, including cases that challenge the system's assumptions.
- Give users a way to question or correct consequential results.
- Make the responsible human or organization identifiable.

## Closing note

Responsible development is not just a legal checklist. It means being honest about uncertainty and creating a system in which people can understand, question, and override an AI-assisted result when the stakes require it.

[Source: 12-Juridiske-Etiske-Overvejelser](https://aida.kursusmaterialer.dk/11-juridiske-etiske-overvejelser/)
