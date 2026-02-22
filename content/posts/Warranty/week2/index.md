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

<script>
document.addEventListener("DOMContentLoaded", function () {
  const ball = document.createElement("div");
  document.body.appendChild(ball);

  ball.style.position = "fixed";
  ball.style.top = "0px";
  ball.style.left = "50%";
  ball.style.width = "40px";
  ball.style.height = "40px";
  ball.style.borderRadius = "50%";
  ball.style.transform = "translateX(-50%)";
  ball.style.zIndex = "9999";
  ball.style.pointerEvents = "none";

  let position = 0;
  let velocity = 1;
  const gravity = 1.1;

  function animate() {
    velocity *= gravity;
    position += velocity;

    const bottom = window.innerHeight - 40;
    const top = window.innerHeight - 840;


    if (position >= bottom) {
      position = bottom;
      velocity = -0.2;
    }

  if(position <= top){
        position = top;
        velocity = 5;
    }

    // Convert position to 0 → 1 range
    let progress = position / bottom;

    // Change hue from blue (240) to red (0)
    let hue = 240 - (progress * 240);

    ball.style.background = `hsl(${hue}, 80%, 50%)`;
    ball.style.top = position + "px";

    requestAnimationFrame(animate);
  }

  animate();
});
</script>


**Reasoning:**

- Added **ProductRegistration**. Registration is the **User's Action**.
- Would be awkward to add **userId** directly to product.
- Can register multiple of the same product.
- Better view of what **entity** owns which entity.
- Helps link **User** and **Product** when **Registering a product**.
