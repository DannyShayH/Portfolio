---
title: Warranty - Introduction
description: A full-stack warranty tracker for products, receipts, expiry dates, notifications, and secure user accounts.
date: 2026-02-03
lastmod: 2026-02-19
weight: 1
tags: ["java", "javalin", "full-stack", "project"]
categories: ["Projects"]
---
<div class="image-center">
<img 
  src="Warrantour.webp"
  loading="lazy"
  decoding="async"
  width="1200"
  height="800">
</div>

# Warranty Project
## Full System Documentation & Development Report

> Comprehensive documentation of the design, development, and implementation of a web-based warranty tracker

## 1. Introduction
The **Warranty Project** is developed as part of a third-semester Computer Science program. The purpose of the project is to provide a system that allows users to **track and manage product warranties digitally**, reducing reliance on physical documentation.

The application focuses on simplifying warranty management by centralizing information such as products, registrations, and expiration dates. This enables users to easily monitor their warranties and avoid losing important information stored on paper.

**Objectives:**
- Digitize the process of tracking warranties
- Ensure that users can keep track of warranties in case they are lost or misplaced
- Model a real-world application that automates warranty tracking after product registration
- Implement a maintainable and scalable architecture for future improvements

## 2. Background
Warrantour aims to keep track of **products**, **warranties**, and **receipts**.  
Normally, users must keep track of:

- Where did I put the receipt?
- When does my warranty expire?
- Manually calculating expiration dates
- Searching through emails or paper documents for warranty information

**Project goal:** give users one reliable place to store warranty details, find receipts, and see when coverage expires without searching through paper documents or old emails.

## 3. Business Understanding
**Customer Journey:**

1. Register products
2. During registration, provide warranty date and receipt
3. View products on profile
4. Delete or keep products with expired warranties

**Business Requirements:**
- Warranty expiry is calculated based on purchase date and warranty duration
- Purchase date cannot be changed after registering a product
- Expired warranties are read-only
- Only the owner has access to product and warranty data

## 4. System Scope

The project combines several parts of a production-style web application:

- A React frontend for registration, login, product creation, and warranty overview.
- A Java and Javalin REST API for business logic and protected endpoints.
- Hibernate and PostgreSQL for users, products, registrations, receipts, and warranties.
- BCrypt password hashing and JWT-based authentication.
- SendGrid notifications for warranties approaching their expiry date.
- Docker, GitHub Actions, Watchtower, and Caddy for deployment and HTTPS.

The weekly pages below document how these pieces were introduced, tested, secured, and deployed. Together they show the progression from the initial persistence layer to a complete full-stack application.

## Project Outcome

Warrantour became a working system rather than only a database exercise. Users can create an account, register products, connect warranty and receipt information, and view their data through a deployed frontend. The remaining opportunities are to simplify the multi-step product-registration flow, strengthen validation and automated tests, and continue improving the user experience around expiring warranties.
