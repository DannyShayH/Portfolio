---
title: Warranty - Exam
description: Front-end enthusiast with a focus on UX/UI design, currently pursuing studies in software development with a growing interest in backend programming and new technologies.
date: 2026-02-03
lastmod: 2026-04-10
---

<div style="border:3px solid #64748B; padding:20px; border-radius:15px; background-color: #334155; box-shadow: inset 5px 10px 15px rgba(0,0,0,0.5)">

# 🔗 Warranty Project Links

| Resource           | Link                                                                 |
|--------------------|----------------------------------------------------------------------|
| 🌐 Portfolio       | https://dannyshayh.github.io/Portfolio/posts/warranty/              |
| 💻 Code Repository | https://github.com/DannyShayH/WarrantyProject                       |
| 🎥 YouTube Video   | https://youtu.be/9xVua2tuYdw                                         |
</div>

---

## SendGrid & Retsinformation

Integrated external RESTful APIs into the portfolio project to enhance functionality. The `Retsinformation API` was used to fetch legal documents in XML format, which were parsed using `XMLExtractor` into `LawDataDTO` objects and persisted via `LawDataDAO`. Additionally, the `SendGrid API` was used to send email notifications for warranties approaching expiration. The `WarrantyScheduler` class checks all warranties daily and triggers notifications at 90, 60, 30, and 0 days before expiration.

`Retsinformation API returns XML and SendGrid API returns JSON.`

## Reflection:
I initially struggled with choosing the correct API because we had only worked with JSON in class. Finding an API that returned XML made me unsure if I was on the right track. The biggest challenge was understanding how to handle XML instead of JSON, but after guidance I learned that you can use Jackson to convert XML to JSON, which is a potential solution to the issue.

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

---

## BCrypt & JWT

Implemented core security features in the backend. A `PasswordService` was added to hash and verify user passwords using BCrypt before persistence. JWT-based authentication was introduced through `SecurityControllerService`, which handles token creation and validation using `JwtTokenService`. Tokens are generated during authentication and verified on protected endpoints by extracting them from the `Authorization` header. Role-based access control was also introduced to restrict endpoint access based on user roles.

A record-based DTO, AuthUserDTO, was introduced to represent authenticated user data (email and roles) within the token. This DTO is used when generating and validating JWTs, and when enforcing role-based access control on protected endpoints.

Tokens are extracted from the Authorization header and validated per request to ensure secure access to the API.

```java
public record AuthUserDTO(String email, Set<String> roles){}
```

## Reflection:
BCrypt was mostly straightforward, but I was unsure where to place the hashing logic in my service layer. After some help, I understood it should be in the UserService, which made the structure clearer. JWT was more challenging, especially understanding how the provided library worked. I ended up creating my own DTO and studying the existing implementation to fully understand token handling.

## Why

The goal was to secure user data and ensure safe authentication within the application. `Storing raw passwords is insecure`, making hashing necessary to protect user credentials. JWT authentication enables stateless and scalable session management, which is suitable for REST APIs. Constraints included ensuring secure handling of secrets, preventing unauthorized access, and maintaining a clear separation between authentication logic and business logic.

## Design reasoning (tradeoffs)

| Aspect                | Description                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Choice**            | Use BCrypt for password hashing, JWT for authentication, and a record-based DTO (`AuthUserDTO`) to represent authenticated user data                              |
| **Alternative(s)**    | Store plain-text passwords, use session-based authentication, or use a mutable class instead of a record for the DTO                                              |
| **Not chosen**    | Plain-text storage is insecure; session-based authentication is less scalable; mutable DTOs increase the risk of unintended modification of security-related data |
| **Risks downsides** | JWTs cannot easily be invalidated before expiration; records are less flexible if the DTO structure needs to change                                               |
| **Mitigations**       | Use token expiration, validate tokens on each request, store secrets securely, and extend the record if additional fields are required                            |

---

## Requests & Tests

Implemented RESTful endpoints for the application using Javalin, covering user and security operations such as `/security/register`, `/security/login`, `/user/all`, and `/user/{id}`. Requests are tested using an HTTP client setup (`http-client.env.json`) to support both local and deployed environments, with JWT tokens included in the `Authorization` header for protected routes.

Integration tests were implemented using JUnit and RestAssured. A containerized PostgreSQL database (Testcontainers) is used to run tests in an isolated environment. Tests cover authentication, endpoint protection, and validation, including scenarios such as successful login, unauthorized access, and invalid input handling.

## Reflection:
I didn’t have major issues with requests, but I was confused about where to configure protected endpoints. I first placed them incorrectly in ApplicationConfig, before realizing they belong in the Routes class with roles assigned. I also ran into problems because of using the wrong Java version (Java 25 instead of 17), which caused test failures. Additionally, setting up GitHub workflows and Testcontainers was challenging, but I learned how to properly configure testing environments.

## Why

The goal was to expose application functionality through a REST API and ensure it behaves correctly under different scenarios. REST endpoints allow structured communication between client and backend, while testing ensures reliability and prevents regressions. Constraints included maintaining stateless authentication using JWT, ensuring endpoints are properly secured, and running tests in an environment that closely resembles production.

## Design reasoning (tradeoffs)

| Aspect                | Description                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Choice**            | Use REST principles with Javalin, JWT for securing endpoints, and integration testing with JUnit + RestAssured + Testcontainers                                       |
| **Alternative(s)**    | Manual testing only, in-memory database testing, or session-based authentication                                                                                      |
| **Not chosen**    | Manual testing is unreliable and not repeatable; in-memory databases do not reflect real database behavior; session-based authentication breaks REST stateless design |
| **Risks downsides** | Increased setup complexity for tests (containers, ports); slower test execution due to real database usage                                                            |
| **Mitigations**       | Use Testcontainers for consistent environments, dynamic ports to avoid conflicts, and automated test setup/teardown to ensure isolation                               |