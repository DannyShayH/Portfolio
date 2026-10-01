---
title: Restful API
weight: 2
date: 2026-02-03
lastmod: 2026-04-02
tags: ["java", "rest-api", "xml", "sendgrid", "integrations"]
categories: ["Projects"]
---

## SendGrid & Retsinformation

Integrated external RESTful APIs into the portfolio project to enhance functionality. The `Retsinformation API` was used to fetch legal documents in XML format, which were parsed using `XMLExtractor` into `LawDataDTO` objects and persisted via `LawDataDAO`. Additionally, the `SendGrid API` was used to send email notifications for warranties approaching expiration. The `WarrantyScheduler` class checks all warranties daily and triggers notifications at 90, 60, 30, and 0 days before expiration.

The integrations use different data formats: Retsinformation returns XML, while SendGrid accepts and returns JSON. Supporting both required a dedicated XML parsing path alongside the application's existing JSON-based API work.

## Why

The goal was to extend the project with real-world REST API integration. Fetching legal data ensures the system stays aligned with current regulations, `although it does not directly impact the end-user functionality, it ensures compliance with current legal regulations.` Automated warranty notifications improve user experience and prevent expired warranties from being overlooked. Constraints included ensuring reliable API communication, correct XML parsing from REST responses, and safe scheduling of notifications without blocking main application execution.

## Deployment Test

The temporary `TestClassFactory.testClassWarranty()` call in the `App` class was used to verify that SendGrid worked in the deployed environment. The helper creates a test user, an already-expired warranty, and a linked product before invoking the scheduler. During testing, the deployed container was configured to check frequently so that an email could be observed without waiting for the normal daily schedule. The helper was commented out after verification to prevent test data and repeated messages in production.

```java
public static void testClassWarranty() {
    User testUser = new User();
        testUser.setEmail("YourEmail@gmail.com");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setPassword("12345678");
        userDAO.create(testUser);

        Warranty testWarranty = new Warranty();
        testWarranty.setStartDate(LocalDate.now().minusMonths(3));
        testWarranty.setWarrantyMonths(3);
        testWarranty.calculateEndDate();

        Product product = new Product();
        product.setOwner(testUser);
        product.setProductName("Test Product");
        product.setWarranty(testWarranty);
        testWarranty.setProduct(product);
        productDAO.create(product);

        scheduler.checkWarranties();
    }
```

## Design reasoning (tradeoffs)

| Aspect                | Description                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Choice**            | Use dedicated services (`XMLExtractor` and `WarrantyScheduler`) to handle RESTful API responses and notifications                          |
| **Alternative(s)**    | Fetch REST data synchronously on the main thread, or send notifications manually without an API                                         |
| **Not chosen**    | Synchronous fetching could block application operations; manual notifications would not scale and are error-prone                       |
| **Risks downsides** | Possible API failures, malformed XML, or missed notifications if the scheduler fails; increased system complexity                       |
| **Mitigations**       | Use exception handling for REST responses, validate XML data, and schedule daily checks with `ScheduledExecutorService` for reliability |

## Outcome

The project gained two distinct external integrations: legal data imported from an XML source and automated email reminders sent through a JSON API. This phase demonstrated that integration work is not only about a successful HTTP response; it also requires format conversion, failure handling, repeatable testing, and a schedule that behaves safely after deployment.
