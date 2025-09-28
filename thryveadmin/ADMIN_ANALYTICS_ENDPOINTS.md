# Admin Analytics API Endpoints

Base Mount Path: `/api/v1/admin/analytics`

All endpoints require:
- Auth: Bearer JWT in `Authorization` header
- Role: `admin` or `superadmin` (enforced in each controller via `ensureAdmin`)
- Standard response envelope: 
```
{
  "success": true/false,
  "statusCode": <number>,
  "message": "<string>",
  "data": <payload specific to endpoint>
}
```
(Envelope produced by `ApiResponse`)

---
## 1. Screening Analytics

### 1.1 List Screenings
GET `/screenings`

Query Params:
- `page` (number, default 1)
- `limit` (number, default 25, max 100)
- `institutionId` (ObjectId, optional)
- `tool` (string enum: `PHQ-9`, `GAD-7`, `GHQ`, optional)
- `riskLevel` (string, e.g. `low`, `moderate`, `high`, etc.)
- `status` (string, e.g. `draft`, `submitted`)
- `studentId` (ObjectId)

Response `data`:
```
{
  items: [ ScreeningDocument, ... ],
  total: <number>,
  page: <number>,
  pages: <number>
}
```
`ScreeningDocument` includes full Mongo document fields per `screening.model.js`.

Example:
```
{
  "data": {
    "items": [ { "_id": "...", "tool": "PHQ-9", "riskLevel": "moderate", ... } ],
    "total": 42,
    "page": 1,
    "pages": 2
  }
}
```

### 1.2 Screening Stats (Last 30 Days)
GET `/screenings/stats`

Query Params:
- `institutionId` (optional)

Computation window: last 30 days based on `createdAt`.

Response `data`:
```
{
  period: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" },
  totalScreenings: <number>,
  submittedScreenings: <number>,
  completionRate: <number>,          // submittedScreenings / totalScreenings (0..1, 2 decimals)
  averageTotalScore: <number>,       // 2 decimals
  toolDistribution: { <tool>: count, ... },
  riskDistribution: { <riskLevel>: count, ... }
}
```

### 1.3 Daily Timeseries
GET `/screenings/timeseries/daily`

Query Params:
- `days` (number, default 14, min 1, max 60)
- `institutionId` (optional)

Response `data`:
```
{
  metric: "screenings_daily",
  series: [ { date: "YYYY-MM-DD", value: <count> }, ... ]
}
```
The series always returns exactly `days` entries (missing days filled with zero).

### 1.4 Risk Distribution
GET `/screenings/distribution/risk`

Query Params:
- `institutionId` (optional)
- `tool` (optional) // filter to a single tool

Response `data`:
```
{
  dimension: "riskLevel",
  total: <number>,
  items: [ { key: <riskLevel>, label: <riskLevel>, value: <count>, pct: <percentage 0..100> }, ... ]
}
```

### 1.5 Tool Summary
GET `/screenings/tools/summary`

Query Params:
- `institutionId` (optional)

Response `data`:
```
{
  total: <number>,         // total screenings across all tools (matching filter)
  tools: [
    { key: <tool>, label: <tool>, count: <number>, avgScore: <number 2 decimals> },
    ...
  ]
}
```

---
## 2. Appointment Analytics

### 2.1 List Appointments
GET `/appointments`

Query Params:
- `page` (number, default 1)
- `limit` (number, default 25, max 100)
- `institutionId` (optional)
- `counselorId` (optional)
- `studentId` (optional)
- `status` (optional; `booked|completed|cancelled|no-show`)
- `isEmergency` (optional; `true` or `false`)
- `from` (ISO date string; filters `startTime >= from`)
- `to` (ISO date string; filters `startTime <= to`)

Response `data`:
```
{
  items: [ AppointmentDocument, ... ],
  total: <number>,
  page: <number>,
  pages: <number>
}
```
`AppointmentDocument` includes fields from `appointment.model.js`.

### 2.2 Appointment Status Summary
GET `/appointments/status-summary`

