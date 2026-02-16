---
title: Warranty
description: I pride myself in creating websites and trying out new ways to improve UX/UI, currently I am a student and making headway towards programming and learning new things.
---
<div class="video-full-bleed">
{{< video src="videos/Warrantour.mp4" autoplay="true" loop="true" muted="true" controls="false" >}}
</div>

# Warranty Project
## Full System Documentation & Development Report

> Comprehensive documentation of the design, development, and implementation of a web-based warranty tracker

---

## 1. Introduction
The **Warranty Project** is being developed by me during my third semester of Computer Science. The Project aims to help people **keep track of their warranties** at any given time without having to worry about paper. 
At first I was not sure what to build, but I to the conclusion that I was not very good at keeping track of my own warranties at some point and this project is for my own sanity in a sense. 
So that I never have to look at paper again.

**Objectives:**
- Digitize the process of keeping track of warranties
- Ensure that users can keep track of warranties if anything were to happen
- Model a real site that people can view, which is automated after registering a product
- Implement a maintainable, scalable architecture for further improvements

---

## 2. Background
Warrantour aims to keep track of **products**, **warranties** and **receipts**.  
Normally you would have to keep track of:

- Where did I throw the receipt?
- When does my warranty expire?
- Calculating when the expiration expires.
- Always having to fiddle with or look for warranties on E-mail or paper.

**Project goal:** Automate this process so the mundane task of keeping overview and remembering isn't an issue.

---

## 3. Business Understanding
**Customer Journey:**

1. Register Products
2. While registering products, register warranty date and receipt
3. View products on profile  
4. Delete or keep products with warranties that have expired

**Business Requirements:**
- Warranty expiry date calculated by purchase date and warranty expiry date
- Purchase date cannot be changed after registering a product
- Expired warranties are read-only
- Only the owner has access to product- and warranty data

---

## Week One

## The Idea
As mentioned in the introduction, on the third semester we had to personally choose a project to work on in Java backend where we have to implement the use of **Hibernate and JPA**. With that being said, the idea stems from my lack of tracking warranties and just plainly being lazy as one might say.

**Progress:**

My progress throughout the blog will mainly be written in a bullet poitnt form to make it easy and simple to understand where I'm at, and perhaps every once in a while I'll add a few images so that it's easier to visualize.

- Wrote a document with what I would need for the project to work.
- Figured out which Entities I needed for my project **(User, Product, Warranty, Receipt)**.
- Created Intellij-project, used a template we made in class with hibernate already implemented.
- Created a repository on github and connected it to my intellij project.
- Created portfolio repository and worked on learning markdown in Visual Studio Code.
- After feedback from my teacher I constructed a **Domain Model** and a **Class Diagram** which looks as follows:

<div class="row-image">
<div class="image-center">
<img src="../../class_diagram1.png" alt="Image" width="300">
</div>

<div class="image-center">
<img src="../../domain_model1.png" alt="Image model" width="300">
</div>
</div>

**Reasoning:**

- Keep my **Entities** simple. **User** has a **product, warrant and receipt**.
- The fields were filled as placeholders for the time being.
- Most of my focus was on the portfolio **(Markdown)** to set it all up.

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
<img src="../../IDAO_interface.png" alt="Image" width="400">
</div>

<div class="image-center">
<img src="../../domain_model2.png" alt="Image model" width="400">
</div>

<div class="image-center">
<img src="../../domain_model3.png" alt="Image model" width="400">
</div>
</div>


**Reasoning:**

- Added **ProductRegistration**. Registration is the **User's Action**.
- Would be awkward to add **userId** directly to product.
- Can register multiple of the same product.
- Better view of what **entity** owns which entity.
- Helps link **User** and **Product** when **Registering a product**.

---

## Week Three

---

## Week Four

---