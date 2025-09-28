# Thryve Admin API Specification

This document contains ONLY the endpoints and data contracts relevant to the separate Admin Frontend.

Base URL: `${API_BASE_URL}` (url: `http://localhost:8000`)
All routes below are under the prefix `/api/v1`.

---
## 1. Scope & Roles
Admin UI is intended for users with role `admin` or `superadmin`. Some endpoints also allow counselors, but they are listed only if an admin view would surface them or they expose cross-user data.

Primary admin capabilities:
- Platform overview & KPIs (dashboard metrics)
- Institution management (currently only add institution endpoint exists and is public – SHOULD be restricted later)
- User management (list/filter users, revoke sessions)
- Oversight on engagement metrics (counts via dashboard & potential future extensions)

Out of scope (not documented here): typical end-user self-service actions (profile update, personal notifications list, booking appointments for self, etc.).

---
## 2. Conventions
- Auth: `Authorization: Bearer <accessToken>` (JWT). Use refresh flow outside scope here.
- JSON unless stated otherwise.
- Pagination: `page` (default 1), `limit` (default 20, max 100).
- Standard success envelope:
```
{ "statusCode": 200, "data": { ... }, "message": "...", "success": true }
```
- Standard error envelope:
```
{ "statusCode": 400, "data": {}, "message": "...", "success": false, "errors": [] }
```

---
## 3. Authentication Summary (Admin Perspective)
Admin frontend begins with an administrator (role `admin|superadmin`) authenticating through the common auth endpoints. For convenience they are repeated here so the admin team does not have to cross‑reference the general spec.

Key header for protected calls after login: `Authorization: Bearer <accessToken>`

### POST /api/v1/users/login
Body:
```
{ "email": "admin@example.com", "password": "string" }
```
Success (200):
```
{
  "statusCode": 200,
  "data": {
    "user": { "_id": "...", "email": "admin@example.com", "role": "admin", ... },
    "accessToken": "<JWT>"
  },
  "message": "User logged in successfully",
  "success": true
}
```
Cookies set: `accessToken`, `refreshToken` (httpOnly if configured). Use returned `accessToken` in header for subsequent admin API calls.

Errors: 400 (missing fields), 401 (invalid credentials).

### POST /api/v1/users/refresh-token
Purpose: obtain a new short‑lived access token using a valid refresh token (from cookie or body).
Body (optional when cookie present):
```
{ "refreshToken": "<token>" }
```
Success (200): `{ "data": { "accessToken": "<JWT>" } }`
Errors: 401 (missing/invalid/expired refresh token).

### POST /api/v1/users/logout
Revokes the refresh token (server side) and clears auth cookies.
Success: 200 with empty `data` object.

### POST /api/v1/users/change-password (authenticated)
Body:
```
{ "currentPassword": "string", "newPassword": "string" }
```
Rules: new password must differ from current. On success existing refresh token is invalidated (forces re-login elsewhere).
Errors: 400 (same password / missing fields), 401 (current password incorrect), 404 (user not found).

### POST /api/v1/users/forgot-password (public)
Body: `{ "email": "admin@example.com" }`
Always returns 200 (does not reveal whether email exists). Sends a reset token via email if user exists.

### POST /api/v1/users/reset-password (public)
Body:
```
{ "email": "admin@example.com", "token": "<resetToken>", "newPassword": "string" }
```
On success (200): password updated and previous refresh token invalidated.
Errors: 400 (missing/invalid/expired token), 404 (user not found).

### Optional: Session Revocation for Self
`POST /api/v1/users/:id/revoke-sessions` also doubles as a self logout-from-all-devices endpoint when `:id` matches the authenticated admin's own id.

---

---
## 4. User Management (Admin)
Base path: `/api/v1/users`

### GET /api/v1/users/
List users with filters (admin/superadmin only).
Query Parameters:
- `page` (number)
- `limit` (number)
- `role` (string) – filter by role (`student|counselor|admin|superadmin`)
- `institutionId` (ObjectId) – filter by institution
- `q` (string) – case-insensitive match on username, pseudoname, email

Response `data`:
```
{
  "items": [ { "_id": "...", "username": "...", "email": "...", "role": "...", ... } ],
  "total": 120,
  "page": 1,
  "pages": 6
}
```

### POST /api/v1/users/:id/revoke-sessions
Invalidate all refresh sessions for a user (admin/superadmin OR the user themself). Admin UI use-case: remote logout.
Path Params:
- `id` – user ObjectId

Response: Empty `data` object with confirmation message.

### (Optional Display) GET /api/v1/users/public/:id
Though public, admins may fetch to preview limited public profile fields (username, pseudoname, role, avatarUrl, institutionId). Often redundant when full list already fetched.

