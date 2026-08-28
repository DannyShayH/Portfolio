---
title: Warranty Frontend
weight: 1
date: 2026-02-03
lastmod: 2026-05-21
tags: ["react", "vite", "frontend", "jwt", "full-stack"]
categories: ["Projects"]
---

# Warrantour — Project Documentation

## Overview

Warrantour is a full-stack web application for tracking product warranties and receipts. Users can register products, set warranty durations, attach receipt information, and monitor expiry dates — all from a clean, responsive dashboard.

**Live URL:** https://warrantyproject.greymansshop.dk  
**Frontend:** React (Vite), deployed via GitHub Actions  
**Backend:** Java + Javalin, deployed via Docker (Jetty) + Watchtower  
**Database:** PostgreSQL on Digital Ocean  

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Vite 8 |
| Auth | JWT — created and validated on backend via nimbus-jose-jwt, decoded on frontend via jwt-decode for inspection only
| Backend | Java, Javalin 7, Hibernate ORM |
| Database | PostgreSQL 16 |
| Deployment | Jetty, Docker, Watchtower, Caddy (reverse proxy) |
| Hosting | Digital Ocean Droplet |

---

## Architecture

### Frontend Structure

```
src/
  context/
    AuthContext.js       ← global auth + product state
  components/
    WarrantyTable.jsx    ← product list with filtering, sorting, detail overlay
    ui.jsx               ← shared UI primitives (Input, PillButton, Field, etc.)
  pages/
    PageLogin.jsx
    PageSignUp.jsx
    PageProfile.jsx
    PageRegister.jsx
    PageContact.jsx
```

### Backend Structure

```
app/
  controllers/        ← Javalin HTTP handlers
  daos/               ← Database access objects (Hibernate)
  dto/                ← Data transfer objects
  entity/             ← JPA entities
  routes/             ← Route definitions with role-based access
  services/
    entityServices/   ← Business logic
    dtoConverter/     ← Entity ↔ DTO mapping
    securityService/  ← JWT creation and validation
  config/
    ApplicationConfig.java  ← Javalin setup, CORS, routing
    HibernateConfig.java    ← Database connection
```

---

## Authentication Flow

### Registration

1. User submits email + password on `/signup`
2. `POST /security/register` creates user with `USER` role in database
3. `login()` is called automatically after successful registration
4. Token and email stored in `localStorage`
5. User ID fetched from `/user/all` and stored in `localStorage`

### Login

1. User submits credentials on `/login`
2. `POST /security/login` validates credentials using case-insensitive email query
3. Backend returns `{ token, email, id }`
4. Frontend stores token, email and userId in `localStorage`
5. User state set in `AuthContext`

### Session Restore

On page load, `AuthContext` reads email from `localStorage` and restores the user session without a server round-trip. The token is sent as a `Bearer` header on all authenticated requests.

### Logout

Clears `token`, `email` and `userId` from `localStorage` and resets React state.

---

## Data Model

### Entity Relationships

```
User ──< ProductRegistration >── Product ──── Warranty
                │
               Receipt
```

- A `User` can have many `ProductRegistration` entries
- Each `ProductRegistration` links a `User`, a `Product`, and optionally a `Receipt`
- Each `Product` has one `Warranty`
- Each `Receipt` belongs to one `ProductRegistration`

### Adding a Product (Frontend Flow)

When a user registers a product, the frontend makes four sequential API calls:

```
1. POST /product          → creates product, returns { id, productName, userId, warrantyId }
2. POST /warranty         → creates warranty linked to productId
3. POST /product-registration → links userId + productId, returns { id }
4. POST /receipt          → links to registrationId (only if price provided)
   PUT  /product-registration/{id} → updates registration with receiptId
```

### Product Data Merge

Products fetched from the API are merged on the frontend with warranty, receipt and registration data:

```js
const merged = products.map(p => {
  const warranty = warranties.find(w => w.id === p.warrantyId)
  const registration = registrations.find(r => r.productId === p.id)
  const receipt = registration ? receipts.find(r => r.id === registration.receiptId) : null
  return {
    ...p,
    purchased: warranty?.startDate,
    expires: warranty?.endDate,
    warrantyMonths: warranty?.warrantyMonths,
    price: receipt?.price,
    retailer: receipt?.description,
  }
})
```

---

## Key Components

### AuthContext.js

Central state manager for the application. Exposes:

| Value | Type | Description |
|---|---|---|
| `user` | object | `{ email, id }` or `null` |
| `products` | array | Merged product objects |
| `login` | function | Authenticates and stores session |
| `logout` | function | Clears session |
| `register` | function | Creates account then logs in |
| `addProduct` | function | Runs the 4-step product creation flow |
| `removeProduct` | function | Deletes product by ID |

### WarrantyTable.jsx

Displays the user's products with:
- Search by product name
- Filter by status (all, expiring soon, active, expired)
- Sort by urgency, newest, or name
- Stat cards (total, expiring soon, expired)
- Colour-coded time left badges
- Two-step delete confirmation
- Click-to-open detail overlay

### ProductDetail Overlay

Opens when clicking a product row. Shows:
- Product name and time left badge
- Purchased and expiry dates
- Editable retailer, order number and description fields

---

## Deployment

### Backend (Java + Docker)

The backend is containerised and deployed to a Digital Ocean droplet. Watchtower polls Docker Hub every 5 minutes and automatically redeploys when a new image is pushed.

```bash
# Build and push new image
mvn clean package -DskipTests
docker build -t shaylah/warranty_project:latest .
docker push shaylah/warranty_project:latest
```

### Frontend (React + Vite)
 
The frontend is built locally and deployed manually using `scp`:
 
