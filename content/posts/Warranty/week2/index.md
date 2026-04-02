---
title: Restful API
weight: 2
date: 2026-02-03
lastmod: 2026-04-02
---

## SendGrid & Retsinformation

Integrated external RESTful APIs into the portfolio project to enhance functionality. The `Retsinformation API` was used to fetch legal documents in XML format, which were parsed using `XMLExtractor` into `LawDataDTO` objects and persisted via `LawDataDAO`. Additionally, the `SendGrid API` was used to send email notifications for warranties approaching expiration. The `WarrantyScheduler` class checks all warranties daily and triggers notifications at 90, 60, 30, and 0 days before expiration.

`Retsinformation API returns XML and SendGrid API returns JSON.`

## Why

The goal was to extend the project with real-world REST API integration. Fetching legal data ensures the system stays aligned with current regulations, `although it does not directly impact the end-user functionality, it ensures compliance with current legal regulations.` Automated warranty notifications improve user experience and prevent expired warranties from being overlooked. Constraints included ensuring reliable API communication, correct XML parsing from REST responses, and safe scheduling of notifications without blocking main application execution.

## Tester

Commented `TestClassFactory.testClassWarranty();` method in App class. Used to test if `SendGrid API` works while deployed.
Test class checks when a warranty is expired and sends Email notification every 5 minutes because of `watchtower` when program runs while deployed.

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