### (Optional Metrics) GET /api/v1/users/activity/summary
Returns the authenticated admin's own counts. Not typically needed for admin oversight of others. Provided if needed for header widgets.

---
## 5. Institution Management
### POST /api/v1/institutes/add
CURRENTLY UNPROTECTED (should be admin-only later). Admin UI can expose a form to add a new institution.

Body:
```
{
  "name": "string",
  "address": "string",
  "contactEmail": "string",
  "contactPhone": "string",
  "website": "string"
}
```
Errors: 400 on missing fields or duplicate `contactEmail`.

Response (201):
```
{ "institueName": "Example College", "contactEmail": "admin@example.edu" }
```

NOTE: Consider moving this under an authenticated route + role check.

---
## 6. Admin Dashboard Metrics
Mounted path combination results in:
`GET /api/v1/admin-dashboard/admin-dashboard`

Returns a comprehensive metrics object. (At present no auth middleware is applied – SHOULD be restricted.)

Example (keys may be 0 if underlying collections are empty):
```
{
  "instituteName": "Default Institute",
  "totalUsers": 123,
  "activeUsersDaily": 15,
  "activeUsersWeekly": 70,
  "activeUsersMonthly": 200,
  "newUsers": 25,
  "returningUsers": 50,
  "averageSessionDuration": 0,
  "percentageUsersShowingImprovement": 12.5,
  "totalScreenings": 40,
  "screeningsByTool": { "PHQ9": 30, "GAD7": 10 },
  "averageScores": { "PHQ9": 4.2, "GAD7": 3.1 },
  "riskLevelDistribution": { "low": 80, "medium": 30, "high": 5 },
  "highRiskFlags": 5,
  "screeningCompletionRate": 82.1,
  "totalAppointments": 60,
  "appointmentsByStatus": { "booked": 40, "completed": 15, "cancelled": 5 },
  "averageWaitTimeForAppointment": 0,
  "counselorLoadDistribution": { "<counselorId>": 12 },
  "appointmentConversionRate": 25.0,
  "emergencyEscalations": 0,
  "totalChatRooms": 5,
  "totalMessages": 150,
  "averageMessagesPerUser": 3.2,
  "averageResponseTimePeerSupport": 0,
  "totalResources": 40,
  "weeklyRetentionRate": 60.5
}
```

Field Notes:
- Some metrics rely on collections not yet fully implemented (`Session`, `Score`, `Escalation`, `PeerSupport`, `getRetainedUsers`). Expect zeros until implemented.
- `counselorLoadDistribution` map keys are counselor ObjectIds.

---
## 7. Authorization Summary
| Endpoint | Required Role | Notes |
|----------|---------------|-------|
| GET /api/v1/users/ | admin or superadmin | Enforced in controller. |
| POST /api/v1/users/:id/revoke-sessions | admin/superadmin OR self | Admin UI uses for forced logout. |
| POST /api/v1/institutes/add | (public currently) | SHOULD add auth + role check. |
| GET /api/v1/admin-dashboard/admin-dashboard | (public currently) | SHOULD require admin. |

Middleware: `verifyJWT` attaches `req.user` when used. Missing on some admin-intent routes (tech debt).

---
## 8. Error Codes
| HTTP | Meaning | Example Admin Scenario |
|------|---------|-----------------------|
| 400 | Bad request / validation | Missing institution name |
| 401 | Unauthenticated | Token missing/expired when hitting user list |
| 403 | Forbidden | Non-admin trying to list users |
| 404 | Not found | Invalid user id on revoke |
| 409 | Conflict | (Reserved – no current admin-specific conflict besides potential future duplicates) |
| 500 | Server error | DB failure |

---
## 9. Hardening / TODO Recommendations
- Add `verifyJWT` + role guard to: institutions add, admin dashboard stats route.
- Split dashboard path to cleaner form e.g. `/api/v1/admin/dashboard`.
- Backfill missing domain collections (Session, Score, Escalation, PeerSupport) or remove dependent metrics.
- Add caching layer for dashboard aggregates (e.g., Redis) if expensive.
- Provide dedicated endpoint for institution list & edit (not implemented yet – admin UI may need it soon).

---
## 10. Quick Reference Cheat Sheet
```
GET    /api/v1/users/                          (admin)
POST   /api/v1/users/:id/revoke-sessions       (admin or self)
GET    /api/v1/users/public/:id                (optional)
GET    /api/v1/users/activity/summary          (optional – self metrics)

POST   /api/v1/institutes/add                  (should be admin protected)

GET    /api/v1/admin-dashboard/admin-dashboard (should be admin protected)
```

---
If additional admin features (resource management, bulk notifications, counselor assignment) are added, extend this document accordingly.
