---
title: Warranty - Introduction
description: I pride myself in creating websites and trying out new ways to improve UX/UI, currently I am a student and making headway towards programming and learning new things.
date: 2026-02-03
lastmod: 2026-02-19
---
<div class="image-center">
<img src="Warrantour.png" alt="Image" width="1200">
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
