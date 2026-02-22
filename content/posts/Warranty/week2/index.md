---
title: Week 2
weight: 2
date: 2026-02-03
lastmod: 2026-02-19
---

## Week Two

## Feedback
After having feedback with my teacher, and he viewed the progress of my project from week one. He came to the conclusion that I need to add an extra **entity** so that my project would have some more to offer rather than the initial 4 entities I had. I worked with what he had in mind.

**Progress:**

- Looked back at my document and added a **ProductRegistration** entity.
- Implemented it into my intellij project and gave it it's respective annotations.
- Gave **ProductRegistration** relation to **Product**. Gave **Product** relation to **Warranty**.
- Set up all of my **DAO's** to my respective entities.
- Added **IDAO Interface** with given methods for all of my DAO's.
- Updated **Domain Model** and yet to update **Class Diagram**.
- Again updated **Domain Model** after feed back. Gave **Warranty** relation to **Product**.

<div class="row-image">
<div class="image-center">
<img src="IDAO_interface.png" alt="Image" width="400">
</div>

<div class="image-center">
<img src="domain_model2.png" alt="Image model" width="400">
</div>

<div class="image-center">
<img src="domain_model3.png" alt="Image model" width="400">
</div>
</div>


**Reasoning:**

- Added **ProductRegistration**. Registration is the **User's Action**.
- Would be awkward to add **userId** directly to product.
- Can register multiple of the same product.
- Better view of what **entity** owns which entity.
- Helps link **User** and **Product** when **Registering a product**.