Query Params:
- `institutionId` (optional)
- `from` (optional date)
- `to` (optional date)

Response `data`:
```
{
  total: <number>,
  statuses: [
    { status: "booked", count: <number>, pct: <0..100>, emergencies: <number> },
    { status: "completed", ... },
    ...
  ]
}
```

### 2.3 Weekly Status Timeseries
GET `/appointments/weekly-status`

Query Params:
- `weeks` (number, default 8, min 1, max 26)
- `institutionId` (optional)

Response `data`:
```
{
  granularity: "week",
  categories: [ "YYYY-W##", ... ], // length == weeks
  series: [
    { key: "booked", label: "Booked", values: [<count per week>...] },
    { key: "completed", label: "Completed", values: [...] },
    { key: "cancelled", label: "Cancelled", values: [...] },
    { key: "no-show", label: "No-show", values: [...] }
  ]
}
```

### 2.4 Counselor Load
GET `/appointments/counselor-load`

Description: Count of upcoming (future) appointments per counselor plus completed count in past 30 days.

Query Params:
- `institutionId` (optional)

Response `data`:
```
{
  items: [
    {
      counselorId: "<ObjectId>",
      username: "<string|null>",
      upcoming: <number>,          // future appointments
      completed30d: <number>       // completed in last 30 days
    }, ...
  ]
}
```

### 2.5 Appointment Funnel
GET `/appointments/funnel`

Window: last 30 days (`createdAt >= now-30d`).

Query Params:
- `institutionId` (optional)

Response `data`:
```
{
  period: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" },
  stages: [
    { key: "booked", label: "Booked", value: <number> },
    { key: "completed", label: "Completed", value: <number> },
    { key: "cancelled", label: "Cancelled", value: <number> },
    { key: "noShow", label: "No Show", value: <number> }
  ],
  conversionRate: <number>,   // completed / booked (0..1, 3 decimals)
  emergencyCount: <number>
}
```

---
## 3. Error Handling
Errors follow the `ApiError` pattern and will respond with (example 403):
```
{
  "success": false,
  "statusCode": 403,
  "message": "Admin access required"
}
```

---
## 4. Notes & Conventions
- All timestamps in responses are ISO 8601 strings or date substrings (`YYYY-MM-DD` where truncated).
- Percentages (`pct`) are rounded to 2 decimals unless otherwise noted.
- Aggregations that return zero items still respond with consistent structure (e.g., empty `series` or `items` arrays).
- Pagination always returns `page` and `pages` even if `total <= limit`.
- Filtering is additive (multiple query params narrow results).

---
## 5. Potential Extensions (Not Yet Implemented)
- Custom date range for all analytics endpoints (`from`, `to` standardization).
- Caching layer for heavy aggregation endpoints (Redis / in-memory TTL).
- Inclusion of counselor profile metadata beyond username (e.g., active load %, lastActive).
- Percentile metrics (e.g., 90th percentile wait time) once appointment durations are tracked.

---
## 6. Quick Reference Table
| Category | Endpoint | Purpose |
|----------|----------|---------|
| Screening | GET /screenings | Paginated screenings list |
| Screening | GET /screenings/stats | 30-day aggregate stats |
| Screening | GET /screenings/timeseries/daily | Daily count series |
| Screening | GET /screenings/distribution/risk | Risk level distribution |
| Screening | GET /screenings/tools/summary | Tool usage & avg scores |
| Appointment | GET /appointments | Paginated appointments list |
| Appointment | GET /appointments/status-summary | Status breakdown |
| Appointment | GET /appointments/weekly-status | Weekly status trend |
| Appointment | GET /appointments/counselor-load | Counselor workload snapshot |
| Appointment | GET /appointments/funnel | 30-day funnel & conversion |

---
## 7. Example Authorization Header
```
Authorization: Bearer <JWT_TOKEN>
```

---
## 8. Sample Success Envelope
```
{
  "success": true,
  "statusCode": 200,
  "message": "Appointment status summary",
  "data": { ... }
}
```

---
If you need this exported in OpenAPI format next, or want a combined master analytics spec, let me know.