```bash
# Build the frontend
npm run build
 
# Copy dist to server
scp -r dist/* jetty@dat2semshop:~/deployment/site/warrantyproject/dist
```
 
The built files live at `~/deployment/site/warrantyproject/dist` on the server and are served as static files by Caddy.
 
### Caddy (Reverse Proxy + Static File Server)
 
Caddy handles HTTPS, serves the frontend as static files, and proxies API requests to the Javalin container. The `try_files` directive ensures React Router works correctly by redirecting unknown paths to `index.html`:
 
```
warrantyproject.greymansshop.dk {
    root * /srv/warrantyproject/dist
    file_server
    try_files {path} /index.html
}
 
warrantyproject-api.greymansshop.dk {
    reverse_proxy warranty_project:7070
}
```
 
The frontend and API are on separate subdomains — `warrantyproject.greymansshop.dk` for the React app and `warrantyproject-api.greymansshop.dk` for the Javalin backend.

---

## Challenges & Solutions
 
### Separate Subdomains for Frontend and API
 
**Problem:** Initially the frontend and backend were both pointed at the same subdomain (`warrantyproject.greymansshop.dk`), which made it impossible to serve both the static React files and proxy API requests from the same Caddy block cleanly.  
**Cause:** Caddy can either serve static files or reverse proxy from a given block — having both on the same domain caused conflicts and CORS issues because the browser saw requests to the same origin going to two different destinations.  
**Solution:** Split them into two separate subdomains in the Caddyfile — `warrantyproject.greymansshop.dk` serves the static frontend files, and `warrantyproject-api.greymansshop.dk` proxies to the Javalin container. The API URL in `AuthContext.js` was updated to point to the new API subdomain.
 
### CORS
 
**Problem:** The frontend was blocked by CORS even after configuring Javalin's `anyHost()` rule.  
**Cause:** Caddy was also adding `Access-Control-Allow-Origin: *`, resulting in a duplicate header `*, *` that browsers reject.  
**Solution:** Handled CORS at the Javalin level with `anyHost()` and removed duplicate headers from Caddy.
 
### React `useEffect` and setState
 
**Problem:** Calling `setLoading(false)` or `setProducts([])` directly at the top of a `useEffect` caused a React warning about cascading renders.  
**Cause:** React doesn't allow synchronous state updates at the top of an effect body — only inside callbacks like `.then()`.  
**Solution:** Moved synchronous state updates out of effects — for example, moving `setProducts([])` into the `logout` function instead of the effect.
 
### Stale Token / 403 Errors
 
**Problem:** Authenticated requests returned 403 after switching between local and deployed backends.  
**Cause:** The token in `localStorage` was issued by one backend but sent to a different one with a different JWT secret.  
**Solution:** Always clear `localStorage` when switching environments and log in fresh to get a valid token.
 
### Product-Registration-Receipt Chicken-and-Egg
 
**Problem:** Creating a receipt requires a `productRegistrationId`, but the registration needs a `receiptId` to link them.  
**Solution:** Create the registration first without a receipt, then create the receipt with the registration ID, then update the registration via `PUT` to add the receipt ID.
 
### Hibernate Query Type Mismatch
 
**Problem:** The backend crashed on startup with `QueryTypeMismatchException` — the `createUser` check query was typed as `Long.class` but the JPQL query selected `User` objects.  
**Fix:** Changed `Long.class` to `User.class` in the query.
 
### Populator Running on Every Startup
 
**Problem:** The `Populator` ran on every container start, trying to create seeded users that already existed, causing the app to crash before Javalin could start.  
**Solution:** Commented out `populateAndCreateEntities()` in `App.java` for production.
 
### JSX in `.js` Files
 
**Problem:** Renaming `AuthContext.jsx` to `AuthContext.js` broke the Vite build because Vite 8 with rolldown doesn't support JSX syntax in plain `.js` files.  
**Solution:** Replaced the JSX return statement with `React.createElement()` so the file contains no JSX and is valid plain JavaScript:
```js
return React.createElement(AuthCtx.Provider, { value }, children)
```
 
---
 
## API Endpoints
 
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/security/register` | None | Create account |
| POST | `/security/login` | None | Login, returns token + email + id |
| GET | `/security/healthcheck` | None | Health check |
| GET | `/product/all` | USER | All products |
| GET | `/product/user/{id}` | USER | Products by user ID |
| POST | `/product` | USER | Create product |
| DELETE | `/product/{id}` | USER | Delete product |
| GET | `/warranty/all` | USER | All warranties |
| POST | `/warranty` | USER | Create warranty |
| GET | `/receipt/all` | USER | All receipts |
| POST | `/receipt` | USER | Create receipt |
| GET | `/product-registration/all` | USER | All registrations |
| POST | `/product-registration` | USER | Create registration |
| PUT | `/product-registration/{id}` | USER | Update registration |
| GET | `/user/all` | USER | All users |
 
---
 
## What I Learned
 
- How JWT authentication works end-to-end — from issuing and signing a token on the backend to storing and sending it from the frontend, and the difference between decoding (reading the payload) and validating (verifying the signature)
- How to manage global state in React using Context and `useState`
- How `useEffect` dependencies and the rules around state updates inside effects work in practice
- How CORS works at the HTTP level and why both the application server and the reverse proxy can interfere with it independently
- How Docker, Watchtower and Caddy work together to create a deployment pipeline
- How to debug a containerised Java application using `docker logs`
- How to design a relational data model with one-to-one and one-to-many relationships and map them with Hibernate JPA
- How to serve a React SPA correctly behind a reverse proxy using `try_files` to support client-side routing
- How to separate frontend and backend concerns at the infrastructure level using distinct subdomains and Caddy blocks