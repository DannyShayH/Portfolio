---
title: Security
weight: 3
date: 2026-02-03
lastmod: 2026-04-03
---

## BCrypt & JWT

Implemented core security features in the backend. A `PasswordService` was added to hash and verify user passwords using BCrypt before persistence. JWT-based authentication was introduced through `SecurityControllerService`, which handles token creation and validation using `JwtTokenService`. Tokens are generated during authentication and verified on protected endpoints by extracting them from the `Authorization` header. Role-based access control was also introduced to restrict endpoint access based on user roles.

A record-based DTO, AuthUserDTO, was introduced to represent authenticated user data (email and roles) within the token. This DTO is used when generating and validating JWTs, and when enforcing role-based access control on protected endpoints.

Tokens are extracted from the Authorization header and validated per request to ensure secure access to the API.

```java
public record AuthUserDTO(String email, Set<String> roles){}
```

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