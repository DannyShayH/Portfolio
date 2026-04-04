---
title: Deployment & DevOps
weight: 5
date: 2026-03-08
lastmod: 2026-04-04
---

## Deployment & DevOps

Implemented a full deployment pipeline for the application using Docker and cloud infrastructure. The application is containerized using a `Dockerfile` and deployed on an Ubuntu VM hosted on DigitalOcean.

`Continuous Integration and Deployment (CI/CD)` is handled using GitHub Actions, where the application is built using Maven, containerized, and pushed to Docker Hub on each push to the main branch. The deployed environment uses Docker Compose to manage services, including the application container and Watchtower, which automatically monitors Docker Hub for new image versions and updates the running container without manual intervention.

A reverse proxy is configured using Caddy, which routes traffic from a domain (`warrantyproject.greymansshop.dk`) to the application container. HTTPS is automatically handled via SSL certificates. Environment variables are managed through a `.env` file to securely configure database connections, JWT secrets, and API keys.

```yml
name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      -
        name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      -
        name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/warranty_project:latest
```

>The snippet shows the `CI/CD workflow` responsible for building and deploying the application. After authenticating with Docker Hub, the workflow sets up Docker Buildx, builds the application image from the Dockerfile, and pushes it to Docker Hub. This updated image is then automatically detected by Watchtower on the server, which pulls the latest version and redeploys the container without manual intervention.

## Why

The goal was to create a scalable and automated deployment process that minimizes manual intervention. Containerization ensures consistency across environments, while CI/CD automates the build and deployment pipeline. `Watchtower` further reduces manual deployment effort by automatically updating containers when new images are available. Using a reverse proxy with HTTPS improves security and accessibility, and cloud hosting enables the application to be publicly available.

Constraints included ensuring secure handling of sensitive data (e.g., API keys and secrets), maintaining near zero-downtime updates, and keeping the deployment process reproducible and maintainable.

## Design reasoning (tradeoffs)

| Aspect                | Description                                                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Choice**            | Use Docker for containerization, GitHub Actions for CI/CD, Docker Hub for image storage, Watchtower for automated container updates, and Caddy for reverse proxy and HTTPS |
| **Alternative(s)**    | Manual deployment via SSH, traditional VM setups without containers, or using Nginx instead of Caddy                                                                       |
| **Not chosen**    | Manual deployment is error-prone and not scalable; non-containerized setups reduce portability; Nginx requires more manual configuration for SSL compared to Caddy         |
| **Risks downsides** | Increased system complexity; reliance on external services; automatic updates may introduce unstable versions                                                              |
| **Mitigations**       | Use health checks, controlled update intervals in Watchtower, and environment variables for secure configuration                                                           